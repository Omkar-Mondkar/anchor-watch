'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * AgentEnrollment — tracks the lifecycle of an agent credential.
 * One record per server. Token is stored as a SHA-256 hash, never plaintext.
 */
const AgentEnrollmentSchema = new Schema(
  {
    serverId: {
      type:     Schema.Types.ObjectId,
      ref:      'Server',
      required: true,
      unique:   true,
      index:    true,
    },
    /** SHA-256 hash of the enrollment token — never stored in plaintext */
    tokenHash: {
      type:     String,
      required: true,
      index:    true,
    },
    issuedAt: {
      type:    Date,
      default: Date.now,
    },
    expiresAt: {
      type:     Date,
      required: true,
    },
    rotatedAt: {
      type: Date,
    },
    status: {
      type:    String,
      enum:    ['active', 'revoked', 'expired'],
      default: 'active',
      index:   true,
    },
  },
  {
    timestamps: true,
    collection: 'agentenrollments',
  }
);

module.exports = mongoose.model('AgentEnrollment', AgentEnrollmentSchema);
