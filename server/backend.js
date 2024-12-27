const express = require('express');
const cors = require('cors')
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const userRoute = require('./routes/userRoute');

const app = express()
const dotenv = require('dotenv')
dotenv.config()
const {OAuth2Client} = require('google-auth-library')
const helmet = require("helmet");

app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin" }, // Adjust as needed
    crossOriginEmbedderPolicy: false, // Disable if you're not using SharedArrayBuffer
  })
);

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/urlshortner")
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Failed to connect to MongoDB:', error))

app.use("/user",userRoute)

app.listen(3000,()=>{
    console.log("server started")
})