const customersRepository = require('./customers-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of customers
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
 * Get customer detail by ID
 * @param {string} id - Customer ID
 * @returns {Object}
 */
async function getCustomerById(id) {
  const customer = await customersRepository.getCustomerById(id);

  if (!customer) {
    return null; // Customer not found
  }

  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
  };
}

/**
 * Create a new customer
 * @param {string} name - Customer's name
 * @param {string} email - Customer's email
 * @param {string} password - Customer's password
 * @returns {boolean} - Indicates if the customer was successfully created
 */
async function createCustomer(name, email, password) {
  const hashedPassword = await hashPassword(password);

  try {
    await customersRepository.createCustomer(name, email, hashedPassword);
    return true; // Customer created successfully
  } catch (error) {
    console.error('Error creating new customer:', error);
    return false; // Failed to create customer
  }
}

/**
 * Update customer information
 * @param {string} id - Customer ID
 * @param {string} name - Updated name
 * @param {string} email - Updated email
 * @returns {boolean} - Indicates if the customer was successfully updated
 */
async function updateCustomer(id, name, email) {
  const customer = await customersRepository.getCustomerById(id);

  if (!customer) {
    return false; // Customer not found
  }

  try {
    await customersRepository.updateCustomer(id, name, email);
    return true; // Customer updated successfully
  } catch (error) {
    console.error('Error updating customer:', error);
    return false; // Failed to update customer
  }
}

/**
 * Delete customer by ID
 * @param {string} id - Customer ID
 * @returns {boolean} - Indicates if the customer was successfully deleted
 */
async function deleteCustomer(id) {
  const customer = await customersRepository.getCustomerById(id);

  if (!customer) {
    return false; // Customer not found
  }

  try {
    await customersRepository.deleteCustomer(id);
    return true; // Customer deleted successfully
  } catch (error) {
    console.error('Error deleting customer:', error);
    return false; // Failed to delete customer
  }
}

/**
 * Check if an email is already registered for a customer
 * @param {string} email - Customer's email
 * @returns {boolean} - Indicates if the email is registered
 */
async function emailIsRegistered(email) {
  const customer = await customersRepository.getCustomerByEmail(email);
  return !!customer; // Return true if customer found (email registered)
}

/**
 * Check if the provided password matches the customer's password
 * @param {string} customerId - Customer ID
 * @param {string} password - Password to check
 * @returns {boolean} - Indicates if the password matches
 */
async function checkPassword(customerId, password) {
  const customer = await customersRepository.getCustomerById(customerId);

  if (!customer) {
    return false; // Customer not found
  }

  return passwordMatched(password, customer.password);
}

/**
 * Change customer's password
 * @param {string} customerId - Customer ID
 * @param {string} newPassword - New password
 * @returns {boolean} - Indicates if the password was successfully changed
 */
async function changeCustomerPassword(customerId, newPassword) {
  const customer = await customersRepository.getCustomerById(customerId);

  if (!customer) {
    return false; // Customer not found
  }

  const hashedPassword = await hashPassword(newPassword);

  try {
    await customersRepository.updateCustomerPassword(customerId, hashedPassword);
    return true; // Password changed successfully
  } catch (error) {
    console.error('Error changing customer password:', error);
    return false; // Failed to change password
  }
}

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  emailIsRegistered,
  checkPassword,
  changeCustomerPassword,
};
