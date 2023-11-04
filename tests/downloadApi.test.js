const request = require('supertest');
const express = require('express');
const app = express();
const downloadController = require('../controllers/downloadController');
const fileStorage = require('../fileStorage');

// Mock the fileStorage functions
fileStorage.getUploadedFiles = jest.fn();

// Mock the environment variable
process.env.FOLDER = 'C:\Users\User\Desktop\Test\Data Storage';

app.get('/files/:publicKey', downloadController);

describe('File Download', () => {
  it('downloads files successfully', async () => {
    // Mock the data for the public key
    const publicKey = 'public_key';
    const fileNames = ['file1.txt', 'file2.jpg'];

    // Mock the fileStorage response
    fileStorage.getUploadedFiles.mockReturnValue([
      { public: publicKey, fileName: fileNames },
    ]);

    const response = await request(app)
      .get(`/files/${publicKey}`)
      .expect(200);

    expect(response.header['content-disposition']).toMatch(`attachment; filename="${publicKey}_files.zip"`);
  });



  it('handles no files found', async () => {
    // Mock a non-existent public key
    const publicKey = 'non_existent_key';

    // Mock the fileStorage response to return an empty array
    fileStorage.getUploadedFiles.mockReturnValue([]);

    const response = await request(app)
      .get(`/files/${publicKey}`)
      .expect(404);

    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('No files found for the given public key');
  });



  it('handles unexpected errors', async () => {
    // Mock an unexpected error in the controller
    fileStorage.getUploadedFiles.mockImplementation(() => {
      throw new Error('Test error');
    });

    const response = await request(app)
      .get('/files/your_public_key_here')
      .expect(500);

    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('An unexpected error occurred during file download.');
  });
});





