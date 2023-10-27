const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../model/user")
const validateRegistrationData = require("../validation/register")
const validateLoginData = require("../validation/login")
const secretKey = "thisissecretkey"
const logger = require("../utils/logger")

const createUser = async (req, res)=>{
    const error = validateRegistrationData(req.body)
    if(error.hasError){
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
    const userDetail = {
        name: req.body.name,
        email: req.body.email
    }
    const plainText = req.body.password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(plainText, salt)
    userDetail.password = passwordHash
    const user = new User(userDetail)
    await user.save()
    res.json({
        success: true,
        message: "User created successfully"
    })
}

const getUser = async (req, res)=>{
    res.json({
        success: true
    })
}

const loginUser = async (req, res)=>{
    const error = validateLoginData(req.body)
    if(error.hasError){
        return res.status(400).json({
            succes: false,
            message: error.message
        })
    }
    const body = req.body
    const user = await User.findOne({email: body.email})
    const timestamp = new Date()
    if(!user){
        logger.info("Login Failure", {timestamp: timestamp, reason: "user does not exist "+ body.email})
        return res.status(401).json({
            success: false,
            message: "User not found register first to login"
        })
    }
    const passwordHash = user.password
    const plainText = body.password
    const isSame = await bcrypt.compare(plainText, passwordHash)
    if(!isSame){
        logger.info("Login Failure", {timestamp: timestamp, reason: "user tried to login with wrong password "+ body.email})
        return res.status(401).json({
            success: false,
            message: "Username or password is wrong"
        })
    }
    const now = Math.floor(Date.now() / 1000)
    const exp = now + 3600
    const payload = {
        email: user.email,
        _id: user._id,
        exp: exp
    }
    const token = jwt.sign(payload, secretKey)
    const updateObject = {
        token: token
    }
    await User.findByIdAndUpdate({_id: user._id}, updateObject)
    logger.info("Login successful", {timestamp: timestamp, reason: "login successful for "+body.email})
    res.json({
        success: true,
        message: "User login successful",
        token: token
    })
}
const userLogout = async (req, res)=>{
    const token = req.headers.authorization
    const decodedToken = jwt.decode(token)
    await User.findByIdAndUpdate(decodedToken._id, {token: ""}) 
    logger.info("Logout successful", {timestamp: timestamp, reason: "logout successful for "+decodedToken.email})
    res.json({
        success: true,
        message: "Logout successful"
    })
}



module.exports = {
    createUser,
    getUser,
    loginUser,
    userLogout
}