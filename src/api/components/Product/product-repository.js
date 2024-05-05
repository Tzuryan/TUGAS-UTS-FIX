const Product = require('../../../models/products-schema');

async function createProduct(name, description, price, customerId) {
  return Product.create({
    name,
    description,
    price,
    customerId,
  });
}

async function getProductsByCustomerId(customerId) {
  return Product.find({ customerId });
}

module.exports = {
  createProduct,
  getProductsByCustomerId,
};
