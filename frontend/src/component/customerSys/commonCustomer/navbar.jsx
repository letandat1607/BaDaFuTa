import { Link, useNavigate } from "react-router-dom";

export default function NavbarCustomer() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/customer/login");
    };

    return (
        <>
            {/* Inline CSS */}
            <style jsx>{`
                .navbar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 50;
                    background: linear-gradient(to right, #4f46e5, #7c3aed);
                    color: white;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                .navbar-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 64px;
                }
                .logo {
                    font-size: 28px;
                    font-weight: bold;
                    text-decoration: none;
                    color: white;
                    transition: color 0.3s ease;
                }
                .logo:hover {
                    color: #fde047;
                }
                .nav-links {
                    display: flex;
                    gap: 12px;
                }
                .nav-btn {
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-weight: 500;
                    font-size: 15px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(4px);
                }
                .nav-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-1px);
                }
                .logout-btn {
                    background: #e11d48;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 15px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .logout-btn:hover {
                    background: #be123c;
                    transform: scale(1.05);
                }
            `}</style>

            <nav className="navbar">
                <div className="navbar-container">
                    {/* Logo */}
                    <Link to="/" className="logo">
                        FoodApp
                    </Link>

                    {/* Menu */}
                    <div className="nav-links">
                        <button className="nav-btn" onClick={() => navigate("/customer/merchants")}>
                            Nhà hàng
                        </button>
                        <button className="nav-btn" onClick={() => navigate("/customer/orders")}>
                            Đơn hàng
                        </button>
                    </div>

                    {/* Logout */}
                    <button onClick={handleLogout} className="logout-btn">
                        Đăng xuất
                    </button>
                </div>
            </nav>
        </>
    );
}