const { hashPassword, passwordMatched } = require('../../../utils/password');
const customersRepository = require('./customers-repository');

async function getCustomers(request, response, next) {
  try {
    const customers = await customersRepository.getCustomers();
    const formattedCustomers = customers.map((customer) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
    }));
    return response.status(200).json(formattedCustomers);
  } catch (error) {
    return next(error);
  }
}

async function getCustomer(request, response, next) {
  try {
    const id = request.params.id;
    const customer = await customersRepository.getCustomer(id);
    if (!customer) {
      return response.status(404).json({ error: 'Customer not found' });
    }
    return response.status(200).json(customer);
  } catch (error) {
    return next(error);
  }
}

async function createCustomer(request, response, next) {
  try {
    const { name, email, password, password_confirm } = request.body;

    // Validate password confirmation
    if (password !== password_confirm) {
      return response.status(400).json({ error: 'Password confirmation mismatch' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create customer
    const newCustomer = await customersRepository.createCustomer(name, email, hashedPassword);

    return response.status(201).json(newCustomer);
  } catch (error) {
    return next(error);
  }
}

async function updateCustomer(request, response, next) {
  try {
    const id = request.params.id;
    const { name, email } = request.body;

    // Check if customer exists
    const existingCustomer = await customersRepository.getCustomer(id);
    if (!existingCustomer) {
      return response.status(404).json({ error: 'Customer not found' });
    }

    // Update customer
    await customersRepository.updateCustomer(id, name, email);

    return response.status(200).json({ id, name, email });
  } catch (error) {
    return next(error);
  }
}

async function deleteCustomer(request, response, next) {
  try {
    const id = request.params.id;

    // Check if customer exists
    const existingCustomer = await customersRepository.getCustomer(id);
    if (!existingCustomer) {
      return response.status(404).json({ error: 'Customer not found' });
    }

    // Delete customer
    await customersRepository.deleteCustomer(id);

    return response.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    return next(error);
  }
}

async function changeCustomerPassword(request, response, next) {
  try {
    const id = request.params.id;
    const { password_new, password_confirm } = request.body;

    // Validate password confirmation
    if (password_new !== password_confirm) {
      return response.status(400).json({ error: 'Password confirmation mismatch' });
    }

    // Hash new password
    const hashedPassword = await hashPassword(password_new);

    // Change customer password
    const success = await customersRepository.changePassword(id, hashedPassword);

    if (!success) {
      return response.status(400).json({ error: 'Failed to change password' });
    }

    return response.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  changeCustomerPassword,
};
