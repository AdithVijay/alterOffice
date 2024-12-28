const URL = require("../model/url")

 const fetchUrlAnalytics = async(req,res) =>{
       const {id} =  req.params
       const trimmedId = id.trim();
       console.log(id)
       
       const urlData = await URL.findById(trimmedId)
        
        const refinedData = {
            longUrl: urlData.longUrl,
            shortUrl: urlData.shortUrl,
            clicks: urlData.clicks,
            uniqueUsers: urlData.uniqueUsers,
            clicksByDate: urlData.clicksByDate.map(entry => ({
              date: entry.date,
              clickCount: entry.clickCount
            })),
            osType: urlData.osType.map(os => ({
              osName: os.osName,
              uniqueClicks: os.uniqueClicks,
              uniqueUsers: os.uniqueUsers
            })),
            deviceType: urlData.deviceType.map(device => ({
              deviceName: device.deviceName,
              uniqueClicks: device.uniqueClicks,
              uniqueUsers: device.uniqueUsers
            }))
          };
          console.log("daatta",refinedData);
          
         return res.status(200).json(refinedData);
}

module.exports = {
    fetchUrlAnalytics
}