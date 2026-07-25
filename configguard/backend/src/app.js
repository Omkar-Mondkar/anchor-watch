'use strict';

const express  = require('express');
const cors     = require('cors');
const morgan   = require('morgan');
const mongoose = require('mongoose');
const config   = require('./config');

const app = express();

// ── Middleware ────────────────────────────────────────────────────
app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE','PATCH'] }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

// ── Routes ────────────────────────────────────────────────────────
app.use('/api', require('./routes/health'));

// Placeholder 501 route groups — implemented in later changes
const PENDING_ROUTES = [
  '/api/auth',
  '/api/servers',
  '/api/profiles',
  '/api/agent',
  '/api/baselines',
  '/api/drift',
  '/api/alerts',
  '/api/audit',
  '/api/compliance',
  '/api/schedules',
  '/api/monitor',
  '/api/webhooks',
];

const stub501 = (req, res) => {
  res.status(501).json({
    error: 'Not implemented',
    message: `${req.method} ${req.originalUrl} is not implemented yet. See OpenSpec tasks.md.`,
  });
};

PENDING_ROUTES.forEach((route) => {
  app.use(route, stub501);
});

// ── 404 handler ───────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.originalUrl });
});

// ── Global error handler ──────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message, err.stack);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
});

// ── Start server ──────────────────────────────────────────────────
const PORT = config.port;

// Connect to MongoDB then start the HTTP server
mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log('[DB] MongoDB connected');
    app.listen(PORT, () => {
      console.log(`[SERVER] ConfigGuard backend running on port ${PORT} (${config.nodeEnv})`);
    });
  })
  .catch((err) => {
    console.error('[DB] MongoDB connection failed:', err.message);
    process.exit(1);
  });

module.exports = app;
