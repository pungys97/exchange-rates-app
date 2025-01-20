export interface ExchangeRate {
  country: string;
  currency: string;
  amount: number;
  code: string;
  rate: number;
}

export const fetchExchangeRates = async (): Promise<ExchangeRate[]> => {
  const corsProxy = import.meta.env.VITE_CORS_PROXY
  const targetUrl = 'https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt';
  
  const response = await fetch(corsProxy + targetUrl);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const text = await response.text();

  // Parse the text response
  const lines = text.trim().split('\n');
  // Skip the first 2 lines (header and date)
  const [,,...dataLines] = lines;

  return dataLines
    .filter(line => line.trim())
    .map(line => {
      const [country, currency, amount, code, rate] = line.split('|');
      return {
        country: country.trim(),
        currency: currency.trim(),
        amount: parseInt(amount.trim()),
        code: code.trim(),
        rate: parseFloat(rate.trim().replace(',', '.')),
      };
    });
}; 