const express = require("express");
const router = express.Router();
const donorController = require("../controllers/donorController");

router.post("/signup",donorController.signup);

router.post("/update",donorController.update);

router.post("/delete",donorController.delete);

router.post("/login",donorController.login);

module.exports = router;