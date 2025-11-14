import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function TestOrder() {
    const [order, setOrder] = useState([]);

    useEffect(() => {
        const merchant = JSON.parse(localStorage.getItem("merchant"))
        if (!merchant) throw new Error("Dữ liệu merchant không hợp lệ");

        const socket = io("http://localhost:3000", {
            query: {merchantId: merchant.id}
        });

        socket.on("connect", () => {
            console.log("✅ Connected to WebSocket server");
        });

        socket.on("newOrder", (order) => {
            console.log("📩 Received new order:", order);
            setOrder((prev) => [order, ...prev]);
        });

        socket.on("disconnect", () => {
            console.log("❌ Disconnected");
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    if(order.length === 0) return (<><h1>Chưa có order</h1></>);

    return (
        <>
            <h1>Order</h1>
            <div style={{ padding: 20 }}>
                <h1>🛒 Real-time Orders</h1>
                {order.map((o, i) => (
                    <div key={i} style={{ border: "1px solid #ccc", margin: "10px 0", padding: 10 }}>
                        <p><b>ID:</b> {o.id}</p>
                        <p><b>User:</b> {o.user_id}</p>
                        <p><b>Total:</b> ${o.total_amount}</p>
                        <p><b>Status:</b> ${o.status}</p>
                        <p><b>Status Payment:</b> ${o.status_payment}</p>
                    </div>
                ))}
            </div>
        </>
    );
}