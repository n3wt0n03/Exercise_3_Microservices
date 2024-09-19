# Exercise 3 - Microservices

Members:

- Marc Nelson Ochavo
- Jethro Engutan

# System Overview

- **Product Service**: Handles product-related data.
- **Customer Service**: Handles customer-related data.
- **Order Service**: Handles order-related data and communicates with the other services to validate customers and products.

# API Structure Overview

1.  **Product Service**

    - POST /products: Add a new product.
    - GET /products/:productId: Get product details by ID.
    - PUT /products/:productId: Update a product.
    - DELETE /products/:productId: Delete a product.

2.  **Customer Service**

    - POST /customers: Add a new customer.
    - GET /customers/:customerId: Get customer details by ID.
    - PUT /customers/:customerId: Update customer information.
    - DELETE /customers/:customerId: Delete a customer.

3.  **Order Service**
    - POST /orders: Create a new order. This service will:
    - Verify that the customer exists by communicating with the Customer Service.
    - Verify that the product exists by communicating with the Product Service.
    - Create the order only if the customer and product are valid.
    - GET /orders/:orderId: Get order details.
    - PUT /orders/:orderId: Update an order.
    - DELETE /orders/:orderId: Delete an order.

# Instructions in Installing and Running the API

1. Clone the project in your local directory of choice. Use the link below:
    ```
    https://github.com/n3wt0n03/Exercise_3_Microservices.git
    ```

2.  Change directory to every folder: "customer", "products", and "order": 
    ```
    cd Exercise_3_Microservices\customer
    ```

3. Execute "npm i" to every folder to install node modules in every folder:
    ```
    Exercise_3_Microservices\customer> npm i
    ```
4. After installing, execute "npm start" to run the server in every folder 
    ```
    Exercise_3_Microservices\customer> npm start
    ```

5. Use the sample inputs under the folder "test_inputs" for every services in running Postman. Copy and paste it manually.