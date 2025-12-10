const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const MenuItem = require('../models/menuItem');
const OptionItem = require('../models/optionItem');
const Option = require('../models/option');
const fs = require('fs');

const PROTO_PATH = path.resolve(__dirname, '../../proto/merchant.proto');
if (!fs.existsSync(PROTO_PATH)) {
    throw new Error(`Proto file not found at: ${PROTO_PATH}`);
}
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    arrays: true
});

const proto = grpc.loadPackageDefinition(packageDefinition).merchant;

async function ValidateOrder(call, callback) {
    const { merchant_id, delivery_fee = 0, items } = call.request;

    try {
        let serverTotal = Number(delivery_fee);
        const invalidMenuItems = [];
        const invalidOptions = [];
        // console.log("orders items to validate:", items);

        for (const item of items) {
            let validPriceItem = 0;
            const menuItem = await MenuItem.findOne({
                where: {
                    id: item.menu_item_id,
                    merchant_id,
                    status: true
                }
            });

            if (!menuItem) {
                invalidMenuItems.push(item.menu_item_id);
                continue;
            }

            serverTotal += Number(menuItem.price) * item.quantity;
            validPriceItem += Number(menuItem.price);
            console.log("menu item option:", item.options);
            for (const opt of item.options) {
                if (opt.items && Array.isArray(opt.items)) {
                    console.log("Validating option group", opt.items[0]);
                    for (const optItem of opt.items) {
                        if (!optItem.option_item_id) {
                            return callback(null, {
                                status: { success: false, message: 'Đơn hàng merchant không hợp lệ' }
                            });
                        }
                        const optionItem = await OptionItem.findOne({
                            where: {
                                id: optItem.option_item_id,
                                status: true
                            },
                            include: [{
                                model: Option,
                                as: 'options',
                                where: { merchant_id },
                                required: true,
                                attributes: ['id'],
                                include: [{
                                    model: MenuItem,
                                    as: 'option_menu_items',
                                    where: { id: item.menu_item_id },
                                    through: { attributes: [] },
                                    required: true
                                }]
                            }],
                            attributes: ['id', 'price']
                        });
                        if (!optionItem) {
                            invalidOptions.push(optItem.option_item_id);
                            continue;
                        }
                        console.log(`Option item price: ${optionItem.price} x quantity: ${item.quantity}`);
                        serverTotal += Number(optionItem.price) * item.quantity;
                        validPriceItem += Number(optionItem.price);
                    }
                }
            }
            console.log(`Validating item ${item.menu_item_id}: client price ${item.client_price}, valid price ${validPriceItem}`);
            if (Number(item.client_price) !== validPriceItem) {
                return callback(null, {
                    status: { success: false, message: 'Giá món không hợp lệ' }
                });
            }
        }

        if (invalidMenuItems.length > 0 || invalidOptions.length > 0) {
            return callback(null, {
                status: { success: false, message: 'Có món hoặc tùy chọn không hợp lệ' },
                invalid_menu_items: invalidMenuItems,
                invalid_options: invalidOptions
            });
        }

        callback(null, {
            status: { success: true, message: 'OK' },
            server_total: serverTotal
        });

    } catch (err) {
        console.error('gRPC ValidateOrder error:', err);
        callback(null, {
            status: { success: false, message: 'Lỗi hệ thống merchant' }
        });
    }
}

const server = new grpc.Server();
server.addService(proto.MerchantService.service, { ValidateOrder });

const port = process.env.GRPC_PORT || 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`Merchant gRPC Server chạy trên port ${port}`);
    server.start();
});