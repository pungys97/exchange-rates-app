export interface ExchangeRate {
  country: string;
  currency: string;
  amount: number;
  code: string;
  rate: number;
}

const mockedData = `
    17 Jan 2025 #12
    Country|Currency|Amount|Code|Rate
    Australia|dollar|1|AUD|15.183
    Brazil|real|1|BRL|4.039
    Bulgaria|lev|1|BGN|12.920
    Canada|dollar|1|CAD|17.008
    China|renminbi|1|CNY|3.349
    Denmark|krone|1|DKK|3.387
    EMU|euro|1|EUR|25.270
    Hongkong|dollar|1|HKD|3.152
    Hungary|forint|100|HUF|6.121
    Iceland|krona|100|ISK|17.416
    IMF|SDR|1|XDR|31.844
    India|rupee|100|INR|28.334
    Indonesia|rupiah|1000|IDR|1.500
    Israel|new shekel|1|ILS|6.837
    Japan|yen|100|JPY|15.776
    Malaysia|ringgit|1|MYR|5.447
    Mexico|peso|1|MXN|1.179
    New Zealand|dollar|1|NZD|13.708
    Norway|krone|1|NOK|2.148
    Philippines|peso|100|PHP|41.888
    Poland|zloty|1|PLN|5.934
    Romania|leu|1|RON|5.078
    Singapore|dollar|1|SGD|17.946
    South Africa|rand|1|ZAR|1.307
    South Korea|won|100|KRW|1.683
    Sweden|krona|1|SEK|2.197
    Switzerland|franc|1|CHF|26.912
    Thailand|baht|100|THB|71.195
    Turkey|lira|100|TRY|69.003
    United Kingdom|pound|1|GBP|29.912
    USA|dollar|1|USD|24.542
`

export const fetchExchangeRates = async (): Promise<ExchangeRate[]> => {
  const targetUrl = 'https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt';
  
  const response = await fetch(targetUrl);
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