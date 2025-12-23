const express = require("express");
const connectDb = require("./database/db.js");
const cors = require("cors");
const  userRouter  = require("./routes/user.router.js");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
const port = 5000;

app.use(cookieParser())

app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))
app.use("/api/v1/user",userRouter)



connectDb().then(()=>{
    app.listen(port,()=>{
        console.log(`server running on port ${port}`)
    })
})
.catch((error)=>{
        console.log(`Database connection failed: ${error.message}`);
})
