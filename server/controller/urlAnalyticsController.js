const URL = require("../model/url");
const CustomAlias = require("../model/customAlias");

const fetchUrlAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const trimmedId = id.trim();

    // Check if the ID matches a record in CustomAlias
    const aliasData = await CustomAlias.findById(trimmedId);

    if (aliasData) {
      // If found in CustomAlias, return its analytics
      const refinedData = {
        longUrl: aliasData.longUrl,
        shortUrl: aliasData.alias,
        clicks: aliasData.clicks,
        uniqueUsers: aliasData.uniqueUsers,
        clicksByDate: aliasData.clicksByDate.map(entry => ({
          date: entry.date,
          clickCount: entry.clickCount,
        })),
        osType: aliasData.osType.map(os => ({
          osName: os.osName,
          uniqueClicks: os.uniqueClicks,
          uniqueUsers: os.uniqueUsers,
        })),
        deviceType: aliasData.deviceType.map(device => ({
          deviceName: device.deviceName,
          uniqueClicks: device.uniqueClicks,
          uniqueUsers: device.uniqueUsers,
        })),
      };

      return res.status(200).json(refinedData);
    }

    // Check if the ID matches a record in URL
    const urlData = await URL.findById(trimmedId);

    if (urlData) {
      // If found in URL, return its analytics
      const refinedData = {
        longUrl: urlData.longUrl,
        shortUrl: urlData.shortUrl,
        clicks: urlData.clicks,
        uniqueUsers: urlData.uniqueUsers,
        clicksByDate: urlData.clicksByDate.map(entry => ({
          date: entry.date,
          clickCount: entry.clickCount,
        })),
        osType: urlData.osType.map(os => ({
          osName: os.osName,
          uniqueClicks: os.uniqueClicks,
          uniqueUsers: os.uniqueUsers,
        })),
        deviceType: urlData.deviceType.map(device => ({
          deviceName: device.deviceName,
          uniqueClicks: device.uniqueClicks,
          uniqueUsers: device.uniqueUsers,
        })),
      };

      return res.status(200).json(refinedData);
    }

    // If ID does not match any record
    return res.status(404).json({ message: "No URL or Custom Alias found for the provided ID." });
  } catch (error) {
    console.error("Error fetching URL analytics:", error);
    return res.status(500).json({ message: "Error fetching analytics." });
  }
};

//---------------------------------------------------------------------------

const fetchUserAnalytics = async (req, res) => {
  const { id } = req.params;
  console.log("User ID in analytics:", id);

  try {
    // Fetch data from both URL and CustomAlias schemas for the given user
    const urls = await URL.find({ user: id });
    const customAliases = await CustomAlias.find({ user: id });

    // Combine the data
    const combinedData = [...urls, ...customAliases];

    // Collect all unique user IPs across both OS and Device analytics
    const uniqueIPs = new Set();

    combinedData.forEach((data) => {
      const seenIPs = new Set(); // Track IPs seen for this specific record

      data.osType.forEach((os) => {
        os.uniqueUserIPs.forEach((userIP) => {
          if (!seenIPs.has(userIP.ip)) {
            uniqueIPs.add(userIP.ip);
            seenIPs.add(userIP.ip);
          }
        })
      })

      data.deviceType.forEach((device) => {
        device.uniqueUserIPs.forEach((userIP) => {
          if (!seenIPs.has(userIP.ip)) {
            uniqueIPs.add(userIP.ip);
            seenIPs.add(userIP.ip);
          }
        });
      });
    });

    // Deduplicated unique users count
    const totalUniqueUsers = uniqueIPs.size;

    // Refine data to send to the frontend
    const refinedData = combinedData.map((data) => ({
      longUrl: data.longUrl,
      shortUrl: data.shortUrl || data.alias, // Alias serves as shortUrl in CustomAlias
      clicks: data.clicks,
      uniqueUsers: data.uniqueUsers, // This remains per URL or alias
      clicksByDate: data.clicksByDate.map((entry) => ({
        date: entry.date,
        clickCount: entry.clickCount,
      })),
      osType: data.osType.map((os) => ({
        osName: os.osName,
        uniqueClicks: os.uniqueClicks,
        uniqueUsers: os.uniqueUsers,
      })),
      deviceType: data.deviceType.map((device) => ({
        deviceName: device.deviceName,
        uniqueClicks: device.uniqueClicks,
        uniqueUsers: device.uniqueUsers,
      })),
    }));

    // Send both the refined data and deduplicated unique users count
    return res.status(200).json({
      refinedData,
      totalUniqueUsers,
    });
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    return res.status(500).json({ error: "An error occurred while fetching analytics data." });
  }
};



module.exports = {
  fetchUrlAnalytics,
  fetchUserAnalytics
};
