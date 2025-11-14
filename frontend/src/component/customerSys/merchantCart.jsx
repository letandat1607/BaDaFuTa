import { useParams, Link } from "react-router-dom";
import CartItem from "./commonCustomer/cartItem";
import CartSummary from "./commonCustomer/cartSummary";
import EmptyCart from "./commonCustomer/emptyCart";
import { useEffect, useState } from "react";

export default function MerchantCart() {
  const { merchantId } = useParams();
  const [cartItems, setCartItems] = useState([]);

  // Load giỏ hàng theo merchant
  useEffect(() => {
    const allCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const merchantCart = allCart.filter(item => item.merchant_id === merchantId);
    setCartItems(merchantCart);
  }, [merchantId]);

  // Cập nhật giỏ hàng (xóa, thay đổi số lượng)
  const updateCart = (newCart) => {
    const allCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const filtered = allCart.filter(item => item.merchant_id !== merchantId);
    const updated = [...filtered, ...newCart];
    localStorage.setItem("cart", JSON.stringify(updated));
    setCartItems(newCart);
  };

  if (cartItems.length === 0) {
    return <EmptyCart merchantId={merchantId} />;
  }

  return (
    <>
      <style jsx>{`
          .cart-page {
            max-width: 1000px;
            margin: 0 auto;
            padding: 24px 16px;
            font-family: 'Segoe UI', sans-serif;
            background: #f9fafb;
            min-height: 100vh;
            padding-top: 90px;
          }
          .cart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 2px solid #e5e7eb;
          }
          .cart-title {
            font-size: 28px;
            font-weight: 700;
            color: #1f2937;
          }
          .back-link {
            color: #4f46e5;
            text-decoration: none;
            font-weight: 500;
            font-size: 15px;
          }
          .back-link:hover {
            text-decoration: underline;
          }
          .cart-list {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            margin-bottom: 24px;
          }
        `}</style>

      <div className="cart-page">
        <div className="cart-header">
          <h1 className="cart-title">Giỏ hàng</h1>
          <Link to={`/customer/merchant/${merchantId}`} className="back-link">
            ← Tiếp tục mua
          </Link>
        </div>

        <div className="cart-list">
          {cartItems.map((item) => (
            <CartItem
              key={item.menu_item_id}
              item={item}
              onUpdate={(updatedItem) => {
                // DÙNG menu_item_id ĐỂ SO SÁNH
                const newCart = cartItems.map(i =>
                  i.menu_item_id === updatedItem.menu_item_id
                    ? { ...i, quantity: updatedItem.quantity }
                    : i
                );
                updateCart(newCart);
              }}
              onRemove={() => {
                // DÙNG menu_item_id ĐỂ XÓA
                const newCart = cartItems.filter(i => i.menu_item_id !== item.menu_item_id);
                updateCart(newCart);
              }}
            />
          ))}
        </div>

        <CartSummary items={cartItems} merchantId={merchantId} />
      </div>
    </>
  );
}