import { Text, Card, Inset, Strong, Box, Switch } from "@radix-ui/themes";
import { useState } from "react";

// import { useState } from "react";


export default function CardContent({
    item = {},
    handleChangeStatus = () => { },
    value = "",
    other = "",
    handleOpenDialog = () => { },
    handleDelete = () => { },
    handleFilterChange = () => { }, // <-- new optional prop


}) {

    const [showDialog, setShowDialog] = useState(false);
    const [selectedOptionGroups, setSelectedOptionGroups] = useState([]);

    const toggleOptionGroup = (id) => {
        const newSel = selectedOptionGroups.includes(id)
            ? selectedOptionGroups.filter(x => x !== id)
            : [...selectedOptionGroups, id];
        setSelectedOptionGroups(newSel);
        handleFilterChange(newSel);
    };

    // const handleOpenFilterDialog = () => {
    //     const existingIds = Array.isArray(item.options)
    //         ? item.options.map(opt => opt.id)
    //         : [];
    //     setSelectedOptionGroups(existingIds);
    //     setShowDialog(true);
    // };



    return (
        <>
            <Box
                // maxWidth="240px"
                onDoubleClick={value !== "menu_item_option" ? handleOpenDialog : undefined}

                style={{

                    width: value === "menu_item_option" ? "100%" : "260px",
                    maxWidth: value === "menu_item_option" ? "100%" : "300px",

                    borderRadius: "12px",
                    backgroundColor: "#ffffffff",
                    boxShadow: value === "menu_item_option" ? null : "0 4px 10px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative", // 👈 cần để định vị nút X
                    overflow: "visible", // 🔥 quan trọng
                    marginBottom: "16px", // 👈 thêm dòng này để tạo khoảng cách giữa các card

                }}
            >



                <Card
                    size="2"
                    style={{
                        width: value === "menu_item_option" ? "100%" : "auto",
                        maxWidth: value === "menu_item_option" ? "100%" : "300px",
                        padding: value === "menu_item_option" ? 0 : undefined,
                        background: value === "menu_item_option" ? "transparent" : undefined,
                    }}
                >                {value == "menu" ? (
                    <>
                        <button
                            onClick={(e) => handleDelete(e, item, "menu_item")}
                            style={{
                                position: "absolute",
                                top: "0px",
                                right: "0px",
                                background: "transparent",
                                border: "none",
                                fontSize: "35px",
                                fontWeight: "bold",
                                color: "#ffececff",
                                cursor: "pointer",
                                transition: "0.2s",
                            }}
                            onMouseEnter={(e) => (e.target.style.color = "red")}
                            onMouseLeave={(e) => (e.target.style.color = "#ffececff")}
                        >
                            ×
                        </button>
                        <Inset clip="padding-box" side="top" pb="current">
                            <img
                                src={item.image_item.url}
                                alt="Bold typography"
                                style={{
                                    display: "block",
                                    objectFit: "cover",
                                    width: "250px",
                                    height: 140,
                                    backgroundColor: "var(--gray-5)",
                                }}
                            />
                        </Inset>

                        <div style={{ padding: "10px" }}>
                            <div style={{ display: "flex", justifyContent: "space-around" }}>
                                <div>
                                    <p style={{ fontWeight: 700 }}>{item.name_item}</p>
                                    <p>Giá: {item.price}</p>
                                </div>
                                <div>
                                    <p>Đã bán: {item.sold_count}</p>
                                </div>
                            </div>

                            <div>
                                <Switch
                                    color={item.status ? "cyan" : "gray"}
                                    variant="soft"
                                    checked={item.status}
                                    onCheckedChange={(checked) =>
                                        handleChangeStatus?.(checked, item, "status", value)
                                    }
                                />
                            </div>
                        </div>
                    </>
                ) : value == "option_item" ? (
                    <>
                        <button
                            onClick={(e) => handleDelete(e, item, "option_item")}
                            style={{
                                position: "absolute",
                                top: "6px",
                                right: "10px",
                                background: "transparent",
                                border: "none",
                                fontSize: "25px",
                                fontWeight: "bold",
                                color: "#ffececff",
                                cursor: "pointer",
                                transition: "0.2s",
                            }}
                            onMouseEnter={(e) => (e.target.style.color = "red")}
                            onMouseLeave={(e) => (e.target.style.color = "#ffececff")}
                        >
                            ×
                        </button>

                        <div style={{ padding: "10px" }}>
                            <div style={{ display: "flex", justifyContent: "space-around" }}>
                                <div>
                                    <p style={{ fontWeight: 700 }}>{item.option_item_name}</p>
                                    <p>Giá: {item.price}</p>
                                    <p>
                                        Trạng thái: {item.status ? "Hoạt động" : "Tạm tắt"}
                                    </p>
                                </div>
                                <div>
                                    <p>Đã chọn: {item.status_select ? "Có" : "Không"}</p>
                                </div>
                            </div>

                            <div>
                                <Switch
                                    color={item.status ? "cyan" : "gray"}
                                    variant="soft"

                                    checked={item.status}
                                    onCheckedChange={(checked) =>
                                        handleChangeStatus?.(checked, item, "status", value)
                                    }
                                />
                            </div>
                        </div>
                    </>
                ) : value == "orders" ? (
                    <>
                        {/* 👇 Nút X dùng chung cho tất cả value */}
                        {value === "orders" && item.status !== "cancel" && item.status !== "complete" && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleChangeStatus(item, "cancel");
                                }}
                                style={{
                                    position: "absolute",
                                    top: "6px",
                                    right: "6px",
                                    background: "#fee2e2",
                                    color: "#991b1b",
                                    border: "none",
                                    borderRadius: "50%",
                                    width: "22px",
                                    height: "22px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    lineHeight: "18px",
                                    textAlign: "center",
                                    transition: "0.2s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "#fecaca")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "#fee2e2")}
                                title="Hủy đơn"
                            >
                                ×
                            </button>
                        )}
                        <div
                            style={{
                                backgroundColor: "#f9fafb",
                                borderRadius: "12px",
                                padding: "12px 14px",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                width: "200px", // tăng chiều ngang
                                height: "320px", // cố định chiều cao (bạn đổi được)
                                overflow: "hidden", // không để tràn
                            }}
                        >
                            {/* Header */}
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                                <strong style={{ fontSize: "15px" }}>{item.full_name}</strong>
                                <span
                                    onClick={() => {
                                        if (item.status === "waiting" || item.status === "accept") {
                                            handleChangeStatus(item, item.status);
                                        }
                                    }} style={{
                                        fontSize: "12px",
                                        padding: "3px 8px",
                                        borderRadius: "6px",
                                        backgroundColor:
                                            item.status === "waiting"
                                                ? "#fef3c7"
                                                : item.status === "accept"
                                                    ? "#cffafe"
                                                    : item.status === "complete"
                                                        ? "#dcfce7"
                                                        : "#fee2e2",
                                        color:
                                            item.status === "waiting"
                                                ? "#92400e"
                                                : item.status === "accept"
                                                    ? "#0369a1"
                                                    : item.status === "complete"
                                                        ? "#166534"
                                                        : "#991b1b",
                                        fontWeight: 600,
                                        cursor: "pointer", // thêm con trỏ chuột để thấy nó có thể bấm
                                        transition: "0.2s",
                                        userSelect: "none",
                                    }}
                                >
                                    {item.status === "waiting"
                                        ? "Chờ xác nhận"
                                        : item.status === "accept"
                                            ? "Đang chuẩn bị"
                                            : item.status === "complete"
                                                ? "Hoàn thành"
                                                : "Đã hủy"}
                                </span>

                            </div>


                            {/* Danh sách món */}
                            {/* Danh sách món (chỉ hiện tối đa 2 món) */}
                            <div
                                style={{
                                    marginTop: "8px",
                                    background: "#ffffff",
                                    padding: "5px",
                                    borderRadius: "8px",
                                    width: "190px",      // 👈 chiều ngang cố định
                                    height: "200px",     // 👈 chiều cao cố định
                                    overflowY: "auto",   // 👈 cuộn khi nội dung vượt quá
                                }}
                            >
                                <p
                                    style={{
                                        fontWeight: "600",
                                        fontSize: "13px",
                                        marginBottom: "4px",
                                    }}
                                >
                                    🍽️ Món ăn:
                                </p>

                                {item.order_items.map((food, index) => (
                                    <div key={index} style={{ marginBottom: "6px" }}>
                                        <p style={{ fontSize: "13px", fontWeight: 500 }}>
                                            - {food.menu_item_name || "Món chưa đặt tên"} ({food.quantity}x) —{" "}
                                            {food.price.toLocaleString("vi-VN")}₫
                                        </p>

                                        {food.note && (
                                            <p
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#6b7280",
                                                    marginLeft: "10px",
                                                }}
                                            >
                                                📝 {food.note}
                                            </p>
                                        )}

                                        {food.options?.length > 0 && (
                                            <p
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#6b7280",
                                                    marginLeft: "10px",
                                                }}
                                            >
                                                ➕ Topping:{" "}
                                                {food.options
                                                    .map((opt, i) => opt.option_item_name || `Topping ${i + 1}`)
                                                    .join(", ")}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Tổng + Thời gian */}
                            <div style={{ marginTop: "8px" }}>
                                <p style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>
                                    💰 Tổng: {item.total_amount.toLocaleString("vi-VN")} ₫
                                </p>
                                <p
                                    style={{
                                        fontSize: "12px",
                                        color: "#6b7280",
                                        marginTop: "4px",
                                        textAlign: "right",
                                    }}
                                >
                                    🕒 {new Date(item.created_at).toLocaleString("vi-VN")}
                                </p>
                            </div>
                        </div>



                    </>


                ) : value == "menu_item_option" ? (
                    <div
                        style={{
                            width: "100%",
                            borderRadius: "12px",
                            backgroundColor: "#fafafa",
                            padding: "16px",
                            position: "relative",
                        }}
                    >
                        {/* Nút xóa */}


                        {/* Nút mở dialog */}
                        <button
                            onClick={handleOpenDialog}
                            style={{
                                position: "absolute",
                                top: "20px",
                                right: "100px",
                                backgroundColor: "#352f2fff",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                padding: "6px 12px",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: 500,
                                transition: "background-color 0.2s",
                            }}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#364b6bff")}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = "#352f2f")}
                        >
                            🔍 Chỉnh sửa liên kết
                        </button>



                        {/* Tiêu đề món */}
                        <h3 style={{ marginTop: "16px", fontSize: "18px", fontWeight: 600 }}>
                            🍔 {item.name_item || "Món không xác định"}
                        </h3>
                        <p style={{ margin: "4px 0", color: "#666" }}>
                            Liên kết với:{" "}
                            <b>
                                {item.options && item.options.length > 0
                                    ? item.options.map((opt) => opt.option_name).join(", ")
                                    : "Chưa có option"}
                            </b>
                        </p>

                        {/* Chi tiết các Option */}
                        <div style={{ fontSize: "15px", color: "#444", lineHeight: "1.6" }}>
                            <div>
                                <span style={{ fontWeight: 500 }}>Món ID:</span>{" "}
                                <code>{item.id}</code>
                            </div>
                            <div style={{ marginTop: "6px" }}>
                                <span style={{ fontWeight: 500 }}>Các Option:</span>
                                <ul
                                    style={{
                                        marginTop: "6px",
                                        marginBottom: 0,
                                        paddingLeft: "16px",
                                    }}
                                >
                                    {item.options && item.options.length > 0 ? (
                                        item.options.map((opt) => (
                                            <li key={opt.id} style={{ marginBottom: "8px" }}>
                                                <b>{opt.option_name}</b> —{" "}
                                                {opt.option_items && opt.option_items.length > 0 ? (
                                                    <span style={{ color: "#6b7280" }}>
                                                        {opt.option_items
                                                            .map((oi) => oi.option_item_name)
                                                            .join(", ")}
                                                    </span>
                                                ) : (
                                                    <span
                                                        style={{ color: "#9ca3af", fontStyle: "italic" }}
                                                    >
                                                        Không có option_item
                                                    </span>
                                                )}
                                            </li>
                                        ))
                                    ) : (
                                        <li>Không có option nào</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Không có dữ liệu</p>
                )}
                </Card>
            </Box>
            {/* <div> */}
            {/* <div> */}
            {/* --- Dialog nằm ngoài Card --- */}
            {showDialog && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0,0,0,0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 999,
                    }}
                    onClick={() => setShowDialog(false)}
                >
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "12px",
                            padding: "20px",
                            width: "420px",
                            maxHeight: "80vh",
                            overflowY: "auto",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ marginTop: 0, marginBottom: "12px" }}>🔍 Chọn nhóm Option</h3>
                        {Array.isArray(other) && other.length > 0 ? (
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                                    gap: "10px",
                                }}
                            >
                                {other.map((opt) => (
                                    <label
                                        key={opt.id}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: "8px",
                                            padding: "6px 10px",
                                            backgroundColor: "#f9fafb",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedOptionGroups.includes(opt.id)}
                                            onChange={() => toggleOptionGroup(opt.id)}
                                            style={{ cursor: "pointer" }}
                                        />
                                        <span style={{ fontSize: "13px", color: "#374151" }}>
                                            {opt.option_name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <div style={{ fontSize: "13px", color: "#9ca3af" }}>
                                Không có nhóm option
                            </div>
                        )}

                        <button
                            onClick={() => setShowDialog(false)}
                            style={{
                                marginTop: "16px",
                                backgroundColor: "#111827",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                padding: "8px 16px",
                                cursor: "pointer",
                                fontWeight: 500,
                            }}
                        >
                            ✅ Xong
                        </button>
                    </div>
                </div>
            )}
            {/* </div> */}
            {/* </div> */}



        </>
    )
}
