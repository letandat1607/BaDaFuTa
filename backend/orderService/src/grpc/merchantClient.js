const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.resolve(__dirname, '../../proto/merchant.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
  arrays: true
});

const proto = grpc.loadPackageDefinition(packageDefinition).merchant;

const client = new proto.MerchantService(
  process.env.MERCHANT_GRPC_URL || 'merchant_service:50051',
  grpc.credentials.createInsecure()
);

function validateOrder(data) {
  // console.log("Validating order with merchant gRPC service:", data.order_items);
  return new Promise((resolve, reject) => {
    const request = {
      merchant_id: data.merchant_id,
      delivery_fee: data.delivery_fee || 0,
      items: data.order_items.map(item => ({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        client_price: item.price,
        options: (item.options.map(opt => ({
          items: (opt.items || [])
        })) || [])
      }))
    };

    client.ValidateOrder(request, (error, response) => {
      if (error || !response?.status?.success) {
        return reject(new Error(response?.status?.message || 'Validate thất bại'));
      }
      resolve({
        server_total: Number(response.server_total)
      });
    });
  });
}

module.exports = { validateOrder };