const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

let products = [];
let idCounter = 0;

app.get('/products/getAll', (req, res) => {
  try {
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'server error' });
  }
});

app.get('/products/getProduct/:productId', (req, res) => {
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
});

app.post('/products/addProduct', (req, res) => {
  const item = req.body;

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
});

app.put('/products/updateProduct/:productId', (req, res) => {
  const productId = parseInt(req.params.productId);
  const productIndex = products.findIndex(
    (product) => product.id === productId
  );

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const updateProduct = req.body;
  products[productIndex].category = updateProduct.category;
  products[productIndex].name = updateProduct.name;
  products[productIndex].color = updateProduct.color;
  products[productIndex].unit = updateProduct.unit;
  products[productIndex].price = updateProduct.price;

  try {
    res.status(200).json(products[productIndex]);
  } catch (error) {
    res.status(500).json({ error: 'There is an error' });
  }
});

app.delete('/products/deleteProduct/:productId', (req, res) => {
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
});

app.listen(port, () => {
  console.log(`Product Server running at port ${port}`);
});
