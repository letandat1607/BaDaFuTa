const { Category, MenuItem, MenuItemOption, Merchant, Option, OptionItem } = require("../models/index");
const { menuItemSchema } = require("../validations/menuItemValidation");
const { categorySchema } = require("../validations/categoryValidation");
const { optionSchema } = require("../validations/optionValidation");
const { optionItemSchema } = require("../validations/optionItemValidation");
const { v4 } = require("uuid");

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

module.exports.getMenuMerchant = async (req, res) => {
  try {
    console.log("Bắt đầu api");
    const { id } = req.params;

    const menu = await MenuItem.findAll({
      where: { merchant_id: id },
    });

    const category = await Category.findAll({
      where: { merchant_id: id },
    });

    // if(!menu) return res.json({message: 'Menu chưa được tạo'});
    // if(!category) return res.json({message: 'Category chưa được tạo'});

    return res.json({ menu, category })
  } catch (err) {
    console.log("merchantController getMenuMerchant error", err);
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
          as: "menu_items"
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
    // console.log("Req.body: ", req.body);
    // const user = req.user;
    // if(!user) return res.status(400).json({message: "khong tim thay merchant"});
    const { menuItem, merchant_id } = req.body;
    const itemId = v4();
    console.log(menuItem);
    const { error, value } = menuItemSchema.validate(menuItem);
    if (error) return res.status(400).json({ error: error.details[0].message })
    const menu = await MenuItem.create({
      id: itemId,
      merchant_id: merchant_id,
      ...value,
    })
    return res.json({ menu });

  } catch (err) {
    console.log("merchantController createMenuItem error", err);
    res.status(500).json({ error: err.message });
  }
};
module.exports.createCategory = async (req, res) => {
  try {
    console.log("Req.body: ", req.body);
    const user = req.user;
    if (!user) return res.status(400).json({ message: "khong tim thay merchant" });

    const { category } = req.body;//fe phat dat ten bien giong de lay du lieu
    const categoryId = v4();
    const { error, value } = categorySchema.validate(category);
    if (error) return res.status(400).json({ error: error.details[0].message })

    const categoryResult = await Category.create({
      id: categoryId,
      merchant_id: user.merchant_id,
      ...value,
    })
    return res.json({ success: true }, categoryResult);

  } catch (err) {
    console.log("merchantController createCategory error", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports.updateMenuItem = async (req,res) => {
try{
    console.log("Req.body: ",req.body);
    const {newItem, merchant_id }= req.body;//fe phat dat ten bien giong de lay du lieu
    const {id: itemId} = req.params;// lấy id từ thanh tìm kiếm https
    // const user = req.user;    
    // if(!user) return res.status(400).json({message: "khong tim thay merchant"});

    // const { error, value } = menuItemSchema.validate(newItem);
    // if(error) return res.status(400).json({ error: error.details[0].message });
    // console.log(value);

    const item = await MenuItem.findOne({
      where: {
        id: itemId,
        merchant_id: merchant_id,
      },
    });
    if (!item) return res.status(404).json({ error: "Không tìm thấy mon an" });

    item.set(newItem);
    const itemUpdate = await item.save();
    if (!itemUpdate) return res.status(400).json({ error: "Xảy ra vấn đề khi update" });

    return res.json({
        message: "Cập nhật thành công",
        item
    });

  } catch (err) {
    console.log("merchantController updateMenuItem error error", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports.updateCategory = async (req,res) => {
try{
    console.log("Req.body: ",req.body);
    const {newCategory }= req.body;//fe phat dat ten bien giong de lay du lieu
    const {id: categoryId} = req.params;// lấy id từ thanh tìm kiếm https
    

    

    const { error, value } = categorySchema.validate(newCategory);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const category = await Category.findOne({
      where: {
        id: categoryId,
        merchant_id: user.merchant_id,
      },
    });
    if (!category) return res.status(404).json({ error: "Không tìm thấy danh muc" });

    category.set(value);
    const categoryUpdate = await category.save();
    if (!categoryUpdate) return res.status(400).json({ error: "Xảy ra vấn đề khi update" });

    return res.json({
      message: "Cập nhật thành công",
    });

  } catch (err) {
    console.log("merchantController updateCategory error error", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports.deleteMenuItem = async (req, res) => {
  try {
    console.log("Req.body: ", req.body);
    const { id: itemId } = req.params;
    // const itemId = "6f15dfd1-8420-4d5e-adf2-13569de8ac2e"

    const user = req.user;
    if (!user) return res.status(400).json({ message: "khong tim thay merchant" });

    const item = await MenuItem.findOne({
      where: {
        id: itemId,
        merchant_id: user.merchant_id,
      }
    })
    if (!item) return res.status(404).json({ error: "Không tìm thấy mon an" });

    if (item.merchant_id !== user.merchant_id) {
      return res.status(403).json({ message: "Bạn không có quyền xóa món này" });
    }

    await item.destroy();

    return res.json({ message: "Xóa món ăn thành công" });


  } catch (err) {
    console.log("merchantController deleteMenuItem error error", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports.deleteCategory = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(400).json({ message: "khong tim thay merchant" });

    const { id: categoryID } = req.params;

    const category = await Category.findOne({
      where: {
        id: categoryID,
        merchant_id: user.merchant_id,

      },
    });
    if (!category) return res.status(404).json({ error: "Không tìm thấy danh muc" });

    if (category.merchant_id !== user.merchant_id) {
      return res.status(403).json({ message: "Bạn không có quyền xóa món này" });
    }

    await category.destroy();

    return res.json({ message: "Xóa danh muc thành công" });


  } catch (err) {
    console.log("merchantController deleteCategory error error", err);
    res.status(500).json({ error: err.message });
  }
}




module.exports.getOption = async (req, res) =>{
  try{
    const {id} = req.params;

    const option = await Option.findAll({where: {merchant_id: id}, 
    
      include:[{
            model: OptionItem,
            as: 'option_items'
          }]
    });
    return res.json({option});

  }catch(err){
    console.log("merchantController getOption error", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports.createOption = async (req,res) =>{
  try{
    console.log("Req.body: ",req.body);
    const user = req.user;
    if (!user) return res.status(400).json({ message: "khong tim thay merchant" });

    const { option } = req.body;
    const optionId = v4();
    const { error, value } = optionSchema.validate(option);
    if(error) return res.status(400).json({ error: error.details[0].message })

    const op = await Option.create({
      id: optionId,
      merchant_id: user.merchant_id,
      ...value,//////////////////////////////////////////////////////////// value
    })
    return res.json({ success: true });

  } catch (err) {
    console.log("merchantController createOption error", err);
    res.status(500).json({ error: err.message });
  }
};
module.exports.updateOption = async (req, res) => {
  try {
    console.log("Req.body: ", req.body);
    const { newOption, merchant_id } = req.body;//fe phat dat ten bien giong de lay du lieu
    const { id: optionId } = req.params;// lấy id từ thanh tìm kiếm https

    // const user = req.user;
    // if (!user) return res.status(400).json({ message: "khong tim thay merchant" });

    const { error, value } = optionSchema.validate(newOption);
    if(error) return res.status(400).json({ error: error.details[0].message });

    const option = await Option.findOne({
      where: {
        id: optionId,
        merchant_id: user.merchant_id,

      }
    });
    if (!option) return res.status(404).json({ error: "Không tìm thấy option" });

    option.set(value);//////////////////////////////////////////////////////////value
    const optionUpdate = await option.save();
    if (!optionUpdate) return res.status(400).json({ error: "Xảy ra vấn đề khi update" });

    return res.json({
      message: "Cập nhật thành công",
    });

  } catch (err) {
    console.log("merchantController updateOption   error", err);
    res.status(500).json({ error: err.message });
  }
};
module.exports.deleteOption = async (req, res) => {
  try {
    console.log("Req.body: ", req.body);
    const { id: optionId } = req.params;

    const user = req.user;
    if (!user) return res.status(400).json({ message: "khong tim thay merchant" });

    const option = await Option.findOne({
      where: {
        id: optionId,
        merchant_id: user.merchant_id,
      }
    })
    if (!option) return res.status(404).json({ error: "Không tìm thấy option" });

    if (option.merchant_id !== user.merchant_id) {
      return res.status(403).json({ message: "Bạn không có quyền xóa món này" });
    }

    await option.destroy();

    return res.json({ message: "Xóa option thành công" });


  } catch (err) {
    console.log("merchantController deleteOption error error", err);
    res.status(500).json({ error: err.message });
  }
}
module.exports.createOptionItem = async (req, res) => {
  try {
    console.log("Req.body: ", req.body);
    // const user = req.user;
    // if (!user) return res.status(400).json({ message: "khong tim thay merchant" });

    const {optionItem} = req.body;
    const optionItemID = v4();
    // const { error, value } = optionItemSchema.validate(optionItem);
    // if (error) return res.status(400).json({ error: error.details[0].message })

    const op = await OptionItem.create({
      id: optionItemID,
      ...optionItem,
    })
    console.log(op);
    return res.json({op });

  } catch (err) {
    console.log("merchantController createOptionItem error", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports.updateOptionItem= async (req,res) => {
try{
    console.log("Req.body: ",req.body);
    const {newOptionItem, merchant_id }= req.body;//fe phat dat ten bien giong de lay du lieu
    const {id: optionItemId} = req.params; 
    // const user = req.user;    
    // if(!user) return res.status(400).json({message: "khong tim thay merchant"});

    // const { error, value } = optionItemSchema.validate(newOptionItem);
    // if(error) return res.status(400).json({ error: error.details[0].message });

    const optionItem = await OptionItem.findOne({
        where: {id: optionItemId},
          include: [{
            model: Option,
            as: 'options',
            // attributes: ["merchant_id"], // chỉ lấy field cần thiết để tối ưu xét điều kiện where
            // where: { merchant_id: user.merchant_id } // không kiểm tra merchant_id thì có khả năng "ai cũng có thể update nếu biết ID"
          }]
        
    });

    if (!optionItem) return res.status(404).json({ error: "Không tìm thấy optionItem" });

    optionItem.set(newOptionItem);
    const optionItemUpdate = await optionItem.save();
    if (!optionItemUpdate) return res.status(400).json({ error: "Xảy ra vấn đề khi update" });

    return res.json({
      message: "Cập nhật thành công",
    });

  } catch (err) {
    console.log("merchantController updateOptionItem   error", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports.deleteOptionItem = async (req, res) => {
  try {
    console.log("Req.body: ", req.body);
    const { id: optionItemId } = req.params;

    const user = req.user;
    if (!user) return res.status(400).json({ message: "khong tim thay merchant" });

    const optionItem = await OptionItem.findOne({
      where: { id: optionItemId, },
      include: [{
        model: Option,
        as: 'option',
        attributes: ["merchant_id"], // chỉ lấy field cần thiết để tối ưu xét điều kiện where
        where: { merchant_id: user.merchant_id }

        // không kiểm tra merchant_id thì có khả năng "ai cũng có thể delete nếu biết ID"
      }]

    });

    if (!optionItem) return res.status(404).json({ error: "Không tìm thấy option" });


    await optionItem.destroy();

    return res.json({ message: "Xóa option thành công" });


  } catch (err) {
    console.log("merchantController deleteOption error error", err);
    res.status(500).json({ error: err.message });
  }
}