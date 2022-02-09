'use strict';

const validateSettings = require('./validation/settings');
const { getService } = require('../utils');

/**
 * responsive-image.js controller
 *
 * @description: A set of functions called "actions" of the `responsive-image` plugin.
 */

module.exports = {
  async getSettings(ctx) {
    const data = await getService('responsiveImage').getSettings();

    ctx.body = { data };
  },

  async updateSettings(ctx) {
    const data = await validateSettings(ctx.request.body);

    const data = await getService('responsiveImage').setSettings(data);

    ctx.body = { data };
  },
};
