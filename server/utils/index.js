'use strict';

const getService = name => {
  return strapi.plugin('responsive-image').service(name);
};

module.exports = {
  getService,
};