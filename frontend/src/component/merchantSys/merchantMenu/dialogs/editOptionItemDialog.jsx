// src/components/merchant/dialogs/EditOptionItemDialog.jsx
import { Dialog } from "@radix-ui/themes"; // Chỉ cần Dialog

export default function EditOptionItemDialog({ item, optionGroups, onClose, onUpdate }) {
  if (!item) {
    onClose?.();
    return null;
  }
  const baseURL ="http://localhost:3000";
  // const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const merchant = JSON.parse(localStorage.getItem("merchant"));

    const updated = {
      option_id: form.option_id.value,
      option_item_name: form.name_topping.value.trim(),
      price: Number(form.price_topping.value),
      status_select: form.status_select.checked,
      status: form.status.checked
    };

    try {
      const res = await fetch(`${baseURL}0/api/merchant/updateOptionItem/${item.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ newOptionItem: updated, merchant_id: merchant.id }),
      });

      if (!res.ok) throw new Error("Cập nhật thất bại");
      const { opit } = await res.json();
      onUpdate(opit);
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Dialog.Content maxWidth="500px" style={{ padding: "24px" }}>
      <Dialog.Title style={{ margin: 0, fontSize: "20px", fontWeight: 600 }}>
        Sửa topping
      </Dialog.Title>

      <form onSubmit={handleSubmit} style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* TÊN TOPPING */}
        <input
          name="name_topping"
          type="text"
          defaultValue={item.option_item_name}
          placeholder="Tên topping"
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
          name="price_topping"
          type="number"
          defaultValue={item.price}
          placeholder="Giá (VNĐ)"
          required
          min="0"
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        />

        {/* NHÓM TOPPING */}
        <select
          name="option_id"
          defaultValue={item.option_id}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        >
          {optionGroups?.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.option_name}
            </option>
          ))}
        </select>

        {/* MẶC ĐỊNH CHỌN */}
        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
          <input
            type="checkbox"
            name="status_select"
            defaultChecked={item.status_select}
            style={{ width: "16px", height: "16px", cursor: "pointer" }}
          />
          <span style={{ fontSize: "14px", color: "#333" }}>Mặc định chọn</span>
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
          <input
            type="checkbox"
            name="status"
            defaultChecked={item.status}
            style={{ width: "16px", height: "16px", cursor: "pointer" }}
          />
          <span style={{ fontSize: "14px", color: "#333" }}>Trạng thái topping</span>
        </label>
        {/* NÚT */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 16px",
              backgroundColor: "#e5e7eb",
              color: "#374151",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Hủy
          </button>
          <button
            type="submit"
            style={{
              padding: "8px 16px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Lưu
          </button>
        </div>
      </form>
    </Dialog.Content>
  );
}