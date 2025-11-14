class GatewayService {
  constructor(io) {
    this.io = io;
  }

  setupSocket() {
    this.io.on('connection', (socket) => {
      const { merchantId, userId, orderId } = socket.handshake.query;
      if (merchantId) {
        socket.join(`merchant_${merchantId}`);
        console.log(`Merchant ${merchantId} joined`);
      } else if (userId) {
        socket.join(`User_${userId}`);
        console.log(`User ${userId} joined`);
      }

      socket.on('disconnect', () => {
        console.log(`Client ${socket.id} disconnected`);
      });
    });
  }

  pushPaymentQR(data) {
    const { userId, orderId, payUrl } = data;
    if (!userId) {
      console.warn('pushPaymentQR: missing userId', data);
      return;
    }

    this.io.to(`User_${userId}`).emit('paymentQR', {
      orderId,
      payUrl,
    });

    console.log(`QR sent to User_${userId} (order: ${orderId})`);
  }

  pushOrderStatusUI(data) {
    this.io.to(`User_${data.user_id}`).emit('orderUpdated', { orderId: data.id, status: data.status, updated_at: data.updated_at});
    console.log(`pushed to customer payment success`)
  }

  pushPaymentSuccess(data) {
    const { userId, orderId, merchantId } = data;
    this.io.to(`User_${userId}`).emit('paymentSuccess', { orderId, merchantId });
    console.log(`pushed to customer payment success`)
  }
  
  pushPaymentFailed(data) {
    const { userId, orderId } = data;
    this.io.to(`User_${userId}`).emit('paymentFailed', { orderId });
    console.log(`pushed to customer payment failed`)
  }

  pushOrderUI(order, userId = null) {
    if(userId){
      // console.log("order: ", order);
      this.io.to(`User_${userId}`).emit('order', order);
      console.log(`Push order to user_${userId}`);
    }else{
      this.io.to(`merchant_${order.merchant_id}`).emit('newOrder', order);
      console.log(`Pushed order ${order.id} → merchant_${order.merchant_id}`);
    }
  }

  pushOrdersUI(data) {
    if(data.merchantId){
      this.io.to(`merchant_${data.merchantId}`).emit('orders', data.orders);
      console.log(`Pushed order → merchant_${data.merchantId}`);
    }else{
      this.io.to(`User_${data.userId}`).emit('orders', data.orders);
      console.log(`Push orders to user_${data.userId}`);
    }
  }

}

module.exports = GatewayService;