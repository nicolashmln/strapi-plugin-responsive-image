module.exports = {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/settings',
      handler: 'responsiveImage.getSettings',
      config: {
        policies: [
          'admin::isAuthenticatedAdmin',
          {
            name: 'admin::hasPermissions',
            config: {
              actions: ['plugin::upload.settings.read'],
            },
          },
        ],
      },
    },
    {
      method: 'PUT',
      path: '/settings',
      handler: 'responsiveImage.updateSettings',
      config: {
        policies: [
          'admin::isAuthenticatedAdmin',
          {
            name: 'admin::hasPermissions',
            config: {
              actions: ['plugin::upload.settings.read'],
            },
          },
        ],
      },
    },
  ]
};