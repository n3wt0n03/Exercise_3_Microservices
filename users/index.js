const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3002;

app.use(express.json());

const verifyToken = require('../middleware/authMiddleware');

let users = [];
let idCounter = 0;

// Secret key for JWT
const secretKey = 'yourSecretKey';

function generateToken(user) {
  // Generate JWT
  const token = jwt.sign({ id: user.id, role: user.role }, secretKey, {
    expiresIn: '1h',
  });

  return token;
}

// Register
app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Check if user already exists
    const userExists = users.find((u) => u.username === username);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword,
      role,
    };
    users.push(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser.id, username: newUser.username, role: newUser.role },
    });
  } catch (error) {
    res.status(500).json({ error: 'There was an error adding a new user' });
  }
});

// Login a user
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = users.find((u) => u.username === username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password match
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = generateToken(user);
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'There was an error logging in' });
  }
});

app.get('/users/getAll', verifyToken, (req, res) => {
  try {
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'server error' });
  }
});

app.get('/users/getUser/:userId', verifyToken, (req, res) => {
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

app.post('/users/addUser', verifyToken, (req, res) => {
  const userData = req.body;

  if (
    userData.firstName === '' ||
    userData.lastName === '' ||
    userData.age === '' ||
    userData.firstName === ' ' ||
    userData.lastName === ' ' ||
    userData.age === ' '
  ) {
    return res
      .status(400)
      .json({ error: 'Please provide all the required fields' });
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

app.put('/users/updateUser/:userId', verifyToken, (req, res) => {
  const userId = parseInt(req.params.userId);
  const userIndex = users.findIndex((user) => user.id === userId);

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

app.delete('/customers/deleteCustomer/:customerId', verifyToken, (req, res) => {
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
