// src/components/merchant/dialogs/BulkAddMenuDialog.jsx
import { Dialog, Button } from "@radix-ui/themes";
import { useState } from "react";

export default function BulkAddMenuDialog({ categories, onSuccess, onClose }) {
  const [tempItems, setTempItems] = useState([]);
  const baseURL ="http://localhost:3000";
  // const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleAddTemp = (e) => {
    e.preventDefault();
    const form = e.target;
    const newItem = {
      category_id: form.category_id.value || null,
      name_item: form.name_item.value.trim(),
      price: Number(form.price.value),
      description: form.description.value.trim() || null,
      image_item: { url: form.url.value.trim() },
      tempKey: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // KEY DUY NHẤT với timestamp
    };
    if (!newItem.name_item || !newItem.price) {
      alert("Vui lòng điền tên món và giá!");
      return;
    }
    setTempItems((prev) => [...prev, newItem]);
    form.reset();
  };

  const handleSubmitAll = async () => {
    if (tempItems.length === 0) return alert("Chưa có món nào để thêm!");
    const merchant = JSON.parse(localStorage.getItem("merchant"));
    
    try {
      const results = [];
      
      // Thêm từng món một
      for (const item of tempItems) {
        const res = await fetch(`${baseURL}/api/merchant/createMenuItem`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({
            menuItem: {
              category_id: item.category_id,
              name_item: item.name_item,
              price: item.price,
              description: item.description,
              image_item: item.image_item,
            },
            merchant_id: merchant.id,
          }),
        });
        
        if (!res.ok) throw new Error(`Lỗi khi thêm món: ${item.name_item}`);
        const { menu } = await res.json();
        
        // ĐẢM BẢO menu có id từ backend
        if (!menu.id) {
          console.error("Menu không có id:", menu);
          throw new Error(`Món ${item.name_item} không có ID hợp lệ`);
        }
        
        console.log("Món vừa thêm:", menu);
        results.push(menu);
      }
      
      // Gọi onSuccess với mảng kết quả
      console.log("Tổng số món thêm thành công:", results.length);
      console.log("Danh sách món:", results);
      
      onSuccess(results);
      
      // Reset state
      setTempItems([]);
      
      // Đóng dialog
      if (onClose) {
        onClose();
      }
      
      alert(`Đã thêm thành công ${results.length} món!`);
      
    } catch (err) {
      console.error("Lỗi bulk add:", err);
      alert(err.message || "Thêm hàng loạt thất bại!");
    }
  };

  const handleRemoveTemp = (tempKey) => {
    setTempItems((prev) => prev.filter((i) => i.tempKey !== tempKey));
  };

  return (
    <Dialog.Content maxWidth="900px" style={{ padding: "24px" }}>
      <Dialog.Title>Thêm nhiều món ăn cùng lúc</Dialog.Title>
      <div style={{ display: "flex", gap: "24px", marginTop: "16px" }}>
        <div style={{ flex: 1 }}>
          <form onSubmit={handleAddTemp} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input 
              name="url" 
              type="text" 
              placeholder="URL hình ảnh" 
              style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} 
            />
            <input 
              name="name_item" 
              type="text" 
              placeholder="Tên món" 
              required 
              style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} 
            />
            <input 
              name="price" 
              type="number" 
              min="0" 
              placeholder="Giá (VNĐ)" 
              required 
              style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} 
            />
            <select 
              name="category_id" 
              style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
            >
              <option value="">Không có danh mục</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.category_name}</option>
              ))}
            </select>
            <textarea 
              name="description" 
              rows="2" 
              placeholder="Mô tả (tùy chọn)" 
              style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} 
            />
            <Button type="submit" style={{ marginTop: "12px" }}>
              Thêm vào danh sách tạm
            </Button>
          </form>
        </div>

        <div style={{ 
          flex: 1, 
          background: "#f9f9f9", 
          padding: "16px", 
          borderRadius: "8px", 
          maxHeight: "500px", 
          overflowY: "auto" 
        }}>
          <h4 style={{ margin: "0 0 12px", fontWeight: 600 }}>
            Danh sách tạm ({tempItems.length})
          </h4>
          
          {tempItems.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {tempItems.map((item) => {
                const categoryName = categories?.find(c => c.id === item.category_id)?.category_name || "Chưa phân loại";
                
                return (
                  <div
                    key={item.tempKey}
                    style={{
                      padding: "10px",
                      background: "white",
                      borderRadius: "6px",
                      border: "1px solid #ddd",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <strong>{item.name_item}</strong> - {item.price.toLocaleString()}₫
                      <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                        📁 {categoryName}
                      </div>
                      {item.description && (
                        <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#555" }}>
                          {item.description}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTemp(item.tempKey)}
                      style={{
                        background: "#ff4d4f",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "6px 12px",
                        fontSize: "12px",
                        cursor: "pointer",
                        marginLeft: "12px",
                        flexShrink: 0,
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: "#888", fontStyle: "italic" }}>Chưa có món nào</p>
          )}
          
          {tempItems.length > 0 && (
            <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
              <Button onClick={handleSubmitAll} color="green">
                Lưu tất cả ({tempItems.length})
              </Button>
              <Button variant="soft" onClick={() => setTempItems([])}>
                Xóa hết
              </Button>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
        <Dialog.Close asChild>
          <Button variant="soft">Đóng</Button>
        </Dialog.Close>
      </div>
    </Dialog.Content>
  );
}