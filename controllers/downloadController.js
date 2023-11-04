// Import necessary modules and packages
const fileStorage = require('../fileStorage');
const path = require("path");
const archiver = require('archiver'); // Import the archiver package

/**
 * Handles the downloading of files associated with a specific public key by creating a zip archive.
 */
const downloadController = (req, res) => {

    try {

        // Extract the public key from the request parameters
        const publicKey = req.params.publicKey;

        // Get the list of files associated with the provided public key
        const filesToDownload = fileStorage.getUploadedFiles().filter(file => file.public === publicKey);



        // Check if there are any files to download
        if (filesToDownload.length === 0) {
            return res.status(404).json({ status: 'error', message: 'No files found for the given public key' });
        }

        // Extract the file names associated with the public key
        const fileNames = filesToDownload[0].fileName;

        // Generate file paths for each file based on the file names
        const filePaths = fileNames.map(fileName => path.join(process.env.FOLDER, fileName));

        // Create a zip archive
        const archive = archiver('zip', {
            zlib: { level: 9 }, // Sets the compression level.
        });


        // Handle archive errors
        archive.on('error', function (err) {
            res.status(500).send({ error: err.message });
        });

        // Set the download filename
        res.attachment(`${publicKey}_files.zip`);


        // Pipe the archive to the response stream
        archive.pipe(res);

        filePaths.forEach(filePath => {
            archive.file(filePath, { name: path.basename(filePath) });
        });

        // Finalize the archive and initiate the download
        archive.finalize();


    }
    catch (error) {
        // Handle any unexpected errors
        console.error(error);
        res.status(500).json({ status: 'error', message: 'An unexpected error occurred during file download.' });
    }


}

module.exports = downloadController

