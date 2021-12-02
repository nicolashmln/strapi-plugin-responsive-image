module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/settings',
      handler: 'responsive-image.getSettings',
      config: { policies: [] }
    },
    {
      method: 'PUT',
      path: '/settings',
      handler: 'responsive-image.updateSettings',
      config: { policies: [] }
    }
  ]
}