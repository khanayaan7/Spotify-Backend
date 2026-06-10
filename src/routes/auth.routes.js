const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller")
const { registerValidation } = require("../middlewares/validation.middleware");

router.post("/register", registerValidation, authController.register)
router.post("/login", registerValidation, authController.login)
router.post("/logout", authController.logout)


module.exports = router;