// src/__tests__/environment.test.js

test('REACT_APP_API_URL is set correctly', () => {
    console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
    expect(process.env.REACT_APP_API_URL).toBeDefined();
  });
  