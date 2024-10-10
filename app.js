const express = require('express');
const usersRouter = require('./microservices/users-services');
const ordersRouter = require('./microservices/orders-services');
const productsRouter = require('./microservices/products-services');
const path = require('path');
const fs = require('fs');
const https = require('https');
const cookieparser = require('cookie-parser');


const app = express();



const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname,'certificate', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname ,'certificate', 'cert.pem'))
  }, app)

app.use(cookieparser());


// Mount routers
app.use('/api/users', usersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/products', productsRouter);

// Catch-all route for unknown endpoints
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const port = process.env.port || 3000;
sslServer.listen(port, () => console.log(`Secure server running on port ${port}`))

