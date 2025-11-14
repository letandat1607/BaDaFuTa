import { Link } from "react-router-dom";

export default function EmptyCart({ merchantId }) {
  return (
    <>
      <style jsx>{`
        .empty {
          text-align: center;
          padding: 80px 20px;
          color: #6b7280;
          font-size: 18px;
        }
        .empty a {
          color: #4f46e5;
          text-decoration: underline;
        }
      `}</style>

      <div className="empty">
        Giỏ hàng trống.<br />
        <Link to={`/customer/merchant/${merchantId}`}>Quay lại chọn món</Link>
      </div>
    </>
  );
}