/**
 * Module: apiRateLimiter.js
 * Description: This module configures rate limiters for upload and download endpoints using the 'express-rate-limit' middleware.
 */


// Import the required 'express-rate-limit' library
const rateLimit = require("express-rate-limit");  

/**
 * Creates a rate limiter for the upload endpoint.
 * This limiter restricts the number of upload requests from each IP address within a specified time window.
 */
const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests for upload per windowMs
    handler: (req, res) => {
        res.status(429).json({ status: 'error', message: 'Upload rate limit exceeded. Please try again after 15 minutes.' });
      },
  });
  

  /**
 * Creates a rate limiter for the download endpoint.
 * This limiter restricts the number of download requests from each IP address within a specified time window.
 */
  const downloadLimiter = rateLimit({
    windowMs:  15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests for download per windowMs
    handler: (req, res) => {
        res.status(429).json({ status: 'error', message: 'Download rate limit exceeded. Please try again after 15 minutes.' });
      },
  });


  module.exports = { uploadLimiter, downloadLimiter };