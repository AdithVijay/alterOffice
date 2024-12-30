const User = require("../model/user");
const URL = require("../model/url");
const { nanoid } = require('nanoid');
const UAParser = require('ua-parser-js');  
const CustomAlias = require('../model/customAlias');

// Function to extract the OS name using ua-parser-js
function extractOS(userAgent) {
  const parser = new UAParser();
  parser.setUA(userAgent);
  const os = parser.getOS();
  return os.name || 'Unknown';  // Return OS name (e.g., Windows, macOS, iOS, Android, etc.)
}

// Function to extract device type (mobile, tablet, or desktop)
function extractDevice(userAgent) {
  const parser = new UAParser();
  parser.setUA(userAgent);
  const device = parser.getDevice();

  // Check if device type is available; if not, categorize as "desktop"
  if (device.type) {
    return device.type;  // For example: 'mobile', 'tablet', or 'desktop'
  } else {
    return 'desktop'; // Default to 'desktop' if device type is not recognized
  }
}

// ----------------------------------------------------------------------------------------------------------------------------------

const getUrlData = async (req, res) => {
  try {
    const { id } = req.params; // User ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch normal URLs
    const urls = await URL.find({ user: user._id });

    // Fetch custom aliases for the user
    const customAliases = await CustomAlias.find({ user: user._id });

    // Combine normal URLs and custom aliases
    const combinedUrls = [
      ...urls.map(url => ({
        _id: url._id,
        longUrl: url.longUrl,
        shortUrl: url.shortUrl,
        clicks: url.clicks || 0,
        createdAt: url.createdAt,
        type: "normal", // Mark it as a normal URL
      })),
      ...customAliases.map(alias => ({
        _id: alias._id,
        longUrl: alias.longUrl,
        shortUrl: alias.alias,
        clicks: alias.clicks, // CustomAlias clicks would need separate tracking if implemented
        createdAt: alias.createdAt,
        type: "custom", // Mark it as a custom alias
      })),
    ];

    return res.status(200).json(combinedUrls);
  } catch (error) {
    console.log("Error fetching URL data:", error);
    return res.status(500).json({ message: "Error fetching URL data" });
  }
};

// ----------------------------------------------------------------------------------------------------------------------------------

const handleGenerateNewUrl = async (req, res) => {
  try {
    const { url, user ,customAlias} = req.body;
    console.log("this s the custom aliasssss", customAlias)
    
    if (!url || !user) {
      return res.status(400).json({ message: "Bad Request: Missing URL or User data" });
    }

    if (customAlias) {
      const aliasExists = await CustomAlias.findOne({ alias: customAlias });
      if (aliasExists) {
        return res.status(409).json({ message: "Custom alias already exists. Please choose another one." });
      }

      // Save the custom alias
      await CustomAlias.create({
        alias: customAlias,
        longUrl: url,
        user,
      });
      return res.status(200).json({ message: "Custom alias created successfully", shortUrl: customAlias });
    }

    const urlExists = await URL.findOne({ longUrl: url, user: user });


    if (urlExists) {
      return res.status(409).json({ message: "URL already exists" });
    }

    const shortId = nanoid(8) 

    await URL.create({
      user: user,
      longUrl: url,
      shortUrl: shortId
    });

    return res.status(200).json({ message: "URL shortened successfully", shortUrl: shortId });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error generating new URL" });
  }
};

// ----------------------------------------------------------------------------------------------------------------------------------

const handleRedirect = async (req, res) => {
  try {
    const { shortUrl } = req.params;

    // Check if the short URL corresponds to a custom alias
    const alias = await CustomAlias.findOne({ alias: shortUrl });
    const target = alias || (await URL.findOne({ shortUrl }));

    if (!target) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    // Track click for analytics
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Get the user's IP address
    const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Update total clicks
    target.clicks += 1;

    // Check if the user has clicked this URL today
    const uniqueUserEntry = target.uniqueUserClicks?.find(
      entry => entry.ip === userIP && new Date(entry.date).getTime() === currentDate.getTime()
    );

    if (!uniqueUserEntry) {
      // Increment unique users only if this is their first click today
      target.uniqueUsers += 1;
      target.uniqueUserClicks.push({ date: currentDate, ip: userIP });
    }

    // Update clicksByDate
    const clickByDate = target.clicksByDate.find(
      entry => new Date(entry.date).getTime() === currentDate.getTime()
    );

    if (clickByDate) {
      clickByDate.clickCount += 1;
    } else {
      target.clicksByDate.push({ date: currentDate, clickCount: 1 });
    }

    // Update OS and Device Analytics
    const userAgent = req.headers['user-agent'];
    const osName = extractOS(userAgent); // Helper function to extract OS name
    const deviceName = extractDevice(userAgent); // Helper function to extract device type

    // Update OS type analytics
    const osTypeEntry = target.osType.find(entry => entry.osName === osName);
    if (osTypeEntry) {
      const osUserEntry = osTypeEntry.uniqueUserIPs?.find(
        entry => entry.ip === userIP && new Date(entry.date).getTime() === currentDate.getTime()
      );

      if (!osUserEntry) {
        osTypeEntry.uniqueClicks += 1;
        osTypeEntry.uniqueUsers += 1;
        osTypeEntry.uniqueUserIPs.push({ ip: userIP, date: currentDate });
      }
    } else {
      target.osType.push({
        osName,
        uniqueClicks: 1,
        uniqueUsers: 1,
        uniqueUserIPs: [{ ip: userIP, date: currentDate }],
      });
    }

    // Update Device type analytics
    const deviceTypeEntry = target.deviceType.find(entry => entry.deviceName === deviceName);
    if (deviceTypeEntry) {
      const deviceUserEntry = deviceTypeEntry.uniqueUserIPs?.find(
        entry => entry.ip === userIP && new Date(entry.date).getTime() === currentDate.getTime()
      );

      if (!deviceUserEntry) {
        deviceTypeEntry.uniqueClicks += 1;
        deviceTypeEntry.uniqueUsers += 1;
        deviceTypeEntry.uniqueUserIPs.push({ ip: userIP, date: currentDate });
      }
    } else {
      target.deviceType.push({
        deviceName,
        uniqueClicks: 1,
        uniqueUsers: 1,
        uniqueUserIPs: [{ ip: userIP, date: currentDate }],
      });
    }

    // Save updates to the appropriate model (CustomAlias or URL)
    await target.save();

    // Redirect to the long URL
    res.redirect(target.longUrl);
  } catch (error) {
    console.error("Error handling redirect:", error);
    res.status(500).json({ message: "Server error" });
  }
};




module.exports = {
  handleGenerateNewUrl,
  getUrlData,
  handleRedirect
};
