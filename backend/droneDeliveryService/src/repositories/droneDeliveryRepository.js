const Drone = require('../models/drone');

module.exports.getDroneByMerchantId = async (merchantId) => {
    return await Drone.findAll({where: {merchant_id: merchantId}});
}

module.exports.updateDroneStatus = async (data) => {
    const drone = await Drone.findOne({where: data.conditons});
    if (!drone) throw new Error('Không tìm thấy drone');

    await drone.update(data.updateFields);

    return drone;
}