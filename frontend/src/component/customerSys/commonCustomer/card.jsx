import { Link } from "react-router-dom";

export default function RestaurantCard({ restaurant }) {
  const location = restaurant.location ? restaurant.location : {};
  const address = location.address || "Không có địa chỉ";
  const imgUrl = restaurant.profile_image?.url || "/placeholder.jpg";

  return (
    <>
      {/* CSS thuần - scoped bằng style jsx */}
      <style jsx>{`
        .card-link {
          text-decoration: none;
          color: inherit;
          display: block;
          height: 100%;
        }
        .card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
        }
        .card-img {
          width: 100%;
          height: 192px;
          object-fit: cover;
        }
        .card-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-grow: 1;
        }
        .card-title {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
          color: #1f2937;
        }
        .card-address {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
        }
        .badge {
          background: #10b981;
          color: white;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 9999px;
        }
        .btn {
          background: #3b82f6;
          color: white;
          font-weight: 600;
          font-size: 14px;
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .btn:hover {
          background: #2563eb;
        }
      `}</style>

      <Link to={`/customer/merchant/${restaurant.id}`} className="card-link">
        <div className="card">
          <img src={imgUrl} alt={restaurant.merchant_name} className="card-img" />
          <div className="card-body">
            <h3 className="card-title">{restaurant.merchant_name}</h3>
            <p className="card-address">{address}</p>
            <div className="card-footer">
              <span className="badge">Mở cửa</span>
              <button className="btn">Xem Menu</button>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}