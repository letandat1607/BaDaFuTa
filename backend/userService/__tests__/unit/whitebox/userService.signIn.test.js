process.env.JWT_SECRET = "testsecret";
process.env.JWT_EXPIRES_IN = "1h";

const userService = require('../../../src/services/userService');
const userRepo = require('../../../src/repositories/userRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sanitizeUser } = require('../../../src/helpers/middleware');
const { loginSchema } = require('../../../src/validation/userValidation');

jest.mock('../../../src/repositories/userRepository');
jest.mock('../../../src/helpers/middleware');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');



describe('userService.signIn - Whitebox Tests', () => {
    const mockUser = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        user_name: "userTest",
        email: "userTest@gmail.com",
        password: "hashedPasswordTest",
        role: "customer",
        toJSON: jest.fn().mockReturnThis(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should sign in successfully with valid credentials", async () => {
        loginSchema.validate = jest.fn().mockReturnValue({
            error: null,
            value: {
                email: "userTest@gmail.com",
                password: "123456",
                role: "customer"
            }
        });
        userRepo.findOneUser.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue("mockedJwtToken");
        sanitizeUser.mockReturnValue({
            id: mockUser.id,
            user_name: mockUser.user_name,
            email: mockUser.email,
            role: mockUser.role
        });

        const result = await userService.signIn({
            email: "userTest@gmail.com",
            password: "123456",
            role: "customer"
        });

        expect(loginSchema.validate).toHaveBeenCalledTimes(1);
        expect(userRepo.findOneUser).toHaveBeenCalledWith({
            [require('sequelize').Op.and]: [
                { email: "userTest@gmail.com" },
                { role: "customer" }
            ]
        });
        expect(bcrypt.compare).toHaveBeenCalledWith("123456", "hashedPasswordTest");
        expect(jwt.sign).toHaveBeenCalledWith(
            {
                id: mockUser.id,
                user_name: mockUser.user_name,
                email: mockUser.email,
                role: mockUser.role
            },
            "testsecret",
            { expiresIn: "1h" }
        );
        expect(sanitizeUser).toHaveBeenCalledWith(mockUser);
        expect(result).toEqual({
            token: "mockedJwtToken",
            user: {
                id: mockUser.id,
                user_name: mockUser.user_name,
                email: mockUser.email,
                role: mockUser.role
            }
        });
    });

    test.each([
        [{ email: "", password: "123456", role: "customer" }, "Invalid data"],
        [{ email: "userTest@gmail.com", password: "", role: "customer" }, "Invalid data"],
        [{ email: "userTest@gmail.com", password: "123456", role: "" }, "Invalid data"],
      ])("should throw validation error for invalid input %o", async (input, expectedError) => {
        loginSchema.validate = jest.fn().mockReturnValue({
            error: { message: "Invalid data" },
            value: null
        });
      
        await expect(userService.signIn(input)).rejects.toThrow(expectedError);
        expect(loginSchema.validate).toHaveBeenCalledTimes(1);
      });

    it("should throw error when user not found (wrong email)", async () => {
        loginSchema.validate = jest.fn().mockReturnValue({
            error: null,
            value: {
                email: "wrong@gmail.com",
                password: "123456",
                role: "customer"
            }
        });
        userRepo.findOneUser.mockResolvedValue(null);

        await expect(userService.signIn({
            email: "wrong@email.com",
            password: "123456",
            role: "customer"
        })).rejects.toThrow("Email hoặc mật khẩu không đúng");
    });

    it("should throw error when user not found (wrong role)", async () => {
        loginSchema.validate = jest.fn().mockReturnValue({
            error: null,
            value: {
                email: "userTest@gmail.com",
                password: "123456",
                role: "merchant"
            }
        });
        userRepo.findOneUser.mockResolvedValue(null);

        await expect(userService.signIn({
            email: "userTest@email.com",
            password: "123456",
            role: "merchant"
        })).rejects.toThrow("Email hoặc mật khẩu không đúng");
    });

    it("should throw error for incorrect password", async () => {
        loginSchema.validate = jest.fn().mockReturnValue({
            error: null,
            value: {
                email: "userTest@gmail.com",
                password: "wrongpassword",
                role: "customer"
            }
        });
        userRepo.findOneUser.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(false);

        await expect(userService.signIn({
            email: "userTest@gmail.com",
            password: "wrongpassword",
            role: "customer"
        })).rejects.toThrow("Email hoặc mật khẩu không đúng");
    });
});
