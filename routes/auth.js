const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth-Middleware");
const {login,logout,refreshToken} = require('../controller/authController')

router.post('/',login)
router.post("/logout",auth,logout)
router.post("/refresh",refreshToken)



module.exports = router

