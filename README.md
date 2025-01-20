# Czech National Bank Currency Converter

A React application that fetches and displays current exchange rates from the Czech National Bank and allows users to convert CZK to other currencies.

## Features

- Fetches latest exchange rates from CNB
- Displays a list of available currencies and their rates
- Allows real-time currency conversion from CZK
- Built with React, TypeScript, and Styled Components
- Includes automated tests

## Prerequisites

- [Bun](https://bun.sh/) package manager

## Getting Started

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <repo-name>
```

2. Install dependencies:
```bash
bun install
```

3. Start the development server:
```bash
bun run dev
```

4. Open [http://localhost:5173](http://localhost:5173) to view the app in your browser.

## Running Tests

To run the tests:

```bash
bun test
```

## Building for Production

To create a production build:

```bash
bun run build
```

## Technologies Used

- React
- TypeScript
- Styled Components
- React Query
- Vite
- Vitest + Testing Library

## API Documentation

The application uses the Czech National Bank's exchange rate API:
- API URL: https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt
- [Documentation](https://www.cnb.cz/en/faq/Format-of-the-foreign-exchange-market-rates/)
