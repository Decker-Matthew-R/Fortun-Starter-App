import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import {
    CreatePaymentIntentRequest,
    CreatePaymentIntentResponse,
    PaymentResult,
} from '../model/PaymentTypes';

const createPaymentIntent = async (
    request: CreatePaymentIntentRequest
): Promise<CreatePaymentIntentResponse> => {
    // eslint-disable-next-line no-undef
    const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create payment intent');
    }

    return response.json();
};

export const verifyPayment = async (paymentIntentId: string): Promise<boolean> => {
    // eslint-disable-next-line no-undef
    const response = await fetch(`/api/payments/verify/${paymentIntentId}`);
    const data = await response.json();
    return data.success;
};

export const usePayment = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const processPayment = async (
        amount: number,
        currency: string = 'usd'
    ): Promise<PaymentResult> => {
        if (!stripe || !elements) {
            setError('Stripe has not loaded yet');
            return { success: false, error: 'Stripe has not loaded yet' };
        }

        setLoading(true);
        setError(null);

        try {
            const { clientSecret, paymentIntentId } = await createPaymentIntent({
                amount,
                currency,
                description: 'Test payment from Fortuna',
            });

            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                throw new Error('Card element not found');
            }

            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card: cardElement,
                    },
                }
            );

            if (stripeError) {
                const errorMessage = stripeError.message || 'Payment failed';
                setError(errorMessage);
                return { success: false, error: errorMessage };
            }

            if (paymentIntent?.status === 'succeeded') {
                return { success: true, paymentIntentId };
            }

            return { success: false, error: 'Payment did not succeed' };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return { processPayment, loading, error };
};
