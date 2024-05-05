const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const customer = require('./components/customers/customers-route');

module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  customer(app);
  return app;
}