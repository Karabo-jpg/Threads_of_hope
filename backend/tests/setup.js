const { sequelize } = require('../src/config/database');

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'threads_of_hope_test';

// Setup before all tests
beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
});

// Cleanup after all tests
afterAll(async () => {
  await sequelize.close();
});


