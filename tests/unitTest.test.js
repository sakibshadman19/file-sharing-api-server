const fs = require('fs');
const path = require('path');
const storage = require('../fileStorage'); 
const fileExtLimiter = require('../middleware/fileExtLimiter');
const fileSizeLimiter = require('../middleware/fileSizeLimiter');



// Mock the fs module to avoid writing to the actual file system
jest.mock('fs');

// Define a test file object

const testFile = { public: 'test101', private: 'test901' , fileName:['test.jpeg']};


// This section of tests is focused on the storage module, which handles file storage and management.
describe('Storage Module', () => {
  beforeEach(() => {
    // Clear the uploadedFiles array before each test
    storage.getUploadedFiles().length = 0;
  });

  test('addUploadedFile should add a file object to uploadedFiles', () => {
    storage.addUploadedFile(testFile);
    expect(storage.getUploadedFiles()).toContainEqual(testFile);
  });

  test('saveFiles should write to the file system', () => {
    storage.saveFiles();
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('storage.json'),
      expect.any(String),
      'utf8'
    );
  });

  test('loadFiles should populate uploadedFiles from the file system', () => {
    const mockData = JSON.stringify([testFile]);
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(mockData);

    storage.loadFiles();

    expect(storage.getUploadedFiles()).toEqual([testFile]);
  });

  test('loadFiles should not populate uploadedFiles if the file does not exist', () => {
    fs.existsSync.mockReturnValue(false);

    storage.loadFiles();

    expect(storage.getUploadedFiles()).toEqual([]);
  });
});









  // This section of tests focuses on the file extension limiter middleware, which filters file extensions.
describe('fileExtLimiter middleware', () => {
  const mockRequest = (files) => ({
    files,
  });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it('should allow valid file extensions', () => {
    const allowedExtensions = ['.jpg', '.png'];
    const middleware = fileExtLimiter(allowedExtensions);
    const req = mockRequest({
      file1: { name: 'file1.jpg' },
      file2: { name: 'file2.png' },
    });
    const res = mockResponse();
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return an error for disallowed file extensions', () => {
    const allowedExtensions = ['.jpg', '.png'];
    const middleware = fileExtLimiter(allowedExtensions);
    const req = mockRequest({
      file1: { name: 'file1.jpg' },
      file2: { name: 'file2.txt' },
    });
    const res = mockResponse();
    const next = jest.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Upload failed. Only .jpg, .png files allowed.',
    });
    expect(next).not.toHaveBeenCalled();
  });
});









 // This section of tests is dedicated to the file size limiter middleware, which enforces size limits on uploaded files.
describe('fileSizeLimiter middleware', () => {
  const req = {
    files: {},
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should allow the request to continue when files are within the size limit', () => {
    req.files = {
      file1: { name: 'file1.txt', size: 4 * 1024 * 1024 }, // 4 MB
      file2: { name: 'file2.txt', size: 3 * 1024 * 1024 }, // 3 MB
    };

    fileSizeLimiter(req, res, next);

    expect(next).toHaveBeenCalled();
  });



  it('should return an error response when files exceed the size limit', () => {
    req.files = {
      file1: { name: 'file1.txt', size: 6 * 1024 * 1024 }, // 6 MB
      file2: { name: 'file2.txt', size: 4 * 1024 * 1024 }, // 4 MB
    };

    fileSizeLimiter(req, res, next);

   
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: `Upload failed. The following files exceed the file size limit of 5 MB: file1.txt.`,
    });
    expect(next).not.toHaveBeenCalled();
  });
});
