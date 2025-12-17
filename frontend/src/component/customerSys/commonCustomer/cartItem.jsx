export default function CartItem({ item, onUpdate, onRemove }) {
  const handleQuantity = (delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return onRemove();
    onUpdate({ ...item, quantity: newQty });
  };
  
    return (
      <>
        <style jsx>{`
          .cart-item {
            display: flex;
            padding: 16px 20px;
            border-bottom: 1px solid #e5e7eb;
            transition: background 0.2s;
          }
          .cart-item:hover { background: #f9fafb; }
          .cart-item:last-child { border: none; }
          .item-image {
            width: 70px; height: 70px;
            object-fit: cover;
            border-radius: 8px;
            margin-right: 16px;
            flex-shrink: 0;
          }
          .item-info { flex: 1; }
          .item-name {
            font-weight: 600; font-size: 16px; color: #111827; margin: 0 0 4px;
          }
          .option-tag {
            display: inline-block;
            background: #e0e7ff;
            color: #4f46e5;
            font-size: 12px;
            padding: 2px 6px;
            border-radius: 4px;
            margin-right: 4px;
            margin-top: 4px;
          }
          .item-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 8px;
          }
          .price { font-weight: 700; color: #dc2626; }
          .quantity {
            display: flex; align-items: center; gap: 8px;
          }
          .qty-btn {
            width: 32px; height: 32px;
            border: 1px solid #d1d5db;
            background: white;
            color: #374151;
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
          }
          .qty-btn:hover { background: #f3f4f6; }
          .remove {
            color: #dc2626; cursor: pointer; font-size: 18px;
          }
          .remove:hover { color: #b91c1c; }
        `}</style>
  
        <div className="cart-item" data-cy={`cart-item-${item.menu_item_id}`}>
          <img src={item.image_item?.url} alt={item.name_item} className="item-image" />
          <div className="item-info">
            <h3 className="item-name" data-cy="cart-item-name">{item.name_item}</h3>
            {item.options?.map((opt, i) => (
              <div key={i}>
                {opt.items.map((it, j) => (
                  <span key={j} className="option-tag" data-cy="cart-item-option">
                    {it.name} {it.price > 0 ? `+${it.price.toLocaleString()}₫` : ""}
                  </span>
                ))}
              </div>
            ))}
            <div className="item-footer">
              <span className="price" data-cy="cart-item-total-price">{(item.price * item.quantity).toLocaleString("vi-VN")}₫</span>
              <div className="quantity">
                <button className="qty-btn" onClick={() => handleQuantity(-1)} data-cy="decrease-quantity-button">−</button>
                <span style={{ minWidth: "24px", textAlign: "center" }} data-cy="quantity-display">{item.quantity}</span>
                <button className="qty-btn" onClick={() => handleQuantity(1)} data-cy="increase-quantity-button">+</button>
                <span className="remove" onClick={onRemove} title="Xóa" data-cy="remove-item-button">×</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }