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

  const [formErrors, setFormErrors] = useState({}); // Thêm state lỗi
  const [position, setPosition] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(""); // Lỗi server hoặc chung
  const [qrUrl, setQrUrl] = useState("");
  const [orderId, setOrderId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  // const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const baseURL = "http://localhost:3000";

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  // Validation
  const validateForm = () => {
    const errors = {};

    if (!form.full_name.trim()) {
      errors.full_name = "Họ tên là bắt buộc";
    }

    if (!form.phone.trim()) {
      errors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^0[2|3|5|7|8|9][0-9]{8}$/.test(form.phone.replace(/\s/g, ""))) {
      errors.phone = "Số điện thoại không hợp lệ (VD: 0901234567)";
    }

    if (!form.delivery_address.trim()) {
      errors.delivery_address = "Vui lòng chọn địa chỉ giao hàng";
    } else if (!form.lat || !form.lng) {
      errors.delivery_address = "Vui lòng chọn chính xác vị trí trên bản đồ";
    }

    return errors;
  };

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const merchantCart = cart.filter((item) => item.merchant_id === merchantId);
    setOrderId(merchantCart.order_id || "");

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
            setForm((prev) => ({
              ...prev,
              delivery_address: "Vui lòng chọn địa chỉ chính xác trên bản đồ",
            }));
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } else {
        setPosition([10.7769, 106.7009]);
      }
    };

    getCurrentLocation();
  }, []);

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
        setPosition(newPos);
        setForm((prev) => ({
          ...prev,
          delivery_address: display_name,
          lat: newLat,
          lng: newLng,
        }));
        setFormErrors((prev) => ({ ...prev, delivery_address: "" })); // Xóa lỗi khi chọn thành công
      } else {
        setError("Không tìm thấy địa chỉ. Vui lòng thử lại!");
      }
    } catch (err) {
      setError("Lỗi tìm kiếm. Vui lòng thử lại.");
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const newPos = [lat, lng];
          setPosition(newPos);
          reverseGeocode(lat, lng, setForm);
          setFormErrors((prev) => ({ ...prev, delivery_address: "" }));
        },
        () => alert("Không thể lấy vị trí hiện tại. Vui lòng kiểm tra quyền truy cập vị trí.")
      );
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    socket = io(baseURL, {
      query: { userId: user.id },
      transports: ["websocket"],
    });

    socket.on("connect", () => console.log("Socket connected :", socket.id));
    socket.on(`paymentQR`, (data) => {
      console.log("Nhận QR Momo:", data);
      setQrUrl(data.payUrl);
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
    setError("");

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setError("Vui lòng kiểm tra lại các trường thông tin!");
      return;
    }

    setFormErrors({});

    setLoading(true);

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const merchantCart = cart.filter((item) => item.merchant_id === merchantId);
    console.log("cart dùng lại đâyyy:", merchantCart);
    const payload = {
      order_id: merchantCart[0].order_id || null,
      merchant_id: merchantId,
      user_id: user.id,
      full_name: form.full_name.trim(),
      phone: form.phone.replace(/\s/g, ""),
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
      const res = await fetch(`${baseURL}/api/order/checkOutOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Tạo đơn hàng thất bại");
      const result = await res.json();
      setOrderId(result.order_id);

      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      let oldCart = cart.filter((item) => item.merchant_id !== merchantId);
      let currentCart = cart
        .filter(item => item.merchant_id === merchantId)
        .map(item => ({
          ...item,
          order_id: result.order_id
        }));
      let newCart = [...oldCart, ...currentCart];
      // console.log("newcart ở đâyy", newCart);
      setOrderId(result.order_id);
      localStorage.setItem("cart", JSON.stringify(newCart));

    } catch (err) {
      setError(err.message || "Lỗi hệ thống khi tạo đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} data-cy="checkout-form-container" data-testid="checkout-form-container">
      <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "20px" }} data-cy="delivery-info-title">
        Thông tin giao hàng
      </h3>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }} data-cy="fullname-field">
          <label>Họ tên <span style={{ color: "red" }}>*</span></label>
          <input
            type="text"
            value={form.full_name}
            data-cy="fullname-input"
            data-testid="fullname-input"
            onChange={(e) => {
              setForm({ ...form, full_name: e.target.value });
              setFormErrors((prev) => ({ ...prev, full_name: "" }));
            }}
            style={{ width: "100%", padding: "12px 5px", borderRadius: "8px", border: "1px solid #ddd" }}
          />
          {formErrors.full_name && (
            <p style={{ color: "red", fontSize: "0.875rem", marginTop: "-0.5rem", marginBottom: "0.5rem" }} data-cy="fullname-error">
              {formErrors.full_name}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "16px" }} data-cy="phone-field">
          <label>Số điện thoại <span style={{ color: "red" }}>*</span></label>
          <input
            type="tel"
            value={form.phone}
            data-cy="phone-input"
            data-testid="phone-input"
            onChange={(e) => {
              setForm({ ...form, phone: e.target.value });
              setFormErrors((prev) => ({ ...prev, phone: "" }));
            }}
            style={{ width: "100%", padding: "12px 5px", borderRadius: "8px", border: "1px solid #ddd" }}
          />
          {formErrors.phone && (
            <p style={{ color: "red", fontSize: "0.875rem", marginTop: "-0.5rem", marginBottom: "0.5rem" }} data-cy="phone-error">
              {formErrors.phone}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "12px" }} data-cy="address-search-section">
          <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            <input
              type="text"
              placeholder="Tìm địa chỉ: số nhà, đường, phường, quận..."
              value={searchQuery}
              data-cy="address-search-input"
              data-testid="address-search-input"
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
              data-cy="search-button"
              data-testid="search-button"
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
            data-cy="use-current-location-button"
            data-testid="use-current-location-button"
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

        {/* Bản đồ + Địa chỉ */}
        <div style={{ marginBottom: "16px" }} data-cy="map-section">
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
          }}
            data-cy="leaflet-map-container"
          >
            {position ? (
              <MapContainer center={position} zoom={17} style={{ height: "100%", width: "100%" }} data-testid="leaflet-map">
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
            data-cy="delivery-address-textarea"
            data-testid="delivery-address-textarea"
            onChange={(e) => {
              setForm({ ...form, delivery_address: e.target.value });
              setFormErrors((prev) => ({ ...prev, delivery_address: "" }));
            }}
            placeholder="Bạn có thể chỉnh sửa địa chỉ chi tiết tại đây..."
            rows={3}
            style={{ width: "100%", padding: "12px 5px", borderRadius: "8px", border: "1px solid #ddd", marginTop: "8px" }}
          />

          {formErrors.delivery_address && (
            <p style={{ color: "red", fontSize: "0.875rem", marginTop: "4px" }} data-cy="address-error">
              {formErrors.delivery_address}
            </p>
          )}

          {form.lat && (
            <div style={{ color: "#10b981", fontWeight: "500", marginTop: "8px", fontSize: "14px" }}>
              GPS đã xác định: {form.lat.toFixed(6)}, {form.lng.toFixed(6)} → Drone sẽ bay đúng chỗ!
            </div>
          )}
        </div>

        {/* Ghi chú */}
        <div style={{ marginBottom: "16px" }} data-cy="note-field">
          <label>Ghi chú cho shipper (không bắt buộc)</label>
          <textarea
            value={form.note}
            data-cy="note-textarea"
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder="Ghi chú"
            style={{ width: "100%", padding: "12px 5px", borderRadius: "8px", border: "1px solid #ddd" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }} data-cy="payment-method-section" data-testid="payment-method-section">
          <label>Phương thức thanh toán</label>
          <select
            value={form.method}
            data-cy="payment-method-select"
            data-testid="payment-method-select"
            onChange={(e) => setForm({ ...form, method: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
          >
            <option value="MOMO">Momo</option>
            <option value="COD">Thanh toán khi nhận hàng (COD)</option>
          </select>
        </div>

        {error && <div style={{ color: "#dc2626", marginBottom: "12px", fontWeight: "500" }} data-cy="checkout-form-error">{error}</div>}

        <button
          type="submit"
          disabled={loading || success}
          data-cy="submit-order-button"
          data-testid="submit-order-button"
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
        <div style={{ marginTop: "30px", padding: "24px", background: "#fdf2f8", borderRadius: "12px", textAlign: "center" }} data-cy="momo-qr-section">
          <h4 style={{ color: "#d946ef", marginBottom: "12px" }}>Quét mã QR để thanh toán Momo</h4>
          <p>Mã đơn hàng: <strong data-cy="order-id">{orderId}</strong></p>
          <div style={{ background: "white", padding: "16px", borderRadius: "12px", display: "inline-block" }} data-cy="momo-qr-container">
            <QRCodeSVG data-cy="momo-qr-svg" value={qrUrl} size={220} level="H" includeMargin />
          </div>
          <a
            href={qrUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cy="momo-direct"
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
        <div data-cy="payment-success-message" style={{ marginTop: "20px", padding: "20px", background: "#d4edda", color: "#155724", borderRadius: "12px", textAlign: "center" }}>
          <strong>Thanh toán thành công!</strong> Đơn hàng: <strong>{orderId}</strong>
          <button
            onClick={() => (window.location.href = `/customer/order/${orderId}`)}
            style={{ marginLeft: "12px", padding: "10px 20px", background: "#28a745", color: "white", border: "none", borderRadius: "6px" }}
            data-cy="view-order-button"
          >
            Xem chi tiết đơn hàng
          </button>
        </div>
      )}
    </div>
  );
}