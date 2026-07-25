'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Drift — a detected deviation between a live server state and its baseline.
 * Created by the server-side diff engine (Change 6).
 */
const DriftSchema = new Schema(
  {
    serverId: {
      type:     Schema.Types.ObjectId,
      ref:      'Server',
      required: true,
      index:    true,
    },
    category: {
      type:     String,
      required: true,
      enum:     ['sysctl', 'cpu', 'irq', 'nic', 'ha', 'ntp', 'memory', 'custom_files'],
    },
    parameter: {
      type:     String,
      required: true,
      trim:     true,
    },
    baselineValue: {
      type: Schema.Types.Mixed,
    },
    currentValue: {
      type: Schema.Types.Mixed,
    },
    severity: {
      type:     String,
      required: true,
      enum:     ['INFO', 'WARNING', 'CRITICAL'],
      index:    true,
    },
    status: {
      type:    String,
      enum:    ['open', 'ack', 'resolved'],
      default: 'open',
      index:   true,
    },
    acknowledgedBy: {
      type: String,
    },
    acknowledgedAt: {
      type: Date,
    },
    resolvedAt: {
      type: Date,
    },
    timestamp: {
      type:    Date,
      default: Date.now,
      index:   true,
    },
  },
  {
    timestamps: true,
    collection: 'drifts',
  }
);

// Compound index for the primary query pattern: open drifts per server
DriftSchema.index({ serverId: 1, status: 1 });
DriftSchema.index({ serverId: 1, timestamp: -1 });
DriftSchema.index({ severity: 1, status: 1 });

module.exports = mongoose.model('Drift', DriftSchema);
