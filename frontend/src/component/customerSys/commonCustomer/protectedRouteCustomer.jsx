import { Navigate } from "react-router-dom";

export default function ProtectedRouteCustomer({ children }) {
    const token = localStorage.getItem("token");
    if (!token) {
        return <Navigate to="/customer/login" replace />;
    }

    return children;
}
