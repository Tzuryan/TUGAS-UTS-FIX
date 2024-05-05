const productsService = require('./products-service');

async function addProduct(req, res, next) {
  try {
    const { customerId } = req.params;
    const { name, description, price } = req.body;
    const product = await productsService.addProduct(customerId, name, description, price);
    res.json(product);
  } catch (error) {
    next(error);
  }
}

async function getCustomerProducts(req, res, next) {
  try {
    const { customerId } = req.params;
    const products = await productsService.getCustomerProducts(customerId);
    res.json(products);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addProduct,
  getCustomerProducts,
};
