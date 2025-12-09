// ==================== CẬP NHẬT ĐƠN HÀNG =====================
describe('POST /updateOrder/:id', () => {
    let createdOrderId;

    beforeEach(async () => {
        middleware.authenticate.mockImplementation((req, res, next) => {
            req.user = {
                id: "5324c950-d209-44b7-9e1b-2c3d859a17af",
                email: "testuser@gmail.com",
                role: "customer"
            };
            next();
        });

        merchantClient.validateOrder.mockResolvedValue({
            server_total: 215000
        });
        
        const createRes = await request(server)
            .post('/checkOutOrder')
            .set('authorization', validToken)
            .send({
                user_id: "5324c950-d209-44b7-9e1b-2c3d859a17af",
                merchant_id: "fb325480-5b1c-4c3b-a044-2fcac7ebce02",
                full_name: "Nguyễn Văn A",
                phone: "0909111222",
                delivery_address: "123 Đường Láng, Hà Nội",
                delivery_fee: 15000,
                note: "Giao nhanh",
                method: "MOMO",
                total_amount: 215000,
                order_items: [
                    {
                        menu_item_id: "6434ea82-1629-4178-8d67-a0ac8e9039e9",
                        quantity: 2,
                        price: 80000,
                        note: "Không hành",
                        options: [{ option_item_id: "fcef3d18-4aec-4623-8ace-5a6c7ddf82ef" }]
                    }
                ]
            });

        createdOrderId = createRes.body.order_id;
    });

    it('should update order status successfully', async () => {
        const res = await request(server)
            .post(`/updateOrder/${createdOrderId}`)
            .set('authorization', validToken)
            .send({
                data: {
                    status: "confirmed"
                },
                location: {
                    latitude: 21.0285,
                    longitude: 105.8542
                }
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Cập nhật trạng thái đơn hàng thành công");
        expect(res.body.order).toHaveProperty('id', createdOrderId);
        expect(res.body.order.status).toBe("confirmed");
    });

    it('should fail when data is missing', async () => {
        const res = await request(server)
            .post(`/updateOrder/${createdOrderId}`)
            .set('authorization', validToken)
            .send({
                location: {
                    latitude: 21.0285,
                    longitude: 105.8542
                }
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Dữ liệu không hợp lệ");
    });

    it('should fail when location is missing', async () => {
        const res = await request(server)
            .post(`/updateOrder/${createdOrderId}`)
            .set('authorization', validToken)
            .send({
                data: {
                    status: "confirmed"
                }
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Dữ liệu không hợp lệ");
    });

    it('should fail when order does not exist', async () => {
        const res = await request(server)
            .post('/updateOrder/99999999-9999-9999-9999-999999999999')
            .set('authorization', validToken)
            .send({
                data: {
                    status: "confirmed"
                },
                location: {
                    latitude: 21.0285,
                    longitude: 105.8542
                }
            });

        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe("Không tìm thấy đơn hàng");
    });

    it('should update order to delivering status with drone_id', async () => {
        const res = await request(server)
            .post(`/updateOrder/${createdOrderId}`)
            .set('authorization', validToken)
            .send({
                data: {
                    status: "delivering",
                    drone_id: "drone-123456"
                },
                location: {
                    latitude: 21.0285,
                    longitude: 105.8542
                }
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Cập nhật trạng thái đơn hàng thành công");
        expect(res.body.order.status).toBe("delivering");
    });

    it('should fail when updating to delivering without drone_id', async () => {
        const res = await request(server)
            .post(`/updateOrder/${createdOrderId}`)
            .set('authorization', validToken)
            .send({
                data: {
                    status: "delivering"
                },
                location: {
                    latitude: 21.0285,
                    longitude: 105.8542
                }
            });

        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe("Thiếu dữ liệu khi giao hàng đơn hàng");
    });

    it('should update order to complete status with drone_id', async () => {
        const res = await request(server)
            .post(`/updateOrder/${createdOrderId}`)
            .set('authorization', validToken)
            .send({
                data: {
                    status: "complete",
                    drone_id: "drone-123456"
                },
                location: {
                    latitude: 21.0285,
                    longitude: 105.8542
                }
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Cập nhật trạng thái đơn hàng thành công");
        expect(res.body.order.status).toBe("complete");
    });

    it('should fail when updating to complete without drone_id', async () => {
        const res = await request(server)
            .post(`/updateOrder/${createdOrderId}`)
            .set('authorization', validToken)
            .send({
                data: {
                    status: "complete"
                },
                location: {
                    latitude: 21.0285,
                    longitude: 105.8542
                }
            });

        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe("Thiếu dữ liệu khi hoàn thành đơn hàng");
    });

    it('should update multiple fields successfully', async () => {
        const res = await request(server)
            .post(`/updateOrder/${createdOrderId}`)
            .set('authorization', validToken)
            .send({
                data: {
                    status: "confirmed",
                    note: "Giao trước 5h chiều",
                    delivery_address: "456 Đường Cầu Giấy, Hà Nội"
                },
                location: {
                    latitude: 21.0285,
                    longitude: 105.8542
                }
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.order.status).toBe("confirmed");
        expect(res.body.order.note).toBe("Giao trước 5h chiều");
        expect(res.body.order.delivery_address).toBe("456 Đường Cầu Giấy, Hà Nội");
    });

    it('should fail with invalid data format', async () => {
        const res = await request(server)
            .post(`/updateOrder/${createdOrderId}`)
            .set('authorization', validToken)
            .send({
                data: {
                    total_amount: -1000
                },
                location: {
                    latitude: 21.0285,
                    longitude: 105.8542
                }
            });

        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe("Dữ liệu cập nhật đơn hàng không hợp lệ");
    });

    it('should fail when location is not an object', async () => {
        const res = await request(server)
            .post(`/updateOrder/${createdOrderId}`)
            .set('authorization', validToken)
            .send({
                data: {
                    status: "confirmed"
                },
                location: "invalid location string"
            });

        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe("Dữ liệu cập nhật đơn hàng không hợp lệ");
    });

    it('should fail when user is not authenticated', async () => {
        middleware.authenticate.mockImplementation((req, res) => {
            return res.status(401).json({ error: "Cần đăng nhập người dùng" });
        });

        const res = await request(server)
            .post(`/updateOrder/${createdOrderId}`)
            .send({
                data: {
                    status: "confirmed"
                },
                location: {
                    latitude: 21.0285,
                    longitude: 105.8542
                }
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe("Cần đăng nhập người dùng");
    });
});