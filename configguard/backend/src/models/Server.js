'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Server — represents a Linux host onboarded into ConfigGuard.
 */
const ServerSchema = new Schema(
  {
    hostname: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,
      index:    true,
    },
    ip: {
      type:     String,
      required: true,
      trim:     true,
    },
    environment: {
      type:     String,
      required: true,
      enum:     ['PROD', 'UAT', 'DR'],
      index:    true,
    },
    profileId: {
      type: Schema.Types.ObjectId,
      ref:  'ServerProfile',
    },
    status: {
      type:    String,
      enum:    ['active', 'inactive', 'decommissioned'],
      default: 'active',
      index:   true,
    },
    enrollmentStatus: {
      type:    String,
      enum:    ['pending', 'enrolled', 'revoked'],
      default: 'pending',
    },
    onboardedAt: {
      type:    Date,
      default: Date.now,
    },
    lastCheckIn: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: 'servers',
  }
);

module.exports = mongoose.model('Server', ServerSchema);
