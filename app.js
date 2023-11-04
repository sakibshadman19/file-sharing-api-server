const express = require("express");
const uploadRoutes = require("./routes/uploadRoute")
const downloadRoutes = require("./routes/downloadRoute")
const deleteRoutes = require("./routes/deleteRoute")
const path = require("path");
const cron = require('node-cron');
const { cleanupFiles } = require("./services/cleanupService");


require("dotenv").config()

const PORT = process.env.PORT || 5000;
const app = express();


// Serve the index.html file for the root URL
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Define routes for file upload, download, and delete
app.use("/post", uploadRoutes);
app.use("/get", downloadRoutes);
app.use("/delete", deleteRoutes);


// Schedule the cleanup job to run daily at midnight (00:00)
cron.schedule('0 0 * * *', () => {
    cleanupFiles();
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));