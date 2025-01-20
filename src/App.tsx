import { useState } from 'react'
import styled from 'styled-components'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { fetchExchangeRates, type ExchangeRate } from './services/exchangeRates'

const queryClient = new QueryClient()

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
`

const RatesList = styled.div`
  margin-bottom: 2rem;
`

const RateItem = styled.div`
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  
  &:hover {
    background-color: #f5f5f5;
  }
`

const Form = styled.form`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
`

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`

const Result = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
`

function CurrencyConverter() {
  const [amount, setAmount] = useState('')
  const [selectedCurrency, setSelectedCurrency] = useState('')
  
  const { data: rates, isLoading, error } = useQuery({
    queryKey: ['exchangeRates'],
    queryFn: fetchExchangeRates,
  })
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading exchange rates</div>
  if (!rates) return null

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
  }

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurrency(e.target.value)
  }

  const calculateConversion = () => {
    if (!amount || !selectedCurrency) return null
    const rate = rates.find(r => r.code === selectedCurrency)
    if (!rate) return null
    
    const czk = parseFloat(amount)
    const foreignAmount = (czk / rate.rate) * rate.amount
    return foreignAmount.toFixed(2)
  }

  const convertedAmount = calculateConversion()

  return (
    <Container>
      <Title>Czech National Bank Exchange Rates</Title>
      
      <Form>
        <Input
          type="number"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Amount in CZK"
          aria-label="Amount in CZK"
        />
        <Select
          value={selectedCurrency}
          onChange={handleCurrencyChange}
          aria-label="Select currency"
        >
          <option value="">Select currency</option>
          {rates.map((rate) => (
            <option key={rate.code} value={rate.code}>
              {rate.code} - {rate.currency}
            </option>
          ))}
        </Select>
      </Form>

      {convertedAmount && selectedCurrency && (
        <Result>
          {amount} CZK = {convertedAmount} {selectedCurrency}
        </Result>
      )}

      <RatesList>
        {rates.map((rate) => (
          <RateItem key={rate.code}>
            <span>{rate.code}</span>
            <span>{rate.currency}</span>
            <span>{rate.amount} {rate.code} = {rate.rate} CZK</span>
          </RateItem>
        ))}
      </RatesList>
    </Container>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CurrencyConverter />
    </QueryClientProvider>
  )
}
