const { v4 } = require('uuid');
const merchantRepo = require('../../../src/repositories/merchantRepository');
const menuService = require('../../../src/services/merchantService');
const { menuItemSchema, updateMenuItemSchema } = require("../../../src/validations/menuItemValidation");
const { categorySchema, updateCategorySchema } = require("../../../src/validations/categoryValidation");
const { optionSchema, updateOptionSchema } = require("../../../src/validations/optionValidation");
const { optionItemSchema, updateOptionItemSchema } = require("../../../src/validations/optionItemValidation");
const { menuItemOptionSchema } = require("../../../src/validations/menuItemOptionValidation");

jest.mock('../../../src/repositories/merchantRepository');

describe('Menu Service - White Box Testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===============================================
  // MENU ITEM TESTS
  // ===============================================
  describe('createMenuItem', () => {
    it('TC1: Nên throw error khi data null/undefined', async () => {
      await expect(menuService.createMenuItem(null))
        .rejects.toThrow('Thiếu dữ liệu món ăn');
    });

    it('TC2: Nên throw error khi validation fail', async () => {
      const invalidData = { name_item: '' };
      menuItemSchema.validate = jest.fn().mockReturnValue({
        error: { details: [{ message: 'Invalid' }] },
        value: null
      });

      await expect(menuService.createMenuItem(invalidData))
        .rejects.toThrow('Món ăn không hợp lệ');
      
      expect(menuItemSchema.validate).toHaveBeenCalledTimes(1);
    });

    it('TC3: Nên throw error khi món ăn đã tồn tại', async () => {
      const validData = {
        name_item: 'Phở bò',
        merchant_id: v4()
      };
      
      menuItemSchema.validate = jest.fn().mockReturnValue({
        error: null,
        value: validData
      });
      
      merchantRepo.findOneMenuItem.mockResolvedValue({ id: v4() });

      await expect(menuService.createMenuItem(validData))
        .rejects.toThrow('Món ăn đã có');
      
      expect(merchantRepo.findOneMenuItem).toHaveBeenCalledWith({
        name_item: validData.name_item,
        merchant_id: validData.merchant_id
      });
    });

    it('TC4: Nên tạo món ăn thành công khi data hợp lệ và không trùng', async () => {
      const validData = {
        name_item: 'Phở bò',
        merchant_id: v4(),
        price: 50000
      };
      
      const expectedResult = { id: v4(), ...validData };

      menuItemSchema.validate = jest.fn().mockReturnValue({
        error: null,
        value: validData
      });
      
      merchantRepo.findOneMenuItem.mockResolvedValue(null);
      merchantRepo.createMenuItem.mockResolvedValue(expectedResult);

      const result = await menuService.createMenuItem(validData);

      expect(menuItemSchema.validate).toHaveBeenCalledTimes(1);
      expect(merchantRepo.findOneMenuItem).toHaveBeenCalledWith({
        name_item: validData.name_item,
        merchant_id: validData.merchant_id
      });
      expect(merchantRepo.createMenuItem).toHaveBeenCalledTimes(1);
      expect(merchantRepo.createMenuItem).toHaveBeenCalledWith(
        expect.objectContaining(validData)
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateMenuItem', () => {
    it('TC5: Nên throw error khi validation fail', async () => {
      const id = v4();
      const invalidData = { price: -1000 };
      
      updateMenuItemSchema.validate = jest.fn().mockReturnValue({
        error: { details: [{ message: 'Invalid' }] },
        value: null
      });

      await expect(menuService.updateMenuItem(id, invalidData))
        .rejects.toThrow('Món ăn không hợp lệ');
      
      expect(updateMenuItemSchema.validate).toHaveBeenCalledTimes(1);
    });

    it('TC6: Nên throw error khi không tìm thấy món ăn', async () => {
      const id = v4();
      const validData = { price: 60000 };
      
      updateMenuItemSchema.validate = jest.fn().mockReturnValue({
        error: null,
        value: validData
      });
      
      merchantRepo.updateMenuItem.mockResolvedValue(null);

      await expect(menuService.updateMenuItem(id, validData))
        .rejects.toThrow('Không tìm thấy món ăn');
      
      expect(merchantRepo.updateMenuItem).toHaveBeenCalledWith(id, validData);
    });

    it('TC7: Nên update thành công khi data hợp lệ', async () => {
      const id = v4();
      const validData = { price: 60000 };
      const expectedResult = { id, ...validData };
      
      updateMenuItemSchema.validate = jest.fn().mockReturnValue({
        error: null,
        value: validData
      });
      
      merchantRepo.updateMenuItem.mockResolvedValue(expectedResult);

      const result = await menuService.updateMenuItem(id, validData);

      expect(updateMenuItemSchema.validate).toHaveBeenCalledTimes(1);
      expect(merchantRepo.updateMenuItem).toHaveBeenCalledWith(id, validData);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteMenuItem', () => {
    it('TC8: Nên throw error khi không tìm thấy món ăn', async () => {
      const id = v4();
      merchantRepo.deleteMenuItem.mockResolvedValue(null);

      await expect(menuService.deleteMenuItem(id))
        .rejects.toThrow('Không tìm thấy món ăn để xóa');
      
      expect(merchantRepo.deleteMenuItem).toHaveBeenCalledWith(id);
    });

    it('TC9: Nên xóa thành công khi tìm thấy món ăn', async () => {
      const id = v4();
      const deletedItem = { id, name_item: 'Phở bò' };
      
      merchantRepo.deleteMenuItem.mockResolvedValue(deletedItem);

      const result = await menuService.deleteMenuItem(id);

      expect(merchantRepo.deleteMenuItem).toHaveBeenCalledWith(id);
      expect(result).toEqual(deletedItem);
    });
  });

  // ===============================================
  // CATEGORY TESTS
  // ===============================================
  describe('createCategory', () => {
    it('TC10: Nên throw error khi data null/undefined', async () => {
      await expect(menuService.createCategory(null))
        .rejects.toThrow('Thiếu dữ liệu danh mục');
    });

    it('TC11: Nên throw error khi validation fail', async () => {
      const invalidData = { category_name: '' };
      categorySchema.validate = jest.fn().mockReturnValue({
        error: { details: [{ message: 'Invalid' }] },
        value: null
      });

      await expect(menuService.createCategory(invalidData))
        .rejects.toThrow('Danh mục không hợp lệ');
      
      expect(categorySchema.validate).toHaveBeenCalledTimes(1);
    });

    it('TC12: Nên throw error khi danh mục đã tồn tại', async () => {
      const validData = {
        category_name: 'Món chính',
        merchant_id: v4()
      };
      
      categorySchema.validate = jest.fn().mockReturnValue({
        error: null,
        value: validData
      });
      
      merchantRepo.findOneCategory.mockResolvedValue({ id: v4() });

      await expect(menuService.createCategory(validData))
        .rejects.toThrow('Danh mục đã tồn tại');
      
      expect(merchantRepo.findOneCategory).toHaveBeenCalledWith({
        category_name: validData.category_name,
        merchant_id: validData.merchant_id
      });
    });

    it('TC13: Nên tạo danh mục thành công', async () => {
      const validData = {
        category_name: 'Món chính',
        merchant_id: v4()
      };
      
      const expectedResult = { id: v4(), ...validData };

      categorySchema.validate = jest.fn().mockReturnValue({
        error: null,
        value: validData
      });
      
      merchantRepo.findOneCategory.mockResolvedValue(null);
      merchantRepo.createCategory.mockResolvedValue(expectedResult);

      const result = await menuService.createCategory(validData);

      expect(categorySchema.validate).toHaveBeenCalledTimes(1);
      expect(merchantRepo.findOneCategory).toHaveBeenCalledWith({
        category_name: validData.category_name,
        merchant_id: validData.merchant_id
      });
      expect(merchantRepo.createCategory).toHaveBeenCalledWith(
        expect.objectContaining(validData)
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateCategory', () => {
    it('TC14: Nên throw error khi validation fail', async () => {
      const id = v4();
      const invalidData = {};
      
      updateCategorySchema.validate = jest.fn().mockReturnValue({
        error: { details: [{ message: 'Invalid' }] },
        value: null
      });

      await expect(menuService.updateCategory(id, invalidData))
        .rejects.toThrow('Danh mục không hợp lệ');
      
      expect(updateCategorySchema.validate).toHaveBeenCalledTimes(1);
    });

    it('TC15: Nên throw error khi không tìm thấy danh mục', async () => {
      const id = v4();
      const validData = { category_name: 'Món phụ' };
      
      updateCategorySchema.validate = jest.fn().mockReturnValue({
        error: null,
        value: validData
      });
      
      merchantRepo.updateCategory.mockResolvedValue(null);

      await expect(menuService.updateCategory(id, validData))
        .rejects.toThrow('Không tìm thấy danh mục');
      
      expect(merchantRepo.updateCategory).toHaveBeenCalledWith(id, validData);
    });

    it('TC16: Nên update thành công', async () => {
      const id = v4();
      const validData = { category_name: 'Món phụ' };
      const expectedResult = { id, ...validData };
      
      updateCategorySchema.validate = jest.fn().mockReturnValue({
        error: null,
        value: validData
      });
      
      merchantRepo.updateCategory.mockResolvedValue(expectedResult);

      const result = await menuService.updateCategory(id, validData);

      expect(updateCategorySchema.validate).toHaveBeenCalledTimes(1);
      expect(merchantRepo.updateCategory).toHaveBeenCalledWith(id, validData);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteCategory', () => {
    it('TC17: Nên throw error khi không tìm thấy danh mục', async () => {
      const id = v4();
      merchantRepo.deleteCategory.mockResolvedValue(null);

      await expect(menuService.deleteCategory(id))
        .rejects.toThrow('Không tìm thấy danh mục để xóa');
      
      expect(merchantRepo.deleteCategory).toHaveBeenCalledWith(id);
    });

    it('TC18: Nên xóa thành công', async () => {
      const id = v4();
      const deletedCategory = { id, category_name: 'Món chính' };
      
      merchantRepo.deleteCategory.mockResolvedValue(deletedCategory);

      const result = await menuService.deleteCategory(id);

      expect(merchantRepo.deleteCategory).toHaveBeenCalledWith(id);
      expect(result).toEqual(deletedCategory);
    });
  });

  // ===============================================
  // OPTION TESTS
  // ===============================================
  describe('createOption', () => {
    it('TC19: Nên throw error khi data null/undefined', async () => {
      await expect(menuService.createOption(null))
        .rejects.toThrow('Thiếu dữ liệu option');
    });

    it('TC20: Nên throw error khi validation fail', async () => {
      const invalidData = { option_name: '' };
      optionSchema.validate = jest.fn().mockReturnValue({
        error: { details: [{ message: 'Invalid' }] },
        value: null
      });

      await expect(menuService.createOption(invalidData))
        .rejects.toThrow('Nhóm topping không hợp lệ');
      
      expect(optionSchema.validate).toHaveBeenCalledTimes(1);
    });

    it('TC21: Nên throw error khi nhóm topping đã tồn tại', async () => {
      const validData = {
        option_name: 'Size',
        merchant_id: v4()
      };
      
      optionSchema.validate = jest.fn().mockReturnValue({
        error: null,
        value: validData
      });
      
      merchantRepo.findOneOption.mockResolvedValue({ id: v4() });

      await expect(menuService.createOption(validData))
        .rejects.toThrow('Nhóm topping đã tồn tại');
      
      expect(merchantRepo.findOneOption).toHaveBeenCalledWith({
        option_name: validData.option_name
      });
    });

    it('TC22: Nên tạo option thành công', async () => {
      const validData = {
        option_name: 'Size',
        merchant_id: v4(),
        multi_select: true
      };
      
      const expectedResult = { id: v4(), ...validData };

      optionSchema.validate = jest.fn().mockReturnValue({
        error: null,
        value: validData
      });
      
      merchantRepo.findOneOption.mockResolvedValue(null);
      merchantRepo.createOption.mockResolvedValue(expectedResult);

      const result = await menuService.createOption(validData);

      expect(optionSchema.validate).toHaveBeenCalledTimes(1);
      expect(merchantRepo.findOneOption).toHaveBeenCalledWith({
        option_name: validData.option_name
      });
      expect(merchantRepo.createOption).toHaveBeenCalledWith(
        expect.objectContaining(validData)
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateOption', () => {
    it('TC23: Nên throw error khi validation fail', async () => {
      const id = v4();
      const invalidData = {};
      
      updateOptionSchema.validate = jest.fn().mockReturnValue({
        error: { details: [{ message: 'Invalid' }] },
        value: null
      });

      await expect(menuService.updateOption(id, invalidData))
        .rejects.toThrow('Nhóm topping không hợp lệ');
      
      expect(updateOptionSchema.validate).toHaveBeenCalledTimes(1);
    });

    it('TC24: Nên throw error khi không tìm thấy option', async () => {
      const id = v4();
      const validData = { option_name: 'Topping' };
      
      updateOptionSchema.validate = jest.fn().mockReturnValue({
        error: null,
        value: validData
      });
      
      merchantRepo.updateOption.mockResolvedValue(null);

      await expect(menuService.updateOption(id, validData))
        .rejects.toThrow('Không tìm thấy nhóm topping');
      
      expect(merchantRepo.updateOption).toHaveBeenCalledWith(id, validData);
    });

    it('TC25: Nên update thành công', async () => {
      const id = v4();
      const validData = { option_name: 'Topping' };
      const expectedResult = { id, ...validData };
      
      updateOptionSchema.validate = jest.fn().mockReturnValue({
        error: null,
        value: validData
      });
      
      merchantRepo.updateOption.mockResolvedValue(expectedResult);

      const result = await menuService.updateOption(id, validData);

      expect(updateOptionSchema.validate).toHaveBeenCalledTimes(1);
      expect(merchantRepo.updateOption).toHaveBeenCalledWith(id, validData);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteOption', () => {
    it('TC26: Nên throw error khi không tìm thấy option', async () => {
      const id = v4();
      merchantRepo.deleteOption.mockResolvedValue(null);

      await expect(menuService.deleteOption(id))
        .rejects.toThrow('Không tìm thấy nhóm topping để xóa');
      
      expect(merchantRepo.deleteOption).toHaveBeenCalledWith(id);
    });

    it('TC27: Nên xóa thành công', async () => {
      const id = v4();
      const deletedOption = { id, option_name: 'Size' };
      
      merchantRepo.deleteOption.mockResolvedValue(deletedOption);

      const result = await menuService.deleteOption(id);

      expect(merchantRepo.deleteOption).toHaveBeenCalledWith(id);
      expect(result).toEqual(deletedOption);
    });
  });

  // ===============================================
  // OPTION ITEM TESTS
  // ===============================================
  describe('createOptionItem', () => {
    it('TC28: Nên throw error khi data null/undefined', async () => {
      await expect(menuService.createOptionItem(null))
        .rejects.toThrow('Thiếu dữ liệu topping');
    });

    it('TC29: Nên throw error khi validation fail', async () => {
      const invalidData = { option_item_name: '' };
      optionItemSchema.validate = jest.fn().mockReturnValue({
        error: { details: [{ message: 'Invalid' }] },
        value: null
      });

      await expect(menuService.createOptionItem(invalidData))
        .rejects.toThrow('Topping không hợp lệ');
      
      expect(optionItemSchema.validate).toHaveBeenCalledTimes(1);
    });

    it('TC30: Nên tạo option item thành công', async () => {
      const validData = {
        option_id: v4(),
        option_item_name: 'Size M',
        price: 5000
      };
      
      const expectedResult = { id: v4(), ...validData };

      optionItemSchema.validate = jest.fn().mockReturnValue({
        error: null,
        value: validData
      });
      
      merchantRepo.createOptionItem.mockResolvedValue(expectedResult);

      const result = await menuService.createOptionItem(validData);

      expect(optionItemSchema.validate).toHaveBeenCalledTimes(1);
      expect(merchantRepo.createOptionItem).toHaveBeenCalledWith(
        expect.objectContaining(validData)
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateOptionItem', () => {
    it('TC31: Nên throw error khi validation fail', async () => {
      const id = v4();
      const invalidData = { price: -1000 };
      
      updateOptionItemSchema.validate = jest.fn().mockReturnValue({
        error: { details: [{ message: 'Invalid' }] },
        value: null
      });

      await expect(menuService.updateOptionItem(id, invalidData))
        .rejects.toThrow('Topping không hợp lệ');
      
      expect(updateOptionItemSchema.validate).toHaveBeenCalledTimes(1);
    });

    it('TC32: Nên throw error khi không tìm thấy option item', async () => {
      const id = v4();
      const validData = { price: 6000 };
      
      updateOptionItemSchema.validate = jest.fn().mockReturnValue({
        error: null,
        value: validData
      });
      
      merchantRepo.updateOptionItem.mockResolvedValue(null);

      await expect(menuService.updateOptionItem(id, validData))
        .rejects.toThrow('Không tìm thấy option item');
      
      expect(merchantRepo.updateOptionItem).toHaveBeenCalledWith(id, validData);
    });

    it('TC33: Nên update thành công', async () => {
      const id = v4();
      const validData = { price: 6000 };
      const expectedResult = { id, ...validData };
      
      updateOptionItemSchema.validate = jest.fn().mockReturnValue({
        error: null,
        value: validData
      });
      
      merchantRepo.updateOptionItem.mockResolvedValue(expectedResult);

      const result = await menuService.updateOptionItem(id, validData);

      expect(updateOptionItemSchema.validate).toHaveBeenCalledTimes(1);
      expect(merchantRepo.updateOptionItem).toHaveBeenCalledWith(id, validData);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteOptionItem', () => {
    it('TC34: Nên throw error khi không tìm thấy option item', async () => {
      const id = v4();
      merchantRepo.deleteOptionItem.mockResolvedValue(null);

      await expect(menuService.deleteOptionItem(id))
        .rejects.toThrow('Không tìm thấy topping để xóa');
      
      expect(merchantRepo.deleteOptionItem).toHaveBeenCalledWith(id);
    });

    it('TC35: Nên xóa thành công', async () => {
      const id = v4();
      const deletedItem = { id, option_item_name: 'Size M' };
      
      merchantRepo.deleteOptionItem.mockResolvedValue(deletedItem);

      const result = await menuService.deleteOptionItem(id);

      expect(merchantRepo.deleteOptionItem).toHaveBeenCalledWith(id);
      expect(result).toEqual(deletedItem);
    });
  });

  // ===============================================
  // MENU ITEM OPTION TESTS
  // ===============================================
  describe('createMenuItemOption', () => {
    it('TC36: Nên throw error khi thiếu menuItemId', async () => {
      await expect(menuService.createMenuItemOption(null, v4()))
        .rejects.toThrow('Dữ liệu không hợp lệ');
    });

    it('TC37: Nên throw error khi thiếu optionId', async () => {
      await expect(menuService.createMenuItemOption(v4(), null))
        .rejects.toThrow('Dữ liệu không hợp lệ');
    });

    it('TC38: Nên return existing khi liên kết đã tồn tại', async () => {
      const menuItemId = v4();
      const optionId = v4();
      const existing = { menuItemId, optionId };
      
      merchantRepo.findMenuItemOption.mockResolvedValue(existing);

      const result = await menuService.createMenuItemOption(menuItemId, optionId);

      expect(merchantRepo.findMenuItemOption).toHaveBeenCalledWith({
        menuItemId,
        optionId
      });
      expect(result).toEqual(existing);
      expect(merchantRepo.createMenuItemOption).not.toHaveBeenCalled();
    });

    it('TC39: Nên tạo liên kết mới khi chưa tồn tại', async () => {
      const menuItemId = v4();
      const optionId = v4();
      const newLink = { menuItemId, optionId };
      
      merchantRepo.findMenuItemOption.mockResolvedValue(null);
      merchantRepo.createMenuItemOption.mockResolvedValue(newLink);

      const result = await menuService.createMenuItemOption(menuItemId, optionId);

      expect(merchantRepo.findMenuItemOption).toHaveBeenCalledWith({
        menuItemId,
        optionId
      });
      expect(merchantRepo.createMenuItemOption).toHaveBeenCalledWith({
        menuItemId,
        optionId
      });
      expect(result).toEqual(newLink);
    });
  });

  describe('updateMenuItemOption', () => {
    it('TC40: Nên throw error khi validation fail', async () => {
      const id = v4();
      const invalidData = {};
      
      menuItemOptionSchema.validate = jest.fn().mockReturnValue({
        error: { details: [{ message: 'Invalid field' }] },
        value: null
      });

      await expect(menuService.updateMenuItemOption(id, invalidData))
        .rejects.toThrow('Invalid field');
      
      expect(menuItemOptionSchema.validate).toHaveBeenCalledTimes(1);
    });

    it('TC41: Nên throw error khi không tìm thấy', async () => {
      const id = v4();
      const validData = { some_field: 'value' };
      
      menuItemOptionSchema.validate = jest.fn().mockReturnValue({
        error: null,
        value: validData
      });
      
      merchantRepo.updateOptionItem.mockResolvedValue(null);

      await expect(menuService.updateMenuItemOption(id, validData))
        .rejects.toThrow('Không tìm thấy topping hoặc món ăn');
      
      expect(merchantRepo.updateOptionItem).toHaveBeenCalledWith(id, validData);
    });

    it('TC42: Nên update thành công', async () => {
      const id = v4();
      const validData = { some_field: 'value' };
      const expectedResult = { id, ...validData };
      
      menuItemOptionSchema.validate = jest.fn().mockReturnValue({
        error: null,
        value: validData
      });
      
      merchantRepo.updateOptionItem.mockResolvedValue(expectedResult);

      const result = await menuService.updateMenuItemOption(id, validData);

      expect(menuItemOptionSchema.validate).toHaveBeenCalledTimes(1);
      expect(merchantRepo.updateOptionItem).toHaveBeenCalledWith(id, validData);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteMenuItemOption', () => {
    it('TC43: Nên throw error khi thiếu menuItemId', async () => {
      const data = { optionId: v4() };

      await expect(menuService.deleteMenuItemOption(data))
        .rejects.toThrow('Dữ liệu không hợp lệ');
    });

    it('TC44: Nên throw error khi thiếu optionId', async () => {
      const data = { menuItemId: v4() };

      await expect(menuService.deleteMenuItemOption(data))
        .rejects.toThrow('Dữ liệu không hợp lệ');
    });

    it('TC45: Nên throw error khi không tìm thấy liên kết', async () => {
      const data = {
        menuItemId: v4(),
        optionId: v4()
      };
      
      merchantRepo.deleteMenuItemOption.mockResolvedValue(null);

      await expect(menuService.deleteMenuItemOption(data))
        .rejects.toThrow('Không tìm thấy liên kết để xóa');
      
      expect(merchantRepo.deleteMenuItemOption).toHaveBeenCalledWith(data);
    });

    it('TC46: Nên xóa liên kết thành công', async () => {
      const data = {
        menuItemId: v4(),
        optionId: v4()
      };
      
      const deletedLink = { ...data, deleted: true };
      
      merchantRepo.deleteMenuItemOption.mockResolvedValue(deletedLink);

      const result = await menuService.deleteMenuItemOption(data);

      expect(merchantRepo.deleteMenuItemOption).toHaveBeenCalledWith(data);
      expect(result).toEqual(deletedLink);
    });
  });
});