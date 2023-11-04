const request = require('supertest');
const express = require('express');
const app = express();
const uploadController = require('../controllers/uploadController');
const fileStorage = require('../fileStorage');

// Mocking the fileStorage functions
fileStorage.addUploadedFile = jest.fn();

app.use(express.json());

// Mock the environment variable
process.env.FOLDER = 'C:\Users\User\Desktop\Test\Data Storage';

// Mock the express-fileupload middleware
app.use((req, res, next) => {
  req.files = {
    file1: {
      name: 'test.jpg',
      mv: jest.fn((path, callback) => {
        callback(null);
      }),
    },
    file2: {
      name: 'test.png',
      mv: jest.fn((path, callback) => {
        callback(null);
      }),
    },
  };
  next();
});

// Mock the bcrypt.hash function
const bcrypt = require('bcrypt');
bcrypt.hash = jest.fn((data, salt) => Promise.resolve(data));

app.post('/files', uploadController);

describe('File Upload', () => {
    
    
  it('uploads files successfully', async () => {
    
    const response = await request(app)
      .post('/files')
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.public_key).toBeDefined();
    expect(response.body.private_key).toBeDefined();
    expect(fileStorage.addUploadedFile).toHaveBeenCalledTimes(1);
    expect(bcrypt.hash).toHaveBeenCalledTimes(1);
    
  });

});
