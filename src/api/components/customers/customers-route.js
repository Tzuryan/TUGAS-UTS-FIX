const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const customersControllers = require('./customers-controller');
const customersValidator = require('./customers-validator');
const productsRoute = require('./product-route'); // Import rute produk
const route = express.Router();

module.exports = (app) => {
  app.use('/customers', route); // Menggunakan '/customers' untuk rute

  // Mendapatkan daftar customers
  route.get('/', authenticationMiddleware, customersControllers.getCustomers);

  // Membuat customer baru
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(customersValidator.createCustomer),
    customersControllers.createCustomer // Fungsi callback untuk POST /customers
  );

  // Mendapatkan detail customer
  route.get('/:id', authenticationMiddleware, customersControllers.getCustomer);

  // Memperbarui customer
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(customersValidator.updateCustomer),
    customersControllers.updateCustomer // Fungsi callback untuk PUT /customers/:id
  );

  // Menghapus customer
  route.delete('/:id', authenticationMiddleware, customersControllers.deleteCustomer);


  route.use('/:customerId/products', productsRoute);

  // Mengubah kata sandi customer
  route.post(
    '/:id/change-password',
    authenticationMiddleware,
    celebrate(customersValidator.changeCustomerPassword),
    customersControllers.changeCustomerPassword // Fungsi callback untuk POST /customers/:id/change-password
  );
};

