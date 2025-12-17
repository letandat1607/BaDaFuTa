// src/components/merchant/MerchantMenu.jsx
import { useState, useEffect, useCallback } from "react";
import { Button, Theme } from "@radix-ui/themes";
import MenuTab from "./merchantMenu/menuTab";
import OptionItemTab from "./merchantMenu/optionItemTab";
import MenuItemOptionTab from "./merchantMenu/menuItemOptionTab";
import LinkOptionDialog from "./merchantMenu/dialogs/linkOptionDialog";

export default function MerchantMenu() {
  const [categories, setCategories] = useState(null);
  const [uncategorizedItems, setUncategorizedItems] = useState([]); // ← THÊM STATE MỚI
  const [option, setOption] = useState([]);
  const [menuItemOption, setMenuItemOption] = useState([]);
  const [tab, setTab] = useState("menu");

  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [selectedOptionGroups, setSelectedOptionGroups] = useState([]);

  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const getMerchantMenu = async () => {
      try {
        const merchant = JSON.parse(localStorage.getItem("merchant"));
        if (!merchant) throw new Error("Merchant không hợp lệ");

        const [resMenu, resUncategorized, resOption, resMenuItemOption] = await Promise.all([
          fetch(`${baseURL}/api/merchant/getMenuClient/${merchant.id}`, {
            headers: { authorization: localStorage.getItem("token") },
          }),
          fetch(`${baseURL}/api/merchant/getMenuItemNoneCategory/${merchant.id}`, {
            headers: { authorization: localStorage.getItem("token") },
          }),
          fetch(`${baseURL}/api/merchant/getOption/${merchant.id}`, {
            headers: { authorization: localStorage.getItem("token") },
          }),
          fetch(`${baseURL}/api/merchant/getMenuItemOption/${merchant.id}`, {
            headers: { authorization: localStorage.getItem("token") },
          }),
        ]);

        if (!resMenu.ok || !resUncategorized.ok || !resOption.ok || !resMenuItemOption.ok) {
          throw new Error("Lỗi server");
        }

        const { categories: catData } = await resMenu.json();
        const { menuItems: uncatData } = await resUncategorized.json();
        const { option: optionData } = await resOption.json();
        const { menuItemOption: mioData } = await resMenuItemOption.json();

        console.log("Categories:", catData);
        console.log("Uncategorized Items:", uncatData);

        setCategories(catData || []);
        setUncategorizedItems(uncatData || []); // ← SET UNCATEGORIZED ITEMS
        setOption(optionData || []);
        setMenuItemOption(mioData || []);
      } catch (err) {
        console.error("Lỗi fetch:", err);
        alert("Không thể tải dữ liệu!");
      }
    };

    getMerchantMenu();
  }, []);

  // === TOGGLE LIÊN KẾT ===
  const toggleOptionGroup = useCallback(
    async (optionId) => {
      if (!selectedMenuItem) return;

      const isChecked = selectedOptionGroups.includes(optionId);
      const newGroups = isChecked
        ? selectedOptionGroups.filter((id) => id !== optionId)
        : [...selectedOptionGroups, optionId];

      // Cập nhật UI ngay
      setSelectedOptionGroups(newGroups);
      setMenuItemOption((prev) =>
        prev.map((item) =>
          item.id === selectedMenuItem.id
            ? {
                ...item,
                options: isChecked
                  ? item.options.filter((o) => o.id !== optionId)
                  : [
                      ...item.options,
                      option.find((o) => o.id === optionId),
                    ].filter(Boolean),
              }
            : item
        )
      );

      try {
        const body = { menuItemId: selectedMenuItem.id, optionId };
        const url = isChecked
          ? `${baseURL}/api/merchant/deleteMenuItemOption`
          : `${baseURL}/api/merchant/createMenuItemOption`;

        const res = await fetch(url, {
          method: isChecked ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error("Lỗi server");
      } catch (err) {
        alert("Cập nhật thất bại! Đang hoàn tác...");
        // Rollback
        setSelectedOptionGroups(selectedOptionGroups);
        setMenuItemOption((prev) =>
          prev.map((item) =>
            item.id === selectedMenuItem.id
              ? { ...item, options: selectedMenuItem.options }
              : item
          )
        );
      }
    },
    [selectedMenuItem, selectedOptionGroups, option]
  );

  const handleOpenLinkDialog = (menuItem) => {
    setSelectedMenuItem(menuItem);
    setSelectedOptionGroups(menuItem.options?.map((o) => o.id) || []);
    setLinkDialogOpen(true);
  };

  const handleCloseLinkDialog = () => {
    setLinkDialogOpen(false);
    setSelectedMenuItem(null);
    setSelectedOptionGroups([]);
  };

  // === CHỜ ĐỢI DỮ LIỆU ===
  if (categories === null || option === null || menuItemOption === null) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        fontSize: "18px",
        color: "#666"
      }}>
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <Theme>
      <main style={{ marginTop: "2%" }}>
        {/* === TAB NAV === */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            margin: "10px 10%",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <Button
            name="menu"
            onClick={() => setTab("menu")}
            color="indigo"
            variant={tab === "menu" ? "solid" : "soft"}
          >
            Món
          </Button>
          <Button
            name="option_item"
            onClick={() => setTab("option_item")}
            color="cyan"
            variant={tab === "option_item" ? "solid" : "soft"}
          >
            Topping
          </Button>
          <Button
            name="menu_item_option"
            onClick={() => setTab("menu_item_option")}
            color="orange"
            variant={tab === "menu_item_option" ? "solid" : "soft"}
          >
            Liên kết món
          </Button>
        </div>

        {/* === NỘI DUNG TAB === */}
        <div
          style={{
            margin: "10px 10%",
            border: "1px solid #ddd",
            borderRadius: "25px",
            padding: "2%",
            backgroundColor: "#fafafa",
          }}
        >
          {tab === "menu" && (
            <MenuTab 
              categories={categories} 
              setCategories={setCategories}
              uncategorizedItems={uncategorizedItems}
              setUncategorizedItems={setUncategorizedItems}
            />
          )}
          {tab === "option_item" && (
            <OptionItemTab option={option} setOption={setOption} />
          )}
          {tab === "menu_item_option" && (
            <MenuItemOptionTab
              menuItemOption={menuItemOption}
              onOpenLinkDialog={handleOpenLinkDialog}
            />
          )}
        </div>

        {/* === DIALOG LIÊN KẾT === */}
        <LinkOptionDialog
          isOpen={linkDialogOpen}
          onClose={handleCloseLinkDialog}
          menuItem={selectedMenuItem}
          optionGroups={option}
          selectedOptionGroups={selectedOptionGroups}
          onToggleOptionGroup={toggleOptionGroup}
        />
      </main>
    </Theme>
  );
}