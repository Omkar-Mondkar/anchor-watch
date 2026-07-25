'use strict';

const { Router } = require('express');
const router = Router();

/**
 * GET /api/health
 * Lightweight health-check for load balancers, Docker healthchecks, and monitoring tools.
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status:    'ok',
    service:   'configguard-backend',
    timestamp: new Date().toISOString(),
    uptime:    Math.floor(process.uptime()),
    env:       process.env.NODE_ENV || 'development',
  });
});

module.exports = router;
