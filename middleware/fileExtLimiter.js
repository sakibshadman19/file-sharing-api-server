const path = require("path")

/**
 * Middleware function to limit the allowed file extensions in a multipart/form-data request.
 *
 * @param {string[]} allowedExtArray - An array of allowed file extensions (e.g., ['.jpg', '.png']).
 */

const fileExtLimiter = (allowedExtArray) => {
    return (req, res, next) => {

        // Extract files from the request
        const files = req.files

        // Extract file extensions from uploaded files
        const fileExtensions = []
        Object.keys(files).forEach(key => {
            fileExtensions.push(path.extname(files[key].name))
        })

        // Check if the file extensions are allowed
        const allowed = fileExtensions.every(ext => allowedExtArray.includes(ext))


        // If the file extensions are not allowed, return an error response
        if (!allowed) {
            const message = `Upload failed. Only ${allowedExtArray.toString()} files allowed.`.replaceAll(",", ", ");

            return res.status(422).json({ status: "error", message });
        }

        // If the file extensions are allowed, proceed to the next middleware
        next()
    }
}

module.exports = fileExtLimiter