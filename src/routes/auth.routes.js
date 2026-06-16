const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller")
const { registerValidation } = require("../middlewares/validation.middleware");

router.post("/register", registerValidation, authController.register)
router.post("/login", registerValidation, authController.login)
router.post("/logout", authController.logout)
router.get("/logoutAll", authController.logoutAll)
router.get("/getMe", authController.getMe)
router.post("/refreshToken", authController.refreshToken)
router.post("/verify-email", authController.verifyEmail)

module.exports = router;