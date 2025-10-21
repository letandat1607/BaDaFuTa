const express = require('express');
const {updateProfile, createLocation} = require("../controllers/userController");
const router = express.Router();

router.post("/updateProfile", updateProfile);
router.post("/createLocation", createLocation);


module.exports = router;