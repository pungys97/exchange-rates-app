import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { CurrencyConverter } from './CurrencyConverter'
import { fetchExchangeRates } from '../services/exchangeRates'

// Mock the exchange rates service
vi.mock('../services/exchangeRates')

const mockExchangeRates = [
  {
    country: 'USA',
    currency: 'Dollar',
    amount: 1,
    code: 'USD',
    rate: 22.123
  },
  {
    country: 'EMU',
    currency: 'Euro',
    amount: 1,
    code: 'EUR',
    rate: 24.720
  }
]

describe('CurrencyConverter', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock the fetchExchangeRates implementation
    vi.mocked(fetchExchangeRates).mockResolvedValue(mockExchangeRates)
  })

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <CurrencyConverter />
      </QueryClientProvider>
    )
  }

  it('renders loading state initially', () => {
    renderComponent()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders exchange rates after loading', async () => {
    renderComponent()
    
    await waitFor(() => {
      expect(screen.getByText('USD - Dollar')).toBeInTheDocument()
      expect(screen.getByText('EUR - Euro')).toBeInTheDocument()
    })
  })

  it('converts CZK to USD correctly', async () => {
    renderComponent()

    await waitFor(() => {
      expect(screen.getByLabelText('Amount in CZK')).toBeInTheDocument()
    })

    const amountInput = screen.getByLabelText('Amount in CZK')
    const currencySelect = screen.getByLabelText('Select currency')
    const submitButton = screen.getByText('Convert')

    fireEvent.change(amountInput, { target: { value: '100' } })
    fireEvent.change(currencySelect, { target: { value: 'USD' } })
    fireEvent.click(submitButton)

    // 100 CZK = 4.52 USD (100 / 22.123)
    await waitFor(() => {
      expect(screen.getByText(/\$4\.52/)).toBeInTheDocument()
    })
  })

  it('converts CZK to EUR correctly', async () => {
    renderComponent()

    await waitFor(() => {
      expect(screen.getByLabelText('Amount in CZK')).toBeInTheDocument()
    })

    const amountInput = screen.getByLabelText('Amount in CZK')
    const currencySelect = screen.getByLabelText('Select currency')
    const submitButton = screen.getByText('Convert')

    fireEvent.change(amountInput, { target: { value: '100' } })
    fireEvent.change(currencySelect, { target: { value: 'EUR' } })
    fireEvent.click(submitButton)

    // 100 CZK = 4.05 EUR (100 / 24.720)
    await waitFor(() => {
      expect(screen.getByText(/€4\.05/)).toBeInTheDocument()
    })
  })

  it('disables submit button when form is invalid', async () => {
    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Convert')).toBeInTheDocument()
    })

    const submitButton = screen.getByText('Convert')
    expect(submitButton).toBeDisabled()

    const amountInput = screen.getByLabelText('Amount in CZK')
    fireEvent.change(amountInput, { target: { value: '100' } })
    expect(submitButton).toBeDisabled()

    const currencySelect = screen.getByLabelText('Select currency')
    fireEvent.change(currencySelect, { target: { value: 'USD' } })
    expect(submitButton).not.toBeDisabled()
  })

  it('displays error message when API fails', async () => {
    vi.mocked(fetchExchangeRates).mockRejectedValueOnce(new Error('API Error'))
    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Error loading exchange rates')).toBeInTheDocument()
    })
  })

  it('updates selected currency when clicking on rate item', async () => {
    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('USD - Dollar')).toBeInTheDocument()
    })

    const usdRateItem = screen.getByText('USD - Dollar').closest('div')
    fireEvent.click(usdRateItem!)

    const currencySelect = screen.getByLabelText('Select currency')
    expect(currencySelect).toHaveValue('USD')
  })
}) 