import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Elements } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import DonationForm from '../DonationForm';

// Mock Stripe
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve({
    elements: jest.fn(),
    confirmCardPayment: jest.fn()
  }))
}));

describe('DonationForm', () => {
  const mockCharity = {
    id: 1,
    name: 'Test Charity'
  };

  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    fetch.resetMocks();
  });

  it('renders donation form correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <Elements stripe={loadStripe('dummy_key')}>
        <DonationForm charity={mockCharity} onSuccess={mockOnSuccess} />
      </Elements>
    );

    expect(getByText('Make a Donation')).toBeInTheDocument();
    expect(getByPlaceholderText('0.00')).toBeInTheDocument();
    expect(getByText('Make this monthly')).toBeInTheDocument();
    expect(getByText('Donate anonymously')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    const { getByText, getByPlaceholderText } = render(
      <Elements stripe={loadStripe('dummy_key')}>
        <DonationForm charity={mockCharity} onSuccess={mockOnSuccess} />
      </Elements>
    );

    // Fill in amount
    fireEvent.change(getByPlaceholderText('0.00'), {
      target: { value: '100' }
    });

    // Submit form
    fireEvent.click(getByText('Donate Now'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/donor/create-payment-intent',
        expect.any(Object)
      );
    });
  });
});