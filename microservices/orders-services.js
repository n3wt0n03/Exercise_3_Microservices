const express = require('express');
const app = express();
const port = 3003;
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const https = require('https');
const jwt = require('jsonwebtoken');


app.use(express.json());

const { validateOrderInput, checkValidationResults } = require('../middleware/inputValidation');
const verifyToken = require("../middleware/authMiddleware");
const apiRateLimiter = require("../middleware/rateLimiterMiddleware");
const checkRole = require("../middleware/rbacMiddleware");

const httpsAgent = new https.Agent({  
  rejectUnauthorized: false
});

let orders = [];
let idCount = 0;

const sslServer = https.createServer({
  key: fs.readFileSync(path.join(__dirname,'..', 'certificate', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname ,'..', 'certificate', 'cert.pem'))
}, app)


app.get('/getAll', 
  verifyToken,
  apiRateLimiter,
  checkRole(['admin', 'customer']),
   async (req, res) => {
  try {
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'server error' });
  }
});

app.get(
  '/getOrder/:orderId',
  verifyToken,
  apiRateLimiter,
  checkRole(['admin', 'customer']),
  async (req, res) => {
    const orderId = parseInt(req.params.orderId);
    const orderData = orders.find((order) => order.id === orderId);
    console.log(orderData);

    if (!orderData) {
      return res.status(404).json({ message: 'Order not found' });
    }

    try {
      const user = await axios.get(
        `http://localhost:3002/user/userUser/${orderData.user}`,
        {
          headers: {
              Authorization: req.headers['authorization'],
          },
          httpsAgent
        }
      );
      const product = await axios.get(
        `http://localhost:3001/products/getProduct/${orderData.productId}`,
        {
          headers: {
              Authorization: req.headers['authorization'],
          },
          httpsAgent
        }
      );

      const orderInfo = {
        orderId: orderId,
        userData: user.data,
        productData: product.data,
      };
      res.status(200).json(orderInfo);
    } catch (error) {
      res.status(500).json({ message: 'There is an error' });
    }
  }
);

app.post(
  '/makeOrder',
  verifyToken,
  apiRateLimiter,
  checkRole(['admin', 'customer']),
  validateOrderInput,
  checkValidationResults,
  async (req, res) => {
    const ids = req.body;


    const token = req.headers['authorization'].split(' ')[1];
    const decoded = jwt.decode(token);
    const userId = decoded.id;

    if (
      userId === ' ' ||
      !ids.productId === ' ' ||
      userId === '' ||
      !ids.productId === ''
    ) {
      return res
        .status(400)
        .json({ message: 'Please provide all the required fields' });
    }
    console.log(ids.productId);
    try {
      console.log(userId);
      const product = await axios.get(
        `https://localhost:3001/getProduct/${ids.productId}`,{
          headers: {
              Authorization: req.headers['authorization'],
          },
          httpsAgent
        })

     
      console.log(product);
      console.log(userId);
      if (product.status !== 200) {
        return res
          .status(404)
          .json({ message: 'Product not found or invalid' });
      }

      const order = {
        id: idCount++,
        userId: userId,
        productId: product.data.id,
      };

      orders.push(order);
      res.status(201).json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'User or Product invalid' });
    }
  }
);

app.put(
  '/updateOrder/:orderId',
  verifyToken,
  apiRateLimiter,
  checkRole(['admin', 'customer']),
  async (req, res) => {
    const orderId = parseInt(req.params.orderId);
    const orderIndex = orders.findIndex((order) => order.id === orderId);

    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const updateOrder = req.body;
    const userId = updateOrder.userId;
    const productId = updateOrder.productId;

    if (!userId || userId === '' || userId === ' ') {
      return res.status(400).json({ message: 'Missing or invalid user ID' });
    }

    if (!productId || productId === '' || productId === ' ') {
      return res.status(400).json({ message: 'Missing or invalid product ID' });
    }

    try {
      const user = await axios.get(
        `http://localhost:3002/users/getUser/${userId}`, {
          headers: {
              Authorization: req.headers['authorization'],
          },
          httpsAgent
        });
      if (user.status !== 200) {
        return res.status(404).json({ message: 'User not found or invalid' });
      }

      const product = await axios.get(
        `http://localhost:3001/products/getProduct/${productId}`,{
          headers: {
              Authorization: req.headers['authorization'],
          },
          httpsAgent
        }
      );
      if (product.status !== 200) {
        return res
          .status(404)
          .json({ message: 'Product not found or invalid' });
      }

      orders[orderIndex].userId = userId;
      orders[orderIndex].productId = productId;

      res.status(200).json({ message: 'Order updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating order' });
    }
  }
);

app.delete(
  '/deleteOrder/:orderId',
  verifyToken,
  apiRateLimiter,
  checkRole(['admin', 'customer']),
  (req, res) => {
    const orderId = parseInt(req.params.orderId);
    const orderIndex = orders.findIndex((order) => order.id === orderId);

    try {
      orders.splice(orderIndex, 1);
      res.status(200).json({ message: 'Deleted Succeessfully' });
    } catch (error) {
      res.status(404).json({ message: 'Order not found or invalid' });
    }
  }
);

sslServer.listen(port, () => console.log(`Secure server running on port ${port}`))
module.exports = app;