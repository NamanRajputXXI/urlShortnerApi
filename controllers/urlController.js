const shortid = require("shortid");
const URL = require("../model/urlModel");

async function handleGetAllURLs(req, res) {
  try {
    const urls = await URL.find({}); // Fetch all URLs
    res.status(200).json({
      success: true,
      message: "All URLs retrieved successfully.",
      data: urls,
    });
  } catch (error) {
    console.error("Error fetching URLs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve URLs.",
      error: error.message,
    });
  }
}

/**
 * Handle URL creation (POST /api/url)
 */
async function handleGenerateNewShortNewURL(req, res) {
  const body = req.body;

  if (!body.url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const shortID = shortid();
  try {
    const newURL = await URL.create({
      shortId: shortID,
      redirectURL: body.url,
      visitHistory: [],
      expirationDate: body.expirationDate
        ? new Date(body.expirationDate)
        : null,
    });

    return res.status(201).json({ id: shortID, shortURL: newURL });
  } catch (error) {
    res.status(500).json({ error: "Failed to create short URL" });
  }
}

/**
 * Handle redirection (GET /api/url/:shortId)
 */
async function handleRedirect(req, res) {
  const { shortId } = req.params;

  try {
    const entry = await URL.findOne({ shortId });

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    // Check expiration
    if (entry.expirationDate && new Date() > entry.expirationDate) {
      return res.status(410).json({ error: "Short URL has expired" });
    }

    // Log visit
    entry.visitHistory.push({ timestamp: Date.now() });
    await entry.save();

    // Redirect to the original URL
    res.redirect(entry.redirectURL);
  } catch (error) {
    res.status(500).json({ error: "Server error during redirection" });
  }
}

/**
 * Handle analytics retrieval (GET /api/url/analytics/:shortId)
 */
async function handleGetAnalytics(req, res) {
  const { shortId } = req.params;

  try {
    const entry = await URL.findOne({ shortId });

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    return res.status(200).json({
      totalClicks: entry.visitHistory.length,
      analytics: entry.visitHistory,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching analytics" });
  }
}

/**
 * Handle short URL updates (PUT /api/url/:shortId)
 */
async function handleUpdateShortURL(req, res) {
  const { shortId } = req.params;
  const { url, customAlias, expirationDate } = req.body;

  try {
    const entry = await URL.findOne({ shortId });

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    // Update the fields
    if (url) entry.redirectURL = url;
    if (customAlias) entry.shortId = customAlias;
    if (expirationDate) entry.expirationDate = new Date(expirationDate);

    await entry.save();

    return res.status(200).json({
      message: "Short URL updated successfully",
      updatedURL: entry,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Server error while updating the short URL" });
  }
}

/**
 * Handle short URL deletion (DELETE /api/url/:shortId)
 */
async function handleDeleteShortURL(req, res) {
  const { shortId } = req.params;

  try {
    const deletedEntry = await URL.findOneAndDelete({ shortId });

    if (!deletedEntry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    return res.status(200).json({ message: "Short URL deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Server error while deleting the short URL" });
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
