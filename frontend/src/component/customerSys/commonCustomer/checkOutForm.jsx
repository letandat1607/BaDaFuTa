// src/components/CheckoutForm.jsx
import { useState, useEffect } from "react";
import io from "socket.io-client";
import { QRCodeSVG } from "qrcode.react";

// Leaflet
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

let socket;

function FlyToLocation({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, 17, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [center, map]);

  return null;
}

function LocationMarker({ position, setPosition, setForm }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      reverseGeocode(lat, lng, setForm);
    },
  });

  return position ? <Marker position={position} /> : null;
}

async function reverseGeocode(lat, lng, setForm) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18`
    );
    const data = await res.json();
    if (data?.display_name) {
      setForm((prev) => ({
        ...prev,
        delivery_address: data.display_name,
        lat,
        lng,
      }));
    }
  } catch (err) {
    console.error("Lỗi reverse geocoding:", err);
  }
}

export default function CheckoutForm({ cartItems, merchantId }) {
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    delivery_address: "",
    note: "",
    method: "MOMO",
    lat: null,
    lng: null,
  });

  const [position, setPosition] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [orderId, setOrderId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const merchantCart = cart.filter((item) => item.merchant_id === merchantId);
    setOrderId(merchantCart.orderId || "");
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            setPosition([lat, lng]);
            reverseGeocode(lat, lng, setForm);
          },
          (err) => {
            console.log("Không lấy được vị trí:", err.message);
            setPosition([10.7769, 106.7009]);
            setForm((prev) => ({ ...prev, delivery_address: "Vui lòng chọn địa chỉ chính xác trên bản đồ" }));
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } else {
        setPosition([10.7769, 106.7009]);
      }
    };

    getCurrentLocation();
  }, []);

  // Xử lý tìm kiếm địa chỉ
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery + ", Việt Nam"
        )}&limit=1&addressdetails=1`
      );
      const data = await res.json();
      if (data && data[0]) {
        const { lat, lon, display_name } = data[0];
        const newLat = parseFloat(lat);
        const newLng = parseFloat(lon);
        const newPos = [newLat, newLng];
        setPosition(newPos); // Kích hoạt FlyToLocation → bản đồ bay mượt
        setForm((prev) => ({
          ...prev,
          delivery_address: display_name,
          lat: newLat,
          lng: newLng,
        }));
      } else {
        setError("Không tìm thấy địa chỉ. Vui lòng thử lại!");
      }
    } catch (err) {
      setError("Lỗi tìm kiếm. Vui lòng thử lại.");
    }
  };

  // Dùng vị trí hiện tại
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const newPos = [lat, lng];
          setPosition(newPos); // Bản đồ sẽ tự động bay về
          reverseGeocode(lat, lng, setForm);
        },
        () => alert("Không thể lấy vị trí hiện tại. Vui lòng kiểm tra quyền truy cập vị trí.")
      );
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    socket = io("http://localhost:3000", {
      query: { userId: user.id },
      transports: ["websocket"],
    });

    socket.on("connect", () => console.log("Socket connected"));
    socket.on("paymentQR", (data) => {
      setQrUrl(data.payUrl);
      setOrderId(data.orderId);
      setPaymentStatus("waiting");
    });
    socket.on("paymentSuccess", (data) => {
      if (data.orderId === orderId) {
        setPaymentStatus("success");
        setSuccess(true);
        const allCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const newCart = allCart.filter((item) => item.merchant_id !== merchantId);
        localStorage.setItem("cart", JSON.stringify(newCart));
      }
    });
    socket.on("paymentFailed", () => {
      setPaymentStatus("failed");
      setError("Thanh toán thất bại");
    });

    return () => socket.disconnect();
  }, [user.id, orderId, merchantId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.phone || !form.lat || !form.lng) {
      setError("Vui lòng nhập đầy đủ thông tin và chọn chính xác địa chỉ giao hàng!");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      merchant_id: merchantId,
      user_id: user.id,
      full_name: form.full_name,
      phone: form.phone,
      method: form.method,
      delivery_address: {
        full_address: form.delivery_address,
        lat: form.lat,
        lng: form.lng,
      },
      delivery_fee: 15000,
      order_items: cartItems.map((item) => ({
        menu_item_id: item.menu_item_id,
        name_item: item.name_item,
        price: item.price,
        quantity: item.quantity,
        image_item: item.image_item,
        note: item.note || "",
        options: item.options || [],
      })),
      total_amount: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + 15000,
    };

    try {
      console.log(payload);
      
      const res = await fetch(`http://localhost:3000/api/order/checkOutOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `${token}`,
        },
        body: JSON.stringify({payload, order_id: orderId || null}),
      });

      if (!res.ok) throw new Error("Tạo đơn hàng thất bại");
      const result = await res.json();
      setOrderId(result.orderId);
      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      cart = cart.filter((item) => item.merchant_id !== merchantId);
      const newCart = {...cart, orderId: result.orderId};
      localStorage.setItem("cart", JSON.stringify(newCart));

    } catch (err) {
      setError(err.message || "Lỗi hệ thống");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
      <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "20px" }}>
        Thông tin giao hàng
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Họ tên & SĐT */}
        <div style={{ marginBottom: "16px" }}>
          <label>Họ tên <span style={{ color: "red" }}>*</span></label>
          <input
            type="text"
            required
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label>Số điện thoại <span style={{ color: "red" }}>*</span></label>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
          />
        </div>

        {/* Thanh tìm kiếm + nút vị trí hiện tại */}
        <div style={{ marginBottom: "12px" }}>
          <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            <input
              type="text"
              placeholder="Tìm địa chỉ: số nhà, đường, phường, quận..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              style={{
                flex: 1,
                padding: "12px 16px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "15px",
              }}
            />
            <button
              type="button"
              onClick={handleSearch}
              style={{
                padding: "0 20px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
              }}
            >
              Tìm
            </button>
          </div>

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            style={{
              width: "100%",
              padding: "10px",
              background: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Dùng vị trí hiện tại của tôi
          </button>
        </div>

        {/* Bản đồ – ĐÃ SỬA: TỰ ĐỘNG BAY VỀ VỊ TRÍ MỚI */}
        <div style={{ marginBottom: "16px" }}>
          <label>Chọn địa chỉ chính xác trên bản đồ <span style={{ color: "red" }}>*</span></label>
          <div style={{
            height: "380px",
            margin: "12px 0",
            borderRadius: "12px",
            overflow: "hidden",
            border: "2px solid #e5e7eb",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            position: "relative",
            zIndex: 1
          }}>
            {position ? (
              <MapContainer center={position} zoom={17} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker position={position} setPosition={setPosition} setForm={setForm} />
                <FlyToLocation center={position} />
              </MapContainer>
            ) : (
              <div style={{
                height: "100%",
                background: "#f9fafb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6b7280",
                fontSize: "16px"
              }}>
                Đang tải bản đồ...
              </div>
            )}
          </div>

          <textarea
            value={form.delivery_address}
            onChange={(e) => setForm({ ...form, delivery_address: e.target.value })}
            placeholder="Bạn có thể chỉnh sửa địa chỉ chi tiết tại đây..."
            rows={3}
            required
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", marginTop: "8px" }}
          />

          {form.lat && (
            <div style={{ color: "#10b981", fontWeight: "500", marginTop: "8px", fontSize: "14px" }}>
              GPS đã xác định: {form.lat.toFixed(6)}, {form.lng.toFixed(6)} → Drone sẽ bay đúng chỗ!
            </div>
          )}
        </div>

        {/* Ghi chú */}
        <div style={{ marginBottom: "16px" }}>
          <label>Ghi chú cho shipper (không bắt buộc)</label>
          <textarea
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder="Ví dụ: Để trước cổng, gọi khi đến..."
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
          />
        </div>

        {/* Phương thức thanh toán */}
        <div style={{ marginBottom: "20px" }}>
          <label>Phương thức thanh toán</label>
          <select
            value={form.method}
            onChange={(e) => setForm({ ...form, method: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
          >
            <option value="MOMO">Momo</option>
            <option value="COD">Thanh toán khi nhận hàng (COD)</option>
          </select>
        </div>

        {error && <div style={{ color: "#dc2626", marginBottom: "12px", fontWeight: "500" }}>{error}</div>}

        <button
          type="submit"
          disabled={loading || success}
          style={{
            width: "100%",
            padding: "16px",
            background: success ? "#6b7280" : "#10b981",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: loading || success ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Đang xử lý..." : success ? "Đơn hàng đã hoàn tất" : "Xác nhận & Thanh toán"}
        </button>
      </form>

      {/* QR Momo */}
      {qrUrl && paymentStatus === "waiting" && (
        <div style={{ marginTop: "30px", padding: "24px", background: "#fdf2f8", borderRadius: "12px", textAlign: "center" }}>
          <h4 style={{ color: "#d946ef", marginBottom: "12px" }}>Quét mã QR để thanh toán Momo</h4>
          <p>Mã đơn hàng: <strong>{orderId}</strong></p>
          <div style={{ background: "white", padding: "16px", borderRadius: "12px", display: "inline-block" }}>
            <QRCodeSVG value={qrUrl} size={220} level="H" includeMargin />
          </div>
          <a
            href={qrUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: "16px",
              padding: "12px 28px",
              background: "#d946ef",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Mở ứng dụng Momo
          </a>
        </div>
      )}

      {paymentStatus === "success" && (
        <div style={{ marginTop: "20px", padding: "20px", background: "#d4edda", color: "#155724", borderRadius: "12px", textAlign: "center" }}>
          <strong>Thanh toán thành công!</strong> Đơn hàng: <strong>{orderId}</strong>
          <button
            onClick={() => (window.location.href = `/customer/order-success/${orderId}`)}
            style={{ marginLeft: "12px", padding: "10px 20px", background: "#28a745", color: "white", border: "none", borderRadius: "6px" }}
          >
            Xem chi tiết đơn hàng
          </button>
        </div>
      )}
    </div>
  );
}