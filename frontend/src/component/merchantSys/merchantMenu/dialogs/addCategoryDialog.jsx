// src/components/merchant/dialogs/AddCategoryDialog.jsx
import { Dialog, Button } from "@radix-ui/themes";

export default function AddCategoryDialog({ onSuccess }) {
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.category_name.value.trim();
    if (!name) return alert("Tên danh mục không được để trống!");

    const merchant = JSON.parse(localStorage.getItem("merchant"));

    try {
      const res = await fetch(`${baseURL}/api/merchant/createCategory/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ category: { category_name: name }, merchant_id: merchant.id }),
      });

      if (!res.ok) throw new Error("Thêm danh mục thất bại");
      const { cat } = await res.json();
      onSuccess(cat);
      e.target.reset();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Dialog.Content maxWidth="400px" style={{ padding: "24px" }}>
      <Dialog.Title>Thêm danh mục</Dialog.Title>
      <form onSubmit={handleSubmit} style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <input
          name="category_name"
          type="text"
          placeholder="Nhập tên danh mục"
          required
          style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <Dialog.Close>
            <Button type="button" variant="soft">Hủy</Button>
          </Dialog.Close>
          <Button type="submit">Thêm</Button>
        </div>
      </form>
    </Dialog.Content>
  );
}