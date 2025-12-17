// src/components/merchant/dialogs/bulkAddToppingDialog.jsx
import { Dialog, Button } from "@radix-ui/themes";
import { useState } from "react";

export default function BulkAddToppingDialog({ optionGroups, onSuccess, onClose }) {
  const [tempItems, setTempItems] = useState([]);
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleAddTemp = (e) => {
    e.preventDefault();
    const form = e.target;
    
    const optionId = form.option_id.value;
    if (!optionId) {
      alert("Vui lòng chọn nhóm topping!");
      return;
    }

    const newItem = {
      option_id: optionId,
      option_item_name: form.option_item_name.value.trim(),
      price: Number(form.price.value),
      status_select: form.status_select.checked,
      tempKey: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    if (!newItem.option_item_name || newItem.price < 0) {
      alert("Vui lòng điền tên topping và giá!");
      return;
    }

    setTempItems((prev) => [...prev, newItem]);
    form.reset();
  };

  const handleSubmitAll = async () => {
    if (tempItems.length === 0) return alert("Chưa có topping nào để thêm!");

    try {
      const results = [];
      
      for (const item of tempItems) {
        const res = await fetch(`${baseURL}/api/merchant/createOptionItem`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({
            optionItem: {
              option_id: item.option_id,
              option_item_name: item.option_item_name,
              price: item.price,
              status_select: item.status_select,
            },
          }),
        });

        if (!res.ok) throw new Error(`Lỗi khi thêm topping: ${item.option_item_name}`);
        const { opi } = await res.json();

        if (!opi.id) {
          console.error("Topping không có id:", opi);
          throw new Error(`Topping ${item.option_item_name} không có ID hợp lệ`);
        }

        console.log("Topping vừa thêm:", opi);
        results.push(opi);
      }

      console.log("Tổng số topping thêm thành công:", results.length);
      console.log("Danh sách topping:", results);

      onSuccess(results);
      setTempItems([]);
      
      if (onClose) {
        onClose();
      }

      alert(`Đã thêm thành công ${results.length} topping!`);
      
    } catch (err) {
      console.error("Lỗi bulk add topping:", err);
      alert(err.message || "Thêm hàng loạt thất bại!");
    }
  };

  const handleRemoveTemp = (tempKey) => {
    setTempItems((prev) => prev.filter((i) => i.tempKey !== tempKey));
  };

  return (
    <Dialog.Content maxWidth="900px" style={{ padding: "24px" }}>
      <Dialog.Title>Thêm nhiều topping cùng lúc</Dialog.Title>
      
      <div style={{ display: "flex", gap: "24px", marginTop: "16px" }}>
        {/* === FORM NHẬP === */}
        <div style={{ flex: 1 }}>
          <form onSubmit={handleAddTemp} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            
            {/* CHỌN NHÓM TOPPING */}
            <select 
              name="option_id" 
              required
              style={{ 
                padding: "10px", 
                borderRadius: "6px", 
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            >
              <option value="">-- Chọn nhóm topping --</option>
              {optionGroups?.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.option_name}
                </option>
              ))}
            </select>

            {/* TÊN TOPPING */}
            <input
              name="option_item_name"
              type="text"
              placeholder="Tên topping (VD: Phô mai)"
              required
              style={{
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            />

            {/* GIÁ */}
            <input
              name="price"
              type="number"
              min="0"
              placeholder="Giá (VNĐ)"
              required
              style={{
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            />

            {/* MẶC ĐỊNH CHỌN */}
            <label style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px", 
              cursor: "pointer",
              padding: "8px",
              borderRadius: "6px",
              background: "#f8f9fa",
            }}>
              <input
                name="status_select"
                type="checkbox"
                style={{ width: "16px", height: "16px", cursor: "pointer" }}
              />
              <span style={{ fontSize: "14px", color: "#333" }}>Mặc định chọn</span>
            </label>

            {/* NÚT THÊM */}
            <Button type="submit" style={{ marginTop: "12px" }}>
              Thêm vào danh sách tạm
            </Button>
          </form>
        </div>

        {/* === DANH SÁCH TẠM === */}
        <div
          style={{
            flex: 1,
            background: "#f9f9f9",
            padding: "16px",
            borderRadius: "8px",
            maxHeight: "500px",
            overflowY: "auto",
          }}
        >
          <h4 style={{ margin: "0 0 12px", fontWeight: 600 }}>
            Danh sách tạm ({tempItems.length})
          </h4>

          {tempItems.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {tempItems.map((item) => {
                const groupName = optionGroups?.find(g => g.id === item.option_id)?.option_name || "Không rõ nhóm";
                
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
                      <strong>{item.option_item_name}</strong> - {item.price.toLocaleString()}₫
                      <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                        📁 {groupName}
                        {item.status_select && (
                          <span style={{ color: "#16a34a", fontWeight: 500, marginLeft: "8px" }}>
                            ✓ Mặc định
                          </span>
                        )}
                      </div>
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
            <p style={{ color: "#888", fontStyle: "italic" }}>Chưa có topping nào</p>
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