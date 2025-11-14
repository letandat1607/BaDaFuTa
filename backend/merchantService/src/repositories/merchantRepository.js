const { Category, MenuItem, MenuItemOption, Merchant, Option, OptionItem } = require("../models/index");
const {Op} = require('sequelize')

module.exports.enrichOrderItemsWithNames = async (orderItems) => {
  if (!orderItems || orderItems.length === 0) return [];

  const menuItemIds = orderItems.map(item => item.menu_item_id).filter(Boolean);
  const optionItemIds = orderItems
    .flatMap(item => item.options || [])
    .map(opt => opt.option_item_id)
    .filter(Boolean);

  const [menuItems, optionItems] = await Promise.all([menuItemIds.length > 0 ? MenuItem.findAll({          
    where: { id: menuItemIds },          
    attributes: ['id', 'name_item'],
          raw: true
        })
      : [],
    optionItemIds.length > 0
      ? OptionItem.findAll({
          where: { id: optionItemIds },
          attributes: ['id', 'option_item_name'],
          raw: true
        })
      : []
  ]);


  const menuNameMap = Object.fromEntries(
    menuItems.map(m => [m.id, m.name_item])
  );
  const optionNameMap = Object.fromEntries(
    optionItems.map(o => [o.id, o.option_item_name])
  );

  return orderItems.map(item => {
    const enrichedItem = { ...item };

    enrichedItem.menu_item_name = menuNameMap[item.menu_item_id] || null;

    if (enrichedItem.options && enrichedItem.options.length > 0) {
      enrichedItem.options = enrichedItem.options.map(opt => ({
        ...opt,
        option_item_name: optionNameMap[opt.option_item_id] || null
      }));
    }

    return enrichedItem;
  });
};

module.exports.getAllMerchant = async () => {
  return await Merchant.findAll({});
}

module.exports.getMerchant = async (id) => {
  return await Merchant.findByPk(id);
}

module.exports.getMenuMerchant = async (id) => {
  const categories = await Category.findAll({
    where: {
      merchant_id: id,
    },
    include: [
      {
        model: MenuItem,
        as: "menu_items",
      }
    ]
  });
  return categories;
}

module.exports.getMenuNoneCategory = async (merchantId) =>{
  return await MenuItem.findAll({
    where: {
      [Op.and]: [
        {merchant_id: merchantId},
        {category_id: {[Op.is]: null}}
      ]
    }
  });
}

module.exports.findOneMenuItem = async (conditions) => {
  return await MenuItem.findOne({
    where: conditions
  });
}
module.exports.createMenuItem = async (data) => {
  if (!data) return null;
  return await MenuItem.create(data);
}
module.exports.updateMenuItem = async (id, data) => {
  const it = await MenuItem.findByPk(id);
  if (!it) return null;
  if (!data) return it;
  await it.update(data);
  return it;
}
module.exports.deleteMenuItem = async (id) => {
  const it = await MenuItem.findByPk(id);
  if (!it) return null;
  await it.destroy();
  return it;
}



module.exports.findOneCategory = async (conditions) => {
  return await Category.findOne({
    where: conditions
  });
}
module.exports.createCategory = async (data) => {
  if (!data) return null;
  return await Category.create(data);
}
module.exports.updateCategory = async (id, data) => {
  const it = await Category.findByPk(id);
  if (!it) return null;
  if (!data) return it;
  await it.update(data);
  return it;
}
module.exports.deleteCategory = async (id) => {
  const it = await Category.findByPk(id);
  if (!it) return null;
  await it.destroy();
  return it;
}




module.exports.getOption = async (id) => {
  const option = await Option.findAll({
    where: { merchant_id: id },

    include: [{
      model: OptionItem,
      as: 'option_items'
    }]
  });

  return option;
}


module.exports.findOneOption = async (conditions) => {
  return await Option.findOne({
    where: conditions
  });
}
module.exports.createOption = async (data) => {
  if (!data) return null;
  return await Option.create(data);
}
module.exports.updateOption = async (id, data) => {
  const it = await Option.findByPk(id);
  if (!it) return null;
  if (!data) return it;
  await it.update(data);
  return it;
}
module.exports.deleteOption = async (id) => {
  const it = await Option.findByPk(id);
  if (!it) return null;
  await it.destroy();
  return it;
}



module.exports.findOneOptionItem = async (conditions) => {
  return await OptionItem.findOne({
    where: conditions
  });
}
module.exports.createOptionItem = async (data) => {
  if (!data) return null;
  return await OptionItem.create(data);
}
module.exports.updateOptionItem = async (id, data) => {
  const it = await OptionItem.findByPk(id);
  if (!it) return null;
  if (!data) return it;
  await it.update(data);
  return it;
}
module.exports.deleteOptionItem = async (id) => {
  const it = await OptionItem.findByPk(id);
  if (!it) return null;
  await it.destroy();
  return it;
}
///////////////////////////////////////////////////////////////////////////////



// module.exports.getMenuItemOption = async (merchantId) => {
//   const menuItemOptions = await MenuItemOption.findAll({
//     include: [
//       {
//         model: MenuItem,
//         as: "menu_item",
//         where: { merchant_id: merchantId },
//        },
//       {
//         model: Option,
//         as: "option",
//          include: [
//           {
//             model: OptionItem,
//             as: "option_items",
//            }
//         ]
//       }
//     ]
//   });

//   return menuItemOptions;
// };


module.exports.getMenuItemOption = async (merchantId) => {
  const menuItemOptions = await MenuItem.findAll({
    where: { merchant_id: merchantId },
    include: [
      {
        model: Option,
        as: "options",
        through: { attributes: [] },
        include: [
          {
            model: OptionItem,
            as: "option_items"
          }
        ]
      }
    ]
  });

  return menuItemOptions;
};


module.exports.getMenuNoneItemOption = async (merchantId) => {
  const menuItems = await MenuItem.findAll({
    where: { merchant_id: merchantId },
    include: [
      {
        model: Option,
        as: "options",
        through: { attributes: [] },
        required: false
      }
    ]
  });

  const menuItemNoneOption = menuItems.filter(mi => !mi.options || mi.options.length === 0);
  return menuItemNoneOption.filter(mi => !mi.options || mi.options.length === 0);
};






 module.exports.createMenuItemOption = async ({ menuItemId, optionId }) => {
  if (!menuItemId || !optionId) return null;

  return await MenuItemOption.create({
    menu_item_id: menuItemId,
    option_id: optionId,
  });
};
module.exports.updateMenuItemOption = async (id, data) => {
  const it = await MenuItemOption.findByPk(id);
  if (!it) return null;
  if (!data) return it;
  await it.update(data);
  return it;
};
 module.exports.deleteMenuItemOption = async ({ menuItemId, optionId }) => {
  if (!menuItemId || !optionId) return null;

  const item = await MenuItemOption.findOne({
    where: {
      menu_item_id: menuItemId,
      option_id: optionId,
    },
  });

  if (!item) return null;
  await item.destroy();
  return item;
};

 module.exports.findMenuItemOption = async ({ menuItemId, optionId }) => {
  return await MenuItemOption.findOne({
    where: {
      menu_item_id: menuItemId,
      option_id: optionId,
    },
  });
};


module.exports.getMenuItemWithOption = async (id, merchant_id) => {
  return MenuItem.findOne({
    where: { id, merchant_id },
    include: [
      {
        model: Option,
        as: "options",
        through: { attributes: [] },
        include: [
          {
            model: OptionItem,
            as: "option_items"
          }
        ]
      }
    ]
  });
};

module.exports.createMenuItem = async (data) => {
    return await MenuItem.create(data);
}

