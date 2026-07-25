'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Audit — immutable append-only change log.
 *
 * Design decision: middleware throws on any update/delete operation so that
 * even a compromised admin token cannot alter audit history.
 * Corrections are recorded as new entries, never edits.
 */
const AuditSchema = new Schema(
  {
    user: {
      type:     String,
      required: true,
      trim:     true,
    },
    action: {
      type:     String,
      required: true,
      trim:     true,
    },
    entity: {
      type:     String,
      required: true,
      trim:     true,
      index:    true,
    },
    entityId: {
      type:  String,
      index: true,
    },
    previousValue: {
      type: Schema.Types.Mixed,
    },
    newValue: {
      type: Schema.Types.Mixed,
    },
    timestamp: {
      type:    Date,
      default: Date.now,
      index:   true,
    },
    /** IP address of the requester if available */
    ipAddress: {
      type: String,
    },
  },
  {
    // No timestamps — we manage timestamp ourselves for explicit control
    collection: 'audits',
  }
);

// Compound indexes for the primary query patterns
AuditSchema.index({ entity: 1, timestamp: -1 });
AuditSchema.index({ user: 1, timestamp: -1 });
AuditSchema.index({ entityId: 1, timestamp: -1 });

// ── Append-only enforcement ────────────────────────────────────────
const IMMUTABLE_ERROR = 'Audit records are immutable';

const throwImmutable = function () {
  throw new Error(IMMUTABLE_ERROR);
};

// Block all Mongoose update/delete operations at the model level
['findOneAndUpdate', 'updateOne', 'updateMany'].forEach((op) => {
  AuditSchema.statics[op] = throwImmutable;
  AuditSchema.pre(op, function () { throw new Error(IMMUTABLE_ERROR); });
});

['findOneAndDelete', 'deleteOne', 'deleteMany'].forEach((op) => {
  AuditSchema.statics[op] = throwImmutable;
  AuditSchema.pre(op, function () { throw new Error(IMMUTABLE_ERROR); });
});

module.exports = mongoose.model('Audit', AuditSchema);
