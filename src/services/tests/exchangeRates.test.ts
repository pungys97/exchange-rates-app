import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { fetchExchangeRates } from '../exchangeRates';

describe('fetchExchangeRates', () => {
  const mockSuccessResponse = `02 Jan 2024 #1
Country|Currency|Amount|Code|Rate
Australia|dollar|1|AUD|15.484
Euro zone|euro|1|EUR|24.115
United States|dollar|1|USD|22.091
`;

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore all mocks after each test
    vi.restoreAllMocks();
  });

  test('should fetch and parse exchange rates successfully', async () => {
    // Mock the fetch function
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockSuccessResponse),
    });

    const rates = await fetchExchangeRates();

    // Verify fetch was called with correct URL
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt'
    );

    // Verify the parsed data
    expect(rates).toHaveLength(3);
    expect(rates).toEqual([
      {
        country: 'Australia',
        currency: 'dollar',
        amount: 1,
        code: 'AUD',
        rate: 15.484,
      },
      {
        country: 'Euro zone',
        currency: 'euro',
        amount: 1,
        code: 'EUR',
        rate: 24.115,
      },
      {
        country: 'United States',
        currency: 'dollar',
        amount: 1,
        code: 'USD',
        rate: 22.091,
      },
    ]);
  });

  test('should handle HTTP error responses', async () => {
    // Mock fetch to return an error response
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    // Verify that the function throws an error
    await expect(fetchExchangeRates()).rejects.toThrow('HTTP error! status: 404');
  });

  test('should handle malformed data', async () => {
    // Mock fetch with malformed response data that will cause parseInt to return NaN
    const malformedResponse = `02 Jan 2024 #1
Country|Currency|Amount|Code|Rate
Australia|dollar|invalid|AUD|15.484`;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(malformedResponse),
    });

    // Since the implementation doesn't throw on malformed data, we should test that it returns NaN for amount
    const rates = await fetchExchangeRates();
    expect(rates[0].amount).toBeNaN();
  });

  test('should handle empty response', async () => {
    // Mock fetch with empty response
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(''),
    });

    const rates = await fetchExchangeRates();
    expect(rates).toEqual([]);
  });

  test('should handle network errors', async () => {
    // Mock fetch to simulate network error
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    await expect(fetchExchangeRates()).rejects.toThrow('Network error');
  });
});