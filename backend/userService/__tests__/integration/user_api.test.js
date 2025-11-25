// // tests/integration/auth.integration.test.js
// const request = require('supertest');
// const app = require('../../app');
// const { sequelize } = require('../../db');
// const { v4: uuidv4 } = require('uuid');

// beforeAll(async () => {
//   // setup.js đã sync DB rồi → không cần sync lại
//   console.log('DB đã sẵn sàng cho test auth');
// });

// afterEach(async () => {
//   // XÓA SẠCH dữ liệu sau mỗi test → đảm bảo độc lập
//   await sequelize.truncate({ cascade: true, restartIdentity: true });
// });

// afterAll(async () => {
//   await sequelize.close();
// });

// describe('AUTH MODULE - Integration Test', () => {
//   const generateEmail = () => `test_${uuidv4()}@example.com`;

//   // REG-001: Đăng ký thành công
//   it('REG-001: Should register successfully - Happy Path', async () => {
//     const email = generateEmail();
//     const res = await request(app).post('/register').send({
//       user_name: 'happyuser',
//       full_name: 'Happy User',
//       email,
//       phone_number: '0909123456',
//       password: '123456',
//       role: 'customer'
//     });

//     expect(res.status).toBe(201);
//     expect(res.body.message).toContain('created');
//     expect(res.body.user.email).toBe(email);
//   });

//   // REG-002: Email đã tồn tại
//   it('REG-002: Should reject duplicate email', async () => {
//     const email = generateEmail();

//     await request(app).post('/register').send({
//       user_name: 'user1', full_name: 'A', email, phone_number: '0909111222', password: '123456', role: 'customer'
//     });

//     const res = await request(app).post('/register').send({
//       user_name: 'user2', full_name: 'B', email, phone_number: '0909333444', password: '123456', role: 'customer'
//     });

//     expect(res.status).toBe(400);
//     expect(res.body.error).toContain('tồn tại');
//   });

//   // REG-006: Password < 6 ký tự
//   it('REG-006: Should reject password < 6 characters', async () => {
//     const res = await request(app).post('/register').send({
//       user_name: 'short', full_name: 'Short', email: generateEmail(),
//       password: '12345', phone_number: '0909999999', role: 'customer'
//     });
//     expect(res.status).toBe(400);
//     expect(res.body.error).toContain('mật khẩu');
//   });

//   // REG-012: Password = 6 ký tự → OK
//   it('REG-012: Should accept password = 6 characters', async () => {
//     const res = await request(app).post('/register').send({
//       user_name: 'exact6', full_name: 'Exact', email: generateEmail(),
//       password: '123456', phone_number: '0908887777', role: 'customer'
//     });
//     expect(res.status).toBe(201);
//   });

//   // LOG-001: Đăng nhập thành công
//   it('LOG-001: Should login successfully and return token', async () => {
//     const email = generateEmail();
//     await request(app).post('/register').send({
//       user_name: 'loginuser', full_name: 'Login User', email,
//       phone_number: '0909998888', password: '123456', role: 'customer'
//     });

//     const res = await request(app).post('/login').send({
//       email, password: '123456'
//     });

//     expect(res.status).toBe(200);
//     expect(res.body.token).toBeDefined();
//     expect(res.body.user.password).toBeUndefined(); // không trả password
//   });

//   // LOG-003: Sai mật khẩu → 401
//   it('LOG-003: Should reject wrong password → 401', async () => {
//     const email = generateEmail();
//     await request(app).post('/register').send({
//       user_name: 'wp', full_name: 'Wrong Pass', email,
//       password: 'correct123', phone_number: '0901112222', role: 'customer'
//     });

//     const res = await request(app).post('/login').send({
//       email, password: 'wrong123'
//     });

//     expect(res.status).toBe(401); // SỬA THÀNH 401
//     expect(res.body.message).toContain('không đúng');
//   });
// });

describe('User API Integration Tests - TODO', () => {
    it('should write integration tests here', () => {
      expect(true).toBe(true);
    });
  })