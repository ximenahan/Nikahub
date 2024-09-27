// src/__tests__/env.test.js

describe('Environment Variables', () => {
    test('REACT_APP_API_URL is defined', () => {
      expect(process.env.REACT_APP_API_URL).toBeDefined();
      console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
    });
  });
  