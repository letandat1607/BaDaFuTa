import { useState, useEffect } from "react";

export default function ToppingModal({ item, onClose, merchantId }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState({});
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(
          `${baseURL}/api/merchant/getMenuWithOption/${item.id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ merchant_id: merchantId }),
          }
        );

        if (!response.ok) throw new Error("Không thể tải tùy chọn");

        const data = await response.json();
        setOptions(data.options || []);

        // Khởi tạo selected với giá trị mặc định (nếu có)
        const init = {};
        data.options?.forEach((opt) => {
          if (opt.require_select && opt.option_items) {
            const defaultItem = opt.option_items.find((i) => i.status_select);
            if (defaultItem) {
              init[opt.id] = [defaultItem.id];
            }
          }
        });
        setSelected(init);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [item.id, merchantId]);

  const toggleItem = (optionId, itemId, multiSelect) => {
    setSelected((prev) => {
      const current = prev[optionId] || [];
      if (multiSelect) {
        return {
          ...prev,
          [optionId]: current.includes(itemId)
            ? current.filter((id) => id !== itemId)
            : [...current, itemId],
        };
      } else {
        return { ...prev, [optionId]: [itemId] };
      }
    });
  };

  const getTotalOptionPrice = () => {
    let total = 0;
    options.forEach((opt) => {
      const selectedItems = selected[opt.id] || [];
      opt.option_items?.forEach((item) => {
        if (selectedItems.includes(item.id)) {
          total += parseInt(item.price) || 0;
        }
      });
    });
    return total;
  };

  const canAddToCart = () => {
    return options.every((opt) => {
      if (!opt.require_select) return true;
      const selectedItems = selected[opt.id] || [];
      return selectedItems.length > 0;
    });
  };

  const addToCart = () => {
    if (!canAddToCart()) {
      alert("Vui lòng chọn đầy đủ các tùy chọn bắt buộc!");
      return;
    }

    const selectedOptions = options
      .map((opt) => ({
        option_name: opt.option_name,
        items: (selected[opt.id] || []).map((sid) => {
          const itm = opt.option_items.find((i) => i.id === sid);
          return { option_item_id: itm.id, name: itm.option_item_name, price: parseInt(itm.price) };
        }),
      }))
      .filter((o) => o.items.length > 0);

    const cartItem = {
      menu_item_id: item.id,
      name_item: item.name_item,
      price: parseInt(item.price) + getTotalOptionPrice(),
      quantity: 1,
      image_item: item.image_item,
      merchant_id: item.merchant_id,
      note: "",
      options: selectedOptions,
    };

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    localStorage.setItem("cart", JSON.stringify([...cart, cartItem]));
    onClose();
    alert(`${item.name_item} đã được thêm vào giỏ hàng!`);
  };

  return (
    <>
      <style jsx>{`
        .overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }
        .modal {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 520px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        .header {
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .title { font-size: 20px; font-weight: 700; color: #1f2937; }
        .close { background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280; }
        .close:hover { color: #374151; }
        .body { padding: 20px; }
        .option-group {
          margin-bottom: 24px;
        }
        .option-title {
          font-weight: 600;
          font-size: 16px;
          color: #1f2937;
          margin-bottom: 8px;
        }
        .required { color: #dc2626; font-size: 12px; }
        .option-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px dashed #e5e7eb;
        }
        .option-item:last-child { border: none; }
        .label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .checkbox, .radio {
          width: 18px; height: 18px; cursor: pointer;
        }
        .name { font-weight: 500; color: #374151; }
        .price { color: #dc2626; font-weight: 600; font-size: 14px; }
        .footer {
          padding: 20px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f9fafb;
        }
        .total { font-weight: 700; color: #1f2937; font-size: 18px; }
        .confirm {
          background: #10b981; color: white; padding: 12px 28px;
          border: none; border-radius: 8px; font-weight: 600; cursor: pointer;
          transition: background 0.2s;
        }
        .confirm:hover { background: #059669; }
        .confirm:disabled {
          background: #9ca3af; cursor: not-allowed; opacity: 0.7;
        }
        .loading, .error {
          text-align: center; padding: 40px; color: #6b7280;
        }
        .error { color: #dc2626; }
      `}</style>

      <div className="overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="header">
            <h3 className="title">Tùy chọn cho {item.name_item}</h3>
            <button className="close" onClick={onClose}>×</button>
          </div>

          <div className="body">
            {loading && <div className="loading">Đang tải tùy chọn...</div>}
            {error && <div className="error">{error}</div>}

            {!loading && !error && options.length === 0 && (
              <p style={{ color: "#6b7280", fontStyle: "italic" }}>
                Không có tùy chọn nào.
              </p>
            )}

            {!loading &&
              options.map((opt) => (
                <div key={opt.id} className="option-group">
                  <div className="option-title">
                    {opt.option_name}
                    {opt.require_select && <span className="required"> (Bắt buộc)</span>}
                  </div>
                  {opt.option_items
                    ?.filter(oitem => oitem.status !== false)
                    .map((oitem) => (
                      <div key={oitem.id} className="option-item">
                        <label className="label">
                          <input
                            type={opt.multi_select ? "checkbox" : "radio"}
                            name={opt.id}
                            className={opt.multi_select ? "checkbox" : "radio"}
                            checked={selected[opt.id]?.includes(oitem.id) || false}
                            onChange={() => toggleItem(opt.id, oitem.id, opt.multi_select)}
                          />
                          <span className="name">{oitem.option_item_name}</span>
                        </label>
                        <span className="price">
                          {oitem.price > 0
                            ? `+${parseInt(oitem.price).toLocaleString("vi-VN")}₫`
                            : "Miễn phí"
                          }
                        </span>
                      </div>
                    ))}
                </div>
              ))}
          </div>

          <div className="footer">
            <div className="total" data-cy="modal-total-price">
              Tổng cộng: {(parseInt(item.price) + getTotalOptionPrice()).toLocaleString("vi-VN")}₫
            </div>
            <button
              className="confirm"
              onClick={addToCart}
              disabled={!canAddToCart()}
              data-cy="add-to-cart-confirm-button"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </>
  );
}