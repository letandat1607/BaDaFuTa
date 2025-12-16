import { Box, Card } from "@radix-ui/themes";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerRegister() {
    const [userName, setUserName] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");

    const [formErrors, setFormErrors] = useState({});
    const [serverError, setServerError] = useState(null);

    const navigate = useNavigate();

    const validateForm = () => {
        const errors = {};

        if (!userName) {
            errors.userName = "Tên đăng nhập là bắt buộc";
        } else if (userName.length < 3) {
            errors.userName = "Tên đăng nhập phải ít nhất 3 ký tự";
        }

        if (!fullName) errors.fullName = "Họ và tên là bắt buộc";

        if (!email) {
            errors.email = "Email là bắt buộc";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Email không hợp lệ";
        }

        if (!phoneNumber) {
            errors.phoneNumber = "Số điện thoại là bắt buộc";
        } else if (!/^0[1-9][0-9]{8,9}$/.test(phoneNumber.replace(/\s/g, ""))) {
            errors.phoneNumber = "Số điện thoại không hợp lệ";
        }

        if (!password) {
            errors.password = "Mật khẩu là bắt buộc";
        } else if (password.length < 6) {
            errors.password = "Mật khẩu phải ít nhất 6 ký tự";
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

        setFormErrors({});

        try {
            const role = "customer";
            const res = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_name: userName.trim(),
                    full_name: fullName.trim(),
                    email: email.trim(),
                    phone_number: phoneNumber.replace(/\s/g, ""),
                    role,
                    password,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "Đăng ký thất bại");
            }

            const { message } = await res.json();
            alert(message || "Đăng ký thành công! Vui lòng đăng nhập.");
            navigate("/customer/login");
        } catch (err) {
            console.error("Lỗi khi đăng ký:", err);
            setServerError(err.message || "Có lỗi xảy ra khi đăng ký!");
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
                        data-cy="register-title"
                        data-testid="register-title"
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

                    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        {/* Tên đăng nhập */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label htmlFor="user_name">Tên đăng nhập</label>
                            <input
                                type="text"
                                id="user_name"
                                placeholder="Nhập tên đăng nhập..."
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                data-cy="username-input"
                                data-testid="username-input"
                                style={{ border: "1px solid #d1d5db", borderRadius: "0.5rem", padding: "0.5rem 0.75rem", fontSize: "1rem", outline: "none" }}
                                onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                            />
                            {formErrors.userName && (
                                <p data-cy="username-error" style={{ color: "red", fontSize: "0.875rem", marginTop: "-0.5rem" }}>
                                    {formErrors.userName}
                                </p>
                            )}
                        </div>

                        {/* Họ và tên */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label htmlFor="full_name">Họ và tên</label>
                            <input
                                type="text"
                                id="full_name"
                                placeholder="Nhập họ và tên..."
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                data-cy="fullname-input"
                                data-testid="fullname-input"
                                style={{ border: "1px solid #d1d5db", borderRadius: "0.5rem", padding: "0.5rem 0.75rem", fontSize: "1rem", outline: "none" }}
                                onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                            />
                            {formErrors.fullName && (
                                <p data-cy="fullname-error" style={{ color: "red", fontSize: "0.875rem", marginTop: "-0.5rem" }}>
                                    {formErrors.fullName}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Nhập email..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                data-cy="email-input"
                                data-testid="email-input"
                                style={{ border: "1px solid #d1d5db", borderRadius: "0.5rem", padding: "0.5rem 0.75rem", fontSize: "1rem", outline: "none" }}
                                onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                            />
                            {formErrors.email && (
                                <p data-cy="email-error" style={{ color: "red", fontSize: "0.875rem", marginTop: "-0.5rem" }}>
                                    {formErrors.email}
                                </p>
                            )}
                        </div>

                        {/* Số điện thoại */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label htmlFor="phone_number">Số điện thoại</label>
                            <input
                                type="tel"
                                id="phone_number"
                                placeholder="Nhập số điện thoại..."
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                data-cy="phone-input"
                                data-testid="phone-input"
                                style={{ border: "1px solid #d1d5db", borderRadius: "0.5rem", padding: "0.5rem 0.75rem", fontSize: "1rem", outline: "none" }}
                                onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                            />
                            {formErrors.phoneNumber && (
                                <p data-cy="phone-error" style={{ color: "red", fontSize: "0.875rem", marginTop: "-0.5rem" }}>
                                    {formErrors.phoneNumber}
                                </p>
                            )}
                        </div>

                        {/* Mật khẩu */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label htmlFor="password">Mật khẩu</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Nhập mật khẩu..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                data-cy="password-input"
                                data-testid="password-input"
                                style={{ border: "1px solid #d1d5db", borderRadius: "0.5rem", padding: "0.5rem 0.75rem", fontSize: "1rem", outline: "none" }}
                                onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                            />
                            {formErrors.password && (
                                <p data-cy="password-error" style={{ color: "red", fontSize: "0.875rem", marginTop: "-0.5rem" }}>
                                    {formErrors.password}
                                </p>
                            )}
                        </div>

                        {/* Server error */}
                        {serverError && (
                            <p data-cy="server-error" style={{ color: "red", fontSize: "0.875rem", textAlign: "center" }}>
                                {serverError}
                            </p>
                        )}

                        <button
                            type="submit"
                            data-cy="register-submit-button"
                            data-testid="register-submit-button"
                            style={{
                                marginTop: "0.75rem",
                                backgroundColor: "#2563eb",
                                color: "white",
                                fontWeight: "600",
                                padding: "0.6rem",
                                borderRadius: "0.5rem",
                                border: "none",
                                cursor: "pointer",
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