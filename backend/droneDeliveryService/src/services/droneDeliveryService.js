const {publishMsg} = require('../rabbitMQ/rabbitFunction');
const droneDeliveryRepo = require('../repositories/droneDeliveryRepository');

module.exports.getDronesByMerchantId = async (merchantId) => {
    return await droneDeliveryRepo.getDroneByMerchantId(merchantId);
}

module.exports.updateDroneStatus = async (data) => {
    console.log("Updating drone status with data:", data);
    if(data.status === 'DELIVERING'){
        return await droneDeliveryRepo.updateDroneStatus({conditons: {id: data.droneId}, updateFields: {status: data.status, order_id: data.orderId}});
    }else{
        return await droneDeliveryRepo.updateDroneStatus({conditons: {order_id: data.orderId}, updateFields: {status: data.status, order_id: null}});
    }
}