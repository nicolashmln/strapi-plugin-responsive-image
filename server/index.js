"use strict"

const services = require("./services");
const routes = require("./routes");
const controllers = require("./controllers");
const bootstrap = require("./bootstrap");

module.exports = {
  bootstrap,
  controllers,
  routes,
  services
};
