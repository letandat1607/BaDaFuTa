// // File: __tests__/setup.js
// require('dotenv').config({ path: '../.env' });

// // Không dùng Testcontainers nữa
// // const { GenericContainer } = require('testcontainers');

// let dbConnection;

// beforeAll(async () => {
//   console.log('Connecting to existing PostgreSQL container...');
  
//   // Sử dụng DATABASE_URL từ environment variables
//   const databaseUrl = 'postgresql://test:test@postgres:5432/testdb';
  
//   // Import Sequelize hoặc DB client của bạn
//   const { sequelize } = require('../db');
  
//   try {
//     await sequelize.authenticate();
//     console.log('Database connection established successfully.');
    
//     // Sync models (tạo bảng)
//     await sequelize.sync({ force: true }); // force: true sẽ drop và tạo lại bảng
//     console.log('Database tables created.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//     throw error;
//   }
// });

// afterAll(async () => {
//   if (dbConnection) {
//     await dbConnection.close();
//   }
// });

// module.exports = {};


// File: backend/userService/__tests__/setup.js
require('dotenv').config({ path: '../.env' });

// Chỉ có setup code, KHÔNG có describe/it blocks
beforeAll(async () => {
  console.log('Setup: Skipping database connection for now');
  // TODO: Add database connection later
});

afterAll(async () => {
  console.log('Teardown complete');
});

// Export để sử dụng trong tests khác nếu cần
module.exports = {};