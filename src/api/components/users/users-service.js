const usersRepository = require('./users-repository');

const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users with pagination, search, and sorting
 * @param {number} page_number - Page number (default: 1)
 * @param {number} page_size - Number of users per page (default: 10)
 * @param {string} search - Search keyword (default: '')
 * @param {string} sort - Sorting criteria (e.g., 'email:asc' or 'name:desc')
 * @returns {Array}
 */
async function getUsers(pageNumber , pageSize , search , sort ) {
  const page_number = parseInt(page) || 1;
  const page_size = parseInt(pageSize) || 10;
  const search = buildSearchQuery(search);
  const sort = buildSortOptions(sort) || 'asc';

  return users;
}
  

// Fungsi untuk membangun query pencarian
function buildSearchQuery(search) {
  let query = {};

  if (!sort) {
    return null;
  }

  const [sortField, sortOrder] = sort.split(':');

  let sortOptions = {};
  sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1;

  return sortOptions;
}

// Fungsi untuk membangun opsi pengurutan
function buildSortOptions(sortField, sortOrder) {
  let sortOptions = {};
  sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1;

  return sortOptions;
}
/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
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
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
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
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
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
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
};
