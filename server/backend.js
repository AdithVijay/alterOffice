const express = require('express');
const cors = require('cors')
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const userRoute = require('./routes/userRoute');

const app = express()
const dotenv = require('dotenv')
dotenv.config()
const {OAuth2Client} = require('google-auth-library')

const corsOptions = {
  origin: "http://localhost:5173", 
  credentials: true,              
};
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/urlshortner")
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Failed to connect to MongoDB:', error))

app.use("/user",userRoute)

app.listen(3000,()=>{
    console.log("server started")
})