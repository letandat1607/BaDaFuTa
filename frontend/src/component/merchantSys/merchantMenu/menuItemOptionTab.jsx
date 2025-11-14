// src/components/merchant/MenuItemOptionTab.jsx
import CardContent from "../commonMerchant/card";

export default function MenuItemOptionTab({ menuItemOption, onOpenLinkDialog }) {
  return (
    <div>
      {menuItemOption.length > 0 ? (
        menuItemOption.map((menuItem) => (
          <CardContent
            key={menuItem.id}
            item={menuItem}
            value="menu_item_option"
            handleOpenDialog={() => onOpenLinkDialog(menuItem)}
          />
        ))
      ) : (
        <p style={{ padding: "8px", color: "#666" }}>Chưa có liên kết nào.</p>
      )}
    </div>
  );
}