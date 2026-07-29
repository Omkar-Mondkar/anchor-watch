'use strict';

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const Server = require('../models/Server');
const AgentEnrollment = require('../models/AgentEnrollment');

/**
 * Register a new server and return a one-time enrollment token.
 * POST /api/servers
 */
exports.registerServer = async (req, res, next) => {
  try {
    const { hostname, ip, environment, profileId } = req.body;

    if (!hostname || !ip || !environment) {
      return res.status(400).json({ error: 'Missing required fields: hostname, ip, environment' });
    }

    // 1. Create the server record
    const server = new Server({
      hostname,
      ip,
      environment,
      profileId: profileId || null,
      status: 'active',
      enrollmentStatus: 'pending'
    });
    
    await server.save();

    // 2. Generate a high-entropy one-time token (e.g. 32 random bytes, hex encoded)
    const token = crypto.randomBytes(32).toString('hex');

    // 3. Securely hash the token using bcrypt
    const salt = await bcrypt.genSalt(10);
    const tokenHash = await bcrypt.hash(token, salt);

    // 4. Create AgentEnrollment record (valid for 24 hours)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const enrollment = new AgentEnrollment({
      serverId: server._id,
      tokenHash,
      expiresAt,
      status: 'active'
    });

    await enrollment.save();

    // 5. Return the plaintext token and serverId ONLY ONCE
    return res.status(201).json({
      message: 'Server registered successfully',
      server: {
        id: server._id,
        hostname: server.hostname
      },
      enrollmentToken: token, // This will never be shown again!
      expiresAt
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Server with this hostname already exists' });
    }
    next(error);
  }
};

/**
 * Get all registered servers.
 * GET /api/servers
 */
exports.getServers = async (req, res, next) => {
  try {
    const servers = await Server.find().sort({ createdAt: -1 });
    res.json({ servers });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a server and its enrollment records.
 * DELETE /api/servers/:id
 */
exports.deleteServer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const server = await Server.findById(id);
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    // Remove associated enrollment records
    await AgentEnrollment.deleteMany({ serverId: id });

    // Remove the server
    await Server.findByIdAndDelete(id);

    return res.json({ message: `Server '${server.hostname}' deleted successfully` });
  } catch (error) {
    next(error);
  }
};
