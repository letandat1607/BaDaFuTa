const request = require('supertest');

jest.mock('../../src/grpc/merchantClient', () => ({
    validateOrder: jest.fn()
}));

const app = require('../../app');
const { sequelize } = require('../../src/utils/db');
const { Order, OrderItem, OrderItemOption } = require('../../src/models/index');
const middleware = require('../../src/helpers/middleware');

let server;

jest.mock('../../src/helpers/middleware', () => ({
    authenticate: jest.fn((req, res, next) => {
        req.user = {
            id: "user-123e4567-e89b-12d3-a456-426614174000",
            email: "testuser@gmail.com",
            role: "customer"
        };
        next();
    })
}));

const merchantClient = require('../../src/grpc/merchantClient');

describe('Order API Integration Tests', () => {
    let mockUserId;
    let mockMerchantId;
    let validToken;

    beforeAll(async () => {
        await sequelize.sync({ force: true });
        console.log('Database synced for integration test.');

        server = app.listen(0);

        mockUserId = "user-123e4567-e89b-12d3-a456-426614174000";
        mockMerchantId = "merchant-123e4567-e89b-12d3-a456-426614174000";
        validToken = "Bearer mock-valid-token";
    });

    afterEach(async () => {
        await OrderItemOption.destroy({ where: {} });
        await OrderItem.destroy({ where: {} });
        await Order.destroy({ where: {} });
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await sequelize.close();
        console.log('Database connection closed.');
        server.close();
    });

    // ==================== TẠO ĐƠN HÀNG =====================
    describe('POST /checkOutOrder', () => {
        const validOrderPayload = {
            user_id: "user-123e4567-e89b-12d3-a456-426614174000",
            merchant_id: "merchant-123e4567-e89b-12d3-a456-426614174000",
            full_name: "Nguyễn Văn A",
            phone: "0909111222",
            delivery_address: "123 Đường Láng, Hà Nội",
            delivery_fee: 15000,
            note: "Giao nhanh giúp mình",
            method: "MOMO",
            total_amount: 215000,
            order_items: [
                {
                    menu_item_id: "phobo-123e4567-e89b-12d3-a456-426614174000",
                    quantity: 2,
                    price: 80000,
                    note: "Không hành",
                    options: [
                        { option_item_id: "xuongbo-123e4567-e89b-12d3-a456-426614174000" }
                    ]
                },
                {
                    menu_item_id: "nuocmia-123e4567-e89b-12d3-a456-426614174000",
                    quantity: 1,
                    price: 20000,
                    note: "",
                    options: []
                }
            ]
        };

        beforeEach(() => {
            middleware.authenticate.mockImplementation((req, res, next) => {
                req.user = {
                    id: "user-123e4567-e89b-12d3-a456-426614174000",
                    email: "testuser@gmail.com",
                    role: "customer"
                };
                next();
            });


            merchantClient.validateOrder.mockResolvedValue({
                server_total: 215000
            });
        });

        it('should create order successfully with valid data', async () => {
            const res = await request(server)
                .post('/checkOutOrder')
                .set('authorization', validToken)
                .send(validOrderPayload, mockUserId);

            // expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('message', 'Tạo đơn hàng thành công chờ thanh toán');
            expect(res.body).toHaveProperty('order_id');
            expect(res.body).toHaveProperty('status_payment', 'pending');
        });

        it('should fail when user is not authenticated', async () => {
            middleware.authenticate.mockImplementation((req, res) => {
                return res.status(401).json({ error: "Cần đăng nhập người dùng" });
            });

            const res = await request(server)
                .post('/checkOutOrder')
                .send(validOrderPayload, mockUserId);

            expect(res.statusCode).toBe(401);
            expect(res.body.error).toBe("Cần đăng nhập người dùng");
        });

        it('should fail when merchant_id is missing', async () => {
            const payload = { ...validOrderPayload };
            delete payload.merchant_id;

            const res = await request(server)
                .post('/checkOutOrder')
                .set('authorization', validToken)
                .send(payload, mockUserId);

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Đơn hàng không hợp lệ");
        });

        it('should fail when order_items is empty', async () => {
            const payload = { ...validOrderPayload, order_items: [] };

            const res = await request(server)
                .post('/checkOutOrder')
                .set('authorization', validToken)
                .send(payload, mockUserId);

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Đơn hàng không hợp lệ");
        });

        it('should fail when full_name is missing', async () => {
            const payload = { ...validOrderPayload };
            delete payload.full_name;

            const res = await request(server)
                .post('/checkOutOrder')
                .set('authorization', validToken)
                .send(payload, mockUserId);

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Đơn hàng không hợp lệ");
        });

        it('should fail when phone is missing', async () => {
            const payload = { ...validOrderPayload };
            delete payload.phone;

            const res = await request(server)
                .post('/checkOutOrder')
                .set('authorization', validToken)
                .send(payload, mockUserId);

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Đơn hàng không hợp lệ");
        });

        it('should fail when delivery_address is missing', async () => {
            const payload = { ...validOrderPayload };
            delete payload.delivery_address;

            const res = await request(server)
                .post('/checkOutOrder')
                .set('authorization', validToken)
                .send(payload, mockUserId);

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Đơn hàng không hợp lệ");
        });

        it('should fail when item price is invalid', async () => {
            const payload = JSON.parse(JSON.stringify(validOrderPayload));
            payload.order_items[0].price = 1000;

            merchantClient.validateOrder.mockRejectedValue(
                new Error("Giá món không hợp lệ")
            );

            const res = await request(server)
                .post('/checkOutOrder')
                .set('authorization', validToken)
                .send(payload, mockUserId);

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Giá món không hợp lệ");
        });

        it('should fail when menu_item_id does not exist', async () => {
            const payload = JSON.parse(JSON.stringify(validOrderPayload));
            payload.order_items[0].menu_item_id = "fake-item-999";

            merchantClient.validateOrder.mockRejectedValue(
                new Error("Có món hoặc tùy chọn không hợp lệ")
            );

            const res = await request(server)
                .post('/checkOutOrder')
                .set('authorization', validToken)
                .send(payload, mockUserId);

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Có món hoặc tùy chọn không hợp lệ");
        });

        it('should fail when option_item_id does not exist', async () => {
            const payload = JSON.parse(JSON.stringify(validOrderPayload));
            payload.order_items[0].options[0].option_item_id = "fake-opt-999";

            merchantClient.validateOrder.mockRejectedValue(
                new Error("Có món hoặc tùy chọn không hợp lệ")
            );

            const res = await request(server)
                .post('/checkOutOrder')
                .set('authorization', validToken)
                .send(payload, mockUserId);

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Có món hoặc tùy chọn không hợp lệ");
        });

        it('should fail when total_amount is invalid', async () => {
            const payload = JSON.parse(JSON.stringify(validOrderPayload));
            payload.total_amount = 1000;

            merchantClient.validateOrder.mockResolvedValue({
                server_total: 215000
            });

            const res = await request(server)
                .post('/checkOutOrder')
                .set('authorization', validToken)
                .send(payload, mockUserId);

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Tổng tiền không hợp lệ");
        });

        it('should create order successfully with empty options', async () => {
            const payload = JSON.parse(JSON.stringify(validOrderPayload));
            payload.order_items[0].options = [];

            merchantClient.validateOrder.mockResolvedValue({
                server_total: 215000
            });

            const res = await request(server)
                .post('/checkOutOrder')
                .set('authorization', validToken)
                .send(payload, mockUserId);

            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe("Tạo đơn hàng thành công chờ thanh toán");
        });

        it('should fail when quantity is 0', async () => {
            const payload = JSON.parse(JSON.stringify(validOrderPayload));
            payload.order_items[0].quantity = 0;

            const res = await request(server)
                .post('/checkOutOrder')
                .set('authorization', validToken)
                .send(payload, mockUserId);

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Đơn hàng không hợp lệ");
        });

        it('should create order successfully when quantity is 1', async () => {
            const payload = JSON.parse(JSON.stringify(validOrderPayload));
            payload.order_items[0].quantity = 1;

            merchantClient.validateOrder.mockResolvedValue({
                server_total: 215000
            });

            const res = await request(server)
                .post('/checkOutOrder')
                .set('authorization', validToken)
                .send(payload, mockUserId);

            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe("Tạo đơn hàng thành công chờ thanh toán");
        });

        it('should fail when price is 0', async () => {
            const payload = JSON.parse(JSON.stringify(validOrderPayload));
            payload.order_items[0].price = 0;

            const res = await request(server)
                .post('/checkOutOrder')
                .set('authorization', validToken)
                .send(payload, mockUserId);

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Đơn hàng không hợp lệ");
        });

        it('should fail when total_amount is 0', async () => {
            const payload = { ...validOrderPayload, total_amount: 0 };

            const res = await request(server)
                .post('/checkOutOrder')
                .set('authorization', validToken)
                .send(payload, mockUserId);

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Đơn hàng không hợp lệ");
        });

        it('should retry payment for existing order with valid order_id', async () => {
            const firstRes = await request(server)
                .post('/checkOutOrder')
                .set('authorization', validToken)
                .send(validOrderPayload, mockUserId);

            expect(firstRes.statusCode).toBe(201);
            const orderId = firstRes.body.order_id;

            const retryRes = await request(server)
                .post('/checkOutOrder')
                .set('authorization', validToken)
                .send({ ...validOrderPayload, order_id: orderId }, mockUserId);

            expect(retryRes.statusCode).toBe(201);
            expect(retryRes.body.order_id).toBe(orderId);
            expect(['pending', 'failed']).toContain(retryRes.body.status_payment);
        });

        it('should fail when order_id does not exist or order_id does not belong to user', async () => {
            const res = await request(server)
                .post('/checkOutOrder')
                .set('authorization', validToken)
                .send({ ...validOrderPayload, order_id: "fake-order-123" }, mockUserId);

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Đơn hàng không tồn tại hoặc đã được thanh toán");
        });
    });
});