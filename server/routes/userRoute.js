const express = require("express");
const userRoute = express.Router()

const userController = require('../controller/userController');
const urlController = require('../controller/urlController')

userRoute.post("/signup",userController.signup)
userRoute.post("/googlesignin",userController.googleSignIn)
userRoute.post("/login",userController.login);
userRoute.post("/googleLogin",userController.googleLogin)

userRoute.post("/shorten",urlController.handleGenerateNewUrl)
userRoute.get("/getUrlData/:id",urlController.getUrlData)
userRoute.get("/:shortUrl",urlController.handleRedirect);

module.exports = userRoute