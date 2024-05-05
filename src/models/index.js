const mongoose = require('mongoose');
const config = require('../core/config');
const logger = require('../core/logger')('app');

const usersSchema = require('./users-schema');
const customersSchema = require('./customers-schema');

// Koneksi ke MongoDB
mongoose.connect(`${config.database.connection}/${config.database.name}`, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on('error', (err) => {
  logger.error(`Failed to connect to MongoDB: ${err.message}`);
});
db.once('open', () => {
  logger.info('Successfully connected to MongoDB');
});

// Definisi model berdasarkan skema
const User = mongoose.model('User', mongoose.Schema(usersSchema));
const Customer = mongoose.model('Customer', mongoose.Schema(customersSchema));

module.exports = {
  mongoose,
  User,
  Customer,
};
