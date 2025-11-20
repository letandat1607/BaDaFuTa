const { GenericContainer, Wait } = require('testcontainers');

let container;

beforeAll(async () => {
  console.log('Khởi động PostgreSQL test container...');

  container = await new GenericContainer('postgres:15')
    .withEnvironment({
      POSTGRES_USER: 'test',
      POSTGRES_PASSWORD: 'test',
      POSTGRES_DB: 'testdb'
    })
    .withExposedPorts(5432) // container dùng 5432
    .withWaitStrategy(Wait.forLogMessage('database system is ready to accept connections'))
    .start();

  // Docker tự map 5432 (container) → 1 port trống trên host (ví dụ: 54321)
  const hostPort = container.getMappedPort(5432);
  console.log(`DB test chạy trên localhost:${hostPort}`);

  // Gán URL kết nối cho service
  process.env.DATABASE_URL = `postgresql://test:test@localhost:${hostPort}/testdb`;

  // Sync schema
  const { sequelize } = require('../../src/utils/db');
  await sequelize.sync({ force: true });

  global.__PG_CONTAINER__ = container;
}, 60000);

afterAll(async () => {
  if (global.__PG_CONTAINER__) {
    await global.__PG_CONTAINER__.stop();
    console.log('Đã dừng PostgreSQL test container');
  }
});