'use strict';

/**
 * Barrel export for all Mongoose models.
 * Import from here: const { Server, Drift, ... } = require('../models');
 */

module.exports = {
  Server:          require('./Server'),
  ServerProfile:   require('./ServerProfile'),
  Baseline:        require('./Baseline'),
  ConfigItem:      require('./ConfigItem'),
  Drift:           require('./Drift'),
  Alert:           require('./Alert'),
  Audit:           require('./Audit'),
  AgentEnrollment: require('./AgentEnrollment'),
  MonitorCard:     require('./MonitorCard'),
};
