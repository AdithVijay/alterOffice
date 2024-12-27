const express = require("express");
const userRoute = express.Router()

const userController = require('../controller/userController');

userRoute.post("/signup",userController.signup)
userRoute.post("/googlesignin",userController.googleSignIn)

module.exports = userRoute