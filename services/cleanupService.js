const path = require("path");
const fs = require('fs'); // Import the fs module
require("dotenv").config()



// Define the directory where uploaded files are stored
const uploadDir = process.env.FOLDER;

/**
 * Clean up files based on inactivity.
 * This function reads files from the upload directory and deletes files that have exceeded a specified inactivity period.
 */
const cleanupFiles = () => {
    // Define the maximum number of days of inactivity before files are deleted
    const maxInactivityDays = 5;

    // Read the contents of the upload directory
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            console.error('Error reading the upload directory:', err);
            return;
        }

        // Get the current timestamp
        const now = Date.now();

        // Iterate through each file in the directory
        files.forEach(file => {

            const filePath = path.join(uploadDir, file);

            // Retrieve file statistics, such as modification time
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error('Error getting file stats:', err);
                    return;
                }
                // Calculate the age of the file in days based on modification time
                const fileAge = (now - stats.mtime.getTime()) / (1000 * 60 * 60 * 24); // Calculate age in days
                // Check if the file has exceeded the maximum inactivity period
                if (fileAge >= maxInactivityDays) {
                    fs.unlink(filePath, err => {
                        if (err) {
                            console.error('Error deleting file:', err);
                        } else {
                            console.log('File deleted due to inactivity:', file);
                        }
                    });
                }
            });
        });
    });
};

module.exports = { cleanupFiles };

