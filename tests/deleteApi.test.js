
const request = require('supertest');
const express = require('express');
const app = express();
const deleteController = require('../controllers/deleteController');
const fileStorage = require('../fileStorage');
const bcrypt = require('bcrypt');

// Mock the fileStorage functions
fileStorage.getUploadedFiles = jest.fn();
fileStorage.saveFiles = jest.fn();

// Mock the environment variable
process.env.FOLDER = 'C:\Users\User\Desktop\Test\Data Storage';

app.delete('/files/:privateKey', deleteController);

describe('File Deletion', () => {
  it('deletes files successfully', async () => {
    // Mock the data for the private key
    const privateKey = 'private_key';
    const fileName = 'file1.txt';

    // Mock the fileStorage response
    fileStorage.getUploadedFiles.mockReturnValue([
      { private: bcrypt.hashSync(privateKey, 10), fileName: [fileName] },
    ]);

      // Mock the fs.unlink function for successful file deletion
      const fs = require('fs');
      fs.unlink = jest.fn((path, callback) => {
        callback(null); // Mock successful file deletion
      });

    const response = await request(app)
      .delete(`/files/${privateKey}`)
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Files associated with the private key deleted');
    expect(fileStorage.saveFiles).toHaveBeenCalledTimes(1);
    expect(fs.unlink).toHaveBeenCalledTimes(1);
  });



  it('handles no files found', async () => {
    // Mock a non-existent private key
    const privateKey = 'non_existent_key';

    // Mock the fileStorage response to return an empty array
    fileStorage.getUploadedFiles.mockReturnValue([]);

    const response = await request(app)
      .delete(`/files/${privateKey}`)
      .expect(404);

    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('No files found for the given private key');
  });



  it('handles file deletion error', async () => {
    // Mock an error in the file deletion process
    const privateKey = 'error_key';
    const fileName = 'file2.txt';

    // Mock the fileStorage response
    fileStorage.getUploadedFiles.mockReturnValue([
      { private: bcrypt.hashSync(privateKey, 10), fileName: [fileName] },
    ]);

    // Mock the deletion error by causing an exception
    fileStorage.saveFiles.mockImplementation(() => {
      throw new Error('File deletion error');
    });

    const response = await request(app)
      .delete(`/files/${privateKey}`)
      .expect(500);

    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('Failed to delete file');
  });
});
