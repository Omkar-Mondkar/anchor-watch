'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * CollectorConfig sub-schema — defines which collector categories are enabled.
 */
const CollectorConfigSchema = new Schema(
  {
    category: {
      type:     String,
      required: true,
      enum:     ['sysctl', 'cpu', 'irq', 'nic', 'ha', 'ntp', 'memory', 'custom_files'],
    },
    enabled: {
      type:    Boolean,
      default: true,
    },
    /** Optional file paths for the custom_files collector */
    watchPaths: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

/**
 * ServerProfile — reusable configuration profile shared across many hosts.
 * e.g. "trading-edge-node-v3" applied to 50 nearly-identical servers.
 */
const ServerProfileSchema = new Schema(
  {
    name: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,
    },
    description: {
      type: String,
      trim: true,
    },
    collectorConfig: {
      type:    [CollectorConfigSchema],
      default: [],
    },
    defaultBaselineId: {
      type: Schema.Types.ObjectId,
      ref:  'Baseline',
    },
    tags: {
      type:    [String],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'serverprofiles',
  }
);

module.exports = mongoose.model('ServerProfile', ServerProfileSchema);
