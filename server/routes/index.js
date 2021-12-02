module.exports = [
  {
    method: 'GET',
    path: '/settings',
    handler: 'responsiveImage.getSettings',
    config: { policies: [] }
  },
  {
    method: 'PUT',
    path: '/settings',
    handler: 'responsiveImage.updateSettings',
    config: { policies: [] }
  }
];