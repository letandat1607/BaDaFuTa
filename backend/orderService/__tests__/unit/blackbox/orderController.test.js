const request = require('supertest');
const express = require('express');
const orderController = require('../../../src/controllers/orderController');
const { authenticate } = require('../../../src/helpers/middleware');

jest.mock('../../../src/services/orderService');
jest.mock('../../../src/helpers/middleware');
jest.mock('../../../src/grpc/merchantClient', () => ({
    validateOrder: jest.fn()
}));
const app = express();
app.use(express.json());

app.post('/checkOutOrder', authenticate, orderController.checkOutOrder);

describe('Order Controller Black Box Tests - POST /checkOutOrder', () => {

    const mockMerchantId = "merchant-123e4567-e89b-12d3-a456-426614174000";
    const mockUser = {
        id: "user-123e4567-e89b-12d3-a456-426614174000",
        user_name: "testuser",
        email: "test@gmail.com",
        role: "customer"
    };

    const validToken = "valid-jwt-token-from-middleware";
    const mockOrderId = "order-18765432-abcd-1234-efgh-567890abcdef";
    const validPayload = {
        merchant_id: mockMerchantId,
        full_name: "Nguyễn Văn A",
        phone: "0909111222",
        delivery_address: "123 Đường Láng, Hà Nội",
        delivery_fee: 15000,
        note: "Giao nhanh giúp mình",
        method: "MOMO",
        total_amount: 215000,
        order_items: [
            {
                menu_item_id: "item-pho-bo",
                quantity: 2,
                price: 80000,
                note: "Không hành",
                options: [
                    {
                        items: [{ option_item_id: "opt-tranchau" }]
                    }
                ]
            },
            {
                menu_item_id: "item-nuocmia",
                quantity: 1,
                price: 20000,
                note: "",
                options: []
            }
        ]
    };

    const mockCreatedOrder = {
        id: "order-98765432-abcd-1234-efgh-567890abcdef",
        merchant_id: mockMerchantId,
        full_name: "Nguyễn Văn A",
        phone: "0909111222",
        delivery_address: "123 Đường Láng, Hà Nội",
        delivery_fee: 15000,
        note: "Giao nhanh giúp mình",
        method: "MOMO",
        total_amount: 215000,
        status_payment: "pending",
        status: "waiting",
    };

    beforeEach(() => {
        jest.clearAllMocks();

        authenticate.mockImplementation((req, res, next) => {
            req.user = mockUser;
            next();
        });
    });

    describe("Equivalence Partitioning", () => {

        it("Order-001_EP - Tạo order thành công", async () => {
            require('../../../src/services/orderService').createOrder.mockResolvedValue(mockCreatedOrder);

            const res = await request(app)
                .post('/checkOutOrder')
                .set('authorization', `${validToken}`)
                .send(validPayload);

            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe("Tạo đơn hàng thành công chờ thanh toán");
            expect(res.body.status_payment).toBe("pending");
            expect(res.body.order_id).toBe(mockCreatedOrder.id);
        });

        it("Order-002_EP - Người dùng chưa đăng nhập", async () => {
            authenticate.mockImplementation((req, res) => {
                return res.status(401).json({ error: "Cần đăng nhập người dùng" });
            });

            const res = await request(app)
                .post('/checkOutOrder')
                .send(validPayload);

            expect(res.statusCode).toBe(401);
            expect(res.body.error).toBe("Cần đăng nhập người dùng");
        });

        it("Order-003_EP - Body thiếu trường bắt buộc (merchant_id)", async () => {
            const payload = { ...validPayload };
            delete payload.merchant_id;

            require('../../../src/services/orderService').createOrder.mockRejectedValue(
                new Error("Đơn hàng không hợp lệ")
            );

            const res = await request(app)
                .post('/checkOutOrder')
                .set('authorization', `${validToken}`)
                .send(payload);

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Đơn hàng không hợp lệ");
        });

        it("Order-004_EP - order_items rỗng", async () => {
            const payload = { ...validPayload, order_items: [] };

            require('../../../src/services/orderService').createOrder.mockRejectedValue(
                new Error("Đơn hàng không hợp lệ")
            );

            const res = await request(app)
                .post('/checkOutOrder')
                .set('authorization', `${validToken}`)
                .send(payload);

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Đơn hàng không hợp lệ");
        });

        it("Order-005_EP - Thanh toán lại order cũ (order_id hợp lệ)", async () => {
            const existingOrder = { ...mockCreatedOrder, id: "order-98765432-abcd-1234-efgh-567890abcdef" };
            require('../../../src/services/orderService').createOrder.mockResolvedValue(existingOrder);

            const res = await request(app)
                .post('/checkOutOrder')
                .set('authorization', `${validToken}`)
                .send({ ...validPayload, order_id: "order-98765432-abcd-1234-efgh-567890abcdef" });

            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe("Tạo đơn hàng thành công chờ thanh toán");
            expect(res.body.status_payment).toBe("pending" || "failed");
            expect(res.body.order_id).toBe("order-98765432-abcd-1234-efgh-567890abcdef");
        });

        it("Order-006_EP - order_id không tồn tại", async () => {
            require('../../../src/services/orderService').createOrder.mockRejectedValue(
                new Error("Đơn hàng không tồn tại hoặc đã được thanh toán")
            );

            const res = await request(app)
                .post('/checkOutOrder')
                .set('authorization', `${validToken}`)
                .send({ ...validPayload, order_id: "fake-order-123" });

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Đơn hàng không tồn tại hoặc đã được thanh toán");
        });

        it("Order-007_EP - Truyền giá món sai", async () => {
            const payload = JSON.parse(JSON.stringify(validPayload));
            payload.order_items[0].price = 1000;

            require('../../../src/services/orderService').createOrder.mockRejectedValue(
                new Error("Giá món không hợp lệ")
            );

            const res = await request(app)
                .post('/checkOutOrder')
                .set('authorization', `${validToken}`)
                .send(payload);

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Giá món không hợp lệ");
        });

        it("Order-008_EP - Truyền món không tồn tại", async () => {
            const payload = JSON.parse(JSON.stringify(validPayload));
            payload.order_items[0].menu_item_id = "fake-item-999";

            require('../../../src/services/orderService').createOrder.mockRejectedValue(
                new Error("Có món hoặc tùy chọn không hợp lệ")
            );

            const res = await request(app)
                .post('/checkOutOrder')
                .set('authorization', `${validToken}`)
                .send(payload);

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Có món hoặc tùy chọn không hợp lệ");
        });

        it("Order-009_EP - Truyền topping không tồn tại", async () => {
            const payload = JSON.parse(JSON.stringify(validPayload));
            payload.order_items[0].options[0].items[0].option_item_id = "fake-opt-999";

            require('../../../src/services/orderService').createOrder.mockRejectedValue(
                new Error("Có món hoặc tùy chọn không hợp lệ")
            );

            const res = await request(app)
                .post('/checkOutOrder')
                .set('authorization', `${validToken}`)
                .send(payload);

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Có món hoặc tùy chọn không hợp lệ");
        });

        it("Order-010_EP - Tổng tiền không hợp lệ", async () => {
            const payload = JSON.parse(JSON.stringify(validPayload));
            payload.total_amount = 1000;

            require('../../../src/services/orderService').createOrder.mockRejectedValue(
                new Error("Tổng tiền không hợp lệ")
            );

            const res = await request(app)
                .post('/checkOutOrder')
                .set('authorization', `${validToken}`)
                .send(payload);

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Tổng tiền không hợp lệ");
        });
    });

    describe("Decision Table & Boundary Value", () => {

        it("Order-011_DT - Body thiếu các trường bắt buộc (full_name, phone, address)", async () => {
            const payload = {
                merchant_id: "merchant-123",
                delivery_fee: 15000,
                total_amount: 95000,
                order_items: [{ menu_item_id: "pho-bo-001", quantity: 1, price: 80000 }]
            };

            require('../../../src/services/orderService').createOrder.mockRejectedValue(
                new Error("Đơn hàng không hợp lệ")
            );

            const res = await request(app)
                .post('/checkOutOrder')
                .set('authorization', `${validToken}`)
                .send(payload);

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Đơn hàng không hợp lệ");
        });

        it("Order-012_DT - options rỗng → vẫn tạo đơn thành công", async () => {
            const payload = JSON.parse(JSON.stringify(validPayload));
            payload.order_items[0].options = [];

            require('../../../src/services/orderService').createOrder.mockResolvedValue({ ...payload, id: mockOrderId });

            const res = await request(app)
                .post('/checkOutOrder')
                .set('authorization', `${validToken}`)
                .send(payload);

            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe("Tạo đơn hàng thành công chờ thanh toán");
            expect(res.body.order_id).toBe(mockOrderId);
        });

        // it("Order-013_DT - options thiếu option_item_id → vẫn tạo đơn (code hiện tại)", async () => {
        //     const payload = JSON.parse(JSON.stringify(validPayload));
        //     payload.order_items[0].options = [{ items: [{}] }]; 

        //     require('../../../src/services/orderService').createOrder.mockResolvedValue(mockCreatedOrder);

        //     const res = await request(app)
        //         .post('/checkOutOrder')
        //         .set('Authorization', `Bearer ${validToken}`)
        //         .send(payload);

        //     expect(res.statusCode).toBe(201);
        // });

        it("Order-014_BVA - quantity = 1 -> thành công", async () => {
            const payload = JSON.parse(JSON.stringify(validPayload));
            payload.order_items[0].quantity = 1;

            require('../../../src/services/orderService').createOrder.mockResolvedValue(mockCreatedOrder);

            const res = await request(app)
                .post('/checkOutOrder')
                .set('authorization', `${validToken}`)
                .send(payload);

            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe("Tạo đơn hàng thành công chờ thanh toán");
            expect(res.body.status_payment).toBe("pending");
            expect(res.body.order_id).toBe(mockCreatedOrder.id);
        });

        it("Order-015_BVA - quantity = 0 -> lỗi", async () => {
            const payload = JSON.parse(JSON.stringify(validPayload));
            payload.order_items[0].quantity = 0;

            require('../../../src/services/orderService').createOrder.mockRejectedValue(
                new Error("Đơn hàng không hợp lệ")
            );

            const res = await request(app)
                .post('/checkOutOrder')
                .set('authorization', `${validToken}`)
                .send(payload);

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Đơn hàng không hợp lệ");
        });

        it("Order-016_BVA - price = 0 -> lỗi", async () => {
            const payload = JSON.parse(JSON.stringify(validPayload));
            payload.order_items[0].price = 0;

            require('../../../src/services/orderService').createOrder.mockRejectedValue(
                new Error("Đơn hàng không hợp lệ")
            );

            const res = await request(app)
                .post('/checkOutOrder')
                .set('authorization', `${validToken}`)
                .send(payload);

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Đơn hàng không hợp lệ");
        });

        it("Order-017_BVA - total_amount = 0 -> lỗi", async () => {
            const payload = { ...validPayload, total_amount: 0 };

            require('../../../src/services/orderService').createOrder.mockRejectedValue(
                new Error("Đơn hàng không hợp lệ")
            );

            const res = await request(app)
                .post('/checkOutOrder')
                .set('authorization', `${validToken}`)
                .send(payload);

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Đơn hàng không hợp lệ");
        });
    });
});