// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom

// src/setupTests.js
import '@testing-library/jest-dom';
import dotenv from 'dotenv';


  // Load environment variables from .env.test
  dotenv.config({ path: '.env.test' });

process.env.REACT_APP_API_URL = 'http://localhost:3001'; // Set environment variable for tests

// Mock console.log globally
beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  
  afterAll(() => {
    console.log.mockRestore();
  });


