const request = require('supertest');
const app = require('../../app'); 
const { sequelize } = require('../../db');
const { User } = require('../../src/models/index');
const bcrypt = require('bcrypt');
let server;

describe('User API Integration Tests (Login & Register)', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    console.log('Database synced for integration test.');

    server = app.listen(0)
  });

  afterEach(async () => {
    await User.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
    console.log('Database connection closed.');
    server.close();
  });

  // ==================== ĐĂNG NHẬP =====================
  describe('POST /login', () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash("123456", 10);
      await User.create({
        id: "123e4567-e89b-12d3-a456-426614174000",
        user_name: "user1",
        full_name: "User One",
        email: "user1@gmail.com",
        password: hashedPassword,
        phone_number: "0909123456",
        role: "customer",
      });
    });

    it('should login successfully with valid credentials', async () => {
      const res = await request(server)
        .post('/login')
        .send({
          email: "user1@gmail.com",
          password: "123456",
          role: "customer"
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe("user1@gmail.com");
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should fail with wrong password', async () => {
      const res = await request(server)
        .post('/login')
        .send({
          email: "user1@gmail.com",
          password: "wrongpassword",
          role: "customer"
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("Email hoặc mật khẩu không đúng");
    });

    it('should fail with wrong role', async () => {
      const res = await request(server)
        .post('/login')
        .send({
          email: "user1@gmail.com",
          password: "123456",
          role: "merchant"
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("Email hoặc mật khẩu không đúng");
    });

    it('should fail with invalid format email', async () => {
      const res = await request(server)
        .post('/login')
        .send({
          email: "user1gmail.com",
          password: "123456",
          role: "customer"
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("\"email\" must be a valid email");
    });

    it('should fail with non exist user', async () => {
      const res = await request(server)
        .post('/login')
        .send({
          email: "userNonExist@gmail.com",
          password: "123456",
          role: "customer"
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("Email hoặc mật khẩu không đúng");
    });
  });

  // ==================== ĐĂNG KÝ =====================
  // describe('POST /register', () => {
  //   it('should register a new user successfully', async () => {
  //     const res = await request(app)
  //       .post('/register')
  //       .send({
  //         user_name: "newuser",
  //         full_name: "New User",
  //         email: "newuser@gmail.com",
  //         phone_number: "0909888777",
  //         password: "123456",
  //         role: "customer"
  //       });

  //     expect(res.statusCode).toBe(201);
  //     expect(res.body.message).toBe("User created");
  //     expect(res.body.user.email).toBe("newuser@gmail.com");
  //   });

  //   it('should fail if email already exists', async () => {
  //     // Tạo user trước
  //     await User.create({
  //       id: "999",
  //       user_name: "exist",
  //       full_name: "Exist",
  //       email: "exist@gmail.com",
  //       password: await bcrypt.hash("123456", 10),
  //       role: "customer"
  //     });

  //     const res = await request(app)
  //       .post('/register')
  //       .send({
  //         user_name: "exist2",
  //         full_name: "Exist Two",
  //         email: "exist@gmail.com", // trùng email
  //         phone_number: "0909111222",
  //         password: "123456",
  //         role: "customer"
  //       });

  //     expect(res.statusCode).toBe(400);
  //     expect(res.body.error).toBe("Email hoặc số điện thoại đã tồn tại");
  //   });
  // });
});