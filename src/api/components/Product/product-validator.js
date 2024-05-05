const joi = require('joi');

module.exports = {
  addProduct: {
    body: {
      name: joi.string().required(),
      description: joi.string(),
      price: joi.number().required(),
    },
  },
};
