import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import './App.css';
import { Button, Typography } from '@mui/material';
import { useMetrics } from './metrics/client/MetricsClient.ts';
import { METRIC_EVENT_TYPE } from './metrics/model/METRIC_EVENT_TYPE.ts';
import { StripePaymentProvider } from './payment/components/StripePaymentProvider.tsx';
import { PaymentButton } from './payment/components/PaymentButton.tsx';

function App() {
    const [count, setCount] = useState(0);
    const { saveMetricEvent } = useMetrics();

    const handlePaymentSuccess = (paymentIntentId: string) => {
        console.log('Payment succeeded:', paymentIntentId);
    };

    const handlePaymentError = (error: string) => {
        console.error('Payment failed:', error);
    };

    return (
        <>
            <div>
                <a
                    href='https://vitejs.dev'
                    target='_blank'
                    rel='noreferrer'
                >
                    <img
                        src={viteLogo}
                        className='logo'
                        alt='Vite logo'
                    />
                </a>
                <a
                    href='https://react.dev'
                    target='_blank'
                    rel='noreferrer'
                >
                    <img
                        src={reactLogo}
                        className='logo react'
                        alt='React logo'
                    />
                </a>
            </div>
            <Typography variant={'h2'}>Vite + React</Typography>
            <div className='card'>
                <Button
                    variant={'contained'}
                    onClick={() => {
                        setCount((count) => count + 1);
                        void saveMetricEvent(METRIC_EVENT_TYPE.BUTTON_CLICK, {
                            triggerId: 'Count Button',
                            screen: 'Home',
                        });
                    }}
                >
                    count is {count}
                </Button>
                <Button
                    color={'secondary'}
                    variant={'contained'}
                >
                    This Button Does Nothing
                </Button>
                <StripePaymentProvider>
                    <PaymentButton
                        amount={1000}
                        currency='usd'
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                    />
                </StripePaymentProvider>
            </div>
            <Typography
                variant={'body1'}
                className='read-the-docs'
            >
                Click on the Vite and React logos to learn more
            </Typography>
        </>
    );
}

export default App;
