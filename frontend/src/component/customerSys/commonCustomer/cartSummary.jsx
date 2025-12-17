import { Link } from "react-router-dom";

export default function CartSummary({ items, merchantId }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <style jsx>{`
        .summary {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          text-align: right;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 16px;
        }
        .checkout-btn {
          background: #10b981;
          color: white;
          font-weight: 600;
          padding: 14px 32px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .checkout-btn:hover {
          background: #059669;
          transform: translateY(-1px);
        }
      `}</style>

      <div className="summary" data-cy="cart-summary">
        <div className="total-row">
          <span>Tổng cộng:</span>
          <span data-cy="cart-total-price">{total.toLocaleString("vi-VN")}₫</span>
        </div>
        <Link to={`/customer/checkout/${merchantId}`}>
          <button className="checkout-btn" data-cy="checkout-button">Tiến hành thanh toán</button>
        </Link>
      </div>
    </>
  );
}