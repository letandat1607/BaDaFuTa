import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import CardContent from "./commonMerchant/card";

export default function MerchantOrders() {
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("waiting");
  const [drones, setDrones] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDroneId, setSelectedDroneId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const merchant = JSON.parse(localStorage.getItem("merchant") || "{}");
  const merchantId = merchant?.id;
  // const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const baseURL ="http://localhost:3000";

  // Socket.io
  useEffect(() => {
    if (!merchantId) return;
    const socket = io(baseURL, { query: { merchantId } });
    socket.on("connect", () => console.log("Socket connected"));
    socket.on("newOrder", (incomingOrder) => {
      setOrders((prevOrders) => {
        const exists = prevOrders.some((order) => order.id === incomingOrder.id);

        if (exists) {
          return prevOrders.map((order) =>
            order.id === incomingOrder.id
              ? {
                ...order,
                status: incomingOrder.status || order.status,
                // Các field có thể thay đổi realtime:
                // drone_id: incomingOrder.drone_id ?? order.drone_id,
                // drone: incomingOrder.drone ?? order.drone,
                // location: incomingOrder.location ?? order.location, // nếu có gửi vị trí drone
                // updatedAt: incomingOrder.updatedAt || order.updatedAt,
              }
              : order
          );
        } else {
          return [incomingOrder, ...prevOrders];
        }
      });
    });
    socket.on("orders", (data) => setOrders(data));
    return () => socket.disconnect();
  }, [merchantId]);

  // Lấy đơn hàng ban đầu
  useEffect(() => {
    if (!merchantId) return;
    fetch(`${baseURL}/api/order/getAllOrderMerchant/${merchantId}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setOrders(data.orders || data.orderss || []))
      .catch(console.error);
  }, [merchantId]);

  // Lấy danh sách drone
  const fetchDrones = async () => {
    try {
      const res = await fetch(`${baseURL}/api/drone/merchant/${merchantId}`);
      const json = await res.json();
      console.log("Drones fetched:", json);
      if (res.ok) {
        setDrones(json.drones || []);
      }
    } catch (err) {
      console.error("Lỗi lấy drone:", err);
    }
  };

  // Mở dialog chọn drone
  const openDroneDialog = async (order) => {
    setSelectedOrder(order);
    setSelectedDroneId("");
    await fetchDrones();
    setIsDialogOpen(true);
  };

  // Giao đơn bằng drone
  const assignDrone = async () => {
    if (!selectedDroneId) return alert("Vui lòng chọn drone!");

    // 1. CẬP NHẬT NGAY TRONG UI (rất quan trọng để mượt)
    const optimisticOrder = {
      ...selectedOrder,
      status: "delivering",
      drone_id: selectedDroneId,
      drone: drones.find(d => d.id === selectedDroneId), // optional: hiện tên drone
    };

    // Cập nhật ngay trong state → đơn hàng biến mất khỏi tab "preparing" và sang "delivering" ngay lập tức
    setOrders(prev => prev.map(o => o.id === selectedOrder.id ? optimisticOrder : o));

    // Đóng dialog ngay
    setIsDialogOpen(false);
    setSelectedDroneId("");
    setSelectedOrder(null);

    // 2. Sau đó mới gọi API (nếu lỗi thì vẫn có thể rollback, nhưng hiếm)
    try {
      const res = await fetch(`${baseURL}/api/order/updateOrder/${selectedOrder.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token") || "",
        },
        body: JSON.stringify({
          data: optimisticOrder,
          orderId: selectedOrder.id,
          location: merchant.location,
        }),
      });

      if (!res.ok) {
        throw new Error("Cập nhật thất bại");
      }

      const updatedOrder = await res.json();
      // Cập nhật lại chính xác từ server (nếu có thêm field nào)
      setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));

      // Có thể emit socket cho khách hàng ở đây nếu backend chưa làm
      // socket.emit("orderUpdated", { orderId: updatedOrder.id, status: "delivering", location: merchant.location });

    } catch (err) {
      alert("Lỗi khi giao đơn: " + err.message);
      // Nếu lỗi → rollback về trạng thái cũ
      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? selectedOrder : o));
    }
  };

  const handleChangeStatus = useCallback((item, currentStatus) => {
    if (currentStatus === "waiting") {
      const updated = { ...item, status: "preparing" };
      fetch(`${baseURL}/api/order/updateOrder/${item.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token") || "",
        },
        body: JSON.stringify({ data: updated, orderId: item.id, location: merchant.location }),
      })
        .then((r) => r.json())
        .then((d) => setOrders((prev) => prev.map((o) => (o.id === d.id ? d : o))))
        .catch(console.error);
    }
    if (currentStatus === "preparing") {
      openDroneDialog(item);
    }

    if (currentStatus === "cancel") {
      if (window.confirm("Bạn chắc chắn muốn hủy đơn này?")) {
        const updated = { ...item, status: "cancelled" };
        fetch(`${baseURL}/api/order/updateOrder/${item.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token") || "",
          },
          body: JSON.stringify({ data: updated, orderId: item.id, location: merchant.location }),
        })
          .then((r) => r.json())
          .then((d) => setOrders((prev) => prev.map((o) => (o.id === d.id ? d : o))))
          .catch(console.error);
      }
    }
  }, []);

  // Lọc đơn theo tab
  const statusMap = {
    waiting: "waiting",
    preparing: "preparing",
    delivering: "delivering",
    complete: "complete",
    cancelled: "cancelled",
  };
  const filteredOrders = orders.filter((o) => o.status === statusMap[tab]);

  return (
    <>
      {/* Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          flexWrap: "wrap",
          margin: "20px 0",
          padding: "0 10%",
        }}
      >
        {[
          { key: "waiting", label: "Đang đợi", color: "#f59e0b" },
          { key: "preparing", label: "Đang chuẩn bị", color: "#9333ea" },
          { key: "delivering", label: "Đang giao", color: "#2563eb" },
          { key: "complete", label: "Hoàn thành", color: "#16a34a" },
          { key: "cancelled", label: "Đã hủy", color: "#dc2626" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "12px 24px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: tab === t.key ? t.color : "#f3f4f6",
              color: tab === t.key ? "white" : "#374151",
              fontWeight: "bold",
              cursor: "pointer",
              minWidth: "140px",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Danh sách đơn hàng */}
      <div
        style={{
          padding: "0 10%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "24px",
        }}
      >
        {filteredOrders.length === 0 ? (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#999", fontSize: "18px", padding: "60px 0" }}>
            Không có đơn hàng nào ở trạng thái này
          </p>
        ) : (
          filteredOrders.map((item) => (
            <CardContent
              key={item.id}
              value="orders"
              item={item}
              handleChangeStatus={handleChangeStatus}
            />
          ))
        )}
      </div>

      {/* Dialog chọn Drone (HTML + CSS thuần) */}
      {isDialogOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setIsDialogOpen(false)}
        >
          <div
            style={{
              background: "white",
              padding: "32px",
              borderRadius: "16px",
              width: "90%",
              maxWidth: "520px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: "0 0 20px", fontSize: "24px", color: "#1f2937" }}>
              Chọn Drone giao đơn #{selectedOrder?.id?.slice(-6).toUpperCase()}
            </h2>

            {drones.filter((d) => d.status === "READY").length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#dc2626", fontSize: "18px" }}>
                Không có drone nào sẵn sàng!
              </div>
            ) : (
              <div>
                {drones
                  .filter((d) => d.status === "READY")
                  .map((drone) => (
                    <label
                      key={drone.id}
                      style={{
                        display: "block",
                        padding: "16px",
                        marginBottom: "12px",
                        border: `2px solid ${selectedDroneId === drone.id ? "#2563eb" : "#e5e7eb"}`,
                        borderRadius: "12px",
                        backgroundColor: selectedDroneId === drone.id ? "#eff6ff" : "#ffffff",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <input
                        type="radio"
                        name="drone"
                        value={drone.id}
                        checked={selectedDroneId === drone.id}
                        onChange={(e) => setSelectedDroneId(e.target.value)}
                        style={{ marginRight: "12px" }}
                      />
                      <strong style={{ fontSize: "18px" }}>{drone.drone_name}</strong>
                      <br />
                      <small style={{ color: "#6b7280" }}>
                        Vị trí: {drone.current_location.lat.toFixed(4)}, {drone.current_location.lng.toFixed(4)}
                      </small>
                    </label>
                  ))}
              </div>
            )}

            <div style={{ marginTop: "30px", textAlign: "right" }}>
              <button
                onClick={() => setIsDialogOpen(false)}
                style={{
                  padding: "12px 24px",
                  marginRight: "12px",
                  backgroundColor: "#e5e7eb",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Hủy
              </button>
              <button
                onClick={assignDrone}
                disabled={!selectedDroneId}
                style={{
                  padding: "12px 32px",
                  backgroundColor: selectedDroneId ? "#2563eb" : "#93c5fd",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: selectedDroneId ? "pointer" : "not-allowed",
                  fontWeight: "600",
                  fontSize: "16px",
                }}
              >
                Xác nhận giao bằng Drone
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}