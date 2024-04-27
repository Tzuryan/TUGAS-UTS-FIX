const { User } = require('../../../models');

/**
 * Get a list of users with pagination, search, and sorting
 * @param {number} page - Nomor halaman (default: 1)
 * @param {number} pageSize - Jumlah pengguna per halaman (default: 10)
 * @param {string} search - Kata kunci pencarian (default: '')
 * @param {string} sortField - Nama bidang yang digunakan untuk pengurutan (default: 'name')
 * @param {string} sortOrder - Urutan pengurutan ('asc' atau 'desc') (default: 'asc')
 * @returns {Promise<Array>}
 */
async function getUsers(page = 1, pageSize = 10, sort = { email }, search ={}) {
  const skip = (page - 1) * pageSize;
  const users = await user.find(search)
                          .sort(sort)
                          .skip(skip)
                          .limit(pageSize);

  const count = await users.countDocuments(search);
  const totalPages = Math.ceil(count / pageSize);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;



  const data = users.map(user => ({
    id: user._id,
    name: user.name,
    email: user.email,
  }));

  return {
    page_number : page,
    page_size : pageSize,
    count : count,
    totalPages : totalPages,
    has_next_page : hasNextPage,
    has_previous_page : hasPreviousPage,
    data,
  }


}


/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
};
