const express = require("express");
const userRoute = express.Router()

const userController = require('../controller/userController');

userRoute.post("/signup",userController.signup)

module.exports = userRoute