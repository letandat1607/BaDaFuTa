// src/components/merchant/dialogs/EditMenuItemDialog.jsx
import { Dialog } from "@radix-ui/themes"; // Chỉ cần Dialog cho Dialog.Content

export default function EditMenuItemDialog({ item, categories, onClose, onUpdate }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const merchant = JSON.parse(localStorage.getItem("merchant"));
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const updated = {
      category_id: form.category_id.value || null,
      name_item: form.name_item.value.trim(),
      price: Number(form.price.value),
      description: form.description.value.trim() || null,
      image_item: { url: form.url.value.trim() },
      status: form.status.checked
    };

    try {
      const res = await fetch(`${baseURL}/api/merchant/updateMenuItem/${item.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ newItem: updated, merchant_id: merchant.id }),
      });

      if (!res.ok) throw new Error("Cập nhật thất bại");
      const { it } = await res.json();
      onUpdate(it);
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Dialog.Content maxWidth="500px" style={{ padding: "24px" }}>
      <Dialog.Title style={{ margin: 0, fontSize: "20px", fontWeight: 600 }}>
        Sửa món ăn
      </Dialog.Title>

      <form onSubmit={handleSubmit} style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* URL ẢNH */}
        <input
          name="url"
          type="text"
          defaultValue={item.image_item?.url || ""}
          placeholder="URL ảnh"
          required
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        />

        {/* TÊN MÓN */}
        <input
          name="name_item"
          type="text"
          defaultValue={item.name_item}
          placeholder="Tên món"
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

        {/* DANH MỤC */}
        <select
          name="category_id"
          defaultValue={item.category_id || ""}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        >
          <option value="">Không có danh mục</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.category_name}
            </option>
          ))}
        </select>

        {/* MÔ TẢ */}
        <textarea
          name="description"
          defaultValue={item.description || ""}
          placeholder="Mô tả (tùy chọn)"
          rows="3"
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "14px",
            resize: "vertical",
          }}
        />

        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
          <input
            type="checkbox"
            name="status"
            defaultChecked={item.status}
            style={{ width: "16px", height: "16px", cursor: "pointer" }}
          />
          <span style={{ fontSize: "14px", color: "#333" }}>Mặc định chọn</span>
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