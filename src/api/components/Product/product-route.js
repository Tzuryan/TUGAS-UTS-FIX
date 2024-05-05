const express = require('express');
const authenticateMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const productsController = require('./product-controller');
const productsValidator = require('./products-validator');

const route = express.Router({ mergeParams: true }); // Gunakan mergeParams untuk mengakses customerId

route.post(
  '/',
  authenticateMiddleware,
  celebrate(productsValidator.addProduct),
  productsController.addProduct
);

route.get('/', authenticateMiddleware, productsController.getCustomerProducts);

module.exports = route;
