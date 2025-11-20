const droneDeliveryService = require('../services/droneDeliveryService'); 

module.exports.getDronesForMerchant = async (req, res) => {
    try {
        const {id} = req.params;
        const drones = await droneDeliveryService.getDronesByMerchantId(id);
        res.status(200).json({
            message: "Drones fetched successfully",
            drones
        });
    } catch (error) {
        console.error("Error fetching drones:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}