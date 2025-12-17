// src/components/merchant/MenuTab.jsx
import { useState } from "react";
import { Button, Dialog } from "@radix-ui/themes";
import CardContent from "../commonMerchant/card";
import AddMenuDialog from "./dialogs/addMenuDialog";
import AddCategoryDialog from "./dialogs/addCategoryDialog";
import EditMenuItemDialog from "./dialogs/editMenuItemDialog";
import BulkAddMenuDialog from "./dialogs/bulkAddMenuDialog";

export default function MenuTab({
  categories,
  setCategories,
  uncategorizedItems,
  setUncategorizedItems
}) {
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [bulkAddOpen, setBulkAddOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // === XÓA DANH MỤC ===
  const handleDeleteCategory = async (catId) => {
    if (!confirm("Xóa danh mục này? Tất cả món ăn sẽ bị xóa!")) return;

    try {
      await fetch(`${baseURL}/api/merchant/deleteCategory/${catId}`, {
        method: "POST",
        headers: { authorization: localStorage.getItem("token") },
      });

      setCategories((prev) => prev.filter((cat) => cat.id !== catId));
    } catch (err) {
      alert("Xóa danh mục thất bại!");
    }
  };

  // === XÓA MÓN ===
  const handleDelete = async (item) => {
    if (!confirm(`Xóa món "${item.name_item}"?`)) return;

    try {
      await fetch(`${baseURL}/api/merchant/deleteMenuItem/${item.id}`, {
        method: "POST",
        headers: { authorization: localStorage.getItem("token") },
      });

      // Nếu món có category
      if (item.category_id) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === item.category_id
              ? { ...cat, menu_items: cat.menu_items.filter((m) => m.id !== item.id) }
              : cat
          )
        );
      } else {
        // Nếu món không có category
        setUncategorizedItems((prev) => prev.filter((m) => m.id !== item.id));
      }
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };

  const handleStatusChange = async (checked, item) => {
    const updated = { ...item, status: checked };

    try {
      await fetch(`${baseURL}/api/merchant/updateMenuItem/${item.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          newItem: updated,
          merchant_id: JSON.parse(localStorage.getItem("merchant")).id,
        }),
      });

      // Nếu món có category
      if (item.category_id) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === item.category_id
              ? {
                ...cat,
                menu_items: cat.menu_items.map((m) =>
                  m.id === item.id ? updated : m
                ),
              }
              : cat
          )
        );
      } else {
        // Nếu món không có category
        setUncategorizedItems((prev) =>
          prev.map((m) => (m.id === item.id ? updated : m))
        );
      }
    } catch (err) {
      alert("Cập nhật thất bại!");
    }
  };

  return (
    <>
      {/* === NÚT THÊM === */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        <Dialog.Root open={addCategoryOpen} onOpenChange={setAddCategoryOpen}>
          <Dialog.Trigger asChild>
            <Button color="gray" variant="soft">+ Danh mục</Button>
          </Dialog.Trigger>
          <AddCategoryDialog
            onSuccess={(newCat) => setCategories((prev) => [...prev, { ...newCat, menu_items: [] }])}
          />
        </Dialog.Root>

        <Dialog.Root open={addMenuOpen} onOpenChange={setAddMenuOpen}>
          <Dialog.Trigger asChild>
            <Button color="indigo" variant="soft">+ Món</Button>
          </Dialog.Trigger>
          <AddMenuDialog
            categories={categories}
            onSuccess={(newMenu) => {
              if (newMenu.category_id) {
                // Có category - thêm vào categories
                setCategories((prev) =>
                  prev.map((cat) =>
                    cat.id === newMenu.category_id
                      ? { ...cat, menu_items: [...cat.menu_items, newMenu] }
                      : cat
                  )
                );
              } else {
                // Không có category - thêm vào uncategorized
                setUncategorizedItems((prev) => [...prev, newMenu]);
              }
            }}
          />
        </Dialog.Root>

        <Dialog.Root open={bulkAddOpen} onOpenChange={setBulkAddOpen}>
          <Dialog.Trigger asChild>
            <Button color="violet" variant="soft">+ Nhiều món</Button>
          </Dialog.Trigger>
          <BulkAddMenuDialog
            categories={categories}
            onSuccess={(newMenus) => {
              console.log("onSuccess nhận được:", newMenus);

              const categorizedMenus = [];
              const uncategorizedMenus = [];

              // Phân loại món
              newMenus.forEach((menu) => {
                if (!menu.id) {
                  console.error("Menu không có id:", menu);
                  return;
                }

                if (menu.category_id) {
                  categorizedMenus.push(menu);
                } else {
                  uncategorizedMenus.push(menu);
                }
              });

              // Cập nhật categories nếu có món có category
              if (categorizedMenus.length > 0) {
                setCategories((prev) => {
                  const updated = prev.map(cat => ({
                    ...cat,
                    menu_items: [...cat.menu_items]
                  }));

                  categorizedMenus.forEach((menu) => {
                    const cat = updated.find((c) => c.id === menu.category_id);
                    if (cat) {
                      const exists = cat.menu_items.some((m) => m.id === menu.id);
                      if (!exists) {
                        console.log(`Thêm món ${menu.name_item} (id: ${menu.id}) vào category ${cat.category_name}`);
                        cat.menu_items.push(menu);
                      } else {
                        console.warn(`Món ${menu.name_item} (id: ${menu.id}) đã tồn tại, bỏ qua`);
                      }
                    } else {
                      console.warn(`Không tìm thấy category ${menu.category_id} cho món ${menu.name_item}`);
                    }
                  });

                  return updated;
                });
              }

              // Cập nhật uncategorized items nếu có món không có category
              if (uncategorizedMenus.length > 0) {
                setUncategorizedItems((prev) => {
                  const updated = [...prev];

                  uncategorizedMenus.forEach((menu) => {
                    const exists = updated.some((m) => m.id === menu.id);
                    if (!exists) {
                      console.log(`Thêm món ${menu.name_item} (id: ${menu.id}) vào uncategorized`);
                      updated.push(menu);
                    } else {
                      console.warn(`Món ${menu.name_item} (id: ${menu.id}) đã tồn tại trong uncategorized, bỏ qua`);
                    }
                  });

                  return updated;
                });
              }
            }}
            onClose={() => setBulkAddOpen(false)}
          />
        </Dialog.Root>
      </div>

      {/* === DANH SÁCH === */}
      {categories.length === 0 && uncategorizedItems.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888", padding: "40px" }}>
          Chưa có danh mục và món ăn nào.
        </p>
      ) : (
        <>
          {categories.map((cat) => (
            <div key={cat.id} style={{ marginBottom: "40px" }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px"
              }}>
                <h3 style={{ fontWeight: 600, fontSize: "18px", color: "#2c3e50" }}>
                  {cat.category_name}
                  <span style={{
                    fontSize: "14px",
                    color: "#888",
                    fontWeight: 400,
                    marginLeft: "8px"
                  }}>
                    ({cat.menu_items.length} món)
                  </span>
                </h3>
                <Button
                  size="1"
                  color="red"
                  variant="soft"
                  onClick={() => handleDeleteCategory(cat.id)}
                >
                  Xóa danh mục
                </Button>
              </div>

              {cat.menu_items.length === 0 ? (
                <p style={{ color: "#888", fontStyle: "italic", padding: "12px" }}>
                  Chưa có món ăn nào trong danh mục này
                </p>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                  {cat.menu_items.map((item) => (
                    <CardContent
                      key={item.id}
                      item={item}
                      value="menu"
                      handleOpenDialog={() => setEditItem(item)}
                      handleDelete={() => handleDelete(item)}
                      handleChangeStatus={handleStatusChange}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}

          {uncategorizedItems.length > 0 && (
            <div style={{ marginBottom: "40px" }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px"
              }}>
                <h3 style={{
                  fontWeight: 600,
                  fontSize: "18px",
                  color: "#e74c3c",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  ⚠️ Chưa phân loại
                  <span style={{
                    fontSize: "14px",
                    color: "#888",
                    fontWeight: 400
                  }}>
                    ({uncategorizedItems.length} món)
                  </span>
                </h3>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                {uncategorizedItems.map((item) => (
                  <CardContent
                    key={item.id}
                    item={item}
                    value="menu"
                    handleOpenDialog={() => setEditItem(item)}
                    handleDelete={() => handleDelete(item)}
                    handleChangeStatus={handleStatusChange}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* === DIALOG SỬA MÓN === */}
      {editItem && (
        <Dialog.Root open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
          <EditMenuItemDialog
            item={editItem}
            categories={categories}
            onClose={() => setEditItem(null)}
            onUpdate={(updated) => {
              const oldCategoryId = editItem.category_id;
              const newCategoryId = updated.category_id;

              if (!oldCategoryId && newCategoryId) {
                setUncategorizedItems((prev) => prev.filter((m) => m.id !== updated.id));
                setCategories((prev) =>
                  prev.map((cat) => {
                    if (cat.id === newCategoryId) {
                      return {
                        ...cat,
                        menu_items: [...cat.menu_items, updated],
                      };
                    }
                    return cat;
                  })
                );
              } else if (oldCategoryId && !newCategoryId) {
                setCategories((prev) =>
                  prev.map((cat) => {
                    if (cat.id === oldCategoryId) {
                      return {
                        ...cat,
                        menu_items: cat.menu_items.filter((m) => m.id !== updated.id),
                      };
                    }
                    return cat;
                  })
                );
                setUncategorizedItems((prev) => [...prev, updated]);
              } else if (!oldCategoryId && !newCategoryId) {
                setUncategorizedItems((prev) =>
                  prev.map((m) => (m.id === updated.id ? updated : m))
                );
              } else {
                setCategories((prev) =>
                  prev.map((cat) => {
                    if (cat.id === oldCategoryId) {
                      return {
                        ...cat,
                        menu_items: cat.menu_items.filter((m) => m.id !== updated.id),
                      };
                    }
                    if (cat.id === newCategoryId) {
                      const exists = cat.menu_items.some((m) => m.id === updated.id);
                      return {
                        ...cat,
                        menu_items: exists
                          ? cat.menu_items.map((m) => (m.id === updated.id ? updated : m))
                          : [...cat.menu_items, updated],
                      };
                    }
                    return cat;
                  })
                );
              }
              setEditItem(null);
            }}
          />
        </Dialog.Root>
      )}
    </>
  );
}