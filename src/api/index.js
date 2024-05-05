const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const customers = require('./components/customers/customers-route');
const products = require('./components/Product/product-route');
module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  customers(app);
  products(app);

  return app;
};