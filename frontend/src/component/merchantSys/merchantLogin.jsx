import { Box, Card } from "@radix-ui/themes";
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function MerchantLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const role = "merchant"
            const res = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, role }),
            });
            if (!res.ok) {
                const errorMsg = await res.text();
                throw new Error(`Đăng nhập thất bại: ${errorMsg}`);
            }

            const { token, user, message } = await res.json();

            if (!token || !user) {
                throw new Error("Dữ liệu trả về không hợp lệ");
            }
            const dataMerchant = await fetch(`http://localhost:3000/api/merchant/getMerchant/${user.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!dataMerchant.ok) {
                throw new Error("Không lấy được dữ liệu merchant");
            }
            const { merchant } = await dataMerchant.json();

            console.log(token);
            console.log(user);
            console.log(message);
            console.log("merchant trước khi lưu:", merchant);
            console.log("chuỗi JSON.stringify:", JSON.stringify(merchant));
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("merchant", JSON.stringify(merchant));

            navigate("/merchantSystem/dashboard");
        } catch (err) {
            console.error("Lỗi khi đăng nhập:", err);
            alert(err.message || "Có lỗi xảy ra khi đăng nhập!");
        }
    }

    return (
        <>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                    //   backgroundColor: "#f8fafc", // nền nhẹ
                }}
            >
                <Box
                    maxWidth="400px"
                    style={{
                        width: "100%",
                    }}
                >
                    <Card
                        size="3"
                        style={{
                            padding: "2rem",
                            borderRadius: "1rem",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                            backgroundColor: "#fff",
                            border: "1px solid #e5e7eb",
                        }}
                    >
                        <h2
                            style={{
                                fontSize: "1.75rem",
                                fontWeight: "700",
                                textAlign: "center",
                                marginBottom: "1.5rem",
                                color: "#1f2937",
                            }}
                        >
                            Đăng nhập
                        </h2>

                        <form
                            onSubmit={handleSubmit}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1.25rem",
                            }}
                        >
                            {/* Email */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <label
                                    htmlFor="email"
                                    style={{
                                        fontSize: "0.875rem",
                                        fontWeight: "500",
                                        color: "#374151",
                                    }}
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Nhập email..."
                                    required
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                    style={{
                                        border: "1px solid #d1d5db",
                                        borderRadius: "0.5rem",
                                        padding: "0.5rem 0.75rem",
                                        fontSize: "1rem",
                                        outline: "none",
                                        transition: "all 0.2s ease",
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                                    onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                                />
                            </div>

                            {/* Mật khẩu */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <label
                                    htmlFor="password"
                                    style={{
                                        fontSize: "0.875rem",
                                        fontWeight: "500",
                                        color: "#374151",
                                    }}
                                >
                                    Mật khẩu
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Nhập mật khẩu..."
                                    required
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                    style={{
                                        border: "1px solid #d1d5db",
                                        borderRadius: "0.5rem",
                                        padding: "0.5rem 0.75rem",
                                        fontSize: "1rem",
                                        outline: "none",
                                        transition: "all 0.2s ease",
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                                    onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                                />
                            </div>

                            {/* Nút đăng nhập */}
                            <button
                                type="submit"
                                style={{
                                    marginTop: "0.75rem",
                                    backgroundColor: "#2563eb",
                                    color: "white",
                                    fontWeight: "600",
                                    padding: "0.6rem",
                                    borderRadius: "0.5rem",
                                    border: "none",
                                    cursor: "pointer",
                                    transition: "background-color 0.2s ease",
                                }}
                                onMouseOver={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
                                onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
                            >
                                Đăng nhập
                            </button>
                        </form>
                    </Card>
                </Box>
            </div>
            <Outlet />
        </>
    );
}
