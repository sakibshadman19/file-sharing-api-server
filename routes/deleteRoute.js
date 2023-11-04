const express = require("express");
const deleteController = require("../controllers/deleteController");


const router = express.Router();

// The private key associated with the file to be deleted.
router.delete('/files/:privateKey',deleteController);

module.exports = router;


