// src/components/customer/CustomerRegister.jsx
import { Box, Card } from "@radix-ui/themes";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerRegister() {
    const [userName, setUserName] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const role = "customer";
            const res = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_name: userName,
                    full_name: fullName,
                    email,
                    phone_number: phoneNumber,
                    role,
                    password,
                }),
            });
            if (!res.ok) {
                const errorMsg = await res.text();
                throw new Error(`Đăng ký thất bại: ${errorMsg}`);
            }

            const { message } = await res.json();
            alert(message || "Đăng ký thành công! Vui lòng đăng nhập.");
            navigate("customer/login");
        } catch (err) {
            console.error("Lỗi khi đăng ký:", err);
            alert(err.message || "Có lỗi xảy ra khi đăng ký!");
        }
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
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
                        Đăng ký
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1.25rem",
                        }}
                    >
                        {/* Tên đăng nhập */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label
                                htmlFor="user_name"
                                style={{
                                    fontSize: "0.875rem",
                                    fontWeight: "500",
                                    color: "#374151",
                                }}
                            >
                                Tên đăng nhập
                            </label>
                            <input
                                type="text"
                                id="user_name"
                                placeholder="Nhập tên đăng nhập..."
                                required
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
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

                        {/* Họ và tên */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label
                                htmlFor="full_name"
                                style={{
                                    fontSize: "0.875rem",
                                    fontWeight: "500",
                                    color: "#374151",
                                }}
                            >
                                Họ và tên
                            </label>
                            <input
                                type="text"
                                id="full_name"
                                placeholder="Nhập họ và tên..."
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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

                        {/* Số điện thoại */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label
                                htmlFor="phone_number"
                                style={{
                                    fontSize: "0.875rem",
                                    fontWeight: "500",
                                    color: "#374151",
                                }}
                            >
                                Số điện thoại
                            </label>
                            <input
                                type="tel"
                                id="phone_number"
                                placeholder="Nhập số điện thoại..."
                                required
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                            Đăng ký
                        </button>
                    </form>
                </Card>
            </Box>
        </div>
    );
}