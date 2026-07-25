'use strict';

require('dotenv').config();

const REQUIRED = [
  'MONGO_URI',
  'REDIS_URL',
  'JWT_SECRET',
  'JWT_EXPIRY',
  'AGENT_TOKEN_EXPIRY',
  'WEBHOOK_SECRET',
];

// Fail fast if any required variable is missing
const missing = REQUIRED.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`[CONFIG] Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

module.exports = {
  nodeEnv:           process.env.NODE_ENV || 'development',
  port:              parseInt(process.env.PORT || '5000', 10),
  mongoUri:          process.env.MONGO_URI,
  redisUrl:          process.env.REDIS_URL,
  jwtSecret:         process.env.JWT_SECRET,
  jwtExpiry:         process.env.JWT_EXPIRY,
  agentTokenExpiry:  process.env.AGENT_TOKEN_EXPIRY,
  monitorToolApiUrl: process.env.MONITOR_TOOL_API_URL || '',
  monitorToolApiKey: process.env.MONITOR_TOOL_API_KEY || '',
  monitorDefaultCard:process.env.MONITOR_TOOL_DEFAULT_CARD_ID || '',
  monitorSignalScript: process.env.MONITOR_SIGNAL_SCRIPT || '',
  webhookSecret:     process.env.WEBHOOK_SECRET,
};
