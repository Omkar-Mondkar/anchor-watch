/**
 * seed-dev.js
 * 
 * Development seed script — inserts mock servers for local development.
 * Run via: docker exec -it configguard-backend node /app/scripts/seed-dev.js
 * 
 * DO NOT run this in production.
 */

'use strict';

const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://svc_configguard:devpassword@localhost:27017/configguard';

async function seed() {
  console.log('[seed-dev] Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('[seed-dev] Connected');

  const db = mongoose.connection.db;
  const serversCol = db.collection('servers');

  // Clear existing dev seeds
  await serversCol.deleteMany({ _devSeed: true });

  const now = new Date();

  // Insert 3 mock trading host servers
  const servers = [
    {
      hostname:         'TNSI1',
      ip:               '10.0.0.10',
      environment:      'PROD',
      status:           'active',
      enrollmentStatus: 'pending',
      onboardedAt:      now,
      lastCheckIn:      null,
      _devSeed:         true,
    },
    {
      hostname:         'TNSI2',
      ip:               '10.0.0.11',
      environment:      'PROD',
      status:           'active',
      enrollmentStatus: 'pending',
      onboardedAt:      now,
      lastCheckIn:      null,
      _devSeed:         true,
    },
    {
      hostname:         'EAGLE1',
      ip:               '10.0.0.20',
      environment:      'PROD',
      status:           'active',
      enrollmentStatus: 'pending',
      onboardedAt:      now,
      lastCheckIn:      null,
      _devSeed:         true,
    },
  ];

  const result = await serversCol.insertMany(servers);
  console.log(`[seed-dev] Inserted ${result.insertedCount} mock servers: TNSI1, TNSI2, EAGLE1`);

  await mongoose.disconnect();
  console.log('[seed-dev] Done');
  process.exit(0);
}

seed().catch((err) => {
  console.error('[seed-dev] Error:', err.message);
  process.exit(1);
});
