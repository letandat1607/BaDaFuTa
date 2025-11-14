// import { useState, useEffect } from "react";
import { useCallback, useEffect, useState } from "react";
import Navbar from "./commonMerchant/navbar";
import { Spinner, Button, Flex, TextField, Dialog, Theme, Switch } from "@radix-ui/themes";
import Card from "./commonMerchant/card";
import { io } from "socket.io-client";


export default function MerchantOrders() {
    const [orders, setOrders] = useState([]);
    const [tab, setTab] = useState("waiting");
    // const [newDish, setNewDish] = useState({})
    // const orders =
    //     [
    //         {
    //             "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //             "full_name": "Nguyễn Văn A",
    //             "phone": "0901234567",
    //             "delivery_address": "123 Lê Lợi, Quận 1, TP.HCM",
    //             "delivery_fee": 15000,
    //             "note": "Giao giờ trưa",
    //             "method": "VNPAY",
    //             "order_items": [
    //                 {
    //                     "menu_item_id": "67c9f1ab-8d0a-4c85-87aa-1a2bbf02d0f3",
    //                     "quantity": 2,
    //                     "price": 65000,
    //                     "note": "ít cay",
    //                     "options": [
    //                         { "option_item_id": "98d2b771-1234-4acb-a21c-7c5a5d6b4a21" },
    //                         { "option_item_id": "ab7d93f0-8bca-4e0a-9137-b6fbe92da8cd" }
    //                     ]
    //                 },
    //                 {
    //                     "menu_item_id": "e2a8b2f9-77dd-45b0-8b11-0d8fbc79e6d4",
    //                     "quantity": 1,
    //                     "price": 120000,
    //                     "note": "",
    //                     "options": []
    //                 },
    //                 {
    //                     "menu_item_id": "e2a8b2f9-77dd-45b0-8b11-0d8fbc79e6d7",
    //                     "quantity": 1,
    //                     "price": 120000,
    //                     "note": "",
    //                     "options": [
    //                         { "option_item_id": "98d2b771-1234-4acb-a21c-7c5a5d6b4a21" },
    //                         { "option_item_id": "ab7d93f0-8bca-4e0a-9137-b6fbe92da8cd" }
    //                     ]
    //                 }
    //             ],
    //             "total_amount": 265000,
    //             "status": "waiting",
    //             "status_payment": "pending",
    //             "created_at": "2025-10-24T14:35:00Z",
    //             "update_at": "2025-10-24T14:35:00Z"
    //         },
    //         {
    //             "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //             "full_name": "Trần Thị B",
    //             "phone": "0912345678",
    //             "delivery_address": "45 Nguyễn Huệ, Quận 1, TP.HCM",
    //             "delivery_fee": 20000,
    //             "note": "Giao nhanh giúp mình",
    //             "method": "CASH",
    //             "order_items": [
    //                 {
    //                     "menu_item_id": "a8c2d1a9-1bcd-46e9-8f1a-234beff5f321",
    //                     "quantity": 3,
    //                     "price": 50000,
    //                     "note": "",
    //                     "options": []
    //                 }
    //             ],
    //             "total_amount": 170000,
    //             "status": "waiting",
    //             "status_payment": "paid",
    //             "created_at": "2025-10-23T09:15:00Z",
    //             "update_at": "2025-10-23T09:45:00Z"
    //         },
    //         {
    //             "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //             "full_name": "Lê Văn C",
    //             "phone": "0987654321",
    //             "delivery_address": "12 Võ Thị Sáu, Quận 3, TP.HCM",
    //             "delivery_fee": 10000,
    //             "note": "Gọi trước khi tới",
    //             "method": "MOMO",
    //             "order_items": [
    //                 {
    //                     "menu_item_id": "c1b2e9f7-8a1d-4b31-a22f-11aa3b2ccdd1",
    //                     "quantity": 1,
    //                     "price": 85000,
    //                     "note": "Không hành",
    //                     "options": []
    //                 }
    //             ],
    //             "total_amount": 95000,
    //             "status": "waiting",
    //             "status_payment": "paid",
    //             "created_at": "2025-10-22T17:00:00Z",
    //             "update_at": "2025-10-22T18:00:00Z"
    //         },
    //         {
    //             "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //             "full_name": "Phạm Duy D",
    //             "phone": "0934123456",
    //             "delivery_address": "88 Lý Thường Kiệt, Quận 10, TP.HCM",
    //             "delivery_fee": 12000,
    //             "note": "Đưa tận cửa, có chó sợ nha",
    //             "method": "VNPAY",
    //             "order_items": [
    //                 {
    //                     "menu_item_id": "de9f8a2b-9a4c-49f9-9bbf-cc99a1a0cc33",
    //                     "quantity": 4,
    //                     "price": 30000,
    //                     "note": "",
    //                     "options": []
    //                 }
    //             ],
    //             "total_amount": 132000,
    //             "status": "waiting",
    //             "status_payment": "refunded",
    //             "created_at": "2025-10-20T13:30:00Z",
    //             "update_at": "2025-10-20T13:50:00Z"
    //         },
    //         {
    //             "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //             "full_name": "Đinh Thị E",
    //             "phone": "0909988776",
    //             "delivery_address": "56 Cách Mạng Tháng 8, Quận 10, TP.HCM",
    //             "delivery_fee": 18000,
    //             "note": "Cho thêm muỗng, đũa nha",
    //             "method": "CASH",
    //             "order_items": [
    //                 {
    //                     "menu_item_id": "123a4b5c-678d-4e9f-9123-9aa4d4e8b222",
    //                     "quantity": 2,
    //                     "price": 70000,
    //                     "note": "",
    //                     "options": []
    //                 }
    //             ],
    //             "total_amount": 158000,
    //             "status": "waiting",
    //             "status_payment": "pending",
    //             "created_at": "2025-10-24T08:00:00Z",
    //             "update_at": "2025-10-24T08:05:00Z"
    //         },
    //         {
    //             "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //             "full_name": "Bùi Văn F",
    //             "phone": "0902345678",
    //             "delivery_address": "27 Hai Bà Trưng, Quận 1, TP.HCM",
    //             "delivery_fee": 10000,
    //             "note": "Cổng số 2, chung cư A",
    //             "method": "MOMO",
    //             "order_items": [
    //                 {
    //                     "menu_item_id": "67c9f1ab-8d0a-4c85-87aa-1a2bbf02d0f3",
    //                     "quantity": 1,
    //                     "price": 65000,
    //                     "note": "Không cay",
    //                     "options": []
    //                 }
    //             ],
    //             "total_amount": 75000,
    //             "status": "waiting",
    //             "status_payment": "paid",
    //             "created_at": "2025-10-18T10:00:00Z",
    //             "update_at": "2025-10-18T11:00:00Z"
    //         },
    //         {
    //             "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //             "full_name": "Nguyễn Thị G",
    //             "phone": "0933555777",
    //             "delivery_address": "21 Trần Hưng Đạo, Quận 5, TP.HCM",
    //             "delivery_fee": 16000,
    //             "note": "Đừng bấm chuông, gọi điện",
    //             "method": "ZALOPAY",
    //             "order_items": [
    //                 {
    //                     "menu_item_id": "e2a8b2f9-77dd-45b0-8b11-0d8fbc79e6d4",
    //                     "quantity": 1,
    //                     "price": 120000,
    //                     "note": "Không hành",
    //                     "options": []
    //                 }
    //             ],
    //             "total_amount": 136000,
    //             "status": "waiting",
    //             "status_payment": "paid",
    //             "created_at": "2025-10-21T15:00:00Z",
    //             "update_at": "2025-10-21T15:45:00Z"
    //         },
    //         {
    //             "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //             "full_name": "Phan Quốc H",
    //             "phone": "0977123456",
    //             "delivery_address": "90 Nguyễn Văn Cừ, Quận 5, TP.HCM",
    //             "delivery_fee": 12000,
    //             "note": "Cho thêm ớt sa tế",
    //             "method": "VNPAY",
    //             "order_items": [
    //                 {
    //                     "menu_item_id": "b9a8e7d6-5a44-4d1b-b3a3-d3f44fa7c888",
    //                     "quantity": 2,
    //                     "price": 90000,
    //                     "note": "",
    //                     "options": []
    //                 }
    //             ],
    //             "total_amount": 192000,
    //             "status": "cancel",
    //             "status_payment": "pending",
    //             "created_at": "2025-10-19T09:00:00Z",
    //             "update_at": "2025-10-19T09:30:00Z"
    //         },
    //         {
    //             "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //             "full_name": "Võ Anh I",
    //             "phone": "0911777333",
    //             "delivery_address": "12 Hoàng Văn Thụ, Tân Bình, TP.HCM",
    //             "delivery_fee": 10000,
    //             "note": "Giao trước 11h",
    //             "method": "MOMO",
    //             "order_items": [
    //                 {
    //                     "menu_item_id": "f3b1d4e2-6a9b-45dd-aaf9-bb9d3e0e3a91",
    //                     "quantity": 3,
    //                     "price": 45000,
    //                     "note": "",
    //                     "options": []
    //                 }
    //             ],
    //             "total_amount": 145000,
    //             "status": "accept",
    //             "status_payment": "paid",
    //             "created_at": "2025-10-24T07:30:00Z",
    //             "update_at": "2025-10-24T07:50:00Z"
    //         },
    //         {
    //             "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //             "full_name": "Ngô Thị K",
    //             "phone": "0908877665",
    //             "delivery_address": "100 Điện Biên Phủ, Bình Thạnh, TP.HCM",
    //             "delivery_fee": 15000,
    //             "note": "Không để ớt",
    //             "method": "CASH",
    //             "order_items": [
    //                 {
    //                     "menu_item_id": "77e2c1a9-9fbb-48e9-bb2b-123b4f5c9d7a",
    //                     "quantity": 2,
    //                     "price": 60000,
    //                     "note": "",
    //                     "options": []
    //                 }
    //             ],
    //             "total_amount": 135000,
    //             "status": "complete",
    //             "status_payment": "paid",
    //             "created_at": "2025-10-16T14:00:00Z",
    //             "update_at": "2025-10-16T14:30:00Z"
    //         },
    //         {
    //             "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //             "full_name": "Trịnh Văn L",
    //             "phone": "0905551111",
    //             "delivery_address": "23 Nguyễn Trãi, Quận 5, TP.HCM",
    //             "delivery_fee": 12000,
    //             "note": "Giao giờ trưa, không bấm chuông",
    //             "method": "MOMO",
    //             "order_items": [
    //                 { "menu_item_id": "ab1d2e3f-4a5b-678c-9d10-112233445566", "quantity": 2, "price": 55000, "note": "Không ớt", "options": [] }
    //             ],
    //             "total_amount": 122000,
    //             "status": "waiting",
    //             "status_payment": "pending",
    //             "created_at": "2025-10-24T10:15:00Z",
    //             "update_at": "2025-10-24T10:20:00Z"
    //         },
    //         {
    //             "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //             "full_name": "Đặng Thị M",
    //             "phone": "0933444555",
    //             "delivery_address": "14 Lê Văn Sỹ, Quận 3, TP.HCM",
    //             "delivery_fee": 10000,
    //             "note": "Gọi trước khi giao",
    //             "method": "ZALOPAY",
    //             "order_items": [
    //                 { "menu_item_id": "98b7c6a5-4321-4e9f-b987-abcdef123456", "quantity": 1, "price": 85000, "note": "Không hành", "options": [] }
    //             ],
    //             "total_amount": 95000,
    //             "status": "waiting",
    //             "status_payment": "paid",
    //             "created_at": "2025-10-24T09:40:00Z",
    //             "update_at": "2025-10-24T09:50:00Z"
    //         },
    //         {
    //             "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //             "full_name": "Phạm Minh N",
    //             "phone": "0977888999",
    //             "delivery_address": "55 Nguyễn Kiệm, Gò Vấp, TP.HCM",
    //             "delivery_fee": 15000,
    //             "note": "",
    //             "method": "CASH",
    //             "order_items": [
    //                 { "menu_item_id": "22334455-6677-8899-aabb-ccddeeff0011", "quantity": 3, "price": 40000, "note": "", "options": [] }
    //             ],
    //             "total_amount": 135000,
    //             "status": "waiting",
    //             "status_payment": "pending",
    //             "created_at": "2025-10-24T11:10:00Z",
    //             "update_at": "2025-10-24T11:15:00Z"
    //         },
    //         {
    //             "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //             "full_name": "Ngô Văn O",
    //             "phone": "0911222333",
    //             "delivery_address": "78 Trần Quang Khải, Quận 1, TP.HCM",
    //             "delivery_fee": 16000,
    //             "note": "Thêm ống hút",
    //             "method": "VNPAY",
    //             "order_items": [
    //                 { "menu_item_id": "33445566-7788-99aa-bbcc-ddeeff001122", "quantity": 1, "price": 120000, "note": "", "options": [] }
    //             ],
    //             "total_amount": 136000,
    //             "status": "waiting",
    //             "status_payment": "paid",
    //             "created_at": "2025-10-24T10:30:00Z",
    //             "update_at": "2025-10-24T10:35:00Z"
    //         },
    //         {
    //             "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //             "full_name": "Vũ Thị P",
    //             "phone": "0909992222",
    //             "delivery_address": "45 Phạm Ngọc Thạch, Quận 3, TP.HCM",
    //             "delivery_fee": 10000,
    //             "note": "Không bỏ tiêu",
    //             "method": "CASH",
    //             "order_items": [
    //                 { "menu_item_id": "44556677-8899-aabb-ccdd-eeff00112233", "quantity": 2, "price": 60000, "note": "", "options": [] }
    //             ],
    //             "total_amount": 130000,
    //             "status": "waiting",
    //             "status_payment": "pending",
    //             "created_at": "2025-10-24T12:00:00Z",
    //             "update_at": "2025-10-24T12:10:00Z"
    //         },
    //         {
    //             "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //             "full_name": "Lâm Quốc Q",
    //             "phone": "0933111222",
    //             "delivery_address": "19 Nguyễn Oanh, Gò Vấp, TP.HCM",
    //             "delivery_fee": 15000,
    //             "note": "Cần giao sớm",
    //             "method": "MOMO",
    //             "order_items": [
    //                 { "menu_item_id": "55667788-99aa-bbcc-ddee-ff0011223344", "quantity": 1, "price": 70000, "note": "", "options": [] }
    //             ],
    //             "total_amount": 85000,
    //             "status": "waiting",
    //             "status_payment": "paid",
    //             "created_at": "2025-10-24T13:00:00Z",
    //             "update_at": "2025-10-24T13:05:00Z"
    //         },
    //         {
    //             "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //             "full_name": "Đỗ Thị R",
    //             "phone": "0907333444",
    //             "delivery_address": "88 Nguyễn Văn Linh, Quận 7, TP.HCM",
    //             "delivery_fee": 18000,
    //             "note": "Giao cổng phụ",
    //             "method": "VNPAY",
    //             "order_items": [
    //                 { "menu_item_id": "66778899-aabb-ccdd-eeff-001122334455", "quantity": 2, "price": 90000, "note": "", "options": [] }
    //             ],
    //             "total_amount": 198000,
    //             "status": "waiting",
    //             "status_payment": "pending",
    //             "created_at": "2025-10-24T14:10:00Z",
    //             "update_at": "2025-10-24T14:15:00Z"
    //         },
    //         {
    //             "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //             "full_name": "Phùng Minh S",
    //             "phone": "0977333444",
    //             "delivery_address": "35 Pasteur, Quận 1, TP.HCM",
    //             "delivery_fee": 12000,
    //             "note": "",
    //             "method": "ZALOPAY",
    //             "order_items": [
    //                 { "menu_item_id": "778899aa-bbcc-ddee-ff00-112233445566", "quantity": 1, "price": 65000, "note": "", "options": [] }
    //             ],
    //             "total_amount": 77000,
    //             "status": "waiting",
    //             "status_payment": "paid",
    //             "created_at": "2025-10-24T15:00:00Z",
    //             "update_at": "2025-10-24T15:05:00Z"
    //         },
    //         {
    //             "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //             "full_name": "Nguyễn Văn T",
    //             "phone": "0911555666",
    //             "delivery_address": "60 Phan Xích Long, Phú Nhuận, TP.HCM",
    //             "delivery_fee": 15000,
    //             "note": "Thêm nước chấm",
    //             "method": "CASH",
    //             "order_items": [
    //                 { "menu_item_id": "8899aabb-ccdd-eeff-0011-223344556677", "quantity": 2, "price": 80000, "note": "", "options": [] }
    //             ],
    //             "total_amount": 175000,
    //             "status": "waiting",
    //             "status_payment": "pending",
    //             "created_at": "2025-10-24T16:10:00Z",
    //             "update_at": "2025-10-24T16:20:00Z"
    //         },
    //         {
    //             "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //             "full_name": "Trần Thị U",
    //             "phone": "0904111222",
    //             "delivery_address": "22 Hoàng Diệu, Quận 4, TP.HCM",
    //             "delivery_fee": 10000,
    //             "note": "Không lấy đũa",
    //             "method": "MOMO",
    //             "order_items": [
    //                 { "menu_item_id": "99aabbcc-ddee-ff00-1122-334455667788", "quantity": 1, "price": 95000, "note": "", "options": [] },
    //                 { "menu_item_id": "99aabbcc-ddee-ff00-1122-334455667781", "quantity": 1, "price": 5000, "note": "", "options": [] },
    //             ],
    //             "total_amount": 110000,
    //             "status": "waiting",
    //             "status_payment": "paid",
    //             "created_at": "2025-10-24T17:00:00Z",
    //             "update_at": "2025-10-24T17:05:00Z"
    //         }

    // const orders =
    // [
    //     {
    //         "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //         "full_name": "Nguyễn Văn A",
    //         "phone": "0901234567",
    //         "delivery_address": "123 Lê Lợi, Quận 1, TP.HCM",
    //         "delivery_fee": 15000,
    //         "note": "Giao giờ trưa",
    //         "method": "VNPAY",
    //         "order_items": [
    //             {
    //                 "menu_item_id": "67c9f1ab-8d0a-4c85-87aa-1a2bbf02d0f3",
    //                 "quantity": 2,
    //                 "price": 65000,
    //                 "note": "ít cay",
    //                 "options": [
    //                     { "option_item_id": "98d2b771-1234-4acb-a21c-7c5a5d6b4a21" },
    //                     { "option_item_id": "ab7d93f0-8bca-4e0a-9137-b6fbe92da8cd" }
    //                 ]
    //             },
    //             {
    //                 "menu_item_id": "e2a8b2f9-77dd-45b0-8b11-0d8fbc79e6d4",
    //                 "quantity": 1,
    //                 "price": 120000,
    //                 "note": "",
    //                 "options": []
    //             },
    //             {
    //                 "menu_item_id": "e2a8b2f9-77dd-45b0-8b11-0d8fbc79e6d7",
    //                 "quantity": 1,
    //                 "price": 120000,
    //                 "note": "",
    //                 "options": [
    //                     { "option_item_id": "98d2b771-1234-4acb-a21c-7c5a5d6b4a21" },
    //                     { "option_item_id": "ab7d93f0-8bca-4e0a-9137-b6fbe92da8cd" }
    //                 ]
    //             }
    //         ],
    //         "total_amount": 265000,
    //         "status": "waiting",
    //         "status_payment": "pending",
    //         "created_at": "2025-10-24T14:35:00Z",
    //         "update_at": "2025-10-24T14:35:00Z"
    //     },
    //     {
    //         "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //         "full_name": "Trần Thị B",
    //         "phone": "0912345678",
    //         "delivery_address": "45 Nguyễn Huệ, Quận 1, TP.HCM",
    //         "delivery_fee": 20000,
    //         "note": "Giao nhanh giúp mình",
    //         "method": "CASH",
    //         "order_items": [
    //             {
    //                 "menu_item_id": "a8c2d1a9-1bcd-46e9-8f1a-234beff5f321",
    //                 "quantity": 3,
    //                 "price": 50000,
    //                 "note": "",
    //                 "options": []
    //             }
    //         ],
    //         "total_amount": 170000,
    //         "status": "waiting",
    //         "status_payment": "paid",
    //         "created_at": "2025-10-23T09:15:00Z",
    //         "update_at": "2025-10-23T09:45:00Z"
    //     },
    //     {
    //         "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //         "full_name": "Lê Văn C",
    //         "phone": "0987654321",
    //         "delivery_address": "12 Võ Thị Sáu, Quận 3, TP.HCM",
    //         "delivery_fee": 10000,
    //         "note": "Gọi trước khi tới",
    //         "method": "MOMO",
    //         "order_items": [
    //             {
    //                 "menu_item_id": "c1b2e9f7-8a1d-4b31-a22f-11aa3b2ccdd1",
    //                 "quantity": 1,
    //                 "price": 85000,
    //                 "note": "Không hành",
    //                 "options": []
    //             }
    //         ],
    //         "total_amount": 95000,
    //         "status": "waiting",
    //         "status_payment": "paid",
    //         "created_at": "2025-10-22T17:00:00Z",
    //         "update_at": "2025-10-22T18:00:00Z"
    //     },
    //     {
    //         "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //         "full_name": "Phạm Duy D",
    //         "phone": "0934123456",
    //         "delivery_address": "88 Lý Thường Kiệt, Quận 10, TP.HCM",
    //         "delivery_fee": 12000,
    //         "note": "Đưa tận cửa, có chó sợ nha",
    //         "method": "VNPAY",
    //         "order_items": [
    //             {
    //                 "menu_item_id": "de9f8a2b-9a4c-49f9-9bbf-cc99a1a0cc33",
    //                 "quantity": 4,
    //                 "price": 30000,
    //                 "note": "",
    //                 "options": []
    //             }
    //         ],
    //         "total_amount": 132000,
    //         "status": "waiting",
    //         "status_payment": "refunded",
    //         "created_at": "2025-10-20T13:30:00Z",
    //         "update_at": "2025-10-20T13:50:00Z"
    //     },
    //     {
    //         "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //         "full_name": "Đinh Thị E",
    //         "phone": "0909988776",
    //         "delivery_address": "56 Cách Mạng Tháng 8, Quận 10, TP.HCM",
    //         "delivery_fee": 18000,
    //         "note": "Cho thêm muỗng, đũa nha",
    //         "method": "CASH",
    //         "order_items": [
    //             {
    //                 "menu_item_id": "123a4b5c-678d-4e9f-9123-9aa4d4e8b222",
    //                 "quantity": 2,
    //                 "price": 70000,
    //                 "note": "",
    //                 "options": []
    //             }
    //         ],
    //         "total_amount": 158000,
    //         "status": "waiting",
    //         "status_payment": "pending",
    //         "created_at": "2025-10-24T08:00:00Z",
    //         "update_at": "2025-10-24T08:05:00Z"
    //     },
    //     {
    //         "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //         "full_name": "Bùi Văn F",
    //         "phone": "0902345678",
    //         "delivery_address": "27 Hai Bà Trưng, Quận 1, TP.HCM",
    //         "delivery_fee": 10000,
    //         "note": "Cổng số 2, chung cư A",
    //         "method": "MOMO",
    //         "order_items": [
    //             {
    //                 "menu_item_id": "67c9f1ab-8d0a-4c85-87aa-1a2bbf02d0f3",
    //                 "quantity": 1,
    //                 "price": 65000,
    //                 "note": "Không cay",
    //                 "options": []
    //             }
    //         ],
    //         "total_amount": 75000,
    //         "status": "waiting",
    //         "status_payment": "paid",
    //         "created_at": "2025-10-18T10:00:00Z",
    //         "update_at": "2025-10-18T11:00:00Z"
    //     },
    //     {
    //         "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //         "full_name": "Nguyễn Thị G",
    //         "phone": "0933555777",
    //         "delivery_address": "21 Trần Hưng Đạo, Quận 5, TP.HCM",
    //         "delivery_fee": 16000,
    //         "note": "Đừng bấm chuông, gọi điện",
    //         "method": "ZALOPAY",
    //         "order_items": [
    //             {
    //                 "menu_item_id": "e2a8b2f9-77dd-45b0-8b11-0d8fbc79e6d4",
    //                 "quantity": 1,
    //                 "price": 120000,
    //                 "note": "Không hành",
    //                 "options": []
    //             }
    //         ],
    //         "total_amount": 136000,
    //         "status": "waiting",
    //         "status_payment": "paid",
    //         "created_at": "2025-10-21T15:00:00Z",
    //         "update_at": "2025-10-21T15:45:00Z"
    //     },
    //     {
    //         "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //         "full_name": "Phan Quốc H",
    //         "phone": "0977123456",
    //         "delivery_address": "90 Nguyễn Văn Cừ, Quận 5, TP.HCM",
    //         "delivery_fee": 12000,
    //         "note": "Cho thêm ớt sa tế",
    //         "method": "VNPAY",
    //         "order_items": [
    //             {
    //                 "menu_item_id": "b9a8e7d6-5a44-4d1b-b3a3-d3f44fa7c888",
    //                 "quantity": 2,
    //                 "price": 90000,
    //                 "note": "",
    //                 "options": []
    //             }
    //         ],
    //         "total_amount": 192000,
    //         "status": "cancel",
    //         "status_payment": "pending",
    //         "created_at": "2025-10-19T09:00:00Z",
    //         "update_at": "2025-10-19T09:30:00Z"
    //     },
    //     {
    //         "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //         "full_name": "Võ Anh I",
    //         "phone": "0911777333",
    //         "delivery_address": "12 Hoàng Văn Thụ, Tân Bình, TP.HCM",
    //         "delivery_fee": 10000,
    //         "note": "Giao trước 11h",
    //         "method": "MOMO",
    //         "order_items": [
    //             {
    //                 "menu_item_id": "f3b1d4e2-6a9b-45dd-aaf9-bb9d3e0e3a91",
    //                 "quantity": 3,
    //                 "price": 45000,
    //                 "note": "",
    //                 "options": []
    //             }
    //         ],
    //         "total_amount": 145000,
    //         "status": "accept",
    //         "status_payment": "paid",
    //         "created_at": "2025-10-24T07:30:00Z",
    //         "update_at": "2025-10-24T07:50:00Z"
    //     },
    //     {
    //         "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //         "full_name": "Ngô Thị K",
    //         "phone": "0908877665",
    //         "delivery_address": "100 Điện Biên Phủ, Bình Thạnh, TP.HCM",
    //         "delivery_fee": 15000,
    //         "note": "Không để ớt",
    //         "method": "CASH",
    //         "order_items": [
    //             {
    //                 "menu_item_id": "77e2c1a9-9fbb-48e9-bb2b-123b4f5c9d7a",
    //                 "quantity": 2,
    //                 "price": 60000,
    //                 "note": "",
    //                 "options": []
    //             }
    //         ],
    //         "total_amount": 135000,
    //         "status": "complete",
    //         "status_payment": "paid",
    //         "created_at": "2025-10-16T14:00:00Z",
    //         "update_at": "2025-10-16T14:30:00Z"
    //     },
    //     {
    //         "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //         "full_name": "Trịnh Văn L",
    //         "phone": "0905551111",
    //         "delivery_address": "23 Nguyễn Trãi, Quận 5, TP.HCM",
    //         "delivery_fee": 12000,
    //         "note": "Giao giờ trưa, không bấm chuông",
    //         "method": "MOMO",
    //         "order_items": [
    //             { "menu_item_id": "ab1d2e3f-4a5b-678c-9d10-112233445566", "quantity": 2, "price": 55000, "note": "Không ớt", "options": [] }
    //         ],
    //         "total_amount": 122000,
    //         "status": "waiting",
    //         "status_payment": "pending",
    //         "created_at": "2025-10-24T10:15:00Z",
    //         "update_at": "2025-10-24T10:20:00Z"
    //     },
    //     {
    //         "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //         "full_name": "Đặng Thị M",
    //         "phone": "0933444555",
    //         "delivery_address": "14 Lê Văn Sỹ, Quận 3, TP.HCM",
    //         "delivery_fee": 10000,
    //         "note": "Gọi trước khi giao",
    //         "method": "ZALOPAY",
    //         "order_items": [
    //             { "menu_item_id": "98b7c6a5-4321-4e9f-b987-abcdef123456", "quantity": 1, "price": 85000, "note": "Không hành", "options": [] }
    //         ],
    //         "total_amount": 95000,
    //         "status": "waiting",
    //         "status_payment": "paid",
    //         "created_at": "2025-10-24T09:40:00Z",
    //         "update_at": "2025-10-24T09:50:00Z"
    //     },
    //     {
    //         "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //         "full_name": "Phạm Minh N",
    //         "phone": "0977888999",
    //         "delivery_address": "55 Nguyễn Kiệm, Gò Vấp, TP.HCM",
    //         "delivery_fee": 15000,
    //         "note": "",
    //         "method": "CASH",
    //         "order_items": [
    //             { "menu_item_id": "22334455-6677-8899-aabb-ccddeeff0011", "quantity": 3, "price": 40000, "note": "", "options": [] }
    //         ],
    //         "total_amount": 135000,
    //         "status": "waiting",
    //         "status_payment": "pending",
    //         "created_at": "2025-10-24T11:10:00Z",
    //         "update_at": "2025-10-24T11:15:00Z"
    //     },
    //     {
    //         "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //         "full_name": "Ngô Văn O",
    //         "phone": "0911222333",
    //         "delivery_address": "78 Trần Quang Khải, Quận 1, TP.HCM",
    //         "delivery_fee": 16000,
    //         "note": "Thêm ống hút",
    //         "method": "VNPAY",
    //         "order_items": [
    //             { "menu_item_id": "33445566-7788-99aa-bbcc-ddeeff001122", "quantity": 1, "price": 120000, "note": "", "options": [] }
    //         ],
    //         "total_amount": 136000,
    //         "status": "waiting",
    //         "status_payment": "paid",
    //         "created_at": "2025-10-24T10:30:00Z",
    //         "update_at": "2025-10-24T10:35:00Z"
    //     },
    //     {
    //         "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //         "full_name": "Vũ Thị P",
    //         "phone": "0909992222",
    //         "delivery_address": "45 Phạm Ngọc Thạch, Quận 3, TP.HCM",
    //         "delivery_fee": 10000,
    //         "note": "Không bỏ tiêu",
    //         "method": "CASH",
    //         "order_items": [
    //             { "menu_item_id": "44556677-8899-aabb-ccdd-eeff00112233", "quantity": 2, "price": 60000, "note": "", "options": [] }
    //         ],
    //         "total_amount": 130000,
    //         "status": "waiting",
    //         "status_payment": "pending",
    //         "created_at": "2025-10-24T12:00:00Z",
    //         "update_at": "2025-10-24T12:10:00Z"
    //     },
    //     {
    //         "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //         "full_name": "Lâm Quốc Q",
    //         "phone": "0933111222",
    //         "delivery_address": "19 Nguyễn Oanh, Gò Vấp, TP.HCM",
    //         "delivery_fee": 15000,
    //         "note": "Cần giao sớm",
    //         "method": "MOMO",
    //         "order_items": [
    //             { "menu_item_id": "55667788-99aa-bbcc-ddee-ff0011223344", "quantity": 1, "price": 70000, "note": "", "options": [] }
    //         ],
    //         "total_amount": 85000,
    //         "status": "waiting",
    //         "status_payment": "paid",
    //         "created_at": "2025-10-24T13:00:00Z",
    //         "update_at": "2025-10-24T13:05:00Z"
    //     },
    //     {
    //         "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //         "full_name": "Đỗ Thị R",
    //         "phone": "0907333444",
    //         "delivery_address": "88 Nguyễn Văn Linh, Quận 7, TP.HCM",
    //         "delivery_fee": 18000,
    //         "note": "Giao cổng phụ",
    //         "method": "VNPAY",
    //         "order_items": [
    //             { "menu_item_id": "66778899-aabb-ccdd-eeff-001122334455", "quantity": 2, "price": 90000, "note": "", "options": [] }
    //         ],
    //         "total_amount": 198000,
    //         "status": "waiting",
    //         "status_payment": "pending",
    //         "created_at": "2025-10-24T14:10:00Z",
    //         "update_at": "2025-10-24T14:15:00Z"
    //     },
    //     {
    //         "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //         "full_name": "Phùng Minh S",
    //         "phone": "0977333444",
    //         "delivery_address": "35 Pasteur, Quận 1, TP.HCM",
    //         "delivery_fee": 12000,
    //         "note": "",
    //         "method": "ZALOPAY",
    //         "order_items": [
    //             { "menu_item_id": "778899aa-bbcc-ddee-ff00-112233445566", "quantity": 1, "price": 65000, "note": "", "options": [] }
    //         ],
    //         "total_amount": 77000,
    //         "status": "waiting",
    //         "status_payment": "paid",
    //         "created_at": "2025-10-24T15:00:00Z",
    //         "update_at": "2025-10-24T15:05:00Z"
    //     },
    //     {
    //         "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //         "full_name": "Nguyễn Văn T",
    //         "phone": "0911555666",
    //         "delivery_address": "60 Phan Xích Long, Phú Nhuận, TP.HCM",
    //         "delivery_fee": 15000,
    //         "note": "Thêm nước chấm",
    //         "method": "CASH",
    //         "order_items": [
    //             { "menu_item_id": "8899aabb-ccdd-eeff-0011-223344556677", "quantity": 2, "price": 80000, "note": "", "options": [] }
    //         ],
    //         "total_amount": 175000,
    //         "status": "waiting",
    //         "status_payment": "pending",
    //         "created_at": "2025-10-24T16:10:00Z",
    //         "update_at": "2025-10-24T16:20:00Z"
    //     },
    //     {
    //         "merchant_id": "b3e45d02-7755-4b78-8d2f-79f5441d2a4e",
    //         "full_name": "Trần Thị U",
    //         "phone": "0904111222",
    //         "delivery_address": "22 Hoàng Diệu, Quận 4, TP.HCM",
    //         "delivery_fee": 10000,
    //         "note": "Không lấy đũa",
    //         "method": "MOMO",
    //         "order_items": [
    //             { "menu_item_id": "99aabbcc-ddee-ff00-1122-334455667788", "quantity": 1, "price": 95000, "note": "", "options": [] },
    //             { "menu_item_id": "99aabbcc-ddee-ff00-1122-334455667781", "quantity": 1, "price": 5000, "note": "", "options": [] },
    //         ],
    //         "total_amount": 110000,
    //         "status": "waiting",
    //         "status_payment": "paid",
    //         "created_at": "2025-10-24T17:00:00Z",
    //         "update_at": "2025-10-24T17:05:00Z"
    //     }
    //     ]
    useEffect(() => {
        const merchant = JSON.parse(localStorage.getItem("merchant"))
        if (!merchant) throw new Error("Dữ liệu merchant không hợp lệ");

        const socket = io("http://localhost:3000", {
            query: { merchantId: merchant.id }
        });

        socket.on("connect", () => {
            console.log("Connected to WebSocket server");
        });

        socket.on("newOrder", (order) => {
            console.log("Received new order:", order);
            setOrders((prev) => [order, ...prev]);
        });
        
        socket.on("orders", (orders) => {
            console.log("Received orders:", orders);
            setOrders(orders);
        });

        socket.on("disconnect", () => {
            console.log("Disconnected");
        });

        return () => {
            socket.disconnect();
        };
    }, []);
    useEffect(() => {
        const getMerchantOrders = async () => {
            try {

                const merchant = JSON.parse(localStorage.getItem("merchant"))
                if (!merchant) throw new Error("Dữ liệu merchant không hợp lệ");
                { console.log("ddddddddddddddddddddddddddd", merchant.id); }
                const resOrders = await fetch(`http://localhost:3000/api/order/getAllOrderMerchant/${merchant.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        // "authorization": localStorage.getItem("token")
                    },
                });
                if (!resOrders.ok) {
                    throw new Error(`Lỗi server: ${resOrders.status}`);
                }
                // const { orderss } = await resOrders.json();
                // setOrders(orderss);
            } catch (err) {
                console.error("Lỗi khi khi get merchant:", err);
            }
        };

        getMerchantOrders();
    }, []);
    function handleTabButton(e) {
        setTab(e.currentTarget.name);
    };


    const handleChangeStatus = useCallback(async (item, type) => {
        try {
            // const merchant = JSON.parse(localStorage.getItem("merchant"));
            // if (!merchant) throw new Error("Dữ liệu merchant không hợp lệ");

            const updatedOrder = { ...item };

            if (type === "waiting") {

                const upt = {
                    ...updatedOrder,
                    status: "accept",
                };

                const res = await fetch(`http://localhost:3000/api/order/updateOrder/${item.id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: localStorage.getItem("token"),
                    },
                    body: JSON.stringify({ data: upt, orderId: item.id }),
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || "Cập nhật Option thất bại");
                }
                const order = await res.json();

                setOrders(prev =>
                    prev.map(op =>
                        op.id === order.id
                            ? {
                                ...op,
                                ...order
                            }
                            : op
                    )
                );
            }

            else if (type === "accept") {
                const upt = {
                    ...updatedOrder,
                    status: "complete",
                };

                const res = await fetch(`http://localhost:3000/api/order/updateOrder/${item.id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: localStorage.getItem("token"),
                    },
                    body: JSON.stringify({ data: upt, orderId: item.id }),
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || "Cập nhật Option thất bại");
                }
                const order = await res.json();

                setOrders(prev =>
                    prev.map(op =>
                        op.id === order.id
                            ? {
                                ...op,
                                ...order
                            }
                            : op
                    )
                );

            }
            else if (type === "complete") {
                console.log("Đơn hàng đã hoàn thành, không thể cập nhật trạng thái nữa.");
            }
            else if (type === "cancel") {
                const upt = {
                    ...updatedOrder,
                    status: "cancel",
                };

                const res = await fetch(`http://localhost:3000/api/order/updateOrder/${item.id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: localStorage.getItem("token"),
                    },
                    body: JSON.stringify({ data: upt, orderId: item.id }),
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || "Cập nhật Option thất bại");
                }
                const order = await res.json();

                setOrders(prev =>
                    prev.map(op =>
                        op.id === order.id
                            ? {
                                ...op,
                                ...order
                            }
                            : op
                    )
                );
            }
        } catch (err) {
            console.error(" Lỗi khi cập nhật:", err);
        }
    }, [setOrders]);

    return (
        <Theme>
            <main style={{ marginTop: "2%" }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-around",
                    margin: "10px 10% 10px 10%",
                    height: "auto",
                    padding: "2%"
                }}>
                    <Button name="waiting" color="indigo" variant="soft" onClick={handleTabButton}>
                        Đang đợi
                    </Button>
                    <Button name="accept" color="cyan" variant="soft" onClick={handleTabButton}>
                        Chuẩn bị
                    </Button>
                    <Button name="complete" color="green" variant="soft" onClick={handleTabButton}>
                        Hoành thành
                    </Button>
                    <Button name="cancel" color="red" variant="soft" onClick={handleTabButton}>
                        Đã hủy
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
                        {tab === "waiting" && (
                            <>
                                <div>
                                    <div>
                                        {/* a */}
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            flexWrap: "wrap", // ✅ Cho phép xuống dòng
                                            gap: "20px", // ✅ Khoảng cách giữa các card
                                            justifyContent: "flex-start", // ✅ Căn trái
                                            padding: "20px",
                                        }}
                                    >
                                        {orders
                                            .filter((item) => item.status === "waiting")
                                            .map((item) => (
                                                <div
                                                    key={item.id}
                                                    style={{
                                                        flex: "1 1 calc(25% - 20px)", // ✅ 4 card mỗi hàng (100 / 4 = 25%)
                                                        minWidth: "260px", // ✅ Giữ kích thước tối thiểu
                                                        maxWidth: "280px",
                                                    }}
                                                >
                                                    <Card value="orders" item={item} handleChangeStatus={handleChangeStatus} />
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </>
                        )}


                        {tab === "accept" && (
                            <>
                                <div>
                                    <div>
                                        {/* b */}
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            flexWrap: "wrap", // ✅ Cho phép xuống dòng
                                            gap: "20px", // ✅ Khoảng cách giữa các card
                                            justifyContent: "flex-start", // ✅ Căn trái
                                            padding: "20px",
                                        }}
                                    >
                                        {orders
                                            .filter((item) => item.status === "accept")
                                            .map((item) => (
                                                <div
                                                    key={item.id}
                                                    style={{
                                                        flex: "1 1 calc(25% - 20px)", // ✅ 4 card mỗi hàng (100 / 4 = 25%)
                                                        minWidth: "260px", // ✅ Giữ kích thước tối thiểu
                                                        maxWidth: "280px",
                                                    }}
                                                >
                                                    <Card value="orders" item={item} handleChangeStatus={handleChangeStatus} />
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </>
                        )}


                        {tab === "complete" && (
                            <>
                                <div>
                                    <div>
                                        {/* c */}
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            flexWrap: "wrap", // ✅ Cho phép xuống dòng
                                            gap: "20px", // ✅ Khoảng cách giữa các card
                                            justifyContent: "flex-start", // ✅ Căn trái
                                            padding: "20px",
                                        }}
                                    >
                                        {orders
                                            .filter((item) => item.status === "complete")
                                            .map((item) => (
                                                <div
                                                    key={item.id}
                                                    style={{
                                                        flex: "1 1 calc(25% - 20px)", // ✅ 4 card mỗi hàng (100 / 4 = 25%)
                                                        minWidth: "260px", // ✅ Giữ kích thước tối thiểu
                                                        maxWidth: "280px",
                                                    }}
                                                >
                                                    <Card value="orders" item={item} handleChangeStatus={handleChangeStatus} />
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </>
                        )}


                        {tab === "cancel" && (
                            <>
                                <div>
                                    <div>
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: "20px",
                                            justifyContent: "flex-start",
                                            padding: "20px",
                                        }}
                                    >
                                        {orders
                                            .filter((item) => item.status === "cancel")
                                            .map((item) => (
                                                <div
                                                    key={item.id}
                                                    style={{
                                                        flex: "1 1 calc(25% - 20px)",
                                                        minWidth: "260px",
                                                        maxWidth: "280px",
                                                    }}
                                                >
                                                    <Card value="orders" item={item} />
                                                </div>
                                            ))}
                                    </div>


                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
            <>

            </>
        </Theme >

    );
}
