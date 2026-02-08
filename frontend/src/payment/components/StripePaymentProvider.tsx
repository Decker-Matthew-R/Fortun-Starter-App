import { ReactNode, useEffect, useState } from 'react';
import { getStripePublishableKey } from '../config/StripeConfig.ts';
import { Box, CircularProgress } from '@mui/material';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';

interface StripePaymentProviderProps {
    children: ReactNode;
}

export const StripePaymentProvider = ({ children }: StripePaymentProviderProps) => {
    const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeStripe = async () => {
            try {
                const publishableKey = await getStripePublishableKey();
                setStripePromise(loadStripe(publishableKey));
            } catch (error) {
                console.error('Failed to load Stripe:', error);
            } finally {
                setLoading(false);
            }
        };

        void initializeStripe();
    }, []);

    if (loading) {
        return (
            <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                minHeight='200px'
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!stripePromise) {
        return <div>Failed to load payment system</div>;
    }

    return <Elements stripe={stripePromise}>{children}</Elements>;
};
