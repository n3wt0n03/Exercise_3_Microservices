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

  if(customerData.firstName === "" || customerData.lastName === "" || customerData.age === "" || customerData.firstName === " " || customerData.lastName === " " || customerData.age === " "){
    return res.status(400).json({ error: 'Please provide all the required fields' });
  }

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
  customers[customerIndex].firstName = updateCustomer.firstName;
  customers[customerIndex].lastName = updateCustomer.lastName;
  customers[customerIndex].age = updateCustomer.age;
  customers[customerIndex].gender = updateCustomer.gender;

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
