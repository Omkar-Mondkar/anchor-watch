'use strict';

const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agent.controller');

// Agent route to enroll with a one-time token
router.post('/enroll', agentController.enrollAgent);

module.exports = router;
