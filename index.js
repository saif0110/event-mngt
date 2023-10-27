const express = require("express")
const mongoose = require("mongoose")
const app = express();

const eventRouter = require("./routes/event")
const userRouter = require("./routes/user")
const myAuthMiddleware = require("./middleware/auth")

app.use(express.json())
app.use("/app/v1/event", myAuthMiddleware, eventRouter)
app.use("/app/v1/user", userRouter)

const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://khanmohdtauheed4:hg3pbmx7ssQbv1GR@cluster0.pqt8jpw.mongodb.net/")
}
connectDB()
.then(()=>{
    console.log("MongoDB connected suuccessfully..");
})
.catch((error)=>{
    console.log("Failed to connect with mongoDB..");
})

const portNo = 5000
app.listen(portNo, ()=>{
    console.log("server is up and runnign on port number ", portNo);
})