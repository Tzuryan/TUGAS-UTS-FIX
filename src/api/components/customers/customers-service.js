const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');
const customersRepository = require('./customers-repository');
const productsService = require('./products-service'); // Import service produk
/**
 * Get list of users
 * @returns {Array}
 */
async function getCustomers() {
  const customers = await customersRepository.getCustomers();

  const results = [];
  for (let i = 0; i < customers.length; i += 1) {
    const customer = customers[i];
    results.push({
      id: customer.id,
      name: customer.name,
      email: customer.email,
    });
  }

  return results;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getCustomer(id) {
  const customer = await customersRepository.getCustomer(id);

  // Customer not found
  if (!customer) {
    return null;
  }

  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
  async function createCustomer(name, email, password) {
  const isEmailRegistered = await customersRepository.getCustomerByEmail(email);
  if (isEmailRegistered) {
    throw new Error('Email is already registered');
  }
  return customersRepository.createCustomer(name, email, password);
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateCustomer(id, name, email) {
  const customer = await customersRepository.getCustomer(id);

  // Customer not found
  if (!customer) {
    return null;
  }

  try {
    await customersRepository.updateCustomer(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteCustomer(id) {
  const customer = await customersRepository.getCustomer(id);

  // Customer not found
  if (!customer) {
    return null;
  }

  try {
    await customersRepository.deleteCustomer(id);
  } catch (err) {
    return null;
  }

  return true;
}
/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const customer = await customersRepository.getCustomerByEmail(email);

  if (customer) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const customer = await customersRepository.getCustomer(userId);
  return passwordMatched(password, customer.password);
}
/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const customer = await customersRepository.getCustomer(userId);

  // Check if customer not found
  if (!customer) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await customersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  emailIsRegistered,
  checkPassword,
  changePassword,
};
