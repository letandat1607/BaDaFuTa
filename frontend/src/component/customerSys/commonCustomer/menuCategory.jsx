import MenuItem from "./menuItem";

export default function MenuCategory({ category }) {
  return (
    <>
      <style jsx>{`
        .category {
          margin-bottom: 40px;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .category-header {
          background: #4f46e5;
          color: white;
          padding: 16px 20px;
          font-size: 20px;
          font-weight: 600;
        }
        .item-list {
          padding: 0;
          list-style: none;
        }
        .no-items {
          text-align: center;
          padding: 40px 20px;
          color: #9ca3af;
          font-style: italic;
        }
      `}</style>

      <div className="category">
        <div className="category-header">{category.category_name}</div>
        {category.menu_items && category.menu_items.length > 0 ? (
          <ul className="item-list">
            {category.menu_items.map((item) => (
              <MenuItem key={item.id} item={item} merchantId={category.merchant_id} />
            ))}
          </ul>
        ) : (
          <div className="no-items">Chưa có món trong danh mục này.</div>
        )}
      </div>
    </>
  );
}