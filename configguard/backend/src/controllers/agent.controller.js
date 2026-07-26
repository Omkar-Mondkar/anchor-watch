'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Server = require('../models/Server');
const AgentEnrollment = require('../models/AgentEnrollment');
const config = require('../config');

/**
 * Exchange a one-time enrollment token for a long-lived JWT.
 * POST /api/agents/enroll
 */
exports.enrollAgent = async (req, res, next) => {
  try {
    const { serverId, token } = req.body;

    if (!serverId || !token) {
      return res.status(400).json({ error: 'Missing required fields: serverId, token' });
    }

    // 1. Find the enrollment record
    const enrollment = await AgentEnrollment.findOne({ serverId, status: 'active' });
    if (!enrollment) {
      return res.status(401).json({ error: 'Invalid or expired enrollment session' });
    }

    // 2. Check expiration
    if (new Date() > enrollment.expiresAt) {
      enrollment.status = 'expired';
      await enrollment.save();
      return res.status(401).json({ error: 'Enrollment token has expired' });
    }

    // 3. Verify the bcrypt hash
    const isMatch = await bcrypt.compare(token, enrollment.tokenHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid enrollment token' });
    }

    // 4. Token matches. Mark as consumed and update server enrollment status
    enrollment.status = 'revoked'; // consumed
    enrollment.rotatedAt = new Date();
    await enrollment.save();

    await Server.findByIdAndUpdate(serverId, { enrollmentStatus: 'enrolled' });

    // 5. Issue the long-lived agent JWT
    // The JWT contains the serverId to authenticate all future requests
    const agentToken = jwt.sign(
      { serverId, role: 'agent' },
      config.jwtSecret,
      { expiresIn: config.agentTokenExpiry || '30d' } // Defaulting to 30 days if not set
    );

    return res.status(200).json({
      message: 'Agent enrolled successfully',
      token: agentToken
    });

  } catch (error) {
    next(error);
  }
};
