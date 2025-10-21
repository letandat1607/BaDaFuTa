import { NavLink } from "react-router-dom";
export default function Navbar() {
    const navStyle = {
        backgroundColor: "#111",
        color: "#fff",
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    };
    const linkStyle = {
        color: "#fff",
        textDecoration: "none",
        margin: "0 1rem",
        fontWeight: "500",
        transition: "0.2s",
    };

    const activeStyle = {
        borderBottom: "2px solid white",
        fontWeight: "600",
    };
    return (
        <nav style={navStyle}>
            <div style={{ fontWeight: "700", fontSize: "1.3rem" }}> BaDaFuTa Food</div>
            <div>
                <NavLink to="/merchantSystem" style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}>
                    Trang chủ
                </NavLink>
                <NavLink to="/merchantSystem/info" style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}>
                    Thông tin cửa hàng
                </NavLink>
                <NavLink to="/merchantSystem/menu" style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}>
                    Thực đơn
                </NavLink>
                <NavLink to="/merchantSystem/orders" style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}>
                    Đơn hàng
                </NavLink>
                <NavLink to="/merchantSystem/reviews" style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}>
                    Đánh giá
                </NavLink>
            </div>
        </nav>
    );
}