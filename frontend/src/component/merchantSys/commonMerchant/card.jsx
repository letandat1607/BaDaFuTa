import { Text, Card, Inset, Strong, Box, Switch } from "@radix-ui/themes";

export default function CardContent({ item, handleChangeStatus, value, handleOpenDialog }) {
    return (
        <Box maxWidth="240px" onDoubleClick={handleOpenDialog}
            style={{
                width: "auto",
                height: "311px",
                borderRadius: "12px",
                backgroundColor: "#fff",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

            }}
        >
            <Card size="2">

                {value == "menu" ? (
                    <>
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
                                    color={item.status ? "orange" : "gray"}
                                    checked={item.status}
                                    onCheckedChange={(checked) =>
                                        handleChangeStatus(checked, item, "status", value)
                                    }
                                />
                            </div>
                        </div>
                    </>
                ) : value == "option_item" ? (
                    <>
                        <div style={{ padding: "10px" }}>
                            <div style={{ display: "flex", justifyContent: "space-around" }}>
                                <div>
                                    <p style={{ fontWeight: 700 }}>{item.option_item_name}</p>
                                    <p>Giá: {item.price}</p>

                                    <p>Trạng thái: {item.status ? "Hoạt động" : "Tạm tắt"}</p>                                </div>
                                <div>
                                    <p>Đã chọn: {item.status_select ? "Có" : "Không"}</p>
                                </div>
                            </div>

                            <div>
                                <Switch
                                    color={item.status ? "orange" : "gray"}
                                    checked={item.status}
                                    onCheckedChange={(checked) =>
                                        handleChangeStatus(checked, item, "status", value)
                                    }
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <p>Không có dữ liệu</p>
                )}






            </Card>
        </Box>
    );
}

