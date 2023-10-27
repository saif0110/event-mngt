const User = require("../model/user")
const jwt = require("jsonwebtoken")

const secretKey = "thisissecretkey"
const myAuthMiddleware = async (req, res, next) => {
    const token = req.headers.authorization
    //check if token exist
    if (!token) {
        return res.status(400).json({
            success: false,
            message: "Please pass the token"
        })
    }
    //check if token within expirey
    const decodedToken = jwt.decode(token)
    const now = Math.floor(Date.now() / 1000)
    const exp = decodedToken.exp
    if (now > exp) {
        return res.status(400).json({
            success: false,
            message: "Token is expired"
        })
    }

    //check if token is of our API
    try {
        jwt.verify(token, secretKey)
    }catch(error){
        res.status(400).json({
            success: false,
            message: "Invalid jwt"
        })
    }
    // cheeck if the users token and passed token are same
    const user = await User.findById(decodedToken._id)
    if (!user || token !== user.token) {
        return res.status(400).json({
            success: false,
            message: "wrong token, please pass the correct one"
        })
    }
    req.user = user
    next()
}

module.exports = myAuthMiddleware