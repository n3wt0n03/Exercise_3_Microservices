# Microservices Project Overview

Members:

- Marc Nelson Ochavo
- Jethro Engutan

# Changes made:

- **Customer Service** turned to **User Services**. This service handles user-related data.
- All services are now contained into one folder named **microservices**.
- Added middlewares for all the services and are contained into one folder named **middlewares**.
- Added **app.js** file that handles all the requests for all the services.

# Technologies Used:

- Node.js
- Postman

# Node Libraries Used:

- Express.js
- Axios
- bcrypt
- express-validator
- express-rate-limit
- jsonwebtoken

# Security Implementations:

- Token-based authentication using **JSON Web Tokens (JWT)**
- Validation to Services using **express-validator**
- **Role-Based Access Control (RBAC)** for each services
- **API Gateway** for routing requests
- **Rate Limiting** for request management

# Installation and Running Instructions

1. **Clone the Project**: Clone the project to your local directory of choice using the link below:

   ```
   https://github.com/n3wt0n03/Exercise_3_Microservices.git

   ```

2. **Install Dependencies**: Navigate to the project directory and install the required node modules:

   ```
   cd Exercise_3_Microservices
   npm install
   ```

3. **Run the Microservices**: Navigate to the microservices directory:

   ```
   cd microservices
   ```

4. **Start the Services**: Use the scripts defined in the package.json to run each service. For example, to start the User service, run:

   ```
   npm run run-users
   ```

   Repeat for other services as needed in a new powershell.

5. **Testing with Postman**: Use the sample inputs located in the test_inputs folder to test the API services. You can copy and paste these into Postman.
