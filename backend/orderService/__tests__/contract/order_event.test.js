const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const { createOrder, publishOrderMerchant } = require('../../src/services/orderService');
const { publishMsg } = require('../../src/rabbitMQ/rabbitFunction');
const { sequelize } = require('../../src/utils/db');

jest.mock('../../src/repositories/orderRepository');
jest.mock('../../src/rabbitMQ/rabbitFunction');
jest.mock('../../src/grpc/merchantClient');
jest.mock('uuid');
jest.mock('../../src/utils/db');
jest.mock('../../src/grpc/merchantClient', () => ({
  validateOrder: jest.fn()
}));
jest.mock('../../src/validations/orderValidation', () => ({
  validate: jest.fn().mockReturnValue({ value: {}, error: null })
}));
jest.mock('../../src/validations/orderItemValidation', () => ({
  validate: jest.fn().mockReturnValue({ value: {}, error: null })
}));

const orderRepo = require('../../src/repositories/orderRepository');
const { v4 } = require('uuid');
v4.mockReturnValue('mocked-uuid');

const { validateOrder } = require('../../src/grpc/merchantClient');
validateOrder.mockResolvedValue({ server_total: 215000 });

sequelize.transaction = jest.fn().mockResolvedValue({
  commit: jest.fn(),
  rollback: jest.fn(),
});

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const schemaDir = path.join(__dirname, '../../contracts/events');
const schemas = {};

if (!fs.existsSync(schemaDir)) {
  throw new Error(`Không tìm thấy thư mục schema: ${schemaDir}`);
}

fs.readdirSync(schemaDir)
  .filter(f => f.endsWith('.json'))
  .forEach(file => {
    const name = file.replace('.json', '');
    const schema = JSON.parse(fs.readFileSync(path.join(schemaDir, file), 'utf8'));
    schemas[name] = ajv.compile(schema);
    console.log(`Loaded schema: ${name}`);
  });

const validOrderInput = {
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
      options: [{ option_item_id: "fcef3d18-4aec-4623-8ace-5a6c7ddf82ef" }]
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

describe('OrderService - Message Contract Tests (XANH 100%)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('createOrder publish đúng contract order.payment.process', async () => {
    orderRepo.createOrder.mockResolvedValue({
      id: 'ord-mocked-123',
      user_id: validOrderInput.user_id,
      merchant_id: validOrderInput.merchant_id,
      total_amount: validOrderInput.total_amount,
      method: validOrderInput.method,
      status_payment: 'pending',
    });

    orderRepo.createOderItem.mockResolvedValue({ id: 'item-1' });
    orderRepo.createOderItemOption?.mockResolvedValue({});

    await createOrder(validOrderInput, validOrderInput.user_id);

    expect(publishMsg).toHaveBeenCalledTimes(1);
    const payload = publishMsg.mock.calls[0][0];

    const validateFn = schemas['order.payment.process'];
    if (!validateFn) {
      console.error('Các schema đã load:', Object.keys(schemas));
      throw new Error('Schema order.payment.process không tồn tại!');
    }

    console.log('Kiểm tra payload:', payload);
    const valid = validateFn(payload);
    expect(valid).toBe(true);

    if (!valid) {
      console.error('Contract lỗi order.payment.process:');
      console.table(validateFn.errors);
    }
  });

  it('publishOrderMerchant → publish đúng contract order.merchant.confirmed', async () => {
    const mockOrder = {
      id: 'ord-999',
      user_id: 'usr-001',
      merchant_id: 'mer-888',
      status: 'confirmed',
      status_payment: 'completed',
      total_amount: 215000,
      order_items: [],
      created_at: new Date().toISOString(),
    };

    orderRepo.getOneOrder.mockResolvedValue(mockOrder);

    await publishOrderMerchant('ord-999');

    expect(publishMsg).toHaveBeenCalledTimes(1);
    const payload = publishMsg.mock.calls[0][0];

    const validateFn = schemas['order.merchant.confirmed'];
    if (!validateFn) throw new Error('Schema order.merchant.confirmed không tồn tại!');

    const valid = validateFn(payload);
    expect(valid).toBe(true);

    if (!valid) {
      console.error('Contract lỗi order.merchant.confirmed:');
      console.table(validateFn.errors);
    }
  });
});