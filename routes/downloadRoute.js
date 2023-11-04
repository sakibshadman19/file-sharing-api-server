// Import required modules
const express = require("express");
const { downloadLimiter } = require("../middleware/rateLimitMiddleware");
const downloadController = require("../controllers/downloadController");

// Create an Express Router instance
const router = express.Router();


router.get('/files/:publicKey',  //The unique identifier for the requested file.
downloadLimiter,  // Rate limiting middleware to control download requests.
downloadController);  //Handles the download operation.

module.exports = router;



