const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../../.env") });
const orderService = require('../services/orderService');

module.exports.getOrder = async (req, res) =>{
  try{
    const user = req.user;
    if (!user) return res.status(400).json({ message: "Người dùng chưa đăng nhập" });

    const {id} = req.params;

    const order = await orderService.getOrder(id, user.id);
    return res.status(200).json({
      message: "Get order success",
      order
    });
  }catch(err){
    return res.status(500).json({
      error: err.message,
    });
  }
}

module.exports.getUserOrders = async (req, res) => {
  try {
    // console.log("orderController getUserOrders called");
    const user = req.user;
    if (!user) return res.status(400).json({ message: "Người dùng chưa đăng nhập" });

    const orders = await orderService.getUserOrders(user.id);
    console.log("Orders fetched:", orders);
    return res.status(200).json({
      message: "Get orders success",
    });
  } catch (err) {
    // console.log("orderController getUserOrders error", err);
    return res.status(500).json({
      error: err.message,
    });
  }
}

// module.exports.getAllOrder = async (req, res) => {
//   try {
//     const user = req.user;
//     if (!user) return res.status(400).json({ message: "Người dùng chưa đăng nhập" });

//     const orders = orderService.checkOutOrder(user.id);

//     return res.status(200).json({
//       message: "Get orders success",
//       orders
//     });
//   } catch (err) {
//     console.log("orderController getAllOrder error", err);
//     res.status(500).json({ error: err.message });
//   }
// }

module.exports.checkOutOrder = async (req, res) => {
  try {
    // console.log(req.body);
    const user = req.user;
    if(!user) return res.status(404).json({error: "Cần đăng nhập người dùng"});
 
    const newOrder = await orderService.createOrder(req.body, user.id);

    return res.status(201).json({
      message: "Tạo đơn hàng thành công chờ thanh toán",
      status_payment: newOrder.status_payment,
      order_id: newOrder.id,
    });
  } catch (err) {
    // console.log("orderController checkOutOrder error", err);
    return res.status(500).json({
      error: err.message,
    });
  }
};

// module.exports.updateOrderStatusPayment = async (req, res) => {
//   try {
//     const { statusPayment, orderId } = req.body;

//     if (!orderId || !statusPayment) {
//       return res.status(400).json({ message: "Thiếu orderId hoặc status" });
//     }

//     const order = await orderService.updateOrderStatusPayment(orderId, statusPayment);

//     const pushOrder = await fetch(`${process.env.GATEWAY_URL}/pushOrder`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         order
//       }),
//     })

//     if (pushOrder.ok) console.log("Push thành công Order");

//     return res.status(200).json({
//       message: "Cập nhật trạng thái đơn hàng thành công",
//       order_id: order.id,
//       new_status: order.status_payment,
//     });
//   } catch (err) {
//     console.error("Lỗi khi cập nhật trạng thái order:", err);
//     return res.status(500).json({ message: "Lỗi server khi cập nhật đơn hàng" });
//   }
// }
///////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.getAllOrderMerchant = async (req, res) => {
  try {
    const { id } = req.params;
    await orderService.getAllOrderMerchant(id);
    res.status(200).json({ message: "Get orders success", });
  } catch (err) {
    console.log("merchantController getAllOrderMerchant error", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports.updateOrder= async (req, res) => {
  try {
    const { data, orderId, location } = req.body;

    if (!orderId || !data || !location) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    }

    const order = await orderService.updateOrder(orderId, data, location);;

    return res.status(200).json({
      message: "Cập nhật trạng thái đơn hàng thành công",
      order,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Lỗi server khi cập nhật đơn hàng" });
  }
}

