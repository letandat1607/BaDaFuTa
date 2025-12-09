process.env.JWT_SECRET = "testsecret";
process.env.JWT_EXPIRES_IN = "1h";

const orderService = require('../../../src/services/orderService');
const orderRepo = require('../../../src/repositories/orderRepository');
const {publishMsg} = require('../../../src/rabbitMQ/rabbitFunction');

jest.mock('../../../src/repositories/orderRepository');
jest.mock('../../../src/rabbitMQ/rabbitFunction');
jest.mock('../../../src/utils/db');
jest.mock('uuid');
jest.mock('../../../src/grpc/merchantClient', () => ({
    validateOrder: jest.fn()
}));

jest.mock('../../../src/repositories/orderRepository');
jest.mock('../../../src/rabbitMQ/rabbitFunction');

describe('OrderService.updateOrder - Whitebox Tests (Full Coverage)', () => {
  const ORDER_ID = 'order-123';
  const DRONE_ID = 'drone-456';
  const USER_ID = 'user-789';
  const LOCATION = {
    lat: 10.780672,
    lng: 106.6663936,
    full_address: "Chợ thuốc Quận 10, Hẻm 156/7F Tô Hiến Thành, Phường Hòa Hưng, Thành phố Thủ Đức, Thành phố Hồ Chí Minh, 70150, Việt Nam"
  };

  const mockExistingOrder = {
    id: ORDER_ID,
    user_id: USER_ID,
    merchant_id: 'mer-001',
    status: 'waiting',
    total_amount: 150000,
    method: 'cod'
  };

  beforeEach(() => {
    jest.clearAllMocks();

    orderRepo.updateField.mockImplementation((id, data) => {
      return Promise.resolve({ ...mockExistingOrder, id, ...data });
    });

    publishMsg.mockResolvedValue();
  });

  it('[UO-001] status không phải delivering/complete -> chỉ publish order.status.updated', async () => {
    const data = { status: 'preparing' };

    const result = await orderService.updateOrder(ORDER_ID, data, LOCATION);

    expect(orderRepo.updateField).toHaveBeenCalledTimes(1);
    expect(publishMsg).toHaveBeenCalledTimes(1);
    expect(publishMsg).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'preparing' }),
      'order_exchange',
      'order.status.updated'
    );
    expect(result.status).toBe('preparing');
  });

  it('[UO-002] status = delivering + có drone_id -> publish 2 message đúng thứ tự', async () => {
    const data = { status: 'delivering', drone_id: DRONE_ID };

    const result = await orderService.updateOrder(ORDER_ID, data, LOCATION);

    expect(publishMsg).toHaveBeenCalledTimes(2);

    expect(publishMsg).toHaveBeenNthCalledWith(1,
      { location: LOCATION, order: result, droneId: DRONE_ID },
      'order_exchange',
      'order.status.updated'
    );

    expect(publishMsg).toHaveBeenNthCalledWith(2,
      { droneId: DRONE_ID, status: 'DELIVERING', orderId: ORDER_ID },
      'order_exchange',
      'order.drone.delivery_status'
    );

    expect(result.status).toBe('delivering');
  });


  it('[UO-003] status = delivering nhưng thiếu drone_id -> throw error, không publish', async () => {
    const data = { status: 'delivering' };

    await expect(orderService.updateOrder(ORDER_ID, data, LOCATION))
      .rejects.toThrow('Thiếu dữ liệu khi giao hàng đơn hàng');

    expect(publishMsg).not.toHaveBeenCalled();
  });

  it('[UO-004] status = complete + có drone_id -> drone về READY + publish status', async () => {
    const data = { status: 'complete', drone_id: DRONE_ID };

    await orderService.updateOrder(ORDER_ID, data, LOCATION);

    expect(publishMsg).toHaveBeenCalledTimes(2);

    expect(publishMsg).toHaveBeenNthCalledWith(1,
      { droneId: DRONE_ID, status: 'READY', orderId: ORDER_ID },
      'order_exchange',
      'order.drone.delivery_status'
    );

    expect(publishMsg).toHaveBeenNthCalledWith(2,
      expect.objectContaining({ status: 'complete' }),
      'order_exchange',
      'order.status.updated'
    );
  });

  it('[UO-005] status = complete nhưng thiếu drone_id -> throw error, không publish', async () => {
    const data = { status: 'complete' };

    await expect(orderService.updateOrder(ORDER_ID, data, LOCATION))
      .rejects.toThrow('Thiếu dữ liệu khi hoàn thành đơn hàng');

    expect(publishMsg).not.toHaveBeenCalled();
  });

  it('[UO-006] status = cancelled -> chỉ publish order.status.updated', async () => {
    const data = { status: 'cancelled' };

    const result = await orderService.updateOrder(ORDER_ID, data, LOCATION);

    expect(publishMsg).toHaveBeenCalledTimes(1);
    expect(publishMsg).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'cancelled' }),
      'order_exchange',
      'order.status.updated'
    );
    expect(result.status).toBe('cancelled');
  });

  it('[UO-007] cập nhật fields -> vẫn publish order.status.updated', async () => {
    const data = { note: 'Khách yêu cầu giao nhanh' };

    const result = await orderService.updateOrder(ORDER_ID, data, LOCATION);

    expect(publishMsg).toHaveBeenCalledTimes(1);
    expect(publishMsg).toHaveBeenCalledWith(
      expect.objectContaining({ note: 'Khách yêu cầu giao nhanh' }),
      'order_exchange',
      'order.status.updated'
    );
    expect(result.note).toBe('Khách yêu cầu giao nhanh');
  });

  it('[UO-008] Không tìm thấy đơn hàng -> throw error, không publish gì', async () => {
    orderRepo.updateField.mockResolvedValue(null);

    await expect(orderService.updateOrder(ORDER_ID, { status: 'preparing' }, LOCATION))
      .rejects.toThrow('Không tìm thấy đơn hàng');

    expect(publishMsg).not.toHaveBeenCalled();
  });

  it('[UO-009] status = delivering -> thứ tự: order.status.updated -> drone status', async () => {
    const data = { status: 'delivering', drone_id: DRONE_ID };
    publishMsg.mockClear();

    await orderService.updateOrder(ORDER_ID, data, LOCATION);

    expect(publishMsg).toHaveBeenCalledTimes(2);
    expect(publishMsg.mock.calls[0][2]).toBe('order.status.updated');
    expect(publishMsg.mock.calls[1][2]).toBe('order.drone.delivery_status');
  });

  it('[UO-010] status = complete -> thứ tự: drone status -> order.status.updated', async () => {
    const data = { status: 'complete', drone_id: DRONE_ID };
    publishMsg.mockClear();

    await orderService.updateOrder(ORDER_ID, data, LOCATION);

    expect(publishMsg.mock.calls[0][2]).toBe('order.drone.delivery_status');
    expect(publishMsg.mock.calls[1][2]).toBe('order.status.updated');
  });

  it('[UO-011] status = delivering nhưng drone_id = null -> throw error', async () => {
    const data = { status: 'delivering', drone_id: null };

    await expect(orderService.updateOrder(ORDER_ID, data, LOCATION))
      .rejects.toThrow('Thiếu dữ liệu khi giao hàng đơn hàng');

    expect(publishMsg).not.toHaveBeenCalled();
  });
});
