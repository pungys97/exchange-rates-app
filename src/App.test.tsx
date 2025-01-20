import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App'
import { fetchExchangeRates } from './services/exchangeRates'

// Mock the exchange rates service
vi.mock('./services/exchangeRates', () => ({
  fetchExchangeRates: vi.fn()
}))

const mockRates = [
  {
    country: 'USA',
    currency: 'Dollar',
    amount: 1,
    code: 'USD',
    rate: 22.5
  },
  {
    country: 'EMU',
    currency: 'Euro',
    amount: 1,
    code: 'EUR',
    rate: 24.5
  }
]

describe('Currency Converter', () => {
  beforeEach(() => {
    vi.mocked(fetchExchangeRates).mockResolvedValue(mockRates)
  })

  it('renders without crashing', async () => {
    render(<App />)
    expect(await screen.findByText('Czech National Bank Exchange Rates')).toBeInTheDocument()
  })

  it('displays exchange rates', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('USD')).toBeInTheDocument()
      expect(screen.getByText('EUR')).toBeInTheDocument()
    })
  })

  it('converts currency correctly', async () => {
    render(<App />)
    
    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByLabelText('Amount in CZK')).toBeInTheDocument()
    })

    // Enter amount and select currency
    const input = screen.getByLabelText('Amount in CZK')
    const select = screen.getByLabelText('Select currency')
    
    fireEvent.change(input, { target: { value: '100' } })
    fireEvent.change(select, { target: { value: 'USD' } })

    // Check if conversion is displayed
    await waitFor(() => {
      expect(screen.getByText('100 CZK = 4.44 USD')).toBeInTheDocument()
    })
  })
}) 