// frontend/src/components/CheckoutForm.jsx
import { useState, useEffect } from "react";
import io from "socket.io-client";
// import { QRCodeSVG } from "qrcode.react"; // ← ĐÚNG RỒI!
import { QRCodeSVG } from "qrcode.react"
let socket;

export default function CheckoutForm({ cartItems, merchantId }) {
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    delivery_address: "",
    note: "",
    method: "MOMO",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [orderId, setOrderId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user?.id) return;

    socket = io("http://localhost:3000", {
      query: { userId: user.id },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("WebSocket connected:", socket.id);
    });

    socket.on("paymentQR", (data) => {
      console.log("QR received:", data);
      setQrUrl(data.payUrl);
      setOrderId(data.orderId);
      setPaymentStatus("waiting");
    });

    socket.on("paymentSuccess", (data) => {
      if (data.orderId === orderId) {
        setPaymentStatus("success");
        const merchantId = data.merchantId;
        if (merchantId) {
          const allCart = JSON.parse(localStorage.getItem("cart") || "[]");
          const updatedCart = allCart.filter(item => item.merchant_id !== merchantId);
          localStorage.setItem("cart", JSON.stringify(updatedCart));
          console.log(`Đã xóa giỏ hàng của merchant: ${merchantId}`);
          setSuccess(true);
        }
      }
    });

    socket.on("paymentFailed", (data) => {
      if (data.orderId === orderId) {
        setPaymentStatus("failed");
        setError(data.error || "Thanh toán thất bại");
      }
    });

    return () => socket.disconnect();
  }, [user.id, orderId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.phone || !form.delivery_address) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setLoading(true);
    setError("");
    setQrUrl("");
    setPaymentStatus("");

    const payload = {
      merchant_id: merchantId,
      user_id: user.id,
      ...form,
      delivery_fee: 15000,
      order_items: cartItems.map(item => ({
        menu_item_id: item.menu_item_id,
        name_item: item.name_item,
        price: item.price,
        quantity: item.quantity,
        image_item: item.image_item,
        note: item.note || "",
        options: item.options || []
      })),
      total_amount: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + 15000,
    };

    try {
      const response = await fetch("http://localhost:3000/api/order/checkOutOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Không thể tạo đơn hàng");

      const result = await response.json();
      setOrderId(result.orderId);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .form-card { background: white; padding: 24px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .form-title { font-size: 20px; font-weight: 600; margin-bottom: 16px; color: #1f2937; }
        .form-group { margin-bottom: 16px; }
        label { display: block; margin-bottom: 6px; font-weight: 500; color: #374151; }
        .required { color: #dc2626; }
        input, textarea, select { width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 15px; }
        input:focus, textarea:focus, select:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); }
        textarea { resize: vertical; min-height: 80px; }
        .error { color: #dc2626; font-size: 14px; margin-top: 8px; }
        .submit-btn { background: #10b981; color: white; width: 100%; padding: 14px; border: none; border-radius: 8px; font-weight: 600; font-size: 16px; cursor: pointer; margin-top: 16px; transition: background 0.2s; }
        .submit-btn:hover { background: #059669; }
        .submit-btn:disabled { background: #9ca3af; cursor: not-allowed; }
      `}</style>

      <div className="form-card">
        <h3 className="form-title">Thông tin giao hàng</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Họ tên <span className="required">*</span></label>
            <input type="text" name="full_name" value={form.full_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Số điện thoại <span className="required">*</span></label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Địa chỉ giao hàng <span className="required">*</span></label>
            <input type="text" name="delivery_address" value={form.delivery_address} onChange={handleChange} placeholder="Nhập địa chỉ của bạn" required />
          </div>
          <div className="form-group">
            <label>Ghi chú</label>
            <textarea name="note" value={form.note} onChange={handleChange} placeholder="Trống hẻm ạ" />
          </div>
          <div className="form-group">
            <label>Phương thức thanh toán</label>
            <select name="method" value={form.method} onChange={handleChange}>
              <option value="MOMO">MOMO</option>
              <option value="COD">Thanh toán khi nhận hàng</option>
            </select>
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" className="submit-btn" disabled={success}>
            {loading ? "Đang xử lý..." : "Xác nhận thanh toán"}
          </button>
        </form>

        {qrUrl && paymentStatus === "waiting" && (
          <div style={{
            marginTop: "30px",
            padding: "20px",
            background: "#f8f9fa",
            borderRadius: "12px",
            textAlign: "center",
            border: "1px solid #e5e7eb"
          }}>
            <h4 style={{ color: "#e41e7b", marginBottom: "12px" }}>
              Quét mã QR để thanh toán
            </h4>
            <p style={{ margin: "8px 0", fontSize: "14px" }}>
              Mã đơn: <strong>{orderId}</strong>
            </p>

            <div style={{
              background: "white",
              padding: "12px",
              borderRadius: "8px",
              display: "inline-block",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
              <QRCodeSVG
                value={qrUrl}
                size={220}
                level="H"
                includeMargin={true}
              />
            </div>

            <p style={{ marginTop: "12px", color: "#666", fontSize: "14px" }}>
              Mở app <strong>Momo</strong> → <strong>Quét mã</strong> → <strong>Xác nhận</strong>
            </p>

            <a
              href={qrUrl}
              style={{
                display: "inline-block",
                marginTop: "12px",
                padding: "10px 20px",
                background: "#e41e7b",
                color: "white",
                textDecoration: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600"
              }}
            >
              Mở Momo ngay
            </a>
          </div>
        )}

        {/* SUCCESS */}
        {paymentStatus === "success" && (
          <div style={{ marginTop: "20px", padding: "16px", background: "#d4edda", color: "#155724", borderRadius: "8px", textAlign: "center" }}>
            Thanh toán thành công! Đơn hàng: <strong>{orderId}</strong>
            <button
              onClick={() => window.location.href = `/customer/order-success/${orderId}`}
              style={{ marginLeft: "10px", padding: "8px 16px", background: "#28a745", color: "white", border: "none", borderRadius: "6px" }}
            > 
              Xem chi tiết
            </button>
          </div>
        )}

        {/* FAILED */}
        {paymentStatus === "failed" && (
          <div style={{ marginTop: "20px", padding: "16px", background: "#f8d7da", color: "#721c24", borderRadius: "8px", textAlign: "center" }}>
            Thanh toán thất bại. Vui lòng thử lại.
          </div>
        )}
      </div>
    </>
  );
}