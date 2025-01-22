const express= require("express");
const mongoose = require("mongoose");
const donorRoutes = require("./routers/donorRoute");
const requestRoutes = require("./routers/requestRoute");

require("dotenv").config();

const cors= require("cors");
const app = express();
const PORT=process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

mongoose
.connect(process.env.Connect)
.then(()=>console.log("MongoDB Connected"))
.catch((err)=>console.log(err));

app.use("/api/donors",donorRoutes);
app.use("/api/requests",requestRoutes);
app.listen(PORT,()=>{
    console.log("Server is running");
})

