// src/components/merchant/OptionItemTab.jsx
import { useState } from "react";
import { Button, Dialog } from "@radix-ui/themes";
import AddOptionDialog from "./dialogs/addOptionDialog";
import EditOptionItemDialog from "./dialogs/editOptionItemDialog";
import BulkAddToppingDialog from "./dialogs/bulkAddToppingDialog";
import CardContent from "../commonMerchant/card";

export default function OptionItemTab({ option, setOption }) {
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const baseURL ="http://localhost:3000";
  // const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  console.log(option);
  
  // === XÓA NHÓM ===
  const handleDeleteGroup = async (groupId) => {
    if (!confirm("Xóa nhóm topping này? Tất cả topping sẽ bị xóa!")) return;
    try {
      await fetch(`${baseURL}/api/merchant/deleteOption/${groupId}`, {
        method: "POST",
        headers: { authorization: localStorage.getItem("token") },
      });
      setOption((prev) => prev.filter((op) => op.id !== groupId));
    } catch (err) {
      alert("Xóa nhóm thất bại!");
    }
  };

  // === XÓA TOPPING ===
  const handleDeleteTopping = async (itemId, groupId) => {
    if (!confirm("Xóa topping này?")) return;
    try {
      await fetch(`${baseURL}/api/merchant/deleteOptionItem/${itemId}`, {
        method: "POST",
        headers: { authorization: localStorage.getItem("token") },
      });
      setOption((prev) =>
        prev.map((op) =>
          op.id === groupId
            ? { ...op, option_items: op.option_items.filter((i) => i.id !== itemId) }
            : op
        )
      );
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };

  // === LƯU KẾT QUẢ BULK ADD ===
  const handleBulkSuccess = (newToppings) => {
    console.log("onSuccess nhận được:", newToppings);

    setOption((prev) => {
      // Tạo deep copy
      const updated = prev.map(op => ({
        ...op,
        option_items: [...op.option_items]
      }));

      // Thêm từng topping vào đúng group
      newToppings.forEach((topping) => {
        if (!topping.id) {
          console.error("Topping không có id:", topping);
          return;
        }

        const group = updated.find((g) => g.id === topping.option_id);
        if (group) {
          // Kiểm tra duplicate
          const exists = group.option_items.some((t) => t.id === topping.id);
          if (!exists) {
            console.log(`Thêm topping ${topping.option_item_name} (id: ${topping.id}) vào group ${group.option_name}`);
            group.option_items.push(topping);
          } else {
            console.warn(`Topping ${topping.option_item_name} (id: ${topping.id}) đã tồn tại, bỏ qua`);
          }
        } else {
          console.warn(`Không tìm thấy group ${topping.option_id} cho topping ${topping.option_item_name}`);
        }
      });

      return updated;
    });

    setBulkOpen(false);
  };

  return (
    <>
      {/* === NÚT THÊM === */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        <Dialog.Root open={addOpen} onOpenChange={setAddOpen}>
          <Dialog.Trigger asChild>
            <Button color="cyan" variant="soft">+ Nhóm topping</Button>
          </Dialog.Trigger>
          <AddOptionDialog
            onSuccess={(newOpt) => {
              newOpt.option_items = [];
              setOption((prev) => [...prev, newOpt]);
              setAddOpen(false);
            }}
          />
        </Dialog.Root>

        {/* NÚT THÊM NHIỀU TOPPING */}
        <Dialog.Root open={bulkOpen} onOpenChange={setBulkOpen}>
          <Dialog.Trigger asChild>
            <Button color="violet" variant="soft">+ Nhiều topping</Button>
          </Dialog.Trigger>
          <BulkAddToppingDialog
            optionGroups={option}
            onSuccess={handleBulkSuccess}
            onClose={() => setBulkOpen(false)}
          />
        </Dialog.Root>
      </div>

      {/* === DANH SÁCH NHÓM === */}
      {option.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888", padding: "40px" }}>
          Chưa có nhóm topping nào.
        </p>
      ) : (
        option.map((opt) => (
          <div key={opt.id} style={{ marginBottom: "40px" }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: "12px" 
            }}>
              <h3 style={{ fontWeight: 600, fontSize: "18px", color: "#2c3e50", margin: 0 }}>
                {opt.option_name}
              </h3>
              
              <Button 
                size="1" 
                color="red" 
                variant="soft" 
                onClick={() => handleDeleteGroup(opt.id)}
              >
                Xóa nhóm
              </Button>
            </div>

            {opt.option_items?.length === 0 ? (
              <p style={{ color: "#888", fontStyle: "italic", padding: "12px" }}>
                Chưa có topping nào trong nhóm này
              </p>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                {opt.option_items.map((item) => (
                  <CardContent
                    key={item.id}
                    item={item}
                    value="option_item"
                    handleOpenDialog={() => setEditItem(item)}
                    handleDelete={() => handleDeleteTopping(item.id, opt.id)}
                    handleChangeStatus={async (checked) => {
                      const updated = { ...item, status: checked };
                      try {
                        const res = await fetch(`${baseURL}/api/merchant/updateOptionItem/${item.id}`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            authorization: localStorage.getItem("token"),
                          },
                          body: JSON.stringify({
                            newOptionItem: updated,
                            merchant_id: JSON.parse(localStorage.getItem("merchant")).id,
                          }),
                        });
                        if (!res.ok) throw new Error();
                        const { opit } = await res.json();

                        setOption((prev) =>
                          prev.map((op) =>
                            op.id === opt.id
                              ? {
                                ...op,
                                option_items: op.option_items.map((i) =>
                                  i.id === opit.id ? opit : i
                                ),
                              }
                              : op
                          )
                        );
                      } catch {
                        alert("Cập nhật thất bại");
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ))
      )}

      {/* === DIALOG SỬA TOPPING === */}
      {editItem && (
        <Dialog.Root open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
          <EditOptionItemDialog
            item={editItem}
            optionGroups={option}
            onClose={() => setEditItem(null)}
            onUpdate={(updated) => {
              setOption((prev) => {
                const oldGroupId = editItem.option_id;
                const newGroupId = updated.option_id;

                return prev.map((group) => {
                  if (group.id === oldGroupId) {
                    return {
                      ...group,
                      option_items: group.option_items.filter((i) => i.id !== updated.id),
                    };
                  }
                  if (group.id === newGroupId) {
                    const exists = group.option_items.some((i) => i.id === updated.id);
                    return {
                      ...group,
                      option_items: exists
                        ? group.option_items.map((i) => (i.id === updated.id ? updated : i))
                        : [...group.option_items, updated],
                    };
                  }
                  return group;
                });
              });
              setEditItem(null);
            }}
          />
        </Dialog.Root>
      )}
    </>
  );
}