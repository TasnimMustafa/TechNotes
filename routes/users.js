const express = require("express");
const router = express.Router();
const {register,profile,updateUserData,changePassword,showUsers,deleteUser} = require('../controller/userController')
const auth = require("../middleware/auth-Middleware");
const isAdmin = require("../middleware/isAdmin-Middleware");

router.post("/register",register) 
router.get("/showusers",auth,isAdmin,showUsers) 
router.get("/profile",auth,profile) 
router.put("/:id",auth,isAdmin,updateUserData) 
router.put("/changePassword/:id",auth,changePassword)
router.delete("/:id",auth,isAdmin,deleteUser)




module.exports = router

