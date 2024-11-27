const express = require("express");
const router = express.Router();
const {
  handleGenerateNewShortNewURL,
  handleGetAnalytics,
  handleRedirect,
  handleUpdateShortURL,
  handleDeleteShortURL,
  handleGetAllURLs,
} = require("../controllers/urlController");

router.get("/", handleGetAllURLs); // Get all URLs

// Route to create a new short URL
router.post("/", handleGenerateNewShortNewURL);

// Route to get analytics for a specific short URL
router.get("/analytics/:shortId", handleGetAnalytics);

// Route to handle redirection
router.get("/:shortId", handleRedirect);

// Route to update a short URL
router.put("/:shortId", handleUpdateShortURL);

// Route to delete a short URL
router.delete("/:shortId", handleDeleteShortURL);

module.exports = router;
