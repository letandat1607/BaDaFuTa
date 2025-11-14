import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";

const SOCKET_TIMEOUT = 60000; 

export default function PaymentResult() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Đang xử lý thanh toán...");


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "[]");

    if (!orderId || !user?.id) {
      setStatus("failed");
      setMessage("Thiếu thông tin thanh toán");
      return;
    }

    const socket = io("http://localhost:3000", {
      query: { userId: user.id },
      transports: ["websocket"],
    });

    let timeoutId;

    const handleSuccess = (data) => {
      if (data.orderId === orderId) {
        clearTimeout(timeoutId);
        setStatus("success");
        setMessage("Thanh toán thành công!");
        // setTimeout(() => navigate(`/order-success/${orderId}`), 2000);
      }
    };

    const handleFailed = (data) => {
      if (data.orderId === orderId) {
        clearTimeout(timeoutId);
        setStatus("failed");
        setMessage(data.error || "Thanh toán thất bại");
        setTimeout(() => navigate(`/order-failed/${orderId}`), 2000);
      }
    };

    const handleTimeout = () => {
      socket.disconnect();
      setStatus("failed");
      setMessage("Hết thời gian xử lý. Vui lòng kiểm tra lại đơn hàng.");
    };

    socket.on("connect", () => {
      console.log("WebSocket connected for payment result");
    });

    socket.on("paymentSuccess", handleSuccess);
    socket.on("paymentFailed", handleFailed);

    // Timeout sau 60s
    timeoutId = setTimeout(handleTimeout, SOCKET_TIMEOUT);

    return () => {
      clearTimeout(timeoutId);
      socket.off("paymentSuccess", handleSuccess);
      socket.off("paymentFailed", handleFailed);
      socket.disconnect();
    };
  }, [orderId, user?.id, navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f9fc",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          textAlign: "center",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        {status === "loading" && (
          <>
            <div
              style={{
                width: "60px",
                height: "60px",
                border: "6px solid #f3f3f3",
                borderTop: "6px solid #3498db",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 20px",
              }}
            />
            <h3>{message}</h3>
            <p style={{ color: "#666", fontSize: "14px" }}>
              Mã đơn hàng: <strong>{orderId}</strong>
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{ fontSize: "48px", color: "#27ae60" }}>Checkmark</div>
            <h3 style={{ color: "#27ae60" }}>{message}</h3>
            <p>Đang chuyển hướng...</p>
          </>
        )}

        {status === "failed" && (
          <>
            <div style={{ fontSize: "48px", color: "#e74c3c" }}>Cross</div>
            <h3 style={{ color: "#e74c3c" }}>{message}</h3>
            <button
              onClick={() => navigate(`/order/${orderId}`)}
              style={{
                marginTop: "16px",
                padding: "10px 20px",
                background: "#3498db",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Xem chi tiết đơn hàng
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}