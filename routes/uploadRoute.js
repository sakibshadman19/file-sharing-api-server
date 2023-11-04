// Import required dependencies and modules

const express = require("express");
const { uploadLimiter } = require("../middleware/rateLimitMiddleware");
const filesPayloadExists = require('../middleware/filesPayloadExists');
const fileExtLimiter = require('../middleware/fileExtLimiter');
const fileSizeLimiter = require('../middleware/fileSizeLimiter');
const fileUpload = require("express-fileupload");
const uploadController = require("../controllers/uploadController");

// Create an Express router instance
const router = express.Router();

// Define a route for handling file uploads

router.post('/files',
uploadLimiter,    // Apply rate limiting middleware
fileUpload({ createParentPath: true }),  // Middleware for handling file uploads
filesPayloadExists,  // Check if files payload exists
fileExtLimiter(['.png', '.jpg', '.jpeg']),  // Limit acceptable file extensions
fileSizeLimiter,   // Limit acceptable file sizes
uploadController);  // Handle file upload logic in the controller
 
module.exports = router;
