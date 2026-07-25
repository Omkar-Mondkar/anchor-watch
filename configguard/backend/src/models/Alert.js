'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Alert — records a dispatch event to a notification channel.
 * Created by the alert engine (Change 8) when CRITICAL drift is detected.
 */
const AlertSchema = new Schema(
  {
    /** Drift records that triggered this alert */
    driftIds: {
      type:     [{ type: Schema.Types.ObjectId, ref: 'Drift' }],
      required: true,
    },
    channel: {
      type:     String,
      required: true,
      enum:     ['monitoring-tool', 'webhook', 'dashboard'],
    },
    /** Monitoring card ID (5-digit) — set when channel is 'monitoring-tool' */
    monitoringId: {
      type:  String,
      match: /^\d{5}$/,
    },
    sentAt: {
      type: Date,
    },
    status: {
      type:    String,
      enum:    ['pending', 'sent', 'failed', 'resolved'],
      default: 'pending',
      index:   true,
    },
    /** Error message if dispatch failed */
    failureReason: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: 'alerts',
  }
);

AlertSchema.index({ status: 1 });
AlertSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Alert', AlertSchema);
