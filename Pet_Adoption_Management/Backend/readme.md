1) Project setup
2) Database connection
3) User CRUD operation
4) Auth endpoints: /api/auth/signup, /api/auth/login (returns JWT)
5) All /api/users routes are protected and require Authorization: Bearer <token>

Dependency
  express, pg, nodemon, sequelize, dotenv, body-parser, cors, jsonwebtoken, bcryptjs

.env example:
PORT=5000
DB_NAME=your_db
DB_USER=your_user
DB_PASSWORD=your_password
DB_HOST=localhost
JWT_SECRET=your_secret
JWT_EXPIRES_IN=1d

Running script

npm run dev  // for development
npm start   


# Navigate to backend directory
cd Pet_Adoption_Management/Backend

# Run all tests
npm test

# Run specific test files
npm test -- adoptionController.test.js
npm test -- favoriteController.test.js
npm test -- authMiddleware.test.js
npm test -- integration/adoptionFlow.test.js

# Run with coverage
npm test -- --coverage