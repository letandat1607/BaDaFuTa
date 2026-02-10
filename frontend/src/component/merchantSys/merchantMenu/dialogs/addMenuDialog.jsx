// src/components/merchant/dialogs/AddMenuDialog.jsx
import { Dialog, Button } from "@radix-ui/themes";

export default function AddMenuDialog({ categories, onSuccess }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const merchant = JSON.parse(localStorage.getItem("merchant"));
    // const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const baseURL ="http://localhost:3000";

    const newMenu = {
      category_id: form.category_id.value || null,
      name_item: form.name_item.value.trim(),
      price: Number(form.price.value),
      description: form.description.value.trim() || null,
      image_item: { url: form.url.value.trim() },
    };

    try {
      const res = await fetch(`${baseURL}/api/merchant/createMenuItem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ menuItem: newMenu, merchant_id: merchant.id }),
      });

      if (!res.ok) throw new Error("Thêm món thất bại");
      const { menu } = await res.json();
      onSuccess(menu);
      form.reset();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Dialog.Content maxWidth="500px" style={{ padding: "24px" }}>
      <Dialog.Title>Thêm món ăn</Dialog.Title>
      <Dialog.Description>Điền thông tin món ăn mới</Dialog.Description>

      <form onSubmit={handleSubmit} style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>Hình ảnh (URL)</label>
          <input name="url" type="text" placeholder="https://..." required style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>Tên món</label>
          <input name="name_item" type="text" placeholder="Phở bò" required style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>Giá (VNĐ)</label>
          <input name="price" type="number" min="0" placeholder="45000" required style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>Danh mục</label>
          <select name="category_id" style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}>
            <option value="">Không có</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.category_name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>Mô tả</label>
          <textarea name="description" rows="3" placeholder="Mô tả món..." style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
          <Dialog.Close>
            <Button type="button" variant="soft">Hủy</Button>
          </Dialog.Close>
          <Button type="submit">Thêm món</Button>
        </div>
      </form>
    </Dialog.Content>
  );
}