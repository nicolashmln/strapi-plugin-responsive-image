'use strict';

const validateSettings = require('./validation/settings');
const { getService } = require('../utils');

const ACTIONS = {
  readSettings: 'plugin::upload.settings.read',
};

const fileModel = 'plugin::upload.file';

/**
 * responsive-image.js controller
 *
 * @description: A set of functions called "actions" of the `responsive-image` plugin.
 */

module.exports = {
  async getSettings(ctx) {
    const data = await getService('responsive-image').getSettings();

    ctx.body = { data };
  },

  async updateSettings(ctx) {
    const {
      request: { body },
      state: { userAbility },
    } = ctx;

    if (userAbility.cannot(ACTIONS.readSettings, fileModel)) {
      return ctx.forbidden();
    }

    const data = await validateSettings(body);

    await getService('responsive-image').setSettings(data);

    ctx.body = { data };
  },
};
