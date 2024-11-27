const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  handleGenerateNewShortNewURL,
  handleGetAnalytics,
  handleRedirect,
  handleUpdateShortURL,
  handleDeleteShortURL,
  handleGetAllURLs,
} = require("../controllers/urlController");

router.get("/", protect, handleGetAllURLs); // Get all URLs (protected)
router.post("/", protect, handleGenerateNewShortNewURL); // Create a new short URL (protected)
router.get("/analytics/:shortId", protect, handleGetAnalytics); // Get analytics (protected)
router.get("/:shortId", handleRedirect); // Public redirect
router.put("/:shortId", protect, handleUpdateShortURL); // Update short URL (protected)
router.delete("/:shortId", protect, handleDeleteShortURL); // Delete short URL (protected)

module.exports = router;
