const express = require('express');
const {createUser, signInUser} = require("../controllers/userController");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", signInUser);

module.exports = router;