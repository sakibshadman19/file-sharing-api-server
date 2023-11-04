// Import required packages and libraries
const { v4: uuidv4 } = require('uuid'); // Import the uuid package
const fileStorage = require('../fileStorage');
const bcrypt = require('bcrypt'); // Import the bcrypt library
const path = require("path");


/**
 * Handles file upload and storage of uploaded files.
 * @returns {Object} - JSON response containing public and private keys.
 */

const uploadController = async (req, res) => {
    try {
        const files = req.files
        // console.log(files)


        // Initialize an object to store uploaded file information
        const uploadedFileObject = {
            public: uuidv4(),  // Generate a unique public key for all files
            private: uuidv4(),  // Generate a unique private key for all files
            fileName: [] // Initialize an empty array to store file names
        };

        // Iterate through uploaded files
        Object.keys(files).forEach((key, index) => {

            // Generate a new file name for the uploaded file by combining the public key, the index, and the file extension of the original file.
            const originalFileName = files[key].name;
            const fileExtension = path.extname(originalFileName);
            const newFileName = `${uploadedFileObject.public}-${index}${fileExtension}`;

            // Create the file path where the file will be stored
            const filepath = path.join(process.env.FOLDER, newFileName)

            // Move the uploaded file to the specified location
            files[key].mv(filepath, (err) => {

                if (err) return res.status(500).json({ status: "error", message: err })
            })

            // Add the file name to the array
            uploadedFileObject.fileName.push(newFileName);

            console.log("this is uploadedfileobject", uploadedFileObject);
        })


        // Include the public and private keys in the response JSON
        const responseJSON = {
            status: 'success',
            message: Object.keys(files).toString(),
            public_key: uploadedFileObject.public,
            private_key: uploadedFileObject.private,
        };

        // Hash the private key before storing it
        const hashedPrivateKey = await bcrypt.hash(uploadedFileObject.private, 10); // 10 is the number of salt rounds
        // console.log('this is hashed private key', hashedPrivateKey);
        uploadedFileObject.private = hashedPrivateKey;


        // Store the uploaded file information
        fileStorage.addUploadedFile(uploadedFileObject);

        return res.json(responseJSON);

    }
    catch (error) {
        console.error('Upload Controller Error:', error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }


}

module.exports = uploadController

