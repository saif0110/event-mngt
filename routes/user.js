const express = require("express");
const router = new express.Router()

const {createUser, getUser, loginUser, userLogout} = require("../controller/user")
const myAuthMiddleware = require("../middleware/auth")

router.post("/create", createUser)
router.post("/login", loginUser) 
router.post("/logout", myAuthMiddleware, userLogout) 
router.get("/list", myAuthMiddleware, getUser)

module.exports = router