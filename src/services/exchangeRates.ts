export interface ExchangeRate {
  country: string;
  currency: string;
  amount: number;
  code: string;
  rate: number;
}

export const fetchExchangeRates = async (): Promise<ExchangeRate[]> => {
  const response = await fetch('https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt');
  const text = await response.text();
  
  // Parse the text response
  const lines = text.split('\n');
  const [, ...dataLines] = lines; // Skip the first line (header)
  
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