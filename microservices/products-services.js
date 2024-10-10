const express = require('express');
const app = express();
const port = 3001;
const path = require('path');
const fs = require('fs');
const https = require('https');


app.use(express.json());



const { validateProductInput, validateUpdateProduct, checkValidationResults } = require('../middleware/inputValidation');
const verifyToken = require('../middleware/authMiddleware');
const apiRateLimiter = require('../middleware/rateLimiterMiddleware');
const checkRole = require('../middleware/rbacMiddleware');

let products = [];
let idCounter = 0;

const sslServer = https.createServer({
  key: fs.readFileSync(path.join(__dirname,'..', 'certificate', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname ,'..', 'certificate', 'cert.pem'))
}, app)




app.get('/getAll', 
  verifyToken,
  apiRateLimiter,
  checkRole(['admin', 'customer']),
  (req, res) => {
  try {
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'server error' });
  }
});

app.get(
  '/getProduct/:productId',
  verifyToken,
  apiRateLimiter,
  checkRole(['admin', 'customer']),
  (req, res) => {
    const productId = parseInt(req.params.productId);
    const productData = products.find((product) => product.id === productId);

    if (!productData) {
      return res.status(404).json({ error: 'Product not found' });
    }

    try {
      res.status(200).json(productData);
    } catch (error) {
      res.status(500).json({ error: 'There is an error' });
    }
  }
);

app.post(
  '/addProduct',
  verifyToken,
  apiRateLimiter,
  checkRole(['admin']),
  validateProductInput,
  checkValidationResults,
  (req, res) => {
    const item = req.body;

    if (
      item.category === '' ||
      item.name === '' ||
      item.color === '' ||
      item.unit === '' ||
      item.price === '' ||
      item.category === ' ' ||
      item.name === ' ' ||
      item.color === ' ' ||
      item.unit === ' ' ||
      item.price === ' '
    ) {
      return res
        .status(400)
        .json({ error: 'Please provide all the required fields' });
    }

    const product = {
      id: idCounter++,
      category: item.category,
      name: item.name,
      color: item.color,
      unit: item.unit,
      price: item.price,
    };

    try {
      products.push(product);
      res.status(201).json(products);
    } catch (error) {
      res.status(500).json({ error: 'There is an error' });
    }
  }
);

app.put(
  '/updateProduct/:productId',
  verifyToken,
  apiRateLimiter,
  validateUpdateProduct,
  checkValidationResults,
  checkRole(['admin']),
  (req, res) => {
    const productId = parseInt(req.params.productId);
    const productIndex = products.findIndex(
      (product) => product.id === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updateProduct = req.body;

    if (req.body.category === '') {
      products[productIndex].category = products[productIndex].category;
    } else if (req.body.category === ' ') {
      return res.status(400).json({ error: 'Input missing field' });
    } else {
      products[productIndex].category = updateProduct.category;
    }

    if (req.body.name === '') {
      products[productIndex].name = products[productIndex].name;
    } else if (req.body.name === ' ') {
      return res.status(400).json({ error: 'Input missing field' });
    } else {
      products[productIndex].name = updateProduct.name;
    }

    if (req.body.color === '') {
      products[productIndex].color = products[productIndex].color;
    } else if (req.body.color === ' ') {
      return res.status(400).json({ error: 'Input missing field' });
    } else {
      products[productIndex].color = updateProduct.color;
    }

    if (req.body.unit === '') {
      products[productIndex].unit = products[productIndex].unit;
    } else if (req.body.unit === ' ') {
      return res.status(400).json({ error: 'Input missing field' });
    } else {
      products[productIndex].unit = updateProduct.unit;
    }

    if (req.body.price === '') {
      products[productIndex].price = products[productIndex].price;
    } else if (req.body.price === ' ') {
      return res.status(400).json({ error: 'Input missing field' });
    } else {
      products[productIndex].price = updateProduct.price;
    }

    try {
      res.status(200).json(products[productIndex]);
    } catch (error) {
      res.status(500).json({ error: 'There is an error' });
    }
  }
);

app.delete(
  '/deleteProduct/:productId',
  verifyToken,
  apiRateLimiter,
  checkRole(['admin']),
  (req, res) => {
    const productId = parseInt(req.params.productId);
    const productIndex = products.findIndex(
      (product) => product.id === productId
    );

    try {
      console.log(productId);
      if (productIndex === -1) {
        return res.status(400).json({ error: 'Product not found' });
      } else {
        console.log(productIndex);
        products.splice(productIndex, 1);
        res.status(200).json({ message: 'Delete Successful' });
      }
    } catch (error) {
      res.status(500).json({ error: 'There is an error' });
    }
  }
);

sslServer.listen(port, () => console.log(`Secure server running on port ${port}`))
module.exports = app;