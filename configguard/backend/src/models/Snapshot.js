'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Snapshot — A normalized configuration payload collected from a server.
 */
const SnapshotSchema = new Schema(
  {
    serverId: {
      type:     Schema.Types.ObjectId,
      ref:      'Server',
      required: true,
      index:    true,
    },
    hash: {
      type:     String,
      required: true,
      trim:     true,
    },
    snapshot: {
      type:     Schema.Types.Mixed,
      required: true,
    },
    collectedAt: {
      type:     Date,
      default:  Date.now,
      required: true,
    },
    agentVersion: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'snapshots',
  }
);

// Compound index for efficient history lookup per server
SnapshotSchema.index({ serverId: 1, collectedAt: -1 });

module.exports = mongoose.model('Snapshot', SnapshotSchema);
