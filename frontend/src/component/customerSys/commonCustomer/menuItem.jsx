import { useState } from "react";
import ToppingModal from "./toppingModal";

export default function MenuItem({ item, merchantId }) {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <>
      <style jsx>{`
        .menu-item {
          display: flex;
          padding: 16px 20px;
          border-bottom: 1px solid #e5e7eb;
          transition: background 0.2s ease;
          position: relative;
        }
        .menu-item:hover { background: #f9fafb; }
        .menu-item:last-child { border-bottom: none; }
        .item-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          margin-right: 16px;
          flex-shrink: 0;
        }
        .item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .item-name {
          font-weight: 600;
          font-size: 16px;
          color: #111827;
          margin: 0 0 4px 0;
        }
        .item-desc {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 8px 0;
          line-height: 1.4;
        }
        .item-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .item-price {
          font-weight: 700;
          color: #dc2626;
          font-size: 16px;
        }
        .item-sold {
          font-size: 13px;
          color: #9ca3af;
        }
        .add-btn {
          background: #10b981;
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          font-size: 20px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          box-shadow: 0 2px 6px rgba(16, 185, 129, 0.3);
        }
        .add-btn:hover {
          background: #059669;
          transform: scale(1.1);
        }
      `}</style>

      <li className="menu-item">
        <img
          src={item.image_item?.url}
          alt={item.name_item}
          className="item-image"
          onError={(e) => (e.target.src = "https://via.placeholder.com/80?text=No+Image")}
        />
        <div className="item-info">
          <h3 className="item-name">{item.name_item}</h3>
          <p className="item-desc">{item.description}</p>
          <div className="item-footer">
            <span className="item-price">
              {parseInt(item.price).toLocaleString("vi-VN")}₫
            </span>
            <span className="item-sold">Đã bán: {item.sold_count}</span>
          </div>
        </div>
        <button className="add-btn" onClick={openModal} data-cy={`add-to-cart-button-${item.id}`}>+</button>
      </li>

      {modalOpen && <ToppingModal item={item} onClose={closeModal} merchantId={merchantId}/>}
    </>
  );
}