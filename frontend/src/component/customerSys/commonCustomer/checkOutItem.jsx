
export default function CheckoutItem({ item }) {
    return (
      <>
        <style jsx>{`
          .checkout-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px dashed #e5e7eb;
            font-size: 14px;
          }
          .checkout-item:last-child { border: none; }
          .item-name {
            font-weight: 500;
            color: #374151;
          }
          .quantity { color: #6b7280; }
          .price { font-weight: 600; color: #dc2626; }
          .options {
            margin-left: 16px;
            font-size: 13px;
            color: #6b7280;
          }
        `}</style>
  
        <div className="checkout-item" data-cy={`cart-item-${item.id}`}>
          <div>
            <div className="item-name">
              {item.name_item} <span className="quantity">x{item.quantity}</span>
            </div>
            {item.options?.map((opt, i) => (
              <div key={i} className="options">
                + {opt.items.map(it => it.name).join(", ")}
              </div>
            ))}
          </div>
          <div className="price">
            {(item.price * item.quantity).toLocaleString("vi-VN")}₫
          </div>
        </div>
      </>
    );
  }