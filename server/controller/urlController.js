const User = require("../model/user")
const URL = require("../model/url")
const { nanoid } = require('nanoid');



const getUrlData = async(req,res)=>{

    try {
        const {id} = req.params
        const user = await User.findById(id)
        console.log(user)
        console.log(user._id)
        const url = await URL.find({user:user._id})
        console.log(url);
        return res.status(200).json(url)
    } catch (error) {
        console.log(error)
    }
}

const handleGenerateNewUrl = async(req,res)=>{

    try {
        const {url,user} = req.body
        if (!url || !user) {
            return res.status(400).json({ message: "Bad Request: Missing URL or User data" });
          }

        const urlExists = await URL.findOne({longUrl:url})
        console.log(urlExists);
        

        if (urlExists) {
            return res.status(409).json({ message: "URL already exists" });
          }

        const shortId = nanoid(8); 
        
        await URL.create({
            user :user,
            longUrl:url,
            shortUrl:shortId
        })
        return res.status(200).json({ message: "URL shortened successfully", shortUrl: shortId });
    } catch (error) {
        console.log(error)
    }
}

const handleRedirect = async (req, res) => {
    try {
      const { shortUrl } = req.params;
  
      const url = await URL.findOne({ shortUrl });
      if (!url) {
        return res.status(404).json({ message: "Short URL not found" });
      }
      url.clicks += 1;
      await url.save();
  
      res.redirect(url.longUrl);
    } catch (error) {
      console.error("Error handling redirect:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

module.exports = {
    handleGenerateNewUrl,
    getUrlData,
    handleRedirect
}