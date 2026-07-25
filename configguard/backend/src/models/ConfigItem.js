'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * ConfigItem — a single diffable configuration parameter within a baseline.
 * The drift engine compares live ConfigItems against baseline ConfigItems.
 */
const ConfigItemSchema = new Schema(
  {
    baselineId: {
      type:     Schema.Types.ObjectId,
      ref:      'Baseline',
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
    /** The expected (baseline) value for this parameter */
    expectedValue: {
      type:     Schema.Types.Mixed,
      required: true,
    },
    dataType: {
      type: String,
      enum: ['string', 'number', 'boolean', 'object'],
    },
  },
  {
    timestamps: true,
    collection: 'configitems',
  }
);

// Compound index for efficient per-baseline queries
ConfigItemSchema.index({ baselineId: 1, category: 1, parameter: 1 });

module.exports = mongoose.model('ConfigItem', ConfigItemSchema);
