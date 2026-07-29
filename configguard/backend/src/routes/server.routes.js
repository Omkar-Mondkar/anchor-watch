'use strict';

const express = require('express');
const router = express.Router();
const serverController = require('../controllers/server.controller');

// Admin route to onboard a server
router.post('/', serverController.registerServer);

// Get all servers
router.get('/', serverController.getServers);

// Delete a server
router.delete('/:id', serverController.deleteServer);

// Mount server-specific snapshot/drift routes
const snapshotRoutes = require('./snapshot.routes');
router.use('/:id', snapshotRoutes);

module.exports = router;
