'use strict';
/**
 * Upload plugin bootstrap.
 *
 * It initializes the provider and sets the default settings in db.
 */

module.exports = async () => {
  // set plugin store
  const configurator = strapi.store({
    type: 'plugin',
    name: 'responsive-image',
    key: 'settings',
  });

  // if provider config does not exist set one by default
  const config = await configurator.get();

  if (!config) {
    await configurator.set({
      value: {
        formats: [
          {
            name: 'large',
            width: 1000,
            fit: 'cover',
            position: 'centre',
            withoutEnlargement: false,
          },
          {
            name: 'medium',
            width: 750,
            fit: 'cover',
            position: 'centre',
            withoutEnlargement: false,
          },
          {
            name: 'small',
            width: 500,
            fit: 'cover',
            position: 'centre',
            withoutEnlargement: false,
          }
        ],
        quality: 87,
        progressive: true,
      },
    });
  }
};