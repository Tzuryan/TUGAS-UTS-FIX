const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

// Objek untuk melacak percobaan login yang gagal
const loginAttempts = {};

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middleware
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      // Increment attempt count or initialize to 1 if first attempt
      loginAttempts[email] = loginAttempts[email] ? loginAttempts[email] + 1 : 1;

      // Generate timestamp in ISO format
      const timestamp = new Date().toISOString();

      // Print failed login attempt message with attempt count to console
      const logMessage = `[${timestamp}] User ${email} gagal login. Attempt = ${loginAttempts[email]}`;
      console.log(logMessage);

      // Return response with 403 Forbidden status
      return response.status(403).json({
        statusCode: 403,
        error: 'FORBIDDEN',
        description: 'Too many failed login attempts',
        message: '403 Forbidden: Too many failed login attempts'
      });
    }

    // If login is successful, reset attempt count for the user
    delete loginAttempts[email];

    // Return response with 200 OK status and login success data
    return response.status(200).json(loginSuccess);
  } catch (error) {
    // Pass the error to the error handling middleware
    return next(error);
  }
}

module.exports = {
  login,
};
