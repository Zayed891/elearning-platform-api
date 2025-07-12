require('dotenv').config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const {userRouter} = require("./routes/user");
const {adminRouter} = require("./routes/admin")
const {courseRouter} = require("./routes/course");


app.use(express.json());

app.use("/api/v1/user",userRouter);

app.use("/api/v1/admin",adminRouter);

app.use("/api/v1/course",courseRouter);



async function main(){
    try {
        await mongoose.connect(process.env.MONGO_URL);
        
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    } catch (error) {
        console.error("Error starting server:", error);
    }
}

main();