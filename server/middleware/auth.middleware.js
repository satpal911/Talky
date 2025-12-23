const jwt = require("jsonwebtoken")
const User = require("../models/user.model")

const protect = async(req,res,next) =>{
    try {
        const token = req.cookies?.token

        if(!token){
            return res.status(401).json({
                status: 0,
                message: "Access token missing"
            })
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = User.findById(decoded.userId).select("-password")

        if(!user){
            return res.status(401).json({
                status: 0,
                message: "user not find"
            })
        }
        req.user = user
        next()
        
        
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: `server error ${error.message}`
        })
    }
}

