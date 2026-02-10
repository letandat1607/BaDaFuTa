import { Box, Card } from "@radix-ui/themes";
import React, { useState } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";

export default function CustomerLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [serverError, setServerError] = useState(null);
    const navigate = useNavigate();
    const baseURL ="http://localhost:3000";
    // const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const validateForm = () => {
        const errors = {};
        if (!email) {
            errors.email = "Email là bắt buộc";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Email không hợp lệ";
        }
        if (!password) {
            errors.password = "Mật khẩu là bắt buộc";
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(null); 
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({}); // Clear form errors nếu valid

        try {
            const role = "customer";
            const res = await fetch(`${baseURL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, role }),
            });
            if (!res.ok) {
                const errorMsg = await res.json();
                throw new Error(`${errorMsg.error}`);
            }

            const { token, user, message } = await res.json();

            if (!token || !user) {
                throw new Error("Dữ liệu trả về không hợp lệ");
            }

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            navigate("/customer/merchants");
        } catch (err) {
            console.error("Lỗi khi đăng nhập:", err);
            setServerError(err.message || "Có lỗi xảy ra khi đăng nhập!");
        }
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                }}
            >
                <Box maxWidth="400px" style={{ width: "100%" }}>
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
                            data-testid="login-title"
                            data-cy="login-title"
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

                        <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                            {/* Email */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <label
                                    htmlFor="email"
                                    style={{ fontSize: "0.875rem", fontWeight: "500", color: "#374151" }}
                                >
                                    Email
                                </label>
                                <input
                                    
                                    type="email"
                                    id="email"
                                    placeholder="Nhập email..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    data-cy="email-input"
                                    data-testid="email-input"
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
                                {formErrors.email && (
                                    <p 
                                        style={{ color: "red", fontSize: "0.875rem", marginTop: "-0.5rem" }} 
                                        data-cy="email-error"
                                    >
                                        {formErrors.email}
                                    </p>
                                )}
                            </div>

                            {/* Mật khẩu */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <label
                                    htmlFor="password"
                                    style={{ fontSize: "0.875rem", fontWeight: "500", color: "#374151" }}
                                >
                                    Mật khẩu
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Nhập mật khẩu..."
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    data-cy="password-input"    
                                    data-testid="password-input"
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
                                {formErrors.password && (
                                    <p 
                                        style={{ color: "red", fontSize: "0.875rem", marginTop: "-0.5rem" }} 
                                        data-cy="password-error"
                                    >
                                        {formErrors.password}
                                    </p>
                                )}
                            </div>

                            {/* Server error (hiển thị trên button đăng nhập) */}
                            {serverError && (
                                <p 
                                    style={{ color: "red", fontSize: "0.875rem", textAlign: "center", marginBottom: "0.5rem" }} 
                                    data-cy="server-error"
                                >
                                    {serverError}
                                </p>
                            )}

                            <button
                                type="submit"
                                data-cy="login-submit-button"  
                                data-testid="login-submit-button"
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

                        <p
                            style={{
                                textAlign: "center",
                                marginTop: "1rem",
                                fontSize: "0.875rem",
                                color: "#6b7280",
                            }}
                        >
                            Chưa có tài khoản?{" "}
                            <Link
                                to="/customer/register"
                                data-cy="register-link"
                                style={{
                                    color: "#2563eb",
                                    textDecoration: "none",
                                    fontWeight: "500",
                                }}
                            >
                                Đăng ký ngay
                            </Link>
                        </p>
                    </Card>
                </Box>
            </div>
            <Outlet />
        </>
    );
}