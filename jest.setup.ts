import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

// Optional: Add global settings for fetch-mock if needed
fetchMock.mockResponse(JSON.stringify({}));
