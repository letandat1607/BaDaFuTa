process.env.JWT_SECRET = "testsecret";
process.env.JWT_EXPIRES_IN = "1h";

const orderService = require('../../../src/services/orderService');
const orderRepo = require('../../../src/repositories/orderRepository');
const rabbitFunction = require('../../../src/rabbitMQ/rabbitFunction');
const { sequelize } = require('../../../src/utils/db');
const { v4 } = require('uuid');
const { validateOrder } = require('../../../src/grpc/merchantClient');
const orderSchema = require('../../../src/validations/orderValidation');
const orderItemValidation = require('../../../src/validations/orderItemValidation');

jest.mock('../../../src/repositories/orderRepository');
jest.mock('../../../src/rabbitMQ/rabbitFunction');
jest.mock('../../../src/utils/db');
jest.mock('uuid');
jest.mock('../../../src/grpc/merchantClient', () => ({
    validateOrder: jest.fn()
}));

describe('orderService createOrder - Whitebox Tests', () => {
    const mockExistOrderId = "orderId-1234";
    const mockNewOrderId = "newOrderId-1213";
    const mockUserId = "userId-5678";
    const mockUserIdWrong = "userId-9999";
    const mockMerchantId = "merchantId-91011";

    const mockOrder = {
        user_id: mockUserId,
        merchant_id: mockMerchantId,
        full_name: "John Doe",
        phone: "0901113334",
        delivery_address: "123 ABC Street",
        delivery_fee: 5000,
        note: "Leave at door",
        method: "MOMO",
        total_amount: 200000,
        order_items: [
            {
                menu_item_id: 'item-1',
                quantity: 2,
                price: 80000,
                note: 'Không hành',
                options: [
                    {
                        items: [
                            { option_item_id: 'opt-1' },
                            { option_item_id: 'opt-2' }
                        ]
                    }
                ]
            },
            {
                menu_item_id: 'item-2',
                quantity: 1,
                price: 30000,
                note: '',
                options: []
            }
        ]
    };

    const mockExistingOrder = {
        id: mockExistOrderId,
        user_id: mockUserId,
        merchant_id: mockMerchantId,
        full_name: "John Doe",
        phone: "0901113334",
        delivery_address: "123 ABC Street",
        delivery_fee: 5000,
        note: "Leave at door",
        method: "MOMO",
        total_amount: 200000
    };

    const mockTransaction = {
        commit: jest.fn().mockResolvedValue(),
        rollback: jest.fn().mockResolvedValue()
    };

    beforeEach(() => {
        jest.clearAllMocks();
        v4
            .mockReturnValueOnce(mockNewOrderId)
            .mockReturnValueOnce('orderItem-111')
            .mockReturnValueOnce('orderItem-222');

        sequelize.transaction.mockResolvedValue(mockTransaction);

        orderSchema.validate = jest.fn().mockReturnValue({
            error: null,
            value: {
                status: 'waiting',
                user_id: mockUserId,
                merchant_id: mockMerchantId,
                full_name: "John Doe",
                phone: "0901113334",
                delivery_address: "123 ABC Street",
                delivery_fee: 5000,
                note: "Leave at door",
                method: "MOMO",
                total_amount: 200000
            }
        });

        orderItemValidation.validate = jest.fn().mockReturnValue({
            error: null,
            value: {
                menu_item_id: 'item-1',
                quantity: 2,
                price: 80000,
                note: 'Không hành'
            }
        });

        validateOrder.mockResolvedValue({ server_total: 200000 });

        orderRepo.createOrder.mockResolvedValue({ id: mockNewOrderId, ...mockOrder });
        orderRepo.createOderItem.mockResolvedValue({
            id: 'orderItem-111',
            menu_item_id: 'item-1',
            quantity: 2,
            price: 80000,
            note: 'Không hành',
        });
        orderRepo.createOderItemOption.mockResolvedValue({
            order_item_id: 'orderItem-111',
            option_item_id: 'opt-1'
        });

        rabbitFunction.publishMsg.mockResolvedValue();
    });

    it('should create new order successfully with valid data', async () => {
        const result = await orderService.createOrder(mockOrder, mockUserId);

        expect(orderSchema.validate).toHaveBeenCalledTimes(1);
        expect(validateOrder).toHaveBeenCalledTimes(1);
        expect(validateOrder).toHaveBeenCalledWith(mockOrder);
        expect(orderRepo.createOrder).toHaveBeenCalledTimes(1);
        expect(orderRepo.createOrder).toHaveBeenCalledWith(
            expect.objectContaining({
                id: mockNewOrderId,
                user_id: mockUserId,
                merchant_id: mockMerchantId,
                full_name: "John Doe",
                phone: "0901113334",
                delivery_address: "123 ABC Street",
                delivery_fee: 5000,
                note: "Leave at door",
                method: "MOMO",
                total_amount: 200000,
                status_payment: 'pending',
                status: 'waiting',
            }),
            mockTransaction
        );
        expect(orderRepo.createOderItem).toHaveBeenCalledTimes(2);
        expect(orderRepo.createOderItemOption).toHaveBeenCalledTimes(2);
        expect(mockTransaction.commit).toHaveBeenCalledTimes(1);
        expect(rabbitFunction.publishMsg).toHaveBeenCalledTimes(1);
        expect(rabbitFunction.publishMsg).toHaveBeenCalledWith(
            {
                order_id: mockNewOrderId,
                user_id: mockUserId,
                merchant_id: mockMerchantId,
                total_amount: 200000,
                method: "MOMO",
                created_at: expect.any(Date),
            }, "order_exchange", "order.payment.process");
        expect(result).toEqual({ id: mockNewOrderId, ...mockOrder });
    });

    it("should push order message to RabbitMQ if order existed", async () => {
        const orderWithId = { ...mockOrder, order_id: mockExistOrderId };
        orderRepo.getOneOrderPayment.mockResolvedValue(mockExistingOrder);
        
        const result = await orderService.createOrder(orderWithId, mockUserId);

        expect(orderSchema.validate).toHaveBeenCalledTimes(1);
        expect(validateOrder).toHaveBeenCalledTimes(1);
        expect(orderRepo.getOneOrderPayment).toHaveBeenCalledTimes(1);
        expect(orderRepo.getOneOrderPayment).toHaveBeenCalledWith(orderWithId.order_id, mockUserId);
        expect(orderRepo.createOrder).not.toHaveBeenCalled();
        expect(orderRepo.createOderItem).not.toHaveBeenCalled();
        expect(mockTransaction.commit).not.toHaveBeenCalled();
        expect(rabbitFunction.publishMsg).toHaveBeenCalledTimes(1);
        expect(rabbitFunction.publishMsg).toHaveBeenCalledWith(
            {
                order_id: mockExistOrderId,
                user_id: mockUserId,
                merchant_id: mockMerchantId,
                total_amount: 200000,
                method: "MOMO",
                created_at: expect.any(Date),
            }, "order_exchange", "order.payment.process");
        expect(result).toEqual(mockExistingOrder);
    });

    it("order_id not belong to user should throw error", async () => {
        const orderWithId = { ...mockOrder, order_id: mockExistOrderId };
        orderRepo.getOneOrderPayment.mockResolvedValue(null);

        await expect(orderService.createOrder(orderWithId, mockUserIdWrong))
            .rejects.toThrow("Đơn hàng không tồn tại hoặc đã được thanh toán");

        expect(orderSchema.validate).toHaveBeenCalledTimes(1);
        expect(validateOrder).toHaveBeenCalledTimes(1);
        expect(orderRepo.getOneOrderPayment).toHaveBeenCalledTimes(1);
        expect(orderRepo.createOrder).not.toHaveBeenCalled();
        expect(mockTransaction.rollback).toHaveBeenCalledTimes(1);
        expect(rabbitFunction.publishMsg).not.toHaveBeenCalled();
    });

    it("should rollback transaction if error occurs during order creation", async () => {
        orderRepo.createOderItem.mockRejectedValue(new Error("Database error"));

        await expect(orderService.createOrder(mockOrder, mockUserId))
            .rejects
            .toThrow("Database error");

        expect(orderRepo.createOrder).toHaveBeenCalledTimes(1);
        expect(orderRepo.createOderItem).toHaveBeenCalledTimes(1);
        expect(mockTransaction.rollback).toHaveBeenCalledTimes(1);
        expect(rabbitFunction.publishMsg).not.toHaveBeenCalled();
    });

    it("should throw error if created order has no ID", async () => {
        orderRepo.createOrder.mockResolvedValue({});

        await expect(orderService.createOrder(mockOrder, mockUserId))
            .rejects
            .toThrow("Tạo đơn hàng thất bại");

        expect(orderRepo.createOrder).toHaveBeenCalledTimes(1);
        expect(mockTransaction.commit).toHaveBeenCalledTimes(1);
        expect(mockTransaction.rollback).toHaveBeenCalledTimes(1);
        expect(rabbitFunction.publishMsg).not.toHaveBeenCalled();
    });

    it('should skip invalid option_item_id without throwing error', async () => {
        const invalidData = {
            ...mockOrder,
            order_items: [
                {
                    menu_item_id: 'item-1',
                    quantity: 2,
                    price: 80000,
                    note: 'Không hành',
                    options: [
                        {
                            items: [
                                { option_item_id: 'opt-1' },
                                { option_item_id: null },
                                { option_item_id: undefined },
                                { option_item_id: 'opt-2' }
                            ]
                        }
                    ]
                }
            ]
        };
    
        await orderService.createOrder(invalidData, mockUserId);
        
        expect(orderRepo.createOrder).toHaveBeenCalledTimes(1);
        expect(orderRepo.createOderItem).toHaveBeenCalledTimes(1);
        expect(orderRepo.createOderItemOption).toHaveBeenCalledTimes(2);
        expect(rabbitFunction.publishMsg).toHaveBeenCalledTimes(1);
        expect(mockTransaction.commit).toHaveBeenCalledTimes(1);
    });

    it('should throw error when total_amount does not match server_total', async () => {
        validateOrder.mockResolvedValue({ server_total: 250000 });

        await expect(orderService.createOrder(mockOrder, mockUserId))
            .rejects
            .toThrow("Tổng tiền không hợp lệ");

        expect(validateOrder).toHaveBeenCalledTimes(1);
        expect(orderRepo.createOrder).not.toHaveBeenCalled();
        expect(mockTransaction.rollback).toHaveBeenCalledTimes(1);
    });

    test.each([
        [{ ...mockOrder, user_id: undefined }, "Đơn hàng không hợp lệ"],
        [{ ...mockOrder, merchant_id: undefined }, "Đơn hàng không hợp lệ"],
        [{ ...mockOrder, full_name: "" }, "Đơn hàng không hợp lệ"],
    ])("should throw validation error for invalid input %o", async (input, expectedError) => {
        orderSchema.validate = jest.fn().mockReturnValue({
            error: { message: "Đơn hàng không hợp lệ" },
            value: null
        });

        await expect(orderService.createOrder(input, mockUserId)).rejects.toThrow(expectedError);
        expect(orderSchema.validate).toHaveBeenCalledTimes(1);
        expect(mockTransaction.rollback).toHaveBeenCalledTimes(1);
    });

    it('should throw error when order item validation fails', async () => {
        orderItemValidation.validate = jest.fn().mockReturnValue({
            error: { message: "Đơn hàng không hợp lệ" },
            value: null
        });

        await expect(orderService.createOrder(mockOrder, mockUserId))
            .rejects
            .toThrow("Đơn hàng không hợp lệ");

        expect(orderRepo.createOrder).toHaveBeenCalledTimes(1);
        expect(mockTransaction.rollback).toHaveBeenCalledTimes(1);
    });

    it('should rollback transaction if publishMsg fails', async () => {
        rabbitFunction.publishMsg.mockRejectedValue(new Error("RabbitMQ error"));

        await expect(orderService.createOrder(mockOrder, mockUserId))
            .rejects
            .toThrow("RabbitMQ error");

        expect(mockTransaction.commit).toHaveBeenCalledTimes(1);
        expect(mockTransaction.rollback).toHaveBeenCalledTimes(1);
    });

    it('should handle order items with no options', async () => {
        const orderNoOptions = {
            ...mockOrder,
            order_items: [
                {
                    menu_item_id: 'item-3',
                    quantity: 1,
                    price: 50000,
                    note: 'Test',
                    options: []
                }
            ]
        };

        await orderService.createOrder(orderNoOptions, mockUserId);

        expect(orderRepo.createOderItem).toHaveBeenCalledTimes(1);
        expect(orderRepo.createOderItemOption).not.toHaveBeenCalled();
        expect(mockTransaction.commit).toHaveBeenCalledTimes(1);
    });

    it('should handle order items with null options', async () => {
        const orderNullOptions = {
            ...mockOrder,
            order_items: [
                {
                    menu_item_id: 'item-4',
                    quantity: 1,
                    price: 50000,
                    note: 'Test',
                    options: null
                }
            ]
        };

        await orderService.createOrder(orderNullOptions, mockUserId);

        expect(orderRepo.createOderItem).toHaveBeenCalledTimes(1);
        expect(orderRepo.createOderItemOption).not.toHaveBeenCalled();
        expect(mockTransaction.commit).toHaveBeenCalledTimes(1);
    });
});