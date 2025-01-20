import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createGlobalStyle } from 'styled-components'
import { CurrencyConverter } from './components/CurrencyConverter'

const queryClient = new QueryClient()

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #f8f9fa;
    color: #212529;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyle />
      <CurrencyConverter />
    </QueryClientProvider>
  )
}
