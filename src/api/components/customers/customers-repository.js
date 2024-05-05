const { Customer } = require('../../../models');

/**
 * Get a list of customers
 * @param {number} pageNo - Page number
 * @param {number} pageSize - Number of items per page
 * @param {object} sort - Sorting criteria
 * @param {object} search - Search criteria
 * @returns {Promise}
 */
async function getCustomers(pageNo = 1, pageSize = 10, sort = { email: 1 }, search = {}) {
  const skip = (pageNo - 1) * pageSize;
  const customers = await Customer.find(search)
    .sort(sort)
    .skip(skip)
    .limit(pageSize);

  const count = await Customer.countDocuments(search);
  const totalPages = Math.ceil(count / pageSize);
  const hasNextPage = pageNo < totalPages;
  const hasPreviousPage = pageNo > 1;

  const dataCustomers = customers.map(customer => ({
    id: customer._id,
    name: customer.name,
    email: customer.email
  }));

  return {
    page_number: pageNo,
    page_size: pageSize,
    count: count,
    totalPages: totalPages,
    has_next_page: hasNextPage,
    has_previous_page: hasPreviousPage,
    data: dataCustomers
  };
}

/**
 * Get customer detail by ID
 * @param {string} id - Customer ID
 * @returns {Promise}
 */
async function getCustomer(id) {
  return Customer.findById(id);
}

/**
 * Create a new customer
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createCustomer(name, email, password) {
  return Customer.create({
    name,
    email,
    password
  });
}

/**
 * Update an existing customer
 * @param {string} id - Customer ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateCustomer(id, name, email) {
  return Customer.updateOne(
    { _id: id },
    {
      $set: {
        name,
        email
      }
    }
  );
}

/**
 * Delete a customer by ID
 * @param {string} id - Customer ID
 * @returns {Promise}
 */
async function deleteCustomer(id) {
  return Customer.deleteOne({ _id: id });
}

/**
 * Get customer by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getCustomerByEmail(email) {
  return Customer.findOne({ email });
}

/**
 * Update customer password
 * @param {string} id - Customer ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changeCustomerPassword(id, password) {
  return Customer.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerByEmail,
  changeCustomerPassword
};
