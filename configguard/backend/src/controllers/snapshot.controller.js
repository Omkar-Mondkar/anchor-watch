'use strict';

const Snapshot = require('../models/Snapshot');
const Server = require('../models/Server');
const Drift = require('../models/Drift');
const Baseline = require('../models/Baseline');

/**
 * Perform a key-by-key symmetric diff between two flattened objects.
 * Returns an array of changes: { parameter, baselineValue, currentValue }
 */
function computeDiff(oldSnap, newSnap) {
  const changes = [];
  const allKeys = new Set([...Object.keys(oldSnap), ...Object.keys(newSnap)]);

  for (const key of allKeys) {
    const oldVal = oldSnap[key];
    const newVal = newSnap[key];

    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      changes.push({
        parameter: key,
        baselineValue: oldVal === undefined ? null : oldVal,
        currentValue: newVal === undefined ? null : newVal,
      });
    }
  }
  return changes;
}

/**
 * Handle agent heartbeat (when checksum hasn't changed).
 * POST /api/servers/:id/heartbeat
 */
exports.heartbeat = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const server = await Server.findByIdAndUpdate(id, { lastCheckIn: new Date() });
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    res.json({ changed: false });
  } catch (error) {
    next(error);
  }
};

/**
 * Ingest a new snapshot, detect drift, and save it.
 * POST /api/servers/:id/snapshots
 */
exports.ingestSnapshot = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { server_id, hash, snapshot } = req.body;

    if (id !== server_id) {
      return res.status(400).json({ error: 'URL ID does not match body server_id' });
    }

    const server = await Server.findById(id);
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    // Get the last known snapshot
    const lastSnapshot = await Snapshot.findOne({ serverId: id }).sort({ collectedAt: -1 });

    // If hash is the same, just update check-in (fallback if agent didn't use heartbeat)
    if (lastSnapshot && lastSnapshot.hash === hash) {
      server.lastCheckIn = new Date();
      await server.save();
      return res.json({ changed: false });
    }

    // Hash differs (or first snapshot) -> compute diff
    let driftCount = 0;
    if (lastSnapshot && lastSnapshot.snapshot) {
      const changes = computeDiff(lastSnapshot.snapshot, snapshot);
      
      const driftRecords = changes.map((change) => {
        // Extract category from parameter (e.g., 'sysctl.net.ipv4.ip_forward' -> 'sysctl')
        const category = change.parameter.split('.')[0] || 'custom_files';
        // Validate category against enum, fallback to 'custom_files' if not matching
        const validCategories = ['sysctl', 'cpu', 'irq', 'nic', 'ha', 'ntp', 'memory', 'custom_files'];
        const finalCategory = validCategories.includes(category) ? category : 'custom_files';

        return {
          serverId: id,
          category: finalCategory,
          parameter: change.parameter,
          baselineValue: change.baselineValue,
          currentValue: change.currentValue,
          severity: 'WARNING',
          status: 'open'
        };
      });

      if (driftRecords.length > 0) {
        // Cap at 100 drifts per ingestion to prevent DB explosion on first big change
        const recordsToInsert = driftRecords.slice(0, 100);
        await Drift.insertMany(recordsToInsert);
        driftCount = recordsToInsert.length;
      }
    }

    // Save new snapshot
    const newSnap = new Snapshot({
      serverId: id,
      hash,
      snapshot,
      collectedAt: new Date()
    });
    await newSnap.save();

    // Update server last check-in
    server.lastCheckIn = new Date();
    await server.save();

    res.json({ changed: true, driftCount });
  } catch (error) {
    next(error);
  }
};

/**
 * Get snapshot history for a server.
 * GET /api/servers/:id/snapshots
 */
exports.getSnapshots = async (req, res, next) => {
  try {
    const { id } = req.params;
    const snapshots = await Snapshot.find({ serverId: id })
      .sort({ collectedAt: -1 })
      .limit(50); // Keep it bounded
      
    res.json({ snapshots });
  } catch (error) {
    next(error);
  }
};

/**
 * Get open drift records for a server.
 * GET /api/servers/:id/drifts
 */
exports.getDrifts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const drifts = await Drift.find({ serverId: id, status: 'open' })
      .sort({ timestamp: -1 });
      
    res.json({ drifts });
  } catch (error) {
    next(error);
  }
};

/**
 * Lock the latest snapshot as the server's golden baseline.
 * POST /api/servers/:id/snapshots/baseline
 */
exports.lockBaseline = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // 1. Get latest snapshot
    const latest = await Snapshot.findOne({ serverId: id }).sort({ collectedAt: -1 });
    if (!latest) {
      return res.status(404).json({ error: 'No snapshots found for this server' });
    }

    // 2. Generate a version string (e.g. v1, v2)
    const existingCount = await Baseline.countDocuments({ scope: 'server', scopeId: id });
    const nextVersion = `v${existingCount + 1}`;

    // 3. Create Baseline record
    const baseline = new Baseline({
      scope: 'server',
      scopeId: id,
      version: nextVersion,
      checksum: latest.hash,
      createdBy: 'admin', // Placeholder until auth is implemented
    });
    await baseline.save();

    // 4. Resolve all open Drift records for this server
    await Drift.updateMany(
      { serverId: id, status: 'open' },
      { $set: { status: 'resolved', resolvedAt: new Date() } }
    );

    res.json({ message: 'Baseline locked successfully', baseline });
  } catch (error) {
    // Handle unique constraint violation on version
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Baseline version conflict. Try again.' });
    }
    next(error);
  }
};
