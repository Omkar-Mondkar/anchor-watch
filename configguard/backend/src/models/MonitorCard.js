'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * MonitorCard — maps a ConfigGuard server/category to a corporate monitoring tool card.
 *
 * The alert engine uses this to look up:
 * 1. The 5-digit monitoring ID for the card
 * 2. The path to the error_signal_sending script on the backend container
 *
 * A card can apply at three scope levels (most-specific wins):
 *   - server + category: for a specific drift category on a specific server
 *   - server only:       for all drift on a specific server
 *   - global (both null): fallback for any drift not covered by a specific card
 */
const MonitorCardSchema = new Schema(
  {
    label: {
      type:     String,
      required: true,
      trim:     true,
    },
    /** 5-digit corporate monitoring tool card identifier */
    monitoringId: {
      type:     String,
      required: true,
      match:    [/^\d{5}$/, 'monitoringId must be exactly 5 digits'],
      index:    true,
    },
    /** Optional: scope to a specific server */
    serverId: {
      type:  Schema.Types.ObjectId,
      ref:   'Server',
      index: true,
    },
    /** Optional: scope to a specific collector category */
    category: {
      type: String,
      enum: ['sysctl', 'cpu', 'irq', 'nic', 'ha', 'ntp', 'memory', 'custom_files'],
    },
    /** Minimum severity level that triggers a signal for this card */
    severityThreshold: {
      type:    String,
      enum:    ['INFO', 'WARNING', 'CRITICAL'],
      default: 'CRITICAL',
    },
    /** Absolute path to the error_signal_sending bash script inside the backend container */
    scriptPath: {
      type:     String,
      required: true,
      trim:     true,
    },
    isActive: {
      type:    Boolean,
      default: true,
      index:   true,
    },
  },
  {
    timestamps: true,
    collection: 'monitorcards',
  }
);

module.exports = mongoose.model('MonitorCard', MonitorCardSchema);
