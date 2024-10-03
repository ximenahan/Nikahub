// src/setupTests.js
import '@testing-library/jest-dom';
import dotenv from 'dotenv';

// Load environment variables from .env.test
dotenv.config({ path: '.env.test' });

// Mock console.log globally
beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterAll(() => {
    console.log.mockRestore();
});
