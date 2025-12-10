import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MenuCategory from "./commonCustomer/menuCategory";

export default function MerchantMenu() {
  const { id } = useParams(); // merchant_id
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // Load menu
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/merchant/getMenuClient/${id}`);
        if (!response.ok) throw new Error("Không thể tải menu");
        const data = await response.json();
        setMenuData(data.categories || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [id]);

  // Cập nhật số lượng giỏ hàng theo merchant
  useEffect(() => {
    const updateCartCount = () => {
      const allCart = JSON.parse(localStorage.getItem("cart") || "[]");
      // const count = allCart.filter(item => item.merchant_id === id);
      // setCartCount(count);
    };

    updateCartCount();
    // Lắng nghe thay đổi localStorage từ các tab khác
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, [id]);

  return (
    <>
      <style jsx>{`
        .menu-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px 16px;
          font-family: 'Segoe UI', sans-serif;
          background: #f9fafb;
          min-height: 100vh;
          padding-top: 80px;
          padding-bottom: 100px; /* bù cho nút giỏ hàng */
          position: relative;
        }
        .menu-title {
          text-align: center;
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 32px;
        }
        .loading, .error, .no-items {
          text-align: center;
          padding: 60px 20px;
          font-size: 18px;
          color: #6b7280;
        }
        .error { color: #dc2626; }

        /* ===== NÚT GIỎ HÀNG CỐ ĐỊNH ===== */
        .cart-fab {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #ef4444;
          color: white;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
          text-decoration: none;
          font-weight: 600;
          font-size: 13px;
          transition: all 0.3s ease;
          z-index: 900;
        }
        .cart-fab:hover {
          background: #dc2626;
          transform: scale(1.1);
          box-shadow: 0 12px 24px rgba(239, 68, 68, 0.4);
        }
        .cart-icon {
          font-size: 24px;
          margin-bottom: 2px;
        }
        .cart-count {
          position: absolute;
          top: -6px;
          right: -6px;
          background: #fbbf24;
          color: #1f2937;
          font-size: 12px;
          font-weight: 700;
          min-width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
        }
      `}</style>

      <div className="menu-container">
        <h1 className="menu-title">Thực đơn</h1>

        {loading && <div className="loading">Đang tải menu...</div>}
        {error && <div className="error">Lỗi: {error}</div>}
        {!loading && !error && menuData.length === 0 && (
          <div className="no-items">Không có món ăn nào.</div>
        )}

        {!loading && !error && menuData.map((category) => (
          <MenuCategory key={category.id} category={category} merchantId={id} />
        ))}
          <Link to={`/customer/merchant/cart/${id}`} className="cart-fab">
            <div>Giỏ</div>
          </Link>
      </div>
    </>
  );
}