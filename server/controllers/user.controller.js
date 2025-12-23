const User = require("../models/user.model.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
 const registerUser = async(req,res) =>{
   const {name, email,password } = req.body

   try {

    if(!name || !email || !password){
        return res.status(400).json({
            status: 0,
            message: "All fields are required"
        })
    }
    
    const emailTrim = email.toLowerCase().trim()
    const existUser = await User.findOne({email:emailTrim})

    if(existUser){
        return res.status(409).json({
            status: 0,
            message:" user already registered"
        })
    }

    const hashedPassword = await bcrypt.hash(password,10)

    const newUser = await User.create({
        name, email:emailTrim, password: hashedPassword
    })

    // await newUser.save()

    const payload = {userId:newUser._id}
    const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn: "1d"})

    res.cookie("token",token,{
        httpOnly: true,
        secure:process.env.NODE_ENV==="production",
        sameSite:process.env.NODE_ENV==="production"?"none":"lax",
        maxAge: 24*60*60*1000  //1 day
    })

    res.status(201).json({
        status: 1,
        message: "user registered successfully"
    })

   } catch (error) {
        res.status(500).json({
            status: 0,
            message: `server error, ${error.message}`
        })
   }
}

const loginUser = async(req,res) =>{
    try {
        
        const {email, password} = req.body

        if(!email || !password){
            return res.status(400).json({
                status: 0,
                message:" all fields are required"
            })
        }

        const emailTrim = email.trim().toLowerCase()
        const existUser = await User.findOne({email:emailTrim})

        if(!existUser){
            return res.status(404).json({
                status: 0,
                message: "User not registered"
            })
        }
 

        const isMatchPassword = await bcrypt.compare(password,existUser.password)

        if(!isMatchPassword){
            return res.status(401).json({
                status: 0,
                message:"invalid credentials"
            })
        }

        const payload = {userId:existUser._id}
        const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn: "1d"})

    res.cookie("token",token,{
        httpOnly: true,
        secure:process.env.NODE_ENV==="production",
        sameSite:process.env.NODE_ENV==="production"?"none":"lax",
        maxAge: 24*60*60*1000  //1 day
    })

        res.status(200).json({
            status: 1,
            message: "User loggedIn successfully",
            data:{
                id:existUser._id,
                email:existUser.email
            }
        })
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: `server error ${error.message}`
        })
    }
}

module.exports = {registerUser, loginUser}