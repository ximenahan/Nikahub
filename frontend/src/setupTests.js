// src/setupTests.js
import '@testing-library/jest-dom';

// Mock console.log globally
beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
});
  
afterAll(() => {
    console.log.mockRestore();
});
