 

const productsSchema = {
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  customerId: {
    type: String,
    required: true,
  },
};

module.exports = productsSchema;
