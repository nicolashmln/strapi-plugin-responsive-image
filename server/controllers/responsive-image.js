'use strict';

const validateSettings = require('./validation/settings');

/**
 * responsive-image.js controller
 *
 * @description: A set of functions called "actions" of the `responsive-image` plugin.
 */

module.exports = {

  async getSettings(ctx) {
    const data = await strapi.plugins['responsive-image'].services['responsive-image'].getSettings();

    ctx.body = { data };
  },

  async updateSettings(ctx) {
    const data = await validateSettings(ctx.request.body);

    await strapi.plugins['responsive-image'].services['responsive-image'].setSettings(data);

    ctx.body = { data };
  },
};
