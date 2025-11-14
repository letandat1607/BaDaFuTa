import React from 'react';
import Navbar from '../component/merchantSys/commonMerchant/navbar';
import { useEffect } from "react";
import { Outlet } from "react-router-dom";


export default function MerchantSys() {

    useEffect(() => {
        const fetchMerchant = async () => {
            try {
                // const user = JSON.parse(localStorage.getItem("user"));
                // if (!user || !user.id) {
                //     console.warn("Không tìm thấy thông tin user trong localStorage");
                //     return;
                // }
                // const res = await fetch(`http://localhost:3000/api/merchant/getMerchant/${user.id}`, {
                //     method: "GET",
                //     headers: {
                //         "Content-Type": "application/json",
                //     },
                // });
                // const { merchant } = await res.json();
                const merchant = JSON.parse(localStorage.getItem("merchant"))
                console.log("Merchant:", merchant.merchant_name);
            } catch (err) {
                console.error("Lỗi khi fetch merchant:", err);
            }
        };

        fetchMerchant();
    }, []);
    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f9f9f9", color: "#111" }}>
            <main style={{ padding: "2rem" }}>
                <div>
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
