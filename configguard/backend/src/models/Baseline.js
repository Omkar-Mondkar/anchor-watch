'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Baseline — versioned configuration snapshot.
 *
 * Uses scope + scopeId instead of a direct serverId foreign key so that
 * a baseline can apply at either the per-host level ("server") or the
 * fleet-profile level ("profile").
 *
 * Design decision: compound unique index on (scope, scopeId, version)
 * enforces version uniqueness per scope without duplicating the logic
 * in application code.
 */
const BaselineSchema = new Schema(
  {
    scope: {
      type:     String,
      required: true,
      enum:     ['server', 'profile'],
      index:    true,
    },
    /** ObjectId of a Server or ServerProfile depending on scope */
    scopeId: {
      type:     Schema.Types.ObjectId,
      required: true,
      index:    true,
    },
    version: {
      type:     String,
      required: true,
      trim:     true,
    },
    /** SHA-256 checksum of the full normalized snapshot */
    checksum: {
      type:     String,
      required: true,
    },
    createdBy: {
      type:     String,
      required: true,
      trim:     true,
    },
    createdAt: {
      type:    Date,
      default: Date.now,
    },
    /** Set when an Engineer or Admin explicitly approves this baseline */
    approvedBy: {
      type: String,
      trim: true,
    },
    approvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: 'baselines',
  }
);

// Compound unique index: one version per scope+scopeId
BaselineSchema.index({ scope: 1, scopeId: 1, version: 1 }, { unique: true });

module.exports = mongoose.model('Baseline', BaselineSchema);
