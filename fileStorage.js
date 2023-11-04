// Import required modules
const fs = require('fs');
const path = require('path');

// Define the file path for storing uploaded files data
const storageFilePath = path.join(__dirname, 'storage.json');

let uploadedFiles = [];

// Function to load uploaded files data from storage file
function loadFiles() {
  if (fs.existsSync(storageFilePath)) {
    // Read data from the storage file
    const data = fs.readFileSync(storageFilePath, 'utf8');
    // Parse the JSON data and populate the uploadedFiles array
    uploadedFiles = JSON.parse(data);
    // console.log("loading", uploadedFiles)


  }
}

// Function to save uploaded files data to the storage file
function saveFiles() {
  // Convert the uploadedFiles array to JSON data
  const dataToSave = JSON.stringify(uploadedFiles);
  // Write the JSON data to the storage file
  fs.writeFileSync(storageFilePath, dataToSave, 'utf8');



}
// Load files when the module is imported
loadFiles();


// Export module functions and data
module.exports = {
  getUploadedFiles: () => uploadedFiles,

  // Add a new uploaded file object to the array and save the data
  addUploadedFile: (fileObject) => {

    uploadedFiles.push(fileObject);

    saveFiles();
  },
  saveFiles: saveFiles,
  loadFiles
};
