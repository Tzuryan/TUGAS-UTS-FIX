const productsRepository = require('./products-repository');

async function addProduct(customerId, name, description, price) {
  return productsRepository.createProduct(name, description, price, customerId);
}

async function getCustomerProducts(customerId) {
  return productsRepository.getProductsByCustomerId(customerId);
}

module.exports = {
  addProduct,
  getCustomerProducts,
};
