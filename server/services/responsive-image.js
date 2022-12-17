'use strict';

/**
 * responsive-image.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

module.exports = (
  {
    strapi
  }
) => {
  return {
    getSettings() {
      return strapi
        .store({
          type: 'plugin',
          name: 'responsive-image',
          key: 'settings',
        })
        .get();
    },

    setSettings(value) {
      return strapi
        .store({
          type: 'plugin',
          name: 'responsive-image',
          key: 'settings',
        })
        .set({ value });
    }
  };
};
