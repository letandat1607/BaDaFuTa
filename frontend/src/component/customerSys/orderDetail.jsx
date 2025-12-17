// frontend/src/pages/customer/OrderDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import io from "socket.io-client";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix icon Leaflet
delete L.Icon.Default.prototype._getIconUrlーパ
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const droneIcon = L.divIcon({
  html: `<div style="font-size: 36px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">✈️</div>`,
  className: "",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

let socket;

export default function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [droneLocation, setDroneLocation] = useState(null);
  const [hasArrived, setHasArrived] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false); // loading khi xác nhận

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // === LẤY CHI TIẾT ĐƠN HÀNG ===
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${baseURL}/api/order/getOrder/${orderId}`, {
          headers: { authorization: `${token}` },
        });
        if (!res.ok) throw new Error("Không tìm thấy đơn hàng");
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err.message || "Lỗi tải đơn hàng");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, token]);

  // === SOCKET.IO ===
  useEffect(() => {
    if (!user?.id || !orderId) return;

    socket = io(baseURL, {
      query: { userId: user.id },
      transports: ["websocket"],
    });

    socket.on("orderUpdated", (data) => {
      if (data.orderId === orderId) {
        setOrder(prev => ({ ...prev, ...data }));
        if (data.location) setDroneLocation(data.location);
      }
    });

    socket.on("order", (data) => {
      if (data.order?.id === orderId) {
        setOrder(data.order);
        if (data.location) setDroneLocation(data.location);
      }
    });

    return () => socket.disconnect();
  }, [user.id, orderId]);

  // === ANIMATION DRONE BAY (giữ nguyên như cũ) ===
  useEffect(() => {
    if (order?.status !== "delivering" || !order?.delivery_address?.lat || hasArrived) return;

    let startPos = droneLocation?.lat
      ? { lat: droneLocation.lat, lng: droneLocation.lng }
      : order.merchant_location?.lat
      ? { lat: order.merchant_location.lat, lng: order.merchant_location.lng }
      : { lat: order.delivery_address.lat + 0.008, lng: order.delivery_address.lng + 0.008 };

    const endLat = order.delivery_address.lat;
    const endLng = order.delivery_address.lng;
    const duration = 10000;
    let startTime = performance.now();

    const animate = (timestamp) => {
      const elapsed = timestamp - startTime;
      let progress = Math.min(elapsed / duration, 1);
      const ease = progress * (2 - progress);

      const lat = startPos.lat + (endLat - startPos.lat) * ease;
      const lng = startPos.lng + (endLng - startPos.lng) * ease;

      setDroneLocation({ lat, lng });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setHasArrived(true);
      }
    };

    requestAnimationFrame(animate);
  }, [order?.status, order?.delivery_address, order?.merchant_location, droneLocation?.lat, hasArrived]);

  // === HÀM XÁC NHẬN ĐÃ NHẬN HÀNG ===
  const handleConfirmReceived = async () => {
    if (isConfirming) return;

    setIsConfirming(true);

    try {
      const res = await fetch(`${baseURL}/api/order/updateOrder/${orderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: token || "",
        },
        body: JSON.stringify({
          data: { status: "complete" },
          orderId: orderId,
          location: droneLocation || order.delivery_address, // gửi vị trí cuối cùng
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error("Cập nhật thất bại: " + errorText);
      }

      const updatedOrder = await res.json();
      setOrder(updatedOrder);

      alert("Cảm ơn bạn! Đơn hàng đã được xác nhận hoàn thành");
      
      // Tự động chuyển về lịch sử sau 2 giây (tùy chọn)
      setTimeout(() => {
        window.location.href = "/customer/orders";
      }, 2000);

    } catch (err) {
      console.error("Lỗi xác nhận nhận hàng:", err);
      alert("Có lỗi xảy ra khi xác nhận nhận hàng. Vui lòng thử lại!");
    } finally {
      setIsConfirming(false);
    }
  };

  // === HÀM HIỂN THỊ TRẠNG THÁI ===
  const getStatusText = (status) => {
    const map = {
      waiting: "Đang chờ xác nhận",
      accepted: "Đã chấp nhận",
      preparing: "Đang chuẩn bị",
      delivering: "Đang giao bằng Drone",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
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
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) return <div className="text-center py-20 text-xl">Đang tải đơn hàng...</div>;
  if (error) return <div className="text-center py-20 text-red-600 text-xl">{error}</div>;
  if (!order) return null;

  const safeOrder = order;
  const items = safeOrder.order_items || [];
  const deliveryFee = Number(safeOrder.delivery_fee || 0);
  const totalAmount = Number(safeOrder.total_amount || 0);
  const customerPosition = safeOrder.delivery_address
    ? [safeOrder.delivery_address.lat, safeOrder.delivery_address.lng]
    : null;
  const currentDronePosition = droneLocation
    ? [droneLocation.lat, droneLocation.lng]
    : null;

  return (
    <>
      <style jsx>{`
        /* CSS giữ nguyên đẹp như cũ */
        .detail-page { max-width: 900px; margin: 0 auto; padding: 16px; background: #f9fafb; min-height: 100vh; font-family: 'Segoe UI', sans-serif; }
        .order-card { background: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden; margin-bottom: 24px; }
        .order-header { background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; padding: 28px 24px; text-align: center; }
        .status-badge { display: inline-block; padding: 8px 20px; border-radius: 999px; font-weight: 600; font-size: 15px; margin-top: 10px; }
        .section { padding: 24px; border-bottom: 1px solid #e5e7eb; }
        .section-title { font-weight: 700; font-size: 19px; color: #1f2937; margin-bottom: 16px; }
        .map-container { height: 420px; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.15); margin: 20px 0; }
        .arrived-button {
          display: block; margin: 30px auto; padding: 18px 60px;
          background: #10b981; color: white; border: none; border-radius: 14px;
          font-size: 20px; font-weight: 700; cursor: pointer;
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
          transition: all 0.3s;
        }
        .arrived-button:disabled {
          background: #6ee7b7; cursor: not-allowed; transform: none;
        }
        .arrived-button:hover:not(:disabled) {
          background: #059669; transform: translateY(-3px);
        }
        .back-btn { display: block; margin: 32px auto 0; padding: 14px 40px; background: #4f46e5; color: white; border: none; border-radius: 12px; font-weight: 600; text-decoration: none; text-align: center; width: fit-content; }
      `}</style>

      <div className="detail-page">
        <div className="order-card">
          <div className="order-header">
            <div style={{ fontSize: "15px", opacity: 0.9 }}>Mã đơn hàng</div>
            <div style={{ fontSize: "28px", fontWeight: 700, margin: "8px 0" }}>{safeOrder.id}</div>
            <div className={`status-badge ${getStatusColor(safeOrder.status)}`}>
              {getStatusText(safeOrder.status)}
            </div>
          </div>

          {/* BẢN ĐỒ + NÚT ĐÃ NHẬN HÀNG */}
          {safeOrder.status === "delivering" && customerPosition && (
            <div className="section">
              <h3 className="section-title">Theo dõi Drone giao hàng</h3>
              <div className="map-container">
                <MapContainer center={customerPosition} zoom={15} style={{ height: "100%", width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={customerPosition}>
                    <Popup>Nhà bạn • {safeOrder.delivery_address.full_address}</Popup>
                  </Marker>
                  {currentDronePosition && (
                    <Marker position={currentDronePosition} icon={droneIcon}>
                      <Popup>Drone đang giao đơn của bạn Airplane</Popup>
                    </Marker>
                  )}
                  {currentDronePosition && (
                    <Polyline positions={[currentDronePosition, customerPosition]} color="#4f46e5" weight={5} opacity={0.8} dashArray="12,12" />
                  )}
                </MapContainer>
              </div>

              {/* NÚT ĐÃ NHẬN HÀNG - ĐÃ HOÀN CHỈNH */}
              {hasArrived && (
                <button
                  className="arrived-button"
                  onClick={handleConfirmReceived}
                  disabled={isConfirming || safeOrder.status === "completed"}
                >
                  {isConfirming ? "Đang xác nhận..." : "Đã nhận hàng"}
                </button>
              )}
            </div>
          )}

          {/* Các phần còn lại giữ nguyên đẹp như cũ */}
          <div className="section">
            <h3 className="section-title">Thông tin giao hàng</h3>
            <div><strong>{safeOrder.full_name}</strong> • {safeOrder.phone}</div>
            <div style={{ marginTop: "8px", color: "#374151" }}>
              {safeOrder.delivery_address?.full_address}
            </div>
          </div>

          {/* Danh sách món ăn */}
          <div className="section">
            <h3 className="section-title">Chi tiết món ăn</h3>
            {items.length === 0 ? (
              <div className="text-gray-500">Không có món ăn</div>
            ) : (
              items.map((item) => {
                const qty = Number(item.quantity || 1);
                const price = Number(item.price || 0);
                return (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px dashed #e5e7eb" }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{qty} × {item.menu_item_name || "Món ăn"}</div>
                      {(item.options || []).map((opt, i) => (
                        <span key={i} style={{ display: "inline-block", background: "#e0e7ff", color: "#4f46e5", fontSize: "12px", padding: "2px 8px", borderRadius: "6px", margin: "4px 4px 0 0" }}>
                          {opt.option_item_name} {opt.price > 0 ? `+${Number(opt.price).toLocaleString()}₫` : ""}
                        </span>
                      ))}
                    </div>
                    <div style={{ fontWeight: 700, color: "#dc2626" }}>
                      {(price * qty).toLocaleString("vi-VN")}₫
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Tổng tiền */}
          <div className="section">
            <h3 className="section-title">Thanh toán</h3>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", color: "#374151" }}>
              <span>Tiền món ăn</span>
              <span>{(totalAmount - deliveryFee).toLocaleString("vi-VN")}₫</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", color: "#374151" }}>
              <span>Phí giao hàng (Drone)</span>
              <span>{deliveryFee.toLocaleString("vi-VN")}₫</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0 0", borderTop: "2px solid #e5e7eb", marginTop: "12px", fontSize: "20px", fontWeight: 700, color: "#111827" }}>
              <span>Tổng cộng</span>
              <span>{totalAmount.toLocaleString("vi-VN")}₫</span>
            </div>
          </div>
        </div>

        <Link to="/customer/orders" className="back-btn">
          Quay lại lịch sử đơn hàng
        </Link>
      </div>
    </>
  );
}