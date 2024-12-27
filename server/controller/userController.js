
const URL = require('../model/url');
const bcrypt = require('bcryptjs');

const securePassword = async (password) => {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      console.log(error);
    }
  };

const signup = async(req,res)=>{
    try{
        const {name,email,password} = req.body
        console.log(req.body);
        
        const isEmailExists = await URL.findOne({email})
        if(isEmailExists){
           return res.status(401).json({message: "email already exists"});
        }
         
            const passwordhash =await securePassword(password)
            console.log(passwordhash)
            const user = await URL.create({
                name:name,
                password:passwordhash,
                email:email,
            })

            return res.status(200).json({ message: "User is registered", user });
    }catch(err){
        console.log("Err is msg:",err.message);
        return res.status(500).json({
          success: false,
          message : err.message
      })
    }
}

module.exports = {
    signup
}