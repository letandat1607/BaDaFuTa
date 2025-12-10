// frontend/src/pages/customer/OrderHistory.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";

let socket;

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    // LẤY DANH SÁCH ĐƠN HÀNG
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/order/getUserOrders`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: token,
                    }
                });
                if (!res.ok) throw new Error("Không thể lấy đơn hàng");
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // WEBSOCKET: CẬP NHẬT TRẠNG THÁI REAL-TIME
    useEffect(() => {
        if (!user?.id) return;

        socket = io("http://localhost:3000", {
            query: { userId: user.id },
            transports: ["websocket"],
        });

        socket.on("orderUpdated", (data) => {
            setOrders(prev =>
                prev.map(order =>
                    order.id === data.orderId
                        ? { ...order, status: data.status, updated_at: data.updated_at }
                        : order
                )
            );
        });

        socket.on("orders", (orders) => {
            console.log("Received orders:", orders);
            setOrders(orders);
        })

        return () => socket.disconnect();
    }, [user.id]);

    // TRẠNG THÁI
    const getStatusText = (status) => {
        const map = {
            waiting: "Đang chờ",
            accepted: "Đã xác nhận",
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("vi-VN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    if (loading) return <div className="text-center py-10">Đang tải...</div>;
    if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

    return (
        <>
            <style jsx>{`
        .history-page {
          max-width: 900px;
          margin: 0 auto;
          padding: 24px 16px;
          font-family: 'Segoe UI', sans-serif;
          background: #f9fafb;
          min-height: 100vh;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .title {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
        }
        .empty {
          text-align: center;
          padding: 60px 20px;
          color: #6b7280;
          font-size: 18px;
        }
        .order-card {
          background: white;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          transition: all 0.2s;
        }
        .order-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }
        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        .order-id {
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }
        .order-date {
          font-size: 13px;
          color: #6b7280;
        }
        .order-body {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .items-preview {
          flex: 1;
          font-size: 15px;
          color: #374151;
        }
        .item-count {
          font-weight: 600;
        }
        .total-price {
          font-weight: 700;
          color: #dc2626;
          font-size: 18px;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 999px;
          font-weight: 600;
          font-size: 13px;
        }
        .view-btn {
          margin-top: 12px;
          text-align: right;
        }
        .view-link {
          color: #4f46e5;
          font-weight: 500;
          text-decoration: none;
          font-size: 14px;
        }
        .view-link:hover {
          text-decoration: underline;
        }
      `}</style>

            <div className="history-page">
                <div className="header">
                    <h1 className="title">Lịch sử đơn hàng</h1>
                </div>

                {orders.length === 0 ? (
                    <div className="empty">
                        Bạn chưa có đơn hàng nào.
                        <br />
                        <Link to="/customer" style={{ color: "#4f46e5", textDecoration: "none" }}>
                            Bắt đầu mua sắm ngay!
                        </Link>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <div>
                                    <div className="order-id">Mã: {order.id.slice(0, 8)}...</div>
                                    <div className="order-date">{formatDate(order.created_at)}</div>
                                </div>
                                <div className={`status-badge ${getStatusColor(order.status)}`}>
                                    {getStatusText(order.status)}
                                </div>
                            </div>

                            <div className="order-body">
                                <div className="items-preview">
                                    <span className="item-count">
                                        {order.order_items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0)} món
                                    </span>
                                    {" • "}{" "}
                                    {order.order_items?.[0]?.menu_item_name || "Món ăn"}
                                    {order.order_items?.length > 1 && ` +${order.order_items.length - 1} món khác`}
                                </div>
                                <div className="total-price">
                                    {Number(order.total_amount).toLocaleString("vi-VN")}₫
                                </div>
                            </div>

                            <div className="view-btn">
                                <Link to={`/customer/order/${order.id}`} className="view-link">
                                    Xem chi tiết
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}