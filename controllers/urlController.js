const shortid = require("shortid");
const URL = require("../model/urlModel");

async function handleGetAllURLs(req, res) {
  try {
    const urls = await URL.find({});
    res.status(200).json({ success: true, data: urls });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve URLs" });
  }
}

async function handleGenerateNewShortNewURL(req, res) {
  const { url, expirationDate } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const shortID = shortid.generate();

  try {
    const newURL = await URL.create({
      shortId: shortID,
      redirectURL: url,
      visitHistory: [],
      expirationDate: expirationDate ? new Date(expirationDate) : null,
      user: req.user._id, // Associate with the authenticated user
    });

    res.status(201).json(newURL);
  } catch (error) {
    res.status(500).json({ error: "Failed to create short URL" });
  }
}

async function handleRedirect(req, res) {
  try {
    const entry = await URL.findOne({ shortId: req.params.shortId });

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    if (entry.expirationDate && new Date() > entry.expirationDate) {
      return res.status(410).json({ error: "Short URL has expired" });
    }

    entry.visitHistory.push({ timestamp: Date.now() });
    await entry.save();

    res.redirect(entry.redirectURL);
  } catch (error) {
    res.status(500).json({ error: "Server error during redirection" });
  }
}

async function handleGetAnalytics(req, res) {
  try {
    const entry = await URL.findOne({ shortId: req.params.shortId });

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.status(200).json({
      totalClicks: entry.visitHistory.length,
      analytics: entry.visitHistory,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
}

async function handleUpdateShortURL(req, res) {
  try {
    const entry = await URL.findOne({ shortId: req.params.shortId });

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    const { url, expirationDate } = req.body;
    if (url) entry.redirectURL = url;
    if (expirationDate) entry.expirationDate = new Date(expirationDate);

    const updatedEntry = await entry.save();
    res.status(200).json(updatedEntry);
  } catch (error) {
    res.status(500).json({ error: "Failed to update URL" });
  }
}

async function handleDeleteShortURL(req, res) {
  try {
    const deletedEntry = await URL.findOneAndDelete({
      shortId: req.params.shortId,
    });

    if (!deletedEntry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.status(200).json({ message: "Short URL deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete URL" });
  }
}

module.exports = {
  handleGetAllURLs,
  handleGenerateNewShortNewURL,
  handleRedirect,
  handleGetAnalytics,
  handleUpdateShortURL,
  handleDeleteShortURL,
};
