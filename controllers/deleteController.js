// Import required modules and libraries
const fileStorage = require('../fileStorage');
const path = require("path");
const fs = require('fs');
const bcrypt = require('bcrypt');


/**
 * Controller function for deleting files associated with a specific private key.
 */
const deleteController = (req, res) => {

    // Extract the private key from the request parameters
    const privateKey = req.params.privateKey;

    // Filter the uploaded files to find files associated with the provided private key
    const filesToDelete = fileStorage.getUploadedFiles().filter(file => {
        // Use bcrypt.compareSync to compare the hashed private key with the provided private key
        return bcrypt.compareSync(privateKey, file.private);
    });

    // If no files are found for the given private key, return a 404 error response
    if (filesToDelete.length === 0) {
        return res.status(404).json({ status: 'error', message: 'No files found for the given private key' });
    }

    // Create an array of promises for deleting each file
    const deletePromises = filesToDelete[0].fileName.map(fileName => {
        return new Promise((resolve, reject) => {
            const filePath = path.join(process.env.FOLDER, fileName);

            // Delete the file from the server
            fs.unlink(filePath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    });


    // Execute all delete promises in parallel using Promise.all
    Promise.all(deletePromises)
        .then(() => {

            // Remove the deleted files from the uploaded Files list

            fileStorage.getUploadedFiles().splice(fileStorage.getUploadedFiles().indexOf(filesToDelete[0]), 1);

            // Save the updated list of uploaded files
            fileStorage.saveFiles();

            return res.json({ status: 'success', message: 'Files associated with the private key deleted' });
        })
        .catch((err) => {
            // Handle errors and return a 500 error response
            return res.status(500).json({ status: 'error', message: 'Failed to delete file' });
        });
}

module.exports = deleteController;

