// frontend/src/pages/customer/OrderSuccess.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import io from "socket.io-client";

let socket;

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // === LẤY ĐƠN HÀNG TỪ API ===
  useEffect(() => {
    console.log(token)
    const fetchOrder = async () => {
      try {
      const res = await fetch(`${baseURL}/api/order/getOrder/${orderId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "authorization": `${token}`
          }
        });
        if (!res.ok) throw new Error("Không tìm thấy đơn hàng");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // === WEBSOCKET: NHẬN CẬP NHẬT TỪ NHÀ HÀNG ===
  useEffect(() => {
    if (!user?.id || !orderId) return;

    socket = io(baseURL, {
      query: { userId: user.id },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("WebSocket connected for order:", orderId);
    });

    socket.on("orderUpdated", (data) => {
      if (data.orderId === orderId) {
        setOrder(prev => ({
          ...prev,
          status: data.status || prev.status,
          updated_at: data.updated_at || prev.updated_at
        }));
      }
    });

    socket.on("order", (order) => {
      console.log("Received order:", order);
      setOrder(order);
    })

    return () => socket.disconnect();
  }, [user.id, orderId]);

  // === HIỂN THỊ TRẠNG THÁI ===
  const getStatusText = (status) => {
    const map = {
      waiting: "Đang chờ xác nhận",
      accepted: "Đã chấp nhận",
      preparing: "Đang chuẩn bị",
      delivering: "Đang giao",
      completed: "Hoàn thành",
      cancelled: "Đã hủy"
    };
    return map[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      waiting: "bg-yellow-100 text-yellow-800",
      accepted: "bg-blue-100 text-blue-800",
      preparing: "bg-purple-100 text-purple-800",
      delivering: "bg-indigo-100 text-indigo-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // === BẢO VỆ DỮ LIỆU ===
  const safeOrder = order || {};
  const safeItems = safeOrder.order_items || [];
  const deliveryFee = Number(safeOrder.delivery_fee || 0);
  const totalAmount = Number(safeOrder.total_amount || 0);

  if (loading) return <div className="text-center py-10 text-lg">Đang tải đơn hàng...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
  if (!order) return null;

  return (
    <>
      <style jsx>{`
        .order-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 24px 16px;
          font-family: 'Segoe UI', sans-serif;
          background: #f9fafb;
          min-height: 100vh;
        }
        .order-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          margin-bottom: 24px;
        }
        .order-header {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 24px;
          text-align: center;
        }
        .order-id { font-size: 14px; opacity: 0.9; }
        .order-title { font-size: 28px; font-weight: 700; margin: 8px 0; }
        .status-badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 999px;
          font-weight: 600;
          font-size: 14px;
          margin-top: 8px;
        }
        .section {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
        }
        .section:last-child { border: none; }
        .section-title {
          font-weight: 600; color: #1f2937; margin-bottom: 12px; font-size: 18px;
        }
        .item {
          display: flex; padding: 12px 0; border-bottom: 1px dashed #e5e7eb;
          align-items: center;
        }
        .item:last-child { border: none; }
        .item-img {
          width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 12px;
          flex-shrink: 0;
        }
        .item-info { flex: 1; }
        .item-name { font-weight: 600; color: #111827; }
        .option-tag {
          display: inline-block; background: #e0e7ff; color: #4f46e5;
          font-size: 12px; padding: 2px 6px; border-radius: 4px; margin: 4px 4px 0 0;
        }
        .item-price { color: #dc2626; font-weight: 700; white-space: nowrap; }
        .summary-row {
          display: flex; justify-content: space-between; padding: 8px 0;
          color: #374151;
        }
        .summary-total {
          font-weight: 700; font-size: 18px; color: #111827;
          border-top: 2px solid #e5e7eb; padding-top: 12px; margin-top: 8px;
        }
        .back-btn {
          display: block; margin: 24px auto 0; padding: 12px 32px;
          background: #4f46e5; color: white; border: none; border-radius: 8px;
          font-weight: 600; cursor: pointer; text-align: center; text-decoration: none;
          width: fit-content;
        }
        .back-btn:hover { background: #4338ca; }
      `}</style>

      <div className="order-page">
        <div className="order-card">
          {/* HEADER */}
          <div className="order-header">
            <div className="order-id">Mã đơn: {safeOrder.id || "N/A"}</div>
            <h1 className="order-title">Thanh toán thành công!</h1>
            <div className={`status-badge ${getStatusColor(safeOrder.status)}`}>
              {getStatusText(safeOrder.status)}
            </div>
          </div>

          {/* THÔNG TIN GIAO HÀNG */}
          <div className="section">
            <h3 className="section-title">Thông tin giao hàng</h3>
            <div><strong>{safeOrder.full_name || "Khách"}</strong> • {safeOrder.phone || "N/A"}</div>
            <div>{safeOrder.delivery_address || "Không có địa chỉ"}</div>
            {safeOrder.note && <div><em>Ghi chú: {safeOrder.note}</em></div>}
          </div>

          {/* DANH SÁCH MÓN */}
          <div className="section">
            <h3 className="section-title">Chi tiết đơn hàng</h3>
            {safeItems.length === 0 ? (
              <div className="text-gray-500 text-center py-4">Không có món ăn</div>
            ) : (
              safeItems.map((item) => {
                const qty = Number(item.quantity || 1);
                const price = Number(item.price || 0);
                const total = price * qty;

                return (
                  <div key={item.id} className="item">
                    <div className="item-info">
                      <div className="item-name">
                        {qty} × {item.menu_item_name || "Món ăn"}
                      </div>
                      {(item.options || []).map((opt, i) => (
                        <span key={i} className="option-tag">
                          {opt.option_item_name || "Tùy chọn"}
                          {opt.price > 0 ? ` +${Number(opt.price).toLocaleString()}₫` : ""}
                        </span>
                      ))}
                    </div>
                    <div className="item-price">
                      {total.toLocaleString("vi-VN")}₫
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* TỔNG TIỀN */}
          <div className="section">
            <h3 className="section-title">Tổng cộng</h3>
            <div className="summary-row">
              <span>Tiền món</span>
              <span>{(totalAmount - deliveryFee).toLocaleString("vi-VN")}₫</span>
            </div>
            <div className="summary-row">
              <span>Phí giao hàng</span>
              <span>{deliveryFee.toLocaleString("vi-VN")}₫</span>
            </div>
            <div className="summary-row summary-total">
              <span>Tổng thanh toán</span>
              <span>{totalAmount.toLocaleString("vi-VN")}₫</span>
            </div>
          </div>
        </div>

        <Link to="/customer/merchants" className="back-btn">
          Về trang chủ
        </Link>
      </div>
    </>
  );
}