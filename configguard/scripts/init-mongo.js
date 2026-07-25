/**
 * init-mongo.js
 * 
 * MongoDB initialization script — runs via docker-entrypoint-initdb.d
 * Creates the application service account and all collection indexes.
 * 
 * In production with Azure AD LDAP, user creation is handled by mongoldap.
 * In development, this creates a local SCRAM-SHA-256 user.
 */

// Only create local user in development mode
if (process.env.NODE_ENV !== 'production') {
  db = db.getSiblingDB('configguard');

  // Create application service account (dev only — prod uses Azure AD LDAP)
  try {
    db.createUser({
      user: 'svc_configguard',
      pwd: 'devpassword',
      roles: [
        { role: 'readWrite', db: 'configguard' },
      ],
    });
    print('[init-mongo] Created dev user: svc_configguard');
  } catch (e) {
    print('[init-mongo] User already exists or LDAP mode: ' + e.message);
  }
}

db = db.getSiblingDB('configguard');

// ── Collection Indexes ────────────────────────────────────────────

// Server
db.servers.createIndex({ environment: 1 });
db.servers.createIndex({ status: 1 });
db.servers.createIndex({ hostname: 1 }, { unique: true });
db.servers.createIndex({ profileId: 1 });
print('[init-mongo] servers indexes created');

// ServerProfile
db.serverprofiles.createIndex({ name: 1 }, { unique: true });
print('[init-mongo] serverprofiles indexes created');

// Baseline
db.baselines.createIndex({ scope: 1, scopeId: 1, version: 1 }, { unique: true });
db.baselines.createIndex({ scopeId: 1 });
print('[init-mongo] baselines indexes created');

// ConfigItem
db.configitems.createIndex({ baselineId: 1 });
db.configitems.createIndex({ baselineId: 1, category: 1, parameter: 1 });
print('[init-mongo] configitems indexes created');

// Drift
db.drifts.createIndex({ serverId: 1, status: 1 });
db.drifts.createIndex({ serverId: 1, timestamp: -1 });
db.drifts.createIndex({ severity: 1, status: 1 });
print('[init-mongo] drifts indexes created');

// Alert
db.alerts.createIndex({ status: 1 });
db.alerts.createIndex({ createdAt: -1 });
print('[init-mongo] alerts indexes created');

// Audit (append-only — no update/delete indexes needed)
db.audits.createIndex({ entity: 1, timestamp: -1 });
db.audits.createIndex({ user: 1, timestamp: -1 });
db.audits.createIndex({ entityId: 1, timestamp: -1 });
print('[init-mongo] audits indexes created');

// AgentEnrollment
db.agentenrollments.createIndex({ serverId: 1 }, { unique: true });
db.agentenrollments.createIndex({ tokenHash: 1 });
db.agentenrollments.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index
print('[init-mongo] agentenrollments indexes created');

// MonitorCard
db.monitorcards.createIndex({ monitoringId: 1 });
db.monitorcards.createIndex({ serverId: 1 });
db.monitorcards.createIndex({ isActive: 1 });
print('[init-mongo] monitorcards indexes created');

print('[init-mongo] Database initialization complete.');
