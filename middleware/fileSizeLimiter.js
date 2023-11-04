// Define the maximum file size in megabytes (MB).
const MB = 5; // 5 MB 

// Maximum allowed number of files
const MAX_FILE_COUNT = 6;

// Calculate the file size limit in bytes by multiplying MB by 1024*1024.
const FILE_SIZE_LIMIT = MB * 1024 * 1024;



/**
 * Middleware function to limit the size of uploaded files.
 * It checks if any uploaded files exceed the defined file size limit.
 */

const fileSizeLimiter = (req, res, next) => {
    // Get the uploaded files from the request.
    const files = req.files


    // Array to store the names of files that exceed the size limit.
    const filesOverLimit = []


    // Check the number of uploaded files
    if (Object.keys(files).length > MAX_FILE_COUNT) {
        const errorMessage = `Upload failed. You can only upload a maximum of ${MAX_FILE_COUNT} files.`;
        return res.status(413).json({ status: 'error', message: errorMessage });
    }


    // Iterate through the uploaded files to identify those exceeding the limit.
    Object.keys(files).forEach(key => {
        if (files[key].size > FILE_SIZE_LIMIT) {
            filesOverLimit.push(files[key].name)
        }
    })


    // Check if there are any files over the size limit.
    if (filesOverLimit.length) {
        // Create an error message indicating the file names exceeding the size limit.
        const errorMessage = `Upload failed. The following files exceed the file size limit of ${MB} MB: ${filesOverLimit.join(', ')}.`;

        // Return a 413 (Payload Too Large) status and the error message as JSON.
        return res.status(413).json({ status: 'error', message: errorMessage });
    }

    // If no files exceed the size limit, continue to the next middleware.

    next()
}

module.exports = fileSizeLimiter