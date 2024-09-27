// src/__tests__/services/simpleMock.test.js

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

test('axios GET request is mocked correctly', async () => {
  const mock = new MockAdapter(axios);
  const apiUrl = 'http://localhost:4000/api';
  const mockData = { message: 'Success' };

  mock.onGet(`${apiUrl}/test`).reply(200, mockData);

  const response = await axios.get(`${apiUrl}/test`);
  expect(response.data).toEqual(mockData);

  mock.restore();
});
