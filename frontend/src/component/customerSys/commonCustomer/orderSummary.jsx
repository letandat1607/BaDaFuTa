import CheckoutItem from "./checkOutItem";

export default function OrderSummary({ items }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 15000;
  const total = subtotal + deliveryFee;

  return (
    <>
      <style jsx>{`
        .summary-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          height: fit-content;
        }
        .summary-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #1f2937;
        }
        .item-list { margin-bottom: 16px; }
        .price-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 15px;
        }
        .total-row {
          font-weight: 700;
          font-size: 18px;
          color: #1f2937;
          border-top: 1px solid #e5e7eb;
          padding-top: 12px;
          margin-top: 12px;
        }
      `}</style>

      <div className="summary-card" data-cy="order-summary" data-testid="order-summary">
        <h3 className="summary-title" data-cy="summary-title">Tóm tắt đơn hàng</h3>
        <div className="item-list" data-cy="items-list">
          {items.map(item => (
            <CheckoutItem key={item.id} item={item} />
          ))}
        </div>

        <div className="price-row" data-cy="subtotal-row">
          <span>Tạm tính</span>
          <span>{subtotal.toLocaleString("vi-VN")}₫</span>
        </div>
        <div className="price-row" data-cy="delivery-fee-row">
          <span>Phí giao hàng</span>
          <span>{deliveryFee.toLocaleString("vi-VN")}₫</span>
        </div>

        <div className="total-row" data-cy="total-row">
          <span>Tổng cộng</span>
          <span>{total.toLocaleString("vi-VN")} ₫</span>
        </div>
      </div>
    </>
  );
}