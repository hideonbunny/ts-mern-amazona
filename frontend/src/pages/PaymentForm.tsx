import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "react-bootstrap";

interface Props {
  onSuccess: (paymentMethod: any) => void;
}

const PaymentForm: React.FC<Props> = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement!,
    });

    if (error) {
      setError(error.message);
    } else {
      onSuccess(paymentMethod);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {error && <div className="mt-2 text-danger">{error}</div>}
      <Button className="mt-3" type="submit" disabled={!stripe}>
        Pay Now
      </Button>
    </form>
  );
};

export default PaymentForm;
