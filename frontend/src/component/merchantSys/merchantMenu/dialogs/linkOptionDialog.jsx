import { useCallback } from "react";

export default function LinkOptionDialog({
  isOpen,
  onClose,
  menuItem,
  optionGroups,
  selectedOptionGroups,
  onToggleOptionGroup,
}) {
  const handleToggle = useCallback(
    (optionId) => {
      onToggleOptionGroup(optionId);
    },
    [onToggleOptionGroup]
  );

  if (!isOpen || !menuItem) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "20px",
          width: "400px",
          maxHeight: "80vh",
          overflowY: "auto",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "6px",
            right: "10px",
            background: "transparent",
            border: "none",
            fontSize: "35px",
            fontWeight: "bold",
            color: "#bd6868ff",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.target.style.color = "red")}
          onMouseLeave={(e) => (e.target.style.color = "#bd6868ff")}
        >
          ×
        </button>

        <h3> Liên kết Option cho món</h3>
        <p><b>{menuItem.name_item}</b></p>

        {optionGroups.length > 0 ? (
          optionGroups.map((opt) => (
            <div
              key={opt.id}
              style={{
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <input
                type="checkbox"
                checked={selectedOptionGroups.includes(opt.id)}
                onChange={() => handleToggle(opt.id)}
              />
              <label>{opt.option_name}</label>
            </div>
          ))
        ) : (
          <p>Không có nhóm option nào.</p>
        )}
      </div>
    </div>
  );
}