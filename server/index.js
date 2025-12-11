const express = require("express");
const connectDb = require("./database/db");

const app = express();

app.use(express.json());
const port = 3000;

connectDb().then(()=>{
    app.listen(port,()=>{
        console.log(`server running on port ${port}`)
    })
})
.catch((error)=>{
        console.log(`Database connection failed: ${error.message}`);
})