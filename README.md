Users REST API - Technical Assessment
A simple REST API for user management built with Node.js, TypeScript, and Express.js.

🚀 Features
Create User: POST /users - Create a new user with name and email
Get User: GET /users/:id - Retrieve a user by their ID
List Users: GET /users - Get all users (bonus endpoint)
In-memory data storage (no database required)
Comprehensive error handling and validation
UUID-based user IDs
Email uniqueness validation
Full test coverage
🛠️ Technology Stack
Language: TypeScript
Framework: Express.js
Runtime: Node.js
Testing: Jest + Supertest
ID Generation: UUID v4
📋 Requirements
Node.js (v16 or higher)
npm or yarn
🏗️ Installation & Setup
Clone the repository

git clone <https://github.com/Blaisepasca/challenge_rest_api.git>
cd challenge_rest_api
Install dependencies

npm install
Build the project

npm run build
Start the server

npm start
Or for development with auto-reload:

npm run dev
The API will be running at http://localhost:3000

📚 API Documentation
Base URL
http://localhost:3000
Endpoints
1. Create User
Method: POST
URL: /users
Content-Type: application/json
Request Body:

{
  "name": "John Doe",
  "email": "john@example.com"
}
Success Response (201):

{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-06-20T10:30:00.000Z"
  },
  "message": "User created successfully"
}
Error Responses:

400 - Validation errors (missing/invalid fields)
409 - Email already exists
500 - Internal server error
2. Get User by ID
Method: GET
URL: /users/:id
Success Response (200):

{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-06-20T10:30:00.000Z"
  },
  "message": "User retrieved successfully"
}
Error Responses:

400 - Invalid UUID format
404 - User not found
500 - Internal server error
3. Get All Users (Bonus)
Method: GET
URL: /users
Success Response (200):

{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-06-20T10:30:00.000Z"
    }
  ],
  "message": "Retrieved 1 users"
}

🧪 Testing
Run All Tests
npm test
Run Tests with Coverage
npm test -- --coverage
Manual Testing with cURL
Create a user:
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
Get user by ID (replace with actual ID from create response):
curl -X GET http://localhost:3000/users/550e8400-e29b-41d4-a716-446655440000
Get all users:
curl -X GET http://localhost:3000/users

Test Cases Covered
✅ Create user with valid data
✅ Validation errors (missing name, missing email, invalid email)
✅ Email uniqueness validation
✅ Get user by valid ID
✅ Get user with invalid ID format
✅ Get non-existent user (404)
✅ List all users
✅ Health check endpoint
✅ Invalid JSON handling
✅ 404 route handling
🔧 Development Scripts
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start production server
npm start

# Start development server with auto-reload
npm run dev

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Clean build directory
npm run clean
📁 Project Structure
src/
├── controllers/        # Request handlers
│   └── userController.ts
├── services/          # Business logic
│   └── userService.ts
├── routes/            # Route definitions
│   └── userRoutes.ts
├── types/             # TypeScript interfaces
│   └── user.ts
├── utils/             # Utility functions
│   └── validation.ts
├── middleware/        # Express middleware
│   └── index.ts
├── app.ts            # Express app configuration
└── server.ts         # Server startup

tests/
├── setup.ts          # Test configuration
├── userService.test.ts
├── validation.test.ts
└── api.test.ts
🎯 Key Features Implemented
Validation: Comprehensive input validation with meaningful error messages
Error Handling: Proper HTTP status codes and error responses
UUID Support: Auto-generated unique identifiers
Email Normalization: Lowercase and trimmed emails
Duplicate Prevention: Email uniqueness validation
Memory Storage: In-memory user storage as requested
TypeScript: Full type safety throughout the application
Testing: Complete test suite with >95% coverage
Documentation: Comprehensive README with examples
🚦 Error Handling
The API returns consistent error responses:

{
  "success": false,
  "error": "Error Type",
  "message": "Detailed error message"
}
Common HTTP status codes:

200 - Success
201 - Created
400 - Bad Request (validation errors)
404 - Not Found
409 - Conflict (duplicate email)
500 - Internal Server Error
🔍 Additional Testing Methods
Using Postman
Import the following endpoints into Postman:
POST http://localhost:3000/users
GET http://localhost:3000/users/:id
GET http://localhost:3000/users

Using HTTPie
# Create user
http POST localhost:3000/users name="John Doe" email="john@example.com"

# Get user
http GET localhost:3000/users/USER_ID_HERE

# Get all users
http GET localhost:3000/users
📊 Performance Considerations
In-memory storage for fast access
UUID v4 for unique, non-sequential IDs
Efficient Map-based user lookup
Minimal middleware stack for low latency
🔒 Security Features
Input validation and sanitization
Email format validation
UUID format validation
JSON payload size limits
Error message sanitization
Author: [Blaise Pascal]
Date: June 20, 2025
Purpose: Technical Assessment - BE Internship

