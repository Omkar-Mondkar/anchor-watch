'use strict';

const express = require('express');
// mergeParams: true is required to access :id from the parent router
const router = express.Router({ mergeParams: true });
const snapshotController = require('../controllers/snapshot.controller');

// Ingest a new snapshot
router.post('/snapshots', snapshotController.ingestSnapshot);

// Handle agent heartbeat
router.post('/heartbeat', snapshotController.heartbeat);

// Get snapshot history
router.get('/snapshots', snapshotController.getSnapshots);

// Get open drift records
router.get('/drifts', snapshotController.getDrifts);

// Lock baseline
router.post('/snapshots/baseline', snapshotController.lockBaseline);

module.exports = router;
