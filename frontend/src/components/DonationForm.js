import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";

const DonationForm = ({ charity }) => {
  const navigate = useNavigate();
  const [donationData, setDonationData] = useState({
    amount: "",
    isRecurring: false,
    isAnonymous: false,
    currency: "USD",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const createOrder = async () => {
    try {
      const response = await fetch("http://localhost:5000/paypal/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          amount: donationData.amount,
          currency: donationData.currency,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        return data.orderID;
      } else {
        throw new Error(data.error || "Failed to create order");
      }
    } catch (err) {
      console.error("Order creation error:", err);
      setError("Error creating PayPal order");
    }
  };

  const captureOrder = async (orderID) => {
    try {
      const response = await fetch("http://localhost:5000/paypal/capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          transaction_id: orderID,
          donation_id: charity?.id || 1, // Default to 1 if no charity specified
        }),
      });

      const data = await response.json();
      if (response.ok) {
        navigate("/donor");
      } else {
        throw new Error(data.error || "Payment capture failed");
      }
    } catch (err) {
      console.error("Capture error:", err);
      setError("Error capturing payment");
    }
  };

  return (
    <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID }}>
      <div className="bg-white rounded-lg shadow p-6 max-w-lg mx-auto">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Make a Donation</h3>

        {error && <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount ({donationData.currency})</label>
          <input
            type="number"
            min="1"
            step="0.01"
            required
            className="block w-full border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            placeholder="0.00"
            value={donationData.amount}
            onChange={(e) => setDonationData({ ...donationData, amount: e.target.value })}
          />
        </div>

        <div className="mt-4">
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={createOrder}
            onApprove={(data) => captureOrder(data.orderID)}
            onError={(err) => {
              console.error("PayPal error:", err);
              setError("Payment failed. Please try again.");
              console.log("PayPal Client ID:", process.env.REACT_APP_PAYPAL_CLIENT_ID);

            }}
          />
        </div>
      </div>
    </PayPalScriptProvider>
  );
};

export default DonationForm;
