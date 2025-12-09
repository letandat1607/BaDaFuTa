const request = require('supertest');

jest.mock('../../src/grpc/merchantClient', () => ({
    validateOrder: jest.fn()
}));

const app = require('../../app');
const { sequelize } = require('../../src/utils/db');
const { Order, OrderItem, OrderItemOption } = require('../../src/models/index');
const {closeRabbitMQ} = require('../../src/rabbitMQ/rabbitConnect');
const middleware = require('../../src/helpers/middleware');

let server;

jest.mock('../../src/helpers/middleware', () => ({
    authenticate: jest.fn((req, res, next) => {
        req.user = {
            id: "5324c950-d209-44b7-9e1b-2c3d859a17af",
            email: "testuser@gmail.com",
            role: "customer"
        };
        next();
    })
}));

jest.mock('../../src/rabbitMQ/rabbitFunction', () => ({
    publishMsg: jest.fn().mockResolvedValue(true)
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

        mockUserId = "5324c950-d209-44b7-9e1b-2c3d859a17af";
        mockMerchantId = "e5f6g7h8-9012-4def-ghi3-456789abcdef";
        validToken = "Bearer mock-valid-token";
    });

    afterEach(async () => {
        await OrderItemOption.destroy({ where: {} });
        await OrderItem.destroy({ where: {} });
        await Order.destroy({ where: {} });
        jest.clearAllMocks();
    });

    afterAll(async () => {
        server?.closeAllConnections?.();
        server?.close();
    
        try {
            await closeRabbitMQ();
        } catch {}
    
        sequelize?.close?.();

        setTimeout(() => process.exit(0), 4000);
    }, 30000);

    // ==================== TẠO ĐƠN HÀNG =====================
    describe('POST /checkOutOrder', () => {
        const validOrderPayload = {
            user_id: "5324c950-d209-44b7-9e1b-2c3d859a17af",    
            merchant_id: "fb325480-5b1c-4c3b-a044-2fcac7ebce02",  
            full_name: "Nguyễn Văn A",
            phone: "0909111222",
            delivery_address: "123 Đường Láng, Hà Nội",
            delivery_fee: 15000,
            note: "Giao nhanh giúp mình",
            method: "MOMO",
            total_amount: 215000,
            order_items: [
                {
                    menu_item_id: "6434ea82-1629-4178-8d67-a0ac8e9039e9", 
                    quantity: 2,
                    price: 80000,
                    note: "Không hành",
                    options: [
                        { option_item_id: "fcef3d18-4aec-4623-8ace-5a6c7ddf82ef" }
                    ]
                },
                {
                    menu_item_id: "31d17dbf-5ba4-4c82-b3a8-e3ef1eb8c467", 
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
                    id: "5324c950-d209-44b7-9e1b-2c3d859a17af",
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

            expect(res.statusCode).toBe(201);
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
            payload.order_items[0].menu_item_id = "6434ea82-1629-4178-8d67-a0ac8e9039e8";

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
            payload.order_items[0].options[0].option_item_id = "fcef3d18-4aec-4623-8ace-5a6c7ddf83ef";

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
            expect(res.body.error).toBe("Tổng tiền không hợp lệ");
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
                .send({ ...validOrderPayload, order_id: "5424c950-d209-44b7-9e1b-2c3d859a17af" }, mockUserId);

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Đơn hàng không tồn tại hoặc đã được thanh toán");
        });
    });

    // ==================== CẬP NHẬT ĐƠN HÀNG =====================
    describe('POST /updateOrder/:id', () => {
        let createdOrderId;

        beforeEach(async () => {
            middleware.authenticate.mockImplementation((req, res, next) => {
                req.user = {
                    id: "5324c950-d209-44b7-9e1b-2c3d859a17af",
                    email: "testuser@gmail.com",
                    role: "merchant"
                };
                next();
            });

            merchantClient.validateOrder.mockResolvedValue({
                server_total: 215000
            });

            const createRes = await request(server)
                .post('/checkOutOrder')
                .set('authorization', validToken)
                .send({
                    user_id: "5324c950-d209-44b7-9e1b-2c3d859a17af",
                    merchant_id: "fb325480-5b1c-4c3b-a044-2fcac7ebce02",
                    full_name: "Nguyễn Văn A",
                    phone: "0909111222",
                    delivery_address: "123 Đường Láng, Hà Nội",
                    delivery_fee: 15000,
                    note: "Giao nhanh",
                    method: "MOMO",
                    total_amount: 215000,
                    order_items: [
                        {
                            menu_item_id: "6434ea82-1629-4178-8d67-a0ac8e9039e9",
                            quantity: 2,
                            price: 80000,
                            note: "Không hành",
                            options: [{ option_item_id: "fcef3d18-4aec-4623-8ace-5a6c7ddf82ef" }]
                        }
                    ]
                });

            createdOrderId = createRes.body.order_id;
        });

        it('should update order status successfully', async () => {
            const res = await request(server)
                .post(`/updateOrder/${createdOrderId}`)
                .set('authorization', validToken)
                .send({
                    data: {
                        status: "confirmed"
                    },
                    location: {
                        lat: 21.0285,
                        lng: 105.8542
                    }
                });

            // expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Cập nhật trạng thái đơn hàng thành công");
            expect(res.body.order).toHaveProperty('id', createdOrderId);
            expect(res.body.order.status).toBe("confirmed");
        });

        it('should fail when data is missing', async () => {
            const res = await request(server)
                .post(`/updateOrder/${createdOrderId}`)
                .set('authorization', validToken)
                .send({
                    location: {
                        lat: 21.0285,
                        lng: 105.8542
                    }
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe("Dữ liệu không hợp lệ");
        });

        it('should fail when location is missing', async () => {
            const res = await request(server)
                .post(`/updateOrder/${createdOrderId}`)
                .set('authorization', validToken)
                .send({
                    data: {
                        status: "confirmed"
                    }
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe("Dữ liệu không hợp lệ");
        });

        it('should fail when order does not exist', async () => {
            const res = await request(server)
                .post('/updateOrder/6aac9694-700c-4036-b214-81bb3cf2b0bf')
                .set('authorization', validToken)
                .send({
                    data: {
                        status: "confirmed"
                    },
                    location: {
                        lat: 21.0285,
                        lng: 105.8542
                    }
                });

            // expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Không tìm thấy đơn hàng");
        });

        it('should update order to delivering status with drone_id', async () => {
            const res = await request(server)
                .post(`/updateOrder/${createdOrderId}`)
                .set('authorization', validToken)
                .send({
                    data: {
                        status: "delivering",
                        drone_id: "drone-123456"
                    },
                    location: {
                        lat: 21.0285,
                        lng: 105.8542
                    }
                });

            // expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Cập nhật trạng thái đơn hàng thành công");
            expect(res.body.order.status).toBe("delivering");
        });

        it('should fail when updating to delivering without drone_id', async () => {
            const res = await request(server)
                .post(`/updateOrder/${createdOrderId}`)
                .set('authorization', validToken)
                .send({
                    data: {
                        status: "delivering"
                    },
                    location: {
                        lat: 21.0285,
                        lng: 105.8542
                    }
                });

            // expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Thiếu dữ liệu khi giao hàng đơn hàng");
        });

        it('should update order to complete status with drone_id', async () => {
            const res = await request(server)
                .post(`/updateOrder/${createdOrderId}`)
                .set('authorization', validToken)
                .send({
                    data: {
                        status: "complete",
                        drone_id: "drone-123456"
                    },
                    location: {
                        lat: 21.0285,
                        lng: 105.8542
                    }
                });

            // expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Cập nhật trạng thái đơn hàng thành công");
            expect(res.body.order.status).toBe("complete");
        });

        it('should fail when updating to complete without drone_id', async () => {
            const res = await request(server)
                .post(`/updateOrder/${createdOrderId}`)
                .set('authorization', validToken)
                .send({
                    data: {
                        status: "complete"
                    },
                    location: {
                        lat: 21.0285,
                        lng: 105.8542
                    }
                });

            // expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Thiếu dữ liệu khi hoàn thành đơn hàng");
        });

        it('should update multiple fields successfully', async () => {
            const res = await request(server)
                .post(`/updateOrder/${createdOrderId}`)
                .set('authorization', validToken)
                .send({
                    data: {
                        status: "confirmed",
                        note: "Giao trước 5h chiều",
                        delivery_address: "456 Đường Cầu Giấy, Hà Nội"
                    },
                    location: {
                        lat: 21.0285,
                        lng: 105.8542
                    }
                });

            // expect(res.statusCode).toBe(200);
            expect(res.body.order.status).toBe("confirmed");
            expect(res.body.order.note).toBe("Giao trước 5h chiều");
            expect(res.body.order.delivery_address).toBe("456 Đường Cầu Giấy, Hà Nội");
        });

        it('should fail with invalid data format', async () => {
            const res = await request(server)
                .post(`/updateOrder/${createdOrderId}`)
                .set('authorization', validToken)
                .send({
                    data: {
                        total_amount: -1000
                    },
                    location: {
                        lat: 21.0285,
                        lng: 105.8542
                    }
                });

            // expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Dữ liệu cập nhật đơn hàng không hợp lệ");
        });

        it('should fail when location is not an object', async () => {
            const res = await request(server)
                .post(`/updateOrder/${createdOrderId}`)
                .set('authorization', validToken)
                .send({
                    data: {
                        status: "confirmed"
                    },
                    location: "invalid location string"
                });

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Dữ liệu cập nhật đơn hàng không hợp lệ");
        });

        it('should fail when user is not authenticated', async () => {
            middleware.authenticate.mockImplementation((req, res) => {
                return res.status(401).json({ error: "Cần đăng nhập người dùng" });
            });

            const res = await request(server)
                .post(`/updateOrder/${createdOrderId}`)
                .send({
                    data: {
                        status: "confirmed"
                    },
                    location: {
                        lat: 21.0285,
                        lng: 105.8542
                    }
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.error).toBe("Cần đăng nhập người dùng");
        });
    });
});