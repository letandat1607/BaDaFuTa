const request = require('supertest');
const express = require('express');

const userController = require('../../../src/controllers/userController');
const { use } = require('passport');

jest.mock('../../../src/services/userService');

const app = express();
app.use(express.json());

app.post('/login', userController.signInUser);
app.post("/register", userController.registerUser);

describe('User Controller Black Box Auth Tests (Login & Register)', () => {
    const mockCreatedUser = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        user_name: "user1",
        email: "user1@gmail.com",
        phone_number: "0909123456",
        role: "customer",
    };

    const mockLoginResponse = {
        message: "Đăng nhập thành công",
        token: "mockedJwtToken",
        user: {
            id: "123e4567-e89b-12d3-a456-426614174000",
            user_name: "user1",
            email: "user1@gmail.com",
            phone_number: "0909123456",
            role: "customer",
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

///////////////////////LOGIN///////////////////////////////////
    describe("Post /login", () => {
        it("LOG_001_EP - should login successfully with valid credentials", async () => {
            require('../../../src/services/userService').signIn.mockResolvedValue(mockLoginResponse);

            const res = await request(app)
                .post('/login')
                .send({
                    email: "user1@gmail.com",
                    password: "123456",
                    role: "customer"
                });
            
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockLoginResponse);
            expect(require('../../../src/services/userService').signIn).toHaveBeenCalledTimes(1);
        });

        it("LOG_002_EP - should login fail with invalid format email", async () => {
            require('../../../src/services/userService').signIn.mockRejectedValue(
                new Error('"email" must be a valid email')
            );

            const res = await request(app)
                .post('/login')
                .send({
                    email: "invalidEmailFormat",   
                    password: "123456",
                    role: "customer"
                });
            
            expect(res.statusCode).toBe(401);
            expect(res.body.error).toBe('"email" must be a valid email');
            expect(require('../../../src/services/userService').signIn).toHaveBeenCalledTimes(1);
        });

        it("LOG_003_EP - should fail login with wrong password", async () => {
            require('../../../src/services/userService').signIn.mockRejectedValue(
                new Error("Email hoặc mật khẩu không đúng")
            );

            const res = await request(app)
                .post('/login')
                .send({
                    email: "user1@gmail.com",   
                    password: "wrongpassword",
                    role: "customer"
                })
            
            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty("error");
            expect(res.body.error).toBe("Email hoặc mật khẩu không đúng");
            expect(require('../../../src/services/userService').signIn).toHaveBeenCalledTimes(1);
        });

        it("LOG_004_EP - should fail login with non-existing email", async () => {
            require('../../../src/services/userService').signIn.mockRejectedValue(
                new Error("Email hoặc mật khẩu không đúng")
            );

            const res = await request(app)
                .post('/login')
                .send({ 
                    email: "nonExistUser@gmail.com",
                    password: "123456",
                    role: "customer"
                })
            
            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty("error");
            expect(res.body.error).toBe("Email hoặc mật khẩu không đúng");
            expect(require('../../../src/services/userService').signIn).toHaveBeenCalledTimes(1);
        });

        it("LOG_005_EP - should fail login with wrong role", async () => {
            require('../../../src/services/userService').signIn.mockRejectedValue(
                new Error("Email hoặc mật khẩu không đúng")
            );

            const res = await request(app)
                .post('/login')
                .send({
                    email: "user1@gmail.com",
                    password: "123456",
                    role: "merchant"
                })
            
            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty("error");
            expect(res.body.error).toBe("Email hoặc mật khẩu không đúng");
            expect(require('../../../src/services/userService').signIn).toHaveBeenCalledTimes(1);
        });

    });
});