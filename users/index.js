const express = require('express');
const app = express();
const port = 3002;

app.use(express.json());

let users = [];
let idCounter = 0;

app.get('/users/getAll', (req, res) => {
  try {
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'server error' });
  }
});

app.get('/users/getUser/:userId', (req, res) => {
  const userID = parseInt(req.params.userId);
  const user = users.find((user) => user.id === userID);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  try {
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'There is an error' });
  }
});

app.post('/users/addUser', (req, res) => {
  const userData = req.body;

  if(userData.firstName === "" || userData.lastName === "" || userData.age === "" || userData.firstName === " " || userData.lastName === " " || userData.age === " "){
    return res.status(400).json({ error: 'Please provide all the required fields' });
  }

  const user = {
    id: idCounter++,
    firstName: userData.firstName,
    lastName: userData.lastName,
    age: userData.age,
    gender: userData.gender,
  };

  try {
    users.push(user);
    res.status(201).json(users);
  } catch (error) {
    res.status(500).json({ error: 'There is an error' });
    console.log(error);
  }
});

app.put('/users/updateUser/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const userIndex = users.findIndex(
    (user) => user.id === userId
  );

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const updateUser = req.body;

  if (req.body.firstName === '') {
    users[userIndex].firstName = users[userIndex].firstName;
  } else if (req.body.firstName === ' ') {
    return res.status(400).json({ error: 'Input missing field' });
  } else {
    users[userIndex].firstName = updateuser.firstName;
  }

  if (req.body.lastName === '') {
    users[userIndex].lastName = users[userIndex].lastName;
  } else if (req.body.lastName === ' ') {
    return res.status(400).json({ error: 'Input missing field' });
  } else {
    users[userIndex].lastName = updateuser.lastName;
  }

  if (req.body.age === '') {
    users[userIndex].age = users[userIndex].age;
  } else if (req.body.age === ' ') {
    return res.status(400).json({ error: 'Input missing field' });
  } else {
    users[userIndex].age = updateuser.age;
  }

  if (req.body.gender === '') {
    users[userIndex].gender = users[userIndex].gender;
  } else if (req.body.gender === ' ') {
    return res.status(400).json({ error: 'Input missing field' });
  } else {
    users[userIndex].gender = updateuser.gender;
  }

  try {
    res.status(200).json(users[userIndex]);
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
