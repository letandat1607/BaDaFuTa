import { useState } from "react";
import Navbar from "./commonMerchant/navbar";
import { Grid, Box, Container, Button, Flex } from "@radix-ui/themes";

export default function MerchantInfor() {
  const merchant = {
    user_id: "2a75359e-e288-45bd-b37c-20ffc970d8e6",
    merchant_name: "McDonald's Nguyễn Huệ",
    location: {
      address: "2 Nguyễn Huệ, Quận 1, TP.HCM",
      lat: 10.7749,
      lng: 106.7049,
    },
    phone: "028-3829-1234",
    email: "contact@mcdonalds.vn",
    profile_image: {
      url: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
    },
    cover_image: {
      url: "https://images.unsplash.com/photo-1571091718767-18b5b1457add",
    },
    time_open: {
      monday: { open: "08:00", close: "22:00" },
      tuesday: { open: "08:00", close: "22:00" },
      wednesday: { open: "08:00", close: "22:00" },
      thursday: { open: "08:00", close: "22:00" },
      friday: { open: "08:00", close: "22:00" },
      saturday: { open: "09:00", close: "23:00" },
      sunday: { open: "09:00", close: "21:00" },
    },
  };

  const [updateMerchant, setUpdateMerchant] = useState(merchant);
  const [showForm, setShowForm] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dữ liệu đã cập nhật:", updateMerchant);
    setShowForm(false);
  };

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

  const mcLogo = (
    <img
      style={imageEdit.image_merchantlogo}
      src={updateMerchant.cover_image.url}
      alt={updateMerchant.merchant_name}
      width="50px"
      height="50px"
    />
  );

  if (!updateMerchant) return <>loading....</>;

  return (
    <>
      <Box style={{ background: "var(--gray-a2)", borderRadius: "var(--radius-3)" }}>
        <Container size="1" style={{ margin: "2% 10%" }}>
          <Box py="9">
            {/* --- Khung ảnh có overlay + chữ --- */}
            <Box style={imageEdit.overlay_and_font}>
              <img
                style={imageEdit.image}
                src={updateMerchant.profile_image.url}
                alt={updateMerchant.merchant_name}
              />
              <Box style={imageEdit.overlay} />
              <Box style={imageEdit.highlight_font}>
                <Box style={boxEdit.boxmcLogo}>
                  {mcLogo} <h1 style={{ margin: 0 }}>{updateMerchant.merchant_name}</h1>
                </Box>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>{updateMerchant.location.address}</p>
              </Box>
            </Box>

            {/* Thông tin chi tiết + nút Update */}
            <Flex justify="between" align="center" style={{ marginTop: "1.5rem", marginBottom: "1rem" }}>
              <h1 style={{ margin: 0, fontWeight: "bold" }}>Thông tin chi tiết</h1>
              <Button
                style={{ background: "#444", color: "white", borderRadius: "8px" }}
                onClick={() => setShowForm((prev) => !prev)}
              >
                ✏️ {showForm ? "Đóng Form" : "Update"}
              </Button>
            </Flex>

            {/* Bảng thông tin merchant */}
            <section style={boxEdit.boxSectionInfor}>
              <h2 style={boxEdit.boxH2Infor}>📋 Thông tin cửa hàng</h2>
              <Grid columns="2" gap="4" width="100%" style={{ lineHeight: "1.8", fontSize: "1rem", color: "#333" }}>
                <Box style={{ fontWeight: "bold", color: "#555" }}>🏪 Tên cửa hàng:</Box>
                <Box>{updateMerchant.merchant_name}</Box>
                <Box style={{ fontWeight: "bold", color: "#555" }}>📍 Địa chỉ:</Box>
                <Box>{updateMerchant.location.address}</Box>
                <Box style={{ fontWeight: "bold", color: "#555" }}>📞 Số điện thoại:</Box>
                <Box>
                  <a href={`tel:${updateMerchant.phone}`} style={{ color: "#0070f3", textDecoration: "none" }}>
                    {updateMerchant.phone}
                  </a>
                </Box>
                <Box style={{ fontWeight: "bold", color: "#555" }}>✉️ Email:</Box>
                <Box>
                  <a href={`mailto:${updateMerchant.email}`} style={{ color: "#0070f3", textDecoration: "none" }}>
                    {updateMerchant.email}
                  </a>
                </Box>
              </Grid>
            </section>

            {/* Giờ mở cửa */}
            <Box style={boxEdit.boxOpentime}>
              <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>🕒 Giờ mở cửa</h3>
              <Grid columns="2" gap="2" width="100%">
                {Object.entries(updateMerchant.time_open).map(([day, time]) => (
                  <Box
                    key={day}
                    style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0.75rem", borderBottom: "1px solid #eee" }}
                  >
                    <span style={{ textTransform: "capitalize" }}>{day}</span>
                    <span>
                      {time.open} - {time.close}
                    </span>
                  </Box>
                ))}
              </Grid>
            </Box>

            {/* FORM CẬP NHẬT */}
            {showForm && (
              <Box style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
                <form onSubmit={handleSubmit}>
                  <Grid columns="2" gap="3">
                    <label>
                      Tên Merchant:
                      <input type="text" name="merchant_name" value={updateMerchant.merchant_name} onChange={handleChange} />
                    </label>
                    <label>
                      Địa chỉ:
                      <input type="text" name="location.address" value={updateMerchant.location.address} onChange={handleChange} />
                    </label>
                    <label>
                      Lat:
                      <input type="number" step="0.0001" name="location.lat" value={updateMerchant.location.lat} onChange={handleChange} />
                    </label>
                    <label>
                      Lng:
                      <input type="number" step="0.0001" name="location.lng" value={updateMerchant.location.lng} onChange={handleChange} />
                    </label>
                    <label>
                      Điện thoại:
                      <input type="text" name="phone" value={updateMerchant.phone} onChange={handleChange} />
                    </label>
                    <label>
                      Email:
                      <input type="email" name="email" value={updateMerchant.email} onChange={handleChange} />
                    </label>
                    <label>
                      Ảnh đại diện URL:
                      <input type="text" name="profile_image.url" value={updateMerchant.profile_image.url} onChange={handleChange} />
                    </label>
                    <label>
                      Ảnh bìa URL:
                      <input type="text" name="cover_image.url" value={updateMerchant.cover_image.url} onChange={handleChange} />
                    </label>

                    {Object.entries(updateMerchant.time_open).map(([day, time]) => (
                      <Box key={day} style={{ gridColumn: "span 2" }}>
                        <strong>{day.toUpperCase()}</strong>
                        <Flex gap="1rem" style={{ marginTop: "0.5rem", marginBottom: "1rem" }}>
                          <input type="time" name={`time_open.${day}.open`} value={time.open} onChange={handleChange} />
                          <input type="time" name={`time_open.${day}.close`} value={time.close} onChange={handleChange} />
                        </Flex>
                      </Box>
                    ))}
                  </Grid>
                  <Button type="submit" style={{ marginTop: "1rem" }}>
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
