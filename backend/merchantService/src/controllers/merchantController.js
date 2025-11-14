const { Category, MenuItem, MenuItemOption, Merchant, Option, OptionItem } = require("../models/index");
const merchantService = require("../services/merchantService");

module.exports.getAllMerchant = async (req, res) => {
  try {
    const restaurants = await Merchant.findAll({});
    if (!restaurants) return res.json({ message: 'Merchant chưa được tạo' });
    return res.json({ restaurants });
  } catch (err) {
    console.log("merchantController getAllMerchant error", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports.getMenuItemWithOption = async (req, res) => {
  try{
    const {id} = req.params;
    const {merchant_id} = req.body;

    console.log("do contrl");

    const options = await merchantService.getMenuItemWithOption(id, merchant_id);

    res.status(200).json({options})

  }catch(err){
    console.log("merchantController getMenuItemWithOption error", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports.getMerchant = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.json({ message: "Không có userId" });
    console.log(id);

    const merchant = await Merchant.findOne({ where: { user_id: id } });
    console.log("merchant:", merchant);
    if (!merchant) return res.json({ message: "Không tìm thấy nhà hàng" });
    return res.json({ merchant });
  } catch (err) {
    console.log("merchantController getMerchant error", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports.getMenuNoneCategory = async (req, res) => {
  try {
    console.log("Bắt đầu api");
    const { id } = req.params;

    const menuItems = await merchantService.getMenuNoneCategory(id);
    return res.status(200).json({
      message: "get menu item none category successed",
      menuItems
    })
  } catch (err) {
    console.log("merchantController getMenuNoneCategory error", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports.getMenuClient = async (req, res) => {
  try {
    const { id } = req.params;

    const categories = await Category.findAll({
      where: {
        merchant_id: id,
      },
      include: [
        {
          model: MenuItem,
          as: "menu_items",
          // where: {
          //   merchant_id: id  // BẮT BUỘC THÊM DÒNG NÀY
          // },
        }
      ]
    });

    return res.json({ categories });
  } catch (err) {
    console.log("merchantController getMenuClient error", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports.createMenuItem = async (req, res) => {
  try {
 
    const { menuItem, merchant_id } = req.body;

    const newMenu = {
      merchant_id,
      ...menuItem
    };

    const menu = await merchantService.createMenuItem(newMenu);
    res.status(201).json({ message: "MenuItem created", menu });
 

  } catch (err) {
    console.log("merchantController createMenuItem error", err);
    res.status(500).json({ error: err.message });
  }
};
module.exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { newItem, merchant_id} = req.body;
    const up = {
      merchant_id,
      ...newItem
    };
    const menu = await merchantService.updateMenuItem(id, up);
    res.json({ message: "MenuItem updated", it: menu });
  } catch (err) {
    console.log("merchantController updateMenuItem error", err);
    res.status(500).json({ error: err.message });
  }
};
module.exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await merchantService.deleteMenuItem(id);
    res.json({ message: "MenuItem deleted", it: deleted });
  } catch (err) {
    console.log("merchantController deleteMenuItem error", err);
    res.status(500).json({ error: err.message });
  }
};
 //////////////////////////////////////////////////////////////////////////////////////////

module.exports.createCategory = async (req, res) => {
  try {
    const { category, merchant_id } = req.body;
    const data = { merchant_id, ...category };

    const cat = await merchantService.createCategory(data);
    return res.status(201).json({ message: "Category created", cat });

  } catch (err) {
    console.log("merchantController createCategory error", err);
    res.status(500).json({ error: err.message });
  }
};
module.exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { newCategory } = req.body;
    const updated = await merchantService.updateCategory(id, newCategory);
    res.json({ message: "Category updated", cat: updated });
  } catch (err) {
    console.log("merchantController updateCategory error", err);
    res.status(500).json({ error: err.message });
  }
};
module.exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await merchantService.deleteCategory(id);
    res.json({ message: "Category deleted", cat: deleted });
  } catch (err) {
    console.log("merchantController deleteCategory error", err);
    res.status(500).json({ error: err.message });
  }
};
// /////////////////////////////////////////////////////////////////////////////

module.exports.getOption = async (req, res) => {
  try {
    const { id } = req.params;
    const option = await merchantService.getOption(id);
    res.json({ option });
  } catch (err) {
    console.log("merchantController getOption error", err);
    res.status(500).json({ error: err.message });
  }
};
module.exports.createOption = async (req, res) => {
  try {
    const { option, merchant_id } = req.body;
    const data = { merchant_id, ...option };
    const created = await merchantService.createOption(data);
    res.status(201).json({ message: "Option created", option: created });
  } catch (err) {
    console.log("merchantController createOption error", err);
    res.status(500).json({ error: err.message });
  }
};
module.exports.updateOption = async (req, res) => {
  try {
    const { id } = req.params;
    const { newOption } = req.body;
    const updated = await merchantService.updateOption(id, newOption);
    res.json({ message: "Option updated", opit: updated });
  } catch (err) {
    console.log("merchantController updateOption error", err);
    res.status(500).json({ error: err.message });
  }
};
module.exports.deleteOption = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await merchantService.deleteOption(id);
    res.json({ message: "Option deleted", opi: deleted });
  } catch (err) {
    console.log("merchantController deleteOption error", err);
    res.status(500).json({ error: err.message });
  }
};
 ///////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.createOptionItem = async (req, res) => {
  try {
    const { optionItem } = req.body;
    const created = await merchantService.createOptionItem(optionItem);
    res.status(201).json({ message: "OptionItem created", opi: created });
  } catch (err) {
    console.log("merchantController createOptionItem error", err);
    res.status(500).json({ error: err.message });
  }
};
module.exports.updateOptionItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { newOptionItem } = req.body;
    console.log(newOptionItem);
    const updated = await merchantService.updateOptionItem(id, newOptionItem);
    res.json({ message: "OptionItem updated", opit: updated });
  } catch (err) {
    console.log("merchantController updateOptionItem error", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports.deleteOptionItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await merchantService.deleteOptionItem(id);
    res.json({ message: "OptionItem deleted", opi: deleted });  
  } catch (err) {
    console.log("merchantController deleteOptionItem error", err);
    res.status(500).json({ error: err.message });
  }
};
//////////////////////////////////////////////////////////////////////////
module.exports.getMenuItemOption = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItemOption = await merchantService.getMenuItemOption(id);
    res.json({ menuItemOption });
  } catch (err) {
    console.log("merchantController getMenuItemOption error", err);
    res.status(500).json({ error: err.message });
  }
};
module.exports.getMenuNoneItemOption = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItemNoneOption = await merchantService.getMenuNoneItemOption(id);
    res.json({ menuItemNoneOption });
  } catch (err) {
    console.log("merchantController getMenuNoneItemOption error", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports.createMenuItemOption = async (req, res) => {
  try {
    const { menuItemId, optionId } = req.body;  
    const created = await merchantService.createMenuItemOption(menuItemId, optionId );
    res.status(201).json({ message: "MenuItemOption created", opi: created });
  } catch (err) {
    console.log("merchantController createMenuItemOption error", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports.updateMenuItemOption = async (req, res) => {
  try {
    const { id } = req.params;
    const { newOptionItem } = req.body;
    const updated = await merchantService.updateMenuItemOption(id, newOptionItem);
    res.json({ message: "MenuItemOption updated", opit: updated });
  } catch (err) {
    console.log("merchantController updateMenuItemOption error", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports.deleteMenuItemOption = async (req, res) => {
  try {
    const { menuItemId, optionId } = req.body; // ✅ nhận cặp menuItemId + optionId
    const deleted = await merchantService.deleteMenuItemOption({ menuItemId, optionId });
    res.json({ message: "MenuItemOption deleted", opi: deleted });
  } catch (err) {
    console.log("merchantController deleteMenuItemOption error", err);
    res.status(500).json({ error: err.message });
  }
};



  