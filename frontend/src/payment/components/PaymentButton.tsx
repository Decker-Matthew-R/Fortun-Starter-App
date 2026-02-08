import { usePayment } from '../client/PaymentClient.ts';
import { useState } from 'react';
import { Alert, Box, Button, CircularProgress } from '@mui/material';
import { CardElement } from '@stripe/react-stripe-js';
import { useMetrics } from '../..//metrics/client/MetricsClient.ts';
import { METRIC_EVENT_TYPE } from '../../metrics/model/METRIC_EVENT_TYPE.ts';

interface PaymentButtonProps {
    amount: number;
    currency?: string;
    onSuccess?: (paymentIntentId: string) => void;
    onError?: (error: string) => void;
}

export const PaymentButton = ({
    amount,
    currency = 'usd',
    onSuccess,
    onError,
}: PaymentButtonProps) => {
    const { processPayment, loading, error } = usePayment();
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const { saveMetricEvent } = useMetrics();

    const handlePayment = async () => {
        void saveMetricEvent(METRIC_EVENT_TYPE.BUTTON_CLICK, {
            triggerId: 'Pay Now Button',
            screen: 'Home',
        });
        const result = await processPayment(amount, currency);
        if (result.success && result.paymentIntentId) {
            setPaymentSuccess(true);
            onSuccess?.(result.paymentIntentId);
        } else if (result.error) {
            onError?.(result.error);
        }
    };

    if (paymentSuccess) {
        return <Alert severity='success'>Payment successful! Thank you for your purchase.</Alert>;
    }

    return (
        <Box sx={{ maxWidth: 400, margin: '0 auto' }}>
            <Box
                sx={{
                    border: '1px solid #ccc',
                    borderRadius: 1,
                    padding: 2,
                    marginBottom: 2,
                }}
            >
                <CardElement
                    options={{
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
                    }}
                />
            </Box>

            {error && (
                <Alert
                    severity='error'
                    sx={{ marginBottom: 2 }}
                >
                    {error}
                </Alert>
            )}

            <Button
                variant='contained'
                color='primary'
                fullWidth
                onClick={handlePayment}
                disabled={loading}
            >
                {loading ? (
                    <>
                        <CircularProgress
                            size={20}
                            sx={{ marginRight: 1 }}
                        />
                        Processing...
                    </>
                ) : (
                    `Pay $${(amount / 100).toFixed(2)}`
                )}
            </Button>
        </Box>
    );
};
