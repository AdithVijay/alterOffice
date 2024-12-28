const User = require("../model/user");
const URL = require("../model/url");
const { nanoid } = require('nanoid');
const UAParser = require('ua-parser-js');  // Import the correct parser

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

const getUrlData = async(req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    console.log(user);
    console.log(user._id);
    const url = await URL.find({ user: user._id });
    console.log(url);
    return res.status(200).json(url);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error fetching URL data" });
  }
};

const handleGenerateNewUrl = async (req, res) => {
  try {
    const { url, user } = req.body;
    if (!url || !user) {
      return res.status(400).json({ message: "Bad Request: Missing URL or User data" });
    }

    const urlExists = await URL.findOne({ longUrl: url });
    console.log(urlExists);

    if (urlExists) {
      return res.status(409).json({ message: "URL already exists" });
    }

    const shortId = nanoid(8); 

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

const handleRedirect = async (req, res) => {
  try {
    const { shortUrl } = req.params;

    const url = await URL.findOne({ shortUrl });
    if (!url) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    // Track click for analytics
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date (YYYY-MM-DD)
    
    // Get the user's IP address
    const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Update total clicks
    url.clicks += 1;

    // Check if the user (by IP) has already clicked today
    const uniqueUserEntry = url.uniqueUserClicks.find(entry => entry.date === currentDate && entry.ip === userIP);
    if (!uniqueUserEntry) {
      // If no entry for today and this IP, increment unique users count
      url.uniqueUsers += 1;
      // Store this IP in the uniqueUserClicks array
      url.uniqueUserClicks.push({ date: currentDate, ip: userIP });
    }

    // Update clicksByDate
    const clickByDate = url.clicksByDate.find(entry => entry.date === currentDate);
    if (clickByDate) {
      clickByDate.clickCount += 1;
    } else {
      url.clicksByDate.push({ date: currentDate, clickCount: 1 });
    }

    // Update OS and Device Analytics
    const userAgent = req.headers['user-agent']; // Example of how you might extract the user agent
    const osName = extractOS(userAgent); // Function to extract OS name from user agent string
    const deviceName = extractDevice(userAgent); // Function to extract device name from user agent string

    // Update OS type analytics
    const osTypeEntry = url.osType.find(entry => entry.osName === osName);
    if (osTypeEntry) {
      osTypeEntry.uniqueClicks += 1;
      osTypeEntry.uniqueUsers += 1; // You may need to check for unique users
    } else {
      url.osType.push({ osName, uniqueClicks: 1, uniqueUsers: 1 });
    }

    // Update Device type analytics
    const deviceTypeEntry = url.deviceType.find(entry => entry.deviceName === deviceName);
    if (deviceTypeEntry) {
      deviceTypeEntry.uniqueClicks += 1;
      deviceTypeEntry.uniqueUsers += 1; // Same as above for unique users
    } else {
      url.deviceType.push({ deviceName, uniqueClicks: 1, uniqueUsers: 1 });
    }

    // Save the updated URL data
    await url.save();

    // Redirect the user to the long URL
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
};
