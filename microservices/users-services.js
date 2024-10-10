const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3002;
const path = require('path');
const fs = require('fs');
const https = require('https');


const { validateLogin, validateRegister, validateUpdateProfile, checkValidationResults } = require('../middleware/inputValidation');

app.use(express.json());

const verifyToken = require('../middleware/authMiddleware');
const apiRateLimiter = require('../middleware/rateLimiterMiddleware');
const checkRole = require('../middleware/rbacMiddleware');

let users = [];
let idCounter = 0;


const sslServer = https.createServer({
  key: fs.readFileSync(path.join(__dirname,'..', 'certificate', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname ,'..', 'certificate', 'cert.pem'))
}, app)

const secretKey = 'yourSecretKey';

function generateToken(user) {
  const token = jwt.sign({ id: user.id, role: user.role }, secretKey, {
    expiresIn: '1h',
  });
  return token;
}

app.post('/register', apiRateLimiter, validateRegister, checkValidationResults, async (req, res) => {
  const userData = req.body;

  try {
    const userExists = users.find((u) => u.username === userData.username);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = {
      id: users.length+1,
      username: userData.username,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      age: userData.age,
      gender: userData.gender,
      role: userData.role ?? 'customer'
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

app.post('/login', apiRateLimiter, validateLogin, checkValidationResults, async (req, res) => {
  const logincred = req.body;

  try {
    const finduser = users.find((u) => u.username === logincred.username);
    if (!finduser) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(logincred.password, finduser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = generateToken(finduser);

    res.status(200).json({
      message: 'Login successful',
      token,
    });
    


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'There was an error logging in' });
  }
});




app.get(
  '/getAll',
  verifyToken,
  apiRateLimiter,
  checkRole(['admin']),
  (req, res) => {
    try {
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'server error' });
    }
  }
);

app.get(
  '/users/getUser/:userId',
  verifyToken,
  apiRateLimiter,
  checkRole(['admin']),
  (req, res) => {
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
  }
);

app.post(
  '/users/addUser',
  verifyToken,
  apiRateLimiter,
  checkRole(['admin']),
  (req, res) => {
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
  }
);

app.put(
  '/users/updateUser/:userId',
  verifyToken,
  apiRateLimiter,
  checkRole(['admin', 'customer']),
  validateUpdateProfile,
  checkValidationResults,
  (req, res) => {
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
      users[userIndex].firstName = updateUser.firstName;
    }

    if (req.body.lastName === '') {
      users[userIndex].lastName = users[userIndex].lastName;
    } else if (req.body.lastName === ' ') {
      return res.status(400).json({ error: 'Input missing field' });
    } else {
      users[userIndex].lastName = updateUser.lastName;
    }

    if (req.body.age === '') {
      users[userIndex].age = users[userIndex].age;
    } else if (req.body.age === ' ') {
      return res.status(400).json({ error: 'Input missing field' });
    } else {
      users[userIndex].age = updateUser.age;
    }

    if (req.body.gender === '') {
      users[userIndex].gender = users[userIndex].gender;
    } else if (req.body.gender === ' ') {
      return res.status(400).json({ error: 'Input missing field' });
    } else {
      users[userIndex].gender = updateUser.gender;
    }

    try {
      res.status(200).json(users[userIndex]);
    } catch (error) {
      res.status(500).json({ error: 'There is an error' });
    }
  }
);

app.delete(
  '/customers/deleteCustomer/:customerId',
  verifyToken,
  apiRateLimiter,
  checkRole(['admin']),
  (req, res) => {
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
  }
);

sslServer.listen(port, () => console.log(`Secure server running on port ${port}`))
module.exports = app;