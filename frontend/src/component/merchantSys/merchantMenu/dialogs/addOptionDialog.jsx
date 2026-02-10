// src/components/merchant/dialogs/AddOptionDialog.jsx
import { Dialog, Button } from "@radix-ui/themes";

export default function AddOptionDialog({ onSuccess }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const merchant = JSON.parse(localStorage.getItem("merchant"));
    // const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const baseURL ="http://localhost:3000";

    const newOption = {
      option_name: form.option_name.value.trim(),
      multi_select: form.multi_select.checked,
      require_select: form.require_select.checked,
      number_select: form.number_select.value ? parseInt(form.number_select.value) : 1,
    };

    try {
      const res = await fetch(`${baseURL}/api/merchant/createOption/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ option: newOption, merchant_id: merchant.id }),
      });

      if (!res.ok) throw new Error("Thêm nhóm thất bại");
      const { option } = await res.json();
      onSuccess(option);
      form.reset();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Dialog.Content maxWidth="500px" style={{ padding: "24px" }}>
      <Dialog.Title>Thêm nhóm topping</Dialog.Title>
      <form onSubmit={handleSubmit} style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <input name="option_name" type="text" placeholder="Tên nhóm (VD: Kích cỡ)" required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />

        <label><input type="checkbox" name="multi_select" /> Cho phép chọn nhiều</label>
        <label><input type="checkbox" name="require_select" /> Bắt buộc chọn</label>

        <input name="number_select" type="number" min="1" placeholder="Số lượng tối đa" style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <Dialog.Close>
            <Button type="button" variant="soft">Hủy</Button>
          </Dialog.Close>
          <Button type="submit">Thêm nhóm</Button>
        </div>
      </form>
    </Dialog.Content>
  );
}