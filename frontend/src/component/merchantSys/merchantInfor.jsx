import { useState, useEffect } from "react";
import { Grid, Box, Container, Button, Flex } from "@radix-ui/themes";

export default function MerchantInfor() {
  const [merchant, setMerchant] = useState(null);
  const [updateMerchant, setUpdateMerchant] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const getMerchant = async () => {
      try {
        const stored = localStorage.getItem("merchant");
        if (!stored) throw new Error("Không tìm thấy dữ liệu merchant");

        const merchantInfor = JSON.parse(stored);
        setMerchant(merchantInfor);
        setUpdateMerchant(merchantInfor); // Cập nhật cả 2 state
      } catch (err) {
        console.error("Lỗi khi tải merchant:", err);
        alert("Không thể tải thông tin cửa hàng. Vui lòng thử lại.");
      }
    };

    getMerchant();
  }, []);

  // Xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("location.")) {
      const key = name.split(".")[1];
      setUpdateMerchant((prev) => ({
        ...prev,
        location: { ...prev.location, [key]: value },
      }));
    } else if (name.startsWith("profile_image.")) {
      const key = name.split(".")[1];
      setUpdateMerchant((prev) => ({
        ...prev,
        profile_image: { ...prev.profile_image, [key]: value },
      }));
    } else if (name.startsWith("cover_image.")) {
      const key = name.split(".")[1];
      setUpdateMerchant((prev) => ({
        ...prev,
        cover_image: { ...prev.cover_image, [key]: value },
      }));
    } else if (name.startsWith("time_open.")) {
      const [_, day, field] = name.split(".");
      setUpdateMerchant((prev) => ({
        ...prev,
        time_open: {
          ...prev.time_open,
          [day]: { ...prev.time_open[day], [field]: value },
        },
      }));
    } else {
      setUpdateMerchant((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Cập nhật merchant:", updateMerchant);
    localStorage.setItem("merchant", JSON.stringify(updateMerchant)); // Lưu lại
    setMerchant(updateMerchant); // Đồng bộ hiển thị
    setShowForm(false);
    alert("Cập nhật thành công!");
  };

  // Styles
  const imageEdit = {
    overlay_and_font: {
      position: "relative",
      width: "100%",
      height: "350px",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    },
    image: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
    overlay: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" },
    highlight_font: {
      position: "absolute",
      bottom: "1.5rem",
      left: "1.5rem",
      color: "white",
      textShadow: "0 2px 8px rgba(0,0,0,0.6)",
    },
    image_merchantlogo: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      objectFit: "cover",
      filter: "brightness(1.2)",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      transition: "all 0.3s ease",
    },
  };

  const boxEdit = {
    boxmcLogo: { display: "flex", alignItems: "center", gap: "10px" },
    boxOpentime: {
      background: "white",
      borderRadius: "12px",
      padding: "1.5rem",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      marginTop: "1rem",
    },
    boxSectionInfor: {
      background: "linear-gradient(to bottom right, #ffffff, #f9fafb)",
      borderRadius: "16px",
      padding: "2rem",
      boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      marginTop: "2rem",
      border: "1px solid #eee",
    },
    boxH2Infor: {
      marginTop: 0,
      marginBottom: "1.5rem",
      fontSize: "1.4rem",
      fontWeight: "600",
      color: "#222",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
  };

  // Loading state
  if (!merchant || !updateMerchant) {
    return (
      <Box style={{ textAlign: "center", padding: "4rem", fontSize: "1.2rem", color: "#666" }}>
        Đang tải thông tin cửa hàng...
      </Box>
    );
  }

  // Logo nhỏ
  const mcLogo = updateMerchant.cover_image?.url ? (
    <img
      style={imageEdit.image_merchantlogo}
      src={updateMerchant.cover_image.url}
      alt={updateMerchant.merchant_name}
    />
  ) : null;

  return (
    <>
      <Box style={{ background: "var(--gray-a2)", borderRadius: "var(--radius-3)" }}>
        <Container size="1" style={{ margin: "2% 10%" }}>
          <Box py="9">
            {/* Ảnh bìa + overlay */}
            <Box style={imageEdit.overlay_and_font}>
              <img
                style={imageEdit.image}
                src={updateMerchant.profile_image?.url || ""}
                alt={updateMerchant.merchant_name}
              />
              <Box style={imageEdit.overlay} />
              <Box style={imageEdit.highlight_font}>
                <Box style={boxEdit.boxmcLogo}>
                  {mcLogo}
                  <h1 style={{ margin: 0 }}>{updateMerchant.merchant_name}</h1>
                </Box>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>
                  {updateMerchant.location?.address}
                </p>
              </Box>
            </Box>

            {/* Tiêu đề + nút Update */}
            <Flex justify="between" align="center" style={{ marginTop: "1.5rem", marginBottom: "1rem" }}>
              <h1 style={{ margin: 0, fontWeight: "bold" }}>Thông tin chi tiết</h1>
              <Button
                style={{ background: "#444", color: "white", borderRadius: "8px" }}
                onClick={() => setShowForm((prev) => !prev)}
              >
                {showForm ? "Đóng Form" : "Update"}
              </Button>
            </Flex>

            {/* Thông tin cửa hàng */}
            <section style={boxEdit.boxSectionInfor}>
              <h2 style={boxEdit.boxH2Infor}>Thông tin cửa hàng</h2>
              <Grid columns="2" gap="4" width="100%" style={{ lineHeight: "1.8", fontSize: "1rem", color: "#333" }}>
                <Box style={{ fontWeight: "bold", color: "#555" }}>Tên cửa hàng:</Box>
                <Box>{updateMerchant.merchant_name}</Box>

                <Box style={{ fontWeight: "bold", color: "#555" }}>Địa chỉ:</Box>
                <Box>{updateMerchant.location?.address}</Box>

                <Box style={{ fontWeight: "bold", color: "#555" }}>Số điện thoại:</Box>
                <Box>
                  <a href={`tel:${updateMerchant.phone}`} style={{ color: "#0070f3", textDecoration: "none" }}>
                    {updateMerchant.phone}
                  </a>
                </Box>

                <Box style={{ fontWeight: "bold", color: "#555" }}>Email:</Box>
                <Box>
                  <a href={`mailto:${updateMerchant.email}`} style={{ color: "#0070f3", textDecoration: "none" }}>
                    {updateMerchant.email}
                  </a>
                </Box>
              </Grid>
            </section>

            {/* Giờ mở cửa */}
            <Box style={boxEdit.boxOpentime}>
              <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>Giờ mở cửa</h3>
              <Grid columns="2" gap="2" width="100%">
                {Object.entries(updateMerchant.time_open || {}).map(([day, time]) => (
                  <Box
                    key={day}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0.5rem 0.75rem",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <span style={{ textTransform: "capitalize" }}>{day}</span>
                    <span>
                      {time.open} - {time.close}
                    </span>
                  </Box>
                ))}
              </Grid>
            </Box>

            {/* Form cập nhật */}
            {showForm && (
              <Box style={{ marginTop: "1.5rem", padding: "1.5rem", border: "1px solid #ddd", borderRadius: "12px", background: "#fff" }}>
                <form onSubmit={handleSubmit}>
                  <Grid columns="2" gap="3">
                    <label>
                      Tên Merchant:
                      <input
                        type="text"
                        name="merchant_name"
                        value={updateMerchant.merchant_name || ""}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", borderRadius: "6px", border: "1px solid #ccc" }}
                      />
                    </label>
                    <label>
                      Địa chỉ:
                      <input
                        type="text"
                        name="location.address"
                        value={updateMerchant.location?.address || ""}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", borderRadius: "6px", border: "1px solid #ccc" }}
                      />
                    </label>
                    <label>
                      Lat:
                      <input
                        type="number"
                        step="0.0001"
                        name="location.lat"
                        value={updateMerchant.location?.lat || ""}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", borderRadius: "6px", border: "1px solid #ccc" }}
                      />
                    </label>
                    <label>
                      Lng:
                      <input
                        type="number"
                        step="0.0001"
                        name="location.lng"
                        value={updateMerchant.location?.lng || ""}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", borderRadius: "6px", border: "1px solid #ccc" }}
                      />
                    </label>
                    <label>
                      Điện thoại:
                      <input
                        type="text"
                        name="phone"
                        value={updateMerchant.phone || ""}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", borderRadius: "6px", border: "1px solid #ccc" }}
                      />
                    </label>
                    <label>
                      Email:
                      <input
                        type="email"
                        name="email"
                        value={updateMerchant.email || ""}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", borderRadius: "6px", border: "1px solid #ccc" }}
                      />
                    </label>
                    <label>
                      Ảnh đại diện URL:
                      <input
                        type="text"
                        name="profile_image.url"
                        value={updateMerchant.profile_image?.url || ""}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", borderRadius: "6px", border: "1px solid #ccc" }}
                      />
                    </label>
                    <label>
                      Ảnh bìa URL:
                      <input
                        type="text"
                        name="cover_image.url"
                        value={updateMerchant.cover_image?.url || ""}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", borderRadius: "6px", border: "1px solid #ccc" }}
                      />
                    </label>

                    {/* Giờ mở cửa */}
                    {Object.entries(updateMerchant.time_open || {}).map(([day, time]) => (
                      <Box key={day} style={{ gridColumn: "span 2" }}>
                        <strong style={{ textTransform: "capitalize" }}>{day}</strong>
                        <Flex gap="1rem" style={{ marginTop: "0.5rem", marginBottom: "1rem" }}>
                          <input
                            type="time"
                            name={`time_open.${day}.open`}
                            value={time.open || ""}
                            onChange={handleChange}
                            style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
                          />
                          <input
                            type="time"
                            name={`time_open.${day}.close`}
                            value={time.close || ""}
                            onChange={handleChange}
                            style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
                          />
                        </Flex>
                      </Box>
                    ))}
                  </Grid>

                  <Button
                    type="submit"
                    style={{
                      marginTop: "1.5rem",
                      background: "#0070f3",
                      color: "white",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "8px",
                      fontWeight: "600",
                    }}
                  >
                    Lưu Thay Đổi
                  </Button>
                </form>
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
}