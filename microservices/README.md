# System Overview

- **User Service**: Handles user-related data.
- **Product Service**: Handles product-related data.
- **Order Service**: Handles order-related data and communicates with the other services to validate users and products.

# API Structure Overview

1.  **Product Service**

    - POST /products: Add a new product.
    - GET /products/:productId: Get product details by ID.
    - PUT /products/:productId: Update a product.
    - DELETE /products/:productId: Delete a product.

2.  **User Service**

    - POST /users: Add a new user.
    - GET /users/:userId: Get user details by ID.
    - PUT /users/:userId: Update user information.
    - DELETE /users/:userId: Delete a user.

3.  **Order Service**
    - POST /orders: Create a new order. This service will:
    - Verify that the user exists by communicating with the User Service.
    - Verify that the product exists by communicating with the Product Service.
    - Create the order only if the user and product are valid.
    - GET /orders/:orderId: Get order details.
    - PUT /orders/:orderId: Update an order.
    - DELETE /orders/:orderId: Delete an order.
