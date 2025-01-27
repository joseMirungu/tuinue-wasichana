import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements, CardElement, useStripe, useElements } from '@stripe/stripe-js/pure';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

const DonationFormContent = ({ charity, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [donationData, setDonationData] = useState({
    amount: '',
    isRecurring: false,
    isAnonymous: false,
    recurringDay: '1',
    currency: 'USD'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/donor/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: parseFloat(donationData.amount) * 100,
          charity_id: charity.id,
          is_recurring: donationData.isRecurring,
          is_anonymous: donationData.isAnonymous,
          recurring_day: parseInt(donationData.recurringDay),
          currency: donationData.currency
        })
      });

      const { clientSecret } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: donationData.isAnonymous ? 'Anonymous Donor' : undefined,
          },
        }
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        onSuccess?.(result.paymentIntent);
        navigate('/donor/dashboard');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Make a Donation</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount ({donationData.currency})
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              min="1"
              step="0.01"
              required
              className="focus:ring-red-500 focus:border-red-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
              value={donationData.amount}
              onChange={(e) => setDonationData({ ...donationData, amount: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Details
          </label>
          <div className="mt-1">
            <CardElement
              options={CARD_ELEMENT_OPTIONS}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              checked={donationData.isRecurring}
              onChange={(e) => setDonationData({ ...donationData, isRecurring: e.target.checked })}
            />
            <span className="ml-2 text-sm text-gray-600">Make this monthly</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              checked={donationData.isAnonymous}
              onChange={(e) => setDonationData({ ...donationData, isAnonymous: e.target.checked })}
            />
            <span className="ml-2 text-sm text-gray-600">Donate anonymously</span>
          </label>
        </div>

        {donationData.isRecurring && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly donation day
            </label>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
              value={donationData.recurringDay}
              onChange={(e) => setDonationData({ ...donationData, recurringDay: e.target.value })}
            >
              {[...Array(28)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Donate Now'}
        </button>
      </form>
    </div>
  );
};

const DonationForm = (props) => (
  <Elements stripe={stripePromise}>
    <DonationFormContent {...props} />
  </Elements>
);

export default DonationForm;