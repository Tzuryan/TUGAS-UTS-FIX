const { User } = require('../../../models');
/**
 * Retrieve user by email with optional page_number parameter.
 * @param {string} email - User email
 * @param {number} [page_number=1] - Page number for pagination
 * @param {number} [page_size=10] - Number of items per page
 * Get user by email for login information
 * @returns {Promise}
 */
async function getUserByEmail(email, page_number = 1,page_size = 10 ) {
  const offset = (page_number - 1) * page_size;

  try {
    // Retrieve user with email
    const user = await User.findOne({
      where: { email },
      offset,
      limit: page_size,
    });

    return user;
  } catch (error) {
    console.error('Error retrieving user by email:', error);
    return null;
  }
}


module.exports = {
  getUserByEmail,
};
