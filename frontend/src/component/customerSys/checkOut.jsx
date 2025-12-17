import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CheckoutForm from "./commonCustomer/checkOutForm";
import OrderSummary from "./commonCustomer/orderSummary";

export default function Checkout() {
  const { merchantId } = useParams();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const merchantCart = allCart.filter(item => item.merchant_id === merchantId);
    if (merchantCart.length === 0) {
      navigate(`/customer/merchant/cart/${merchantId}`);
      return;
    }
    setCartItems(merchantCart);
    setLoading(false);
  }, [merchantId, navigate]);

  if (loading) return <div style={{ textAlign: "center", padding: "60px" }} data-cy="checkout-loading">Đang tải...</div>;

  return (
    <>
      <style jsx>{`
        .checkout-page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 24px 16px;
          font-family: 'Segoe UI', sans-serif;
          background: #f9fafb;
          min-height: 100vh;
          padding-top: 90px;
        }
        .checkout-title {
          text-align: center;
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 24px;
        }
        .checkout-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        @media (max-width: 768px) {
          .checkout-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="checkout-page" data-cy="checkout-page" data-testid="checkout-page">
        <h1 className="checkout-title" data-cy="checkout-title">Thanh toán</h1>
        <div className="checkout-grid" data-cy="checkout-grid" data-testid="checkout-grid">
          <CheckoutForm cartItems={cartItems} merchantId={merchantId} />
          <OrderSummary items={cartItems} />
        </div>
      </div>
    </>
  );
}