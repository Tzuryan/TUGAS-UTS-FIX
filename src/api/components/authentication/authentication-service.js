const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');
/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
const loginAttempts = {};

async function checkLoginCredentials(email, password) {
  const user = await authenticationRepository.getUserByEmail(email);
  const currentTimestamp = Date.now();
  
  if (loginAttempts[email] && loginAttempts[email].attempts >= 5) {
    if (currentTimestamp - loginAttempts[email].lastAttempt < 30 * 60 * 1000) {
      throw new Error('403 Forbidden: Too many failed login attempts');
    } else {
      delete loginAttempts[email];
    }
  }
  
  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);

  if (user && passwordChecked) {
    loginAttempts[email] = { attempts: 0, lastAttempt: currentTimestamp };
    return {
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    };
  } else {
    if (loginAttempts[email]) {
      loginAttempts[email].attempts++;
      loginAttempts[email].lastAttempt = currentTimestamp;
    } else {
      loginAttempts[email] = { attempts: 1, lastAttempt: currentTimestamp };
    }loginAttempts[email].timestamp = currentTimestamp;
    return null;
  }
}

module.exports = {
  checkLoginCredentials,
};
