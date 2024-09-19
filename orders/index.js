const express = require('express');
const app = express();
const port = 3003;
const axios = require('axios');

app.use(express.json());

let orders = [];
let idCount = 0;

app.get('/orders/getAll', async (req, res) => {
  try {
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'server error' });
  }
});

app.get('/orders/getOrder/:orderId', async (req, res) => {
  const orderId = parseInt(req.params.orderId);
  const orderData = orders.find((order) => order.id === orderId);
  console.log(orderData);

  if (!orderData) {
    return res.status(404).json({ message: 'Order not found' });
  }

  try {
    const customer = await axios.get(
      `http://localhost:3002/customers/getCustomer/${orderData.customerId}`
    );
    const product = await axios.get(
      `http://localhost:3001/products/getProduct/${orderData.productId}`
    );

    const orderInfo = {
      orderId: orderId,
      customerData: customer.data,
      productData: product.data,
    };
    res.status(200).json(orderInfo);
  } catch (error) {
    res.status(500).json({ message: 'There is an error' });
  }
});

app.post('/orders/makeOrder', async (req, res) => {
  const ids = req.body;

  if (!ids.customerId || !ids.productId) {
    return res.status(400).json({ message: 'Please provide all the required fields' });
  }

  try {
    const customer = await axios.get(
      `http://localhost:3002/customers/getCustomer/${ids.customerId}`
    );
    console.log(customer.status);
    if (customer.status !== 200) {
      return res.status(404).json({ message: 'Customer not found or invalid' });
    }

    const product = await axios.get(
      `http://localhost:3001/products/getProduct/${ids.productId}`
    );
    console.log(product.status);
    if (product.status !== 200) {
      return res.status(404).json({ message: 'Product not found or invalid' });
    }

    const order = {
      id: idCount++,
      customerId: customer.data.id,
      productId: product.data.id,
    };

    orders.push(order);
    res.status(201).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Customer or Product invalid' });
  }
});

app.put('/orders/updateOrder/:orderId', async (req, res) => {
  const orderId = parseInt(req.params.orderId);
  const orderIndex = orders.findIndex((order) => order.id === orderId);

  if (orderIndex === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const updateOrder = req.body;
  const customerId = updateOrder.customerId;
  const productId = updateOrder.productId;

  if (!customerId || customerId === '' || customerId === ' ') {
    return res.status(400).json({ message: 'Missing or invalid customer ID' });
  }

  if (!productId || productId === '' || productId === ' ') {
    return res.status(400).json({ message: 'Missing or invalid product ID' });
  }

  try {
    const customer = await axios.get(
      `http://localhost:3002/customers/getCustomer/${customerId}`
    );
    if (customer.status !== 200) {
      return res.status(404).json({ message: 'Customer not found or invalid' });
    }

    const product = await axios.get(
      `http://localhost:3001/products/getProduct/${productId}`
    );
    if (product.status !== 200) {
      return res.status(404).json({ message: 'Product not found or invalid' });
    }

    orders[orderIndex].customerId = customerId;
    orders[orderIndex].productId = productId;

    res.status(200).json({ message: 'Order updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order' });
  }
});

app.delete('/orders/deleteOrder/:orderId', (req, res) => {
  const orderId = parseInt(req.params.orderId);
  const orderIndex = orders.findIndex((order) => order.id === orderId);

  try {
    orders.splice(orderIndex, 1);
    res.status(200).json({ message: 'Deleted Succeessfully' });
  } catch (error) {
    res.status(404).json({ message: 'Order not found or invalid' });
  }
});

app.listen(port, () => {
  console.log(`Product Server running at port ${port}`);
});
