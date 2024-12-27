const express = require("express");
const userRoute = express.Router()

const userController = require('../controller/userController');

userRoute.post("/signup",userController.signup)
userRoute.post("/googlesignin",userController.googleSignIn)
userRoute.post("/login",userController.login);
userRoute.post("/googleLogin",userController.googleLogin)

module.exports = userRoute