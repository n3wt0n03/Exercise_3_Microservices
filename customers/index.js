const express = require('express');
const app = express();
const port = 3002;

app.use(express.json());

let customers = [];
let idCounter = 0;

app.get('/customers/getAll', (req, res) => {
  try {
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'server error' });
  }
});

app.get('/customers/getCustomer/:customerId', (req, res) => {
  const customerId = parseInt(req.params.customerId);
  const customer = customers.find((customer) => customer.id === customerId);

  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  try {
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: 'There is an error' });
  }
});

app.post('/customers/addCustomer', (req, res) => {
  const customerData = req.body;

  const customer = {
    id: idCounter++,
    firstName: customerData.firstName,
    lastName: customerData.lastName,
    age: customerData.age,
    gender: customerData.gender,
  };

  try {
    customers.push(customer);
    res.status(201).json(customers);
  } catch (error) {
    res.status(500).json({ error: 'There is an error' });
    console.log(error);
  }
});

app.put('/customers/updateCustomer/:customerId', (req, res) => {
  const customerId = parseInt(req.params.customerId);
  const customerIndex = customers.findIndex(
    (customer) => customer.id === customerId
  );

  if (customerIndex === -1) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  const updateCustomer = req.body;

  if (req.body.firstName === '') {
    customers[customerIndex].firstName = customers[customerIndex].firstName;
  } else if (req.body.firstName === ' ') {
    return res.status(400).json({ error: 'Input missing field' });
  } else {
    customers[customerIndex].firstName = updateCustomer.firstName;
  }

  if (req.body.lastName === '') {
    customers[customerIndex].lastName = customers[customerIndex].lastName;
  } else if (req.body.lastName === ' ') {
    return res.status(400).json({ error: 'Input missing field' });
  } else {
    customers[customerIndex].lastName = updateCustomer.lastName;
  }

  if (req.body.age === '') {
    customers[customerIndex].age = customers[customerIndex].age;
  } else if (req.body.age === ' ') {
    return res.status(400).json({ error: 'Input missing field' });
  } else {
    customers[customerIndex].age = updateCustomer.age;
  }

  if (req.body.gender === '') {
    customers[customerIndex].gender = customers[customerIndex].gender;
  } else if (req.body.gender === ' ') {
    return res.status(400).json({ error: 'Input missing field' });
  } else {
    customers[customerIndex].gender = updateCustomer.gender;
  }

  try {
    res.status(200).json(customers[customerIndex]);
  } catch (error) {
    res.status(500).json({ error: 'There is an error' });
  }
});

app.delete('/customers/deleteCustomer/:customerId', (req, res) => {
  if (customers.length === 0) {
    return res.status(404).json({ error: 'No customers found' });
  }

  const customerId = parseInt(req.params.customerId);
  const customerIndex = customers.findIndex(
    (customer) => customer.id === customerId
  );

  if (customerIndex === -1) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  try {
    customers.splice(customerIndex, 1);
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting customer' });
  }
});

app.listen(port, () => {
  console.log(`Customers Server running at port ${port}`);
});
