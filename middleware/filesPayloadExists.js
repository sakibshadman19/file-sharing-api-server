/**
 * Middleware to check the existence of files in the request.
 *
 * This middleware is designed to be used in an Express.js application to ensure that
 * the request contains uploaded files in the 'req.files' object. If no files are
 * found, it responds with a 400 Bad Request status and an error message. Otherwise,
 * it allows the request to proceed to the next middleware or route handler.
 */


const filesPayloadExists = (req, res, next) => {
    if (!req.files) return res.status(400).json({ status: "error", message: "Missing files" })

    // If files are found, allow the request to proceed to the next middleware or route handler.
    next()
}

module.exports = filesPayloadExists