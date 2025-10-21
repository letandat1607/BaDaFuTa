import { useCallback, useEffect, useState } from "react";
import Navbar from "./commonMerchant/navbar";
import { Spinner, Button, Flex, TextField, Dialog, Theme, Switch } from "@radix-ui/themes";
import Card from "./commonMerchant/card";


export default function MerchantMenu() {
    const [menu, setMenu] = useState(null);
    const [categories, setCategories] = useState(null);
    const [option, setOption] = useState([]);
    const [tab, setTab] = useState("menu");
    // const [newDish, setNewDish] = useState({})
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);





    useEffect(() => {
        const getMerchantMenu = async () => {
            try {
                const merchant = JSON.parse(localStorage.getItem("merchant"))
                if (!merchant) throw new Error("Dữ liệu merchant không hợp lệ");

                const resMenu = await fetch(`http://localhost:3000/api/merchant/getMenuMerchant/${merchant.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: localStorage.getItem("token")
                    },
                });
                if (!resMenu.ok) {
                    throw new Error(`Lỗi server: ${resMenu.status}`);
                }
                const { menu, category } = await resMenu.json();

                const resOption = await fetch(`http://localhost:3000/api/merchant/getOption/${merchant.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: localStorage.getItem("token")
                    },
                });
                if (!resOption.ok) {
                    throw new Error(`Lỗi server: ${resOption.status}`);
                }
                const { option } = await resOption.json();

                console.log(menu);
                console.log(category);

                setMenu(menu);
                setCategories(category);

                console.log(option);
                setOption(option);

            } catch (err) {
                console.error("Lỗi khi khi get merchant:", err);
            }
        };

        getMerchantMenu();
    }, []);

    function handleChangeDialog(item = null) {
        setIsDialogOpen(prev => !prev); 
        setSelectedItem(item || null);

    }



    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        try {
            const merchant = JSON.parse(localStorage.getItem("merchant"));
            if (!merchant) throw new Error("Dữ liệu merchant không hợp lệ");
            console.log(merchant.id);

            if (tab === "menu") {
                const newDish = {
                    category_id: e.target.category_id?.value || null,
                    name_item: e.target.name_item?.value.trim(),
                    price: Number.parseFloat(e.target.price?.value) || 0,
                    description: e.target.description?.value.trim() || null,
                    image_item: {
                        "url": e.target.url.value.trim(),
                    }
                };
                console.log(newDish);

                const res = await fetch("http://localhost:3000/api/merchant/createMenuItem", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: localStorage.getItem("token")
                    },
                    body: JSON.stringify({ menuItem: newDish, merchant_id: merchant.id }),
                })

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || "Thêm món ăn thất bại!");
                }
                const { menu } = await res.json();
                console.log(menu);
                setMenu((prevMenu) => [...prevMenu, menu]);
                alert("Đã thêm món ăn!");
            };


            if (tab === "option_item") {
                const newOption = {
                    option_id: e.target.option_id?.value,
                    option_item_name: e.target.name_topping?.value.trim(),
                    price: Number.parseFloat(e.target.price_topping?.value) || 0,
                    status: true,
                    status_select: e.target.checkbox?.checked || false,
                };
                console.log(newOption);

                const res = await fetch("http://localhost:3000/api/merchant/createOptionItem", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: localStorage.getItem("token")
                    },
                    body: JSON.stringify({ optionItem: newOption }),
                })

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || "Thêm món ăn thất bại!");
                }
                const { opt } = await res.json();
                console.log(opt);
                setOption((prevMenu) => [...prevMenu, opt]);
                alert("Đã thêm topping!");
            };


        } catch (err) {
            console.error("Lỗi khi thêm monffffffffffffffffffffffffff ăn:", err);
        }
    }, [tab, setMenu, setOption]);



    const handleChangeStatus = useCallback(async (checked, item, field, type) => {
        try {
            const merchant = JSON.parse(localStorage.getItem("merchant"));
            if (!merchant) throw new Error("Dữ liệu merchant không hợp lệ");

            const updatedItem = { ...item, status: checked };
            const updatedOption = { ...item, [field]: checked };

            console.log(updatedOption);
            if (type === "option") {
                const res = await fetch(`http://localhost:3000/api/merchant/updateOption/${item.id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: localStorage.getItem("token"),
                    },
                    body: JSON.stringify({ newOption: updatedOption, merchant_id: merchant.id }),
                });

                console.log(updatedOption);
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || "Cập nhật Option thất bại");
                }

                setOption(prev =>
                    prev.map(opt =>
                        opt.id === item.id ? { ...opt, [field]: checked } : opt
                    )
                );
            }

            else if (type === "option_item") {
                const res = await fetch(`http://localhost:3000/api/merchant/updateOptionItem/${item.id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: localStorage.getItem("token"),
                    },
                    body: JSON.stringify({ newOptionItem: updatedItem, merchant_id: merchant.id }),
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || "Cập nhật Option Item thất bại");
                }

                setOption(prev =>
                    prev.map(opt => ({
                        ...opt,
                        option_items: opt.option_items.map(oi =>
                            oi.id === item.id ? { ...oi, status: checked } : oi
                        )
                    }))
                );
            }

            else if (type === "menu") {
                const res = await fetch(`http://localhost:3000/api/merchant/updateMenuItem/${item.id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: localStorage.getItem("token"),
                    },
                    body: JSON.stringify({ newItem: updatedItem, merchant_id: merchant.id }),
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || "Cập nhật món ăn thất bại");
                }

                setMenu(prev => prev.map(m => (m.id === item.id ? updatedItem : m)));
            }

        } catch (err) {
            console.error(" Lỗi khi cập nhật:", err);
        }
    }, [setMenu, setOption]);











    const handleUpdateItem = useCallback(async (e, item) => {
        e.preventDefault();
        try {

            const merchant = JSON.parse(localStorage.getItem("merchant"));
            if (!merchant) throw new Error("Dữ liệu merchant không hợp lệ");
            console.log(merchant.id);

            if (tab === "menu") {
                const newDish = {
                    category_id: e.target.category_id?.value || null,
                    name_item: e.target.name_item?.value.trim(),
                    price: Number.parseFloat(e.target.price?.value) || 0,
                    description: e.target.description?.value.trim() || null,
                    image_item: {
                        "url": e.target.url.value.trim(),
                    }
                };
                console.log(newDish);

                const res = await fetch("http://localhost:3000/api/merchant/createMenuItem", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: localStorage.getItem("token")
                    },
                    body: JSON.stringify({ menuItem: newDish, merchant_id: merchant.id }),
                })

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || "Thêm món ăn thất bại!");
                }
                const { menu } = await res.json();
                console.log(menu);
                setMenu((prevMenu) => [...prevMenu, menu]);
                alert("Đã thêm món ăn!");
            };


            if (tab === "option_item") {
                const newOption = {
                    option_id: e.target.option_id?.value,
                    option_item_name: e.target.name_topping?.value.trim(),
                    price: Number.parseFloat(e.target.price_topping?.value) || 0,
                    status: item.status,
                    status_select: e.target.checkbox?.checked || false,
                };

                const res = await fetch(`http://localhost:3000/api/merchant/updateOptionItem/${item.id}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", authorization: localStorage.getItem("token") },
                    body: JSON.stringify({ newOptionItem: newOption, merchant_id: merchant.id }),
                });
                console.log(newOption);


                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || "Change status failed");
                }
                console.log(newOption);

                setOption(prev =>
                    prev.map(opt => ({
                        ...opt,
                        option_items: opt.option_items.map(oi =>
                            oi.id === item.id ? { ...oi, ...newOption } : oi
                        )
                    }))
                );



            };


        } catch (err) {
            console.error("Lỗi khi thêm monffffffffffffffffffffffffff ăn:", err);
        }
    }, [tab, setMenu, setOption]);




    if (!menu || !categories || !option) return (<h1>tfdtdtfc</h1>);

    function handleTabButton(e) {
        setTab(e.currentTarget.name);
    };



    return (




        <Theme>

            <header>
                <Navbar />
            </header>
            <main style={{ marginTop: "2%" }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-around",
                    margin: "10px 10% 10px 10%",
                    height: "auto",
                    padding: "2%"
                }}>
                    <Button name="menu" color="indigo" variant="soft" onClick={handleTabButton}>
                        Món
                    </Button>
                    <Button name="option_item" color="cyan" variant="soft" onClick={handleTabButton}>
                        Topping
                    </Button>
                    <Button color="orange" variant="soft">
                        Danh mục
                    </Button>
                </div>
                <div style={{
                    margin: "10px 10% 10px 10%",
                    border: "1px solid black",
                    borderRadius: "25px",
                    height: "auto",
                    padding: "2%"
                }}>


                    {/* ///////////////////////////////////////////////////// */}
                    <div>
                        {/* Tab mon */}
                        {tab === "menu" && (
                            <>
                                {/* nut edit */}
                                <div>
                                    <div>
                                        <Dialog.Root>
                                            <Dialog.Trigger>
                                                <Button>Edit profile</Button>
                                            </Dialog.Trigger>

                                            <Dialog.Content
                                                maxWidth="500px"
                                                style={{
                                                    backgroundColor: "white",
                                                    borderRadius: "12px",
                                                    padding: "24px",
                                                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                                }}
                                            >
                                                <Dialog.Title style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>
                                                    Thêm món ăn
                                                </Dialog.Title>
                                                <Dialog.Description style={{ marginBottom: "16px", color: "#555" }}>
                                                    Điền thông tin bên dưới để thêm món ăn mới
                                                </Dialog.Description>

                                                <div style={{ padding: "10px", width: "80%" }}>

                                                    <form
                                                        onSubmit={handleSubmit}
                                                    >
                                                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                                            <div>
                                                                <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                                                                    Hình ảnh
                                                                </label>
                                                                <input
                                                                    type="file"
                                                                    name="url"
                                                                    accept="image/*"
                                                                    style={{
                                                                        width: "100%",
                                                                        padding: "8px",
                                                                        border: "1px solid #ccc",
                                                                        borderRadius: "6px",
                                                                    }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                                                                    Tên món ăn
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="name_item"
                                                                    placeholder="Nhập tên món ăn"
                                                                    required
                                                                    style={{
                                                                        width: "100%",
                                                                        padding: "10px",
                                                                        border: "1px solid #ccc",
                                                                        borderRadius: "6px",
                                                                        fontSize: "14px",
                                                                    }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                                                                    Giá (VNĐ)
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    name="price"
                                                                    placeholder="Ví dụ: 45000"
                                                                    required
                                                                    style={{
                                                                        width: "100%",
                                                                        padding: "10px",
                                                                        border: "1px solid #ccc",
                                                                        borderRadius: "6px",
                                                                        fontSize: "14px",
                                                                    }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                                                                    Danh mục (tuỳ chọn)
                                                                </label>
                                                                <select
                                                                    name="category_id"
                                                                    defaultValue=""
                                                                    style={{
                                                                        width: "100%",
                                                                        padding: "10px",
                                                                        border: "1px solid #ccc",
                                                                        borderRadius: "6px",
                                                                        fontSize: "14px",
                                                                        backgroundColor: "white",
                                                                    }}
                                                                >
                                                                    <option value="">Không có</option>
                                                                    {categories?.map((cat) => (
                                                                        <option key={cat.id} value={cat.id}>
                                                                            {cat.category_name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                                                                    Mô tả món ăn
                                                                </label>
                                                                <textarea
                                                                    name="description"
                                                                    rows="3"
                                                                    placeholder="Mô tả chi tiết món ăn..."
                                                                    style={{
                                                                        width: "100%",
                                                                        padding: "10px",
                                                                        border: "1px solid #ccc",
                                                                        borderRadius: "6px",
                                                                        fontSize: "14px",
                                                                        resize: "vertical",
                                                                    }}
                                                                ></textarea>
                                                            </div>
                                                        </div>
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                justifyContent: "flex-end",
                                                                gap: "12px",
                                                                marginTop: "24px",
                                                            }}
                                                        >
                                                            <Dialog.Close>
                                                                <button
                                                                    type="button"
                                                                    style={{
                                                                        backgroundColor: "#eee",
                                                                        color: "#333",
                                                                        border: "none",
                                                                        borderRadius: "6px",
                                                                        padding: "8px 16px",
                                                                        cursor: "pointer",
                                                                    }}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </Dialog.Close>

                                                            <Dialog.Close>
                                                                <button
                                                                    type="submit"
                                                                    style={{
                                                                        backgroundColor: "#4CAF50",
                                                                        color: "white",
                                                                        border: "none",
                                                                        borderRadius: "6px",
                                                                        padding: "8px 16px",
                                                                        cursor: "pointer",
                                                                    }}
                                                                >
                                                                    Save
                                                                </button>
                                                            </Dialog.Close>
                                                        </div>
                                                    </form>
                                                </div>
                                            </Dialog.Content>

                                        </Dialog.Root>
                                    </div>
                                </div>

                                <div>
                                    {/* Component Danh mucj */}
                                    <div tab="menu">
                                        {categories.map((category) => (
                                            <div key={category.id} style={{ marginBottom: "2px" }}>
                                                <h2
                                                    style={{
                                                        fontSize: "20px",
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    {category.category_name}
                                                </h2>

                                                <div
                                                    style={{
                                                        display: "flex",
                                                        gap: "16px",
                                                        overflowX: "auto",
                                                        scrollSnapType: "x mandatory",
                                                        scrollBehavior: "smooth",
                                                        padding: "16px",
                                                        scrollbarWidth: "none",
                                                    }}
                                                >
                                                    {menu
                                                        .filter((item) => item.category_id === category.id)
                                                        .map((item) => (
                                                            <div
                                                                key={item.id}
                                                                style={{
                                                                    flex: "0 0 auto",
                                                                    scrollSnapAlign: "start",
                                                                }}
                                                            >
                                                                <Card handleUpdateItem={handleUpdateItem} value={tab} item={item} handleChangeStatus={handleChangeStatus} />
                                                                <p>{item.status}</p>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/*  mon an khong co danh muc */}
                                    <div tab="menu">
                                        {menu.some(
                                            (item) =>
                                                !item.category_id ||
                                                !categories.find((cat) => cat.id === item.category_id)
                                        ) && (
                                                <div style={{ marginBottom: "32px" }}>
                                                    <h2
                                                        style={{
                                                            fontSize: "20px",
                                                            fontWeight: "600",
                                                        }}
                                                    >
                                                        Không có danh mục
                                                    </h2>

                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            gap: "16px",
                                                            overflowX: "auto",
                                                            scrollSnapType: "x mandatory",
                                                            scrollBehavior: "smooth",
                                                            padding: "16px",
                                                            scrollbarWidth: "none",
                                                        }}
                                                    >
                                                        {menu
                                                            .filter(
                                                                (item) =>
                                                                    !item.category_id ||
                                                                    !categories.find(
                                                                        (cat) => cat.id === item.category_id
                                                                    )
                                                            )
                                                            .map((item) => (
                                                                <div
                                                                    key={item.id}
                                                                    style={{
                                                                        flex: "0 0 auto",
                                                                        scrollSnapAlign: "start",
                                                                    }}
                                                                >
                                                                    <Card handleUpdateItem={handleUpdateItem} value={tab} item={item} />
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </>
                        )}


                        {tab === "option_item" && (
                            <>
                                {/* Tab Topping */}
                                <div>

                                    {/* nut edit */}
                                    <div>
                                        <div>
                                            <Dialog.Root>
                                                <Dialog.Trigger>
                                                    <Button>Edit profile</Button>
                                                </Dialog.Trigger>

                                                <Dialog.Content
                                                    maxWidth="500px"
                                                    style={{
                                                        backgroundColor: "white",
                                                        borderRadius: "12px",
                                                        padding: "24px",
                                                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                                    }}
                                                >
                                                    <Dialog.Title style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>
                                                        Thêm Topping mới
                                                    </Dialog.Title>
                                                    <Dialog.Description style={{ marginBottom: "16px", color: "#555" }}>
                                                        Điền thông tin bên dưới để topping
                                                    </Dialog.Description>

                                                    <div style={{ padding: "10px", width: "80%" }}>

                                                        <form
                                                            onSubmit={handleSubmit}
                                                        >
                                                            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                                                <div>
                                                                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                                                                        Tên Topping
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        name="name_topping"
                                                                        placeholder="Nhập tên topping"
                                                                        required
                                                                        style={{
                                                                            width: "100%",
                                                                            padding: "10px",
                                                                            border: "1px solid #ccc",
                                                                            borderRadius: "6px",
                                                                            fontSize: "14px",
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                                                                        Giá (VNĐ)
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        name="price_topping"
                                                                        placeholder="Ví dụ: 45000"
                                                                        required
                                                                        style={{
                                                                            width: "100%",
                                                                            padding: "10px",
                                                                            border: "1px solid #ccc",
                                                                            borderRadius: "6px",
                                                                            fontSize: "14px",
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                                                                        Danh mục (tuỳ chọn)
                                                                    </label>
                                                                    <select
                                                                        name="option_id"
                                                                        defaultValue=""
                                                                        style={{
                                                                            width: "100%",
                                                                            padding: "10px",
                                                                            border: "1px solid #ccc",
                                                                            borderRadius: "6px",
                                                                            fontSize: "14px",
                                                                            backgroundColor: "white",
                                                                        }}
                                                                    >
                                                                        <option value="">Không có</option>
                                                                        {option?.map((opt) => (
                                                                            <option key={opt.id} value={opt.id}>
                                                                                {opt.option_name}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div>
                                                                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                                                                        Chọn nhiều món ?
                                                                    </label>
                                                                    <input
                                                                        type="checkbox"
                                                                        name="checkbox"
                                                                        style={{
                                                                            width: "20px",
                                                                            height: "20px",
                                                                            marginRight: "10px",
                                                                            verticalAlign: "middle",
                                                                        }}
                                                                    />
                                                                    <span>Đánh dấu nếu muốn bật</span>
                                                                </div>
                                                            </div>
                                                            <div
                                                                style={{
                                                                    display: "flex",
                                                                    justifyContent: "flex-end",
                                                                    gap: "12px",
                                                                    marginTop: "24px",
                                                                }}
                                                            >
                                                                <Dialog.Close>
                                                                    <button
                                                                        type="button"
                                                                        style={{
                                                                            backgroundColor: "#eee",
                                                                            color: "#333",
                                                                            border: "none",
                                                                            borderRadius: "6px",
                                                                            padding: "8px 16px",
                                                                            cursor: "pointer",
                                                                        }}
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </Dialog.Close>

                                                                <Dialog.Close>
                                                                    <button
                                                                        type="submit"
                                                                        style={{
                                                                            backgroundColor: "#4CAF50",
                                                                            color: "white",
                                                                            border: "none",
                                                                            borderRadius: "6px",
                                                                            padding: "8px 16px",
                                                                            cursor: "pointer",
                                                                        }}
                                                                    >
                                                                        Save
                                                                    </button>
                                                                </Dialog.Close>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </Dialog.Content>

                                            </Dialog.Root>
                                        </div>
                                    </div>

                                    {/* nhom topping */}
                                    <div tab="option_item">
                                        {option.map((item) => (
                                            <div key={item.id} style={{ marginBottom: "2px" }}>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "flex-start",
                                                        gap: "60px",
                                                    }}
                                                >
                                                    <h2
                                                        style={{
                                                            fontSize: "20px",
                                                            fontWeight: "600",
                                                            margin: 0,
                                                        }}
                                                    >
                                                        {item.option_name}
                                                    </h2>

                                                    <div tab="option"
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "60px",
                                                        }}
                                                    >
                                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                            <span style={{ fontSize: "14px", color: "#333" }}>Chọn nhiều món</span>
                                                            <Switch
                                                                color={item.multi_select ? "orange" : "gray"}
                                                                checked={item.multi_select}
                                                                onCheckedChange={(checked) => handleChangeStatus(checked, item, "multi_select", "option")}
                                                            />
                                                        </div>

                                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                            <span style={{ fontSize: "14px", color: "#333" }}>Bắt buộc chọn món</span>
                                                            <Switch
                                                                color={item.require_select ? "orange" : "gray"}
                                                                checked={item.require_select}
                                                                onCheckedChange={(checked) => handleChangeStatus(checked, item, "require_select", "option")}
                                                            />
                                                        </div>

                                                    </div>
                                                </div>

                                                <div tab="option_item"
                                                    style={{
                                                        display: "flex",
                                                        gap: "16px",
                                                        overflowX: "auto",
                                                        scrollSnapType: "x mandatory",
                                                        scrollBehavior: "smooth",
                                                        padding: "16px",
                                                        scrollbarWidth: "none",
                                                    }}
                                                >
                                                    {item.option_items.map((optItem) => (
                                                        <div
                                                            key={optItem.id}
                                                            style={{
                                                                flex: "0 0 auto",
                                                                scrollSnapAlign: "start",
                                                            }}
                                                        >

                                                            <Card handleOpenDialog={() => handleChangeDialog(optItem)} value={tab} item={optItem} handleChangeStatus={handleChangeStatus} />
                                                            <p>{optItem.status ? "Đang bật" : "Tắt"}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Dialog sua Option */}
                                    <div>

                                        <Dialog.Root open={isDialogOpen} >

                                            <Dialog.Content
                                                maxWidth="500px"
                                                style={{
                                                    backgroundColor: "white",
                                                    borderRadius: "12px",
                                                    padding: "24px",
                                                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                                }}
                                            >
                                                <Dialog.Title style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>
                                                    Sửa Topping
                                                </Dialog.Title>
                                                <Dialog.Description style={{ marginBottom: "16px", color: "#555" }}>
                                                    Điền thông tin bên dưới để sửa topping
                                                </Dialog.Description>

                                                <div style={{ padding: "10px", width: "80%" }}>

                                                    <form onSubmit={(e) => handleUpdateItem(e, selectedItem)}>

                                                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                                            <div>
                                                                <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                                                                    Tên Topping
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="name_topping"
                                                                    defaultValue={selectedItem?.option_item_name || ""}


                                                                    required
                                                                    style={{
                                                                        width: "100%",
                                                                        padding: "10px",
                                                                        border: "1px solid #ccc",
                                                                        borderRadius: "6px",
                                                                        fontSize: "14px",
                                                                    }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                                                                    Giá (VNĐ)
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    name="price_topping"
                                                                    defaultValue={selectedItem?.price || ""}
                                                                    required
                                                                    style={{
                                                                        width: "100%",
                                                                        padding: "10px",
                                                                        border: "1px solid #ccc",
                                                                        borderRadius: "6px",
                                                                        fontSize: "14px",
                                                                    }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                                                                    Danh mục (tuỳ chọn)
                                                                </label>
                                                                <select
                                                                    name="option_id"
                                                                    defaultValue={selectedItem?.option_id || ""}
                                                                    style={{
                                                                        width: "100%",
                                                                        padding: "10px",
                                                                        border: "1px solid #ccc",
                                                                        borderRadius: "6px",
                                                                        fontSize: "14px",
                                                                        backgroundColor: "white",
                                                                    }}
                                                                >
                                                                    <option value=""> {option?.find(opt => opt.id === selectedItem?.option_id)?.option_name || "Không có"}  </option>
                                                                    {option?.map((opt) => (
                                                                        <option key={opt.id} value={opt.id}>
                                                                            {opt.option_name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                                                                    Mặc định ?
                                                                </label>
                                                                <input
                                                                    type="checkbox"
                                                                    name="checkbox"
                                                                    defaultChecked={selectedItem?.status_select}

                                                                    style={{
                                                                        width: "20px",
                                                                        height: "20px",
                                                                        marginRight: "10px",
                                                                        verticalAlign: "middle",
                                                                    }}
                                                                />
                                                                <span>Đánh dấu nếu muốn bật</span>
                                                            </div>
                                                        </div>
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                justifyContent: "flex-end",
                                                                gap: "12px",
                                                                marginTop: "24px",
                                                            }}
                                                        >
                                                            <Dialog.Close onClick={handleChangeDialog}>
                                                                <button
                                                                    type="button"
                                                                    style={{
                                                                        backgroundColor: "#eee",
                                                                        color: "#333",
                                                                        border: "none",
                                                                        borderRadius: "6px",
                                                                        padding: "8px 16px",
                                                                        cursor: "pointer",
                                                                    }}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </Dialog.Close>

                                                            <Dialog.Close>
                                                                <button
                                                                    type="submit"
                                                                    style={{
                                                                        backgroundColor: "#4CAF50",
                                                                        color: "white",
                                                                        border: "none",
                                                                        borderRadius: "6px",
                                                                        padding: "8px 16px",
                                                                        cursor: "pointer",
                                                                    }}
                                                                >
                                                                    Save
                                                                </button>
                                                            </Dialog.Close>
                                                        </div>
                                                    </form>
                                                </div>
                                            </Dialog.Content>

                                        </Dialog.Root>
                                    </div>

                                </div>
                            </>
                        )}

                        {/* Tab Danh muc */}
                        <div>

                        </div>
                        <div>

                        </div>

                    </div>



                </div>
            </main>
            <>

            </>
        </Theme >





    );
}
