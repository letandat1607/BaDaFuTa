const { menuItemSchema } = require("../validations/menuItemValidation");
const { updateMenuItemSchema } = require("../validations/menuItemValidation");
const { categorySchema } = require("../validations/categoryValidation");
const { updateCategorySchema } = require("../validations/categoryValidation");
const { optionSchema } = require("../validations/optionValidation");
const { updateOptionSchema } = require("../validations/optionValidation");
const { optionItemSchema } = require("../validations/optionItemValidation");
const { updateOptionItemSchema } = require("../validations/optionItemValidation");
const { menuItemOptionSchema } = require("../validations/menuItemOptionValidation");
const { v4 } = require("uuid");
const merchantRepo = require('../repositories/merchantRepository');
const { publishMsg } = require("../rabbitMQ/rabbitFunction");

async function enrichOrdersWithItemNames(orders) {
  if (!orders || orders.length === 0) return [];

  const enrichedOrders = await Promise.all(
    orders.map(async (order) => {
      const enrichedOrder = { ...order };

      if (order.order_items && order.order_items.length > 0) {
        enrichedOrder.order_items = await merchantRepo.enrichOrderItemsWithNames(
          order.order_items
        );
      }

      return enrichedOrder;
    })
  );

  return enrichedOrders;
}

module.exports.publishOrderGateway = async (data) => {
  if (data.userId) {
    const merchant = await merchantRepo.getMerchant(data.order.merchant_id);
    const orderWithName = await enrichOrdersWithItemNames([data.order]);
    await publishMsg({ userId: data.userId, order: orderWithName, location: merchant.location }, "merchant_exchange", "merchant.gateway.new_order") ///////
  } else {
    const orderWithName = await enrichOrdersWithItemNames([data]);
    await publishMsg(orderWithName, "merchant_exchange", "merchant.gateway.new_order");
  }
}

module.exports.publishOrdersGateway = async (data) => {

  const orders = await enrichOrdersWithItemNames(data.orders);
  if (data.merchantId) {
    await publishMsg({ orders, merchantId: data.merchantId }, "merchant_exchange", "merchant.gateway.orders")
  } else {
    await publishMsg({ orders, userId: data.userId }, "merchant_exchange", "merchant.gateway.orders")
  }
}

module.exports.getMenuItemWithOption = async (id, merchant_id) => {
  const menuItem = await merchantRepo.getMenuItemWithOption(id, merchant_id);

  if (!menuItem) throw new Error("Món không tồn tại");

  const options = (menuItem.options || []).map(opt => ({
    id: opt.id,
    option_name: opt.option_name,
    multi_select: opt.multi_select,
    require_select: opt.require_select,
    number_select: opt.number_select,
    option_items: (opt.option_items || []).map(oi => ({
      id: oi.id,
      option_item_name: oi.option_item_name,
      price: Number(oi.price),
      status: oi.status,
      status_select: oi.status_select
    }))
  }));

  return options;
};

module.exports.getMenuNoneCategory = async (merchantId) => {
  if (!merchantId) return null;

  const menuItems = await merchantRepo.getMenuNoneCategory(merchantId);
  return menuItems;
}

module.exports.createMenuItem = async (data) => {
  if (!data) throw new Error("Thiếu dữ liệu món ăn");

  const { error, value } = menuItemSchema.validate(data);
  // if (error) throw new Error(error.details[0].message);
  if (error) throw new Error("Món ăn không hợp lệ");

  const menu = await merchantRepo.findOneMenuItem({
    name_item: value.name_item,
    merchant_id: value.merchant_id
  })

  if (menu) throw new Error("Món ăn đã có");

  return await merchantRepo.createMenuItem({
    id: v4(),
    ...value,
  });

}
module.exports.updateMenuItem = async (id, data) => {
  const { error, value } = updateMenuItemSchema.validate(data);
  // if (error) throw new Error(error.details[0].message);
  if (error) throw new Error("Món ăn không hợp lệ");

  const menu = await merchantRepo.updateMenuItem(id, value);
  if (!menu) throw new Error("Không tìm thấy món ăn");

  return menu;
};

module.exports.deleteMenuItem = async (id) => {
  const menu = await merchantRepo.deleteMenuItem(id);
  if (!menu) throw new Error("Không tìm thấy món ăn để xóa");
  return menu;
};
////////////////////////////////////////////category///////////////////////////////////////////

module.exports.createCategory = async (data) => {
  if (!data) throw new Error("Thiếu dữ liệu danh mục");

  const { error, value } = categorySchema.validate(data);
  // if (error) throw new Error(error.details[0].message);
  if (error) throw new Error("Danh mục không hợp lệ");

  const existing = await merchantRepo.findOneCategory({
    category_name: value.category_name,
    merchant_id: value.merchant_id
  });
  if (existing) throw new Error("Danh mục đã tồn tại");

  return await merchantRepo.createCategory({
    id: v4(),
    ...value,
  });
};
module.exports.updateCategory = async (id, data) => {
  const { error, value } = updateCategorySchema.validate(data);
  // if (error) throw new Error(error.details[0].message);
  if (error) throw new Error("Danh mục không hợp lệ");

  const category = await merchantRepo.updateCategory(id, value);
  if (!category) throw new Error("Không tìm thấy danh mục");

  return category;
};

module.exports.deleteCategory = async (id) => {
  const category = await merchantRepo.deleteCategory(id);
  if (!category) throw new Error("Không tìm thấy danh mục để xóa");
  return category;
};

// ===============================================
// 🧩 OPTION
// ===============================================



module.exports.getOption = async (merchant_id) => {
  if (!merchant_id) throw new Error("Thiếu merchant_id");
  const options = await merchantRepo.getOption(merchant_id);
  return options;
};
module.exports.createOption = async (data) => {
  if (!data) throw new Error("Thiếu dữ liệu option");

  const { error, value } = optionSchema.validate(data);
  // if (error) throw new Error(error.details[0].message);
  if (error) throw new Error("Nhóm topping không hợp lệ");

  const exist = await merchantRepo.findOneOption({
    option_name: value.option_name,
    // merchant_id: value.merchant_id,
  });
  if (exist) throw new Error("Nhóm topping đã tồn tại");

  return await merchantRepo.createOption({
    id: v4(),
    ...value,
  });
};

module.exports.updateOption = async (id, data) => {
  const { error, value } = updateOptionSchema.validate(data);
  // if (error) throw new Error(error.details[0].message);
  if (error) throw new Error("Nhóm topping không hợp lệ");

  const option = await merchantRepo.updateOption(id, value);
  if (!option) throw new Error("Không tìm thấy nhóm topping");

  return option;
};

module.exports.deleteOption = async (id) => {
  const option = await merchantRepo.deleteOption(id);
  if (!option) throw new Error("Không tìm thấy nhóm topping để xóa");
  return option;
};

// ===============================================
// OPTION ITEM
// ===============================================
module.exports.createOptionItem = async (data) => {
  if (!data) throw new Error("Thiếu dữ liệu topping");

  const { error, value } = optionItemSchema.validate(data);
  // if (error) throw new Error(error.details[0].message);
  if (error) throw new Error("Topping không hợp lệ");

  return await merchantRepo.createOptionItem({
    id: v4(),
    ...value,
  });
};

module.exports.updateOptionItem = async (id, data) => {
  const { error, value } = updateOptionItemSchema.validate(data);
  // if (error) throw new Error(error.details[0].message);
  if (error) throw new Error("Topping không hợp lệ");

  const item = await merchantRepo.updateOptionItem(id, value);
  if (!item) throw new Error("Không tìm thấy option item");

  return item;
};

module.exports.deleteOptionItem = async (id) => {
  const item = await merchantRepo.deleteOptionItem(id);
  if (!item) throw new Error("Không tìm thấy topping để xóa");
  return item;
};
// ===============================================
// 🧩 MENU OPTION ITEM
// ===============================================
module.exports.getMenuItemOption = async (merchant_id) => {
  if (!merchant_id) throw new Error("Thiếu merchant_id");
  return await merchantRepo.getMenuItemOption(merchant_id);
};
module.exports.getMenuNoneItemOption = async (merchant_id) => {
  if (!merchant_id) throw new Error("Thiếu merchant_id");
  return await merchantRepo.getMenuNoneItemOption(merchant_id);
};


module.exports.createMenuItemOption = async (menuItemId, optionId) => {
  if (!menuItemId || !optionId) throw new Error("Dữ liệu không hợp lệ");

  // kiểm tra xem liên kết đã có chưa
  const existing = await merchantRepo.findMenuItemOption({ menuItemId, optionId });
  if (existing) return existing;

  return await merchantRepo.createMenuItemOption({ menuItemId, optionId });
};

module.exports.updateMenuItemOption = async (id, data) => {
  const { error, value } = menuItemOptionSchema.validate(data);
  if (error) throw new Error(error.details[0].message);

  const item = await merchantRepo.updateOptionItem(id, value);
  if (!item) throw new Error("Không tìm thấy topping hoặc món ăn");

  return item;
};

module.exports.deleteMenuItemOption = async (data) => {
  const { menuItemId, optionId } = data;
  if (!menuItemId || !optionId) throw new Error("Dữ liệu không hợp lệ");

  const item = await merchantRepo.deleteMenuItemOption({ menuItemId, optionId });
  if (!item) throw new Error("Không tìm thấy liên kết để xóa");
  return item;
};


