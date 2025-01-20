import { useState } from 'react'
import styled from 'styled-components'
import { useQuery } from '@tanstack/react-query'
import { fetchExchangeRates } from '../services/exchangeRates'

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 2rem;
`

const Title = styled.h1`
  color: #1a365d;
  margin-bottom: 2rem;
  font-size: 2rem;
  text-align: center;
`

const RatesList = styled.div`
  margin-bottom: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`

const RateItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  color: #2d3748;
  cursor: pointer;
  
  &:hover {
    background-color: #f1f3f5;
    transition: background-color 0.2s ease;
  }

  &:last-child {
    border-bottom: none;
  }

  span {
    font-weight: 500;
  }
`

const Form = styled.form`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  flex: 1;
  font-size: 1rem;
  color: #2d3748;
  background-color: white;
  transition: border-color 0.2s ease;
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    outline: none;
    border-color: #4dabf7;
  }

  &::placeholder {
    color: #a0aec0;
  }
`

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  flex: 1;
  font-size: 1rem;
  background-color: white;
  color: #2d3748;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4dabf7;
  }

  option {
    color: #2d3748;
  }
`

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #4dabf7;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #339af0;
  }

  &:active {
    background-color: #228be6;
    border: none;
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    background-color: #adb5bd;
    cursor: not-allowed;
  }
`

const Result = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1a365d;
  text-align: center;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`

export function CurrencyConverter() {
  const [amount, setAmount] = useState('')
  const [selectedCurrency, setSelectedCurrency] = useState('')
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null)
  
  const { data: rates, isLoading, error } = useQuery({
    queryKey: ['exchangeRates'],
    queryFn: fetchExchangeRates,
  })
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading exchange rates</div>
  if (!rates) return null

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
    setConvertedAmount(null)
  }

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurrency(e.target.value)
    setConvertedAmount(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCurrency || amount === '') return

    const rate = rates.find(r => r.code === selectedCurrency)
    if (!rate) return

    const convertedAmount = (Number(amount) / rate.rate) * rate.amount
    setConvertedAmount(convertedAmount)
  }

  const isFormValid = amount !== '' && selectedCurrency !== ''

  const formatAmountAsCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
  }

  return (
    <Container>
      <Title>Czech National Bank Exchange Rates</Title>
      
      <Form onSubmit={handleSubmit}>
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
        <Button type="submit" disabled={!isFormValid}>
          Convert
        </Button>
      </Form>

      {convertedAmount !== null && selectedCurrency && (
        <Result>
            {formatAmountAsCurrency(Number(amount), 'CZK')} = {formatAmountAsCurrency(convertedAmount, selectedCurrency)}
        </Result>
      )}

      <RatesList>
        {rates.map((rate) => (
          <RateItem 
            key={rate.code} 
            onClick={() => setSelectedCurrency(rate.code)}
          >
            <span>{rate.country}</span>
            <span>{rate.code} - {rate.currency}</span>
            <span>{rate.rate} CZK</span>
          </RateItem>
        ))}
      </RatesList>
    </Container>
  )
} 