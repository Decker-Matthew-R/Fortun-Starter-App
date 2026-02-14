import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import LandingPage from '../../components/LandingPage.tsx';
import * as MetricsClient from '../../../metrics/client/MetricsClient';
import * as PaymentClient from '../../../payment/client/PaymentClient';

vi.mock('../../../payment/config/StripeConfig', () => ({
    getStripePublishableKey: vi.fn().mockResolvedValue('pk_test_mock_key'),
}));

vi.mock('@stripe/stripe-js', () => ({
    loadStripe: vi.fn().mockResolvedValue({
        elements: vi.fn().mockReturnValue({
            create: vi.fn(),
            getElement: vi.fn(),
        }),
        createToken: vi.fn(),
        createPaymentMethod: vi.fn(),
        confirmCardPayment: vi.fn(),
    }),
}));

describe('render landing page', () => {
    const mockProcessPayment = vi.fn();
    const mockSaveMetricEvent = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render and increment count', async () => {
        vi.spyOn(MetricsClient, 'useMetrics').mockReturnValue({
            saveMetricEvent: vi.fn().mockResolvedValue(undefined),
        });

        const user = userEvent.setup();
        render(<LandingPage />);

        const countButton = screen.getByRole('button', { name: 'count is 0' });
        expect(countButton).toBeVisible();

        await user.click(countButton);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'count is 1' })).toBeVisible();
        });
    });
    it('should render payment button', async () => {
        vi.spyOn(MetricsClient, 'useMetrics').mockReturnValue({
            saveMetricEvent: mockSaveMetricEvent.mockResolvedValue(undefined),
        });

        vi.spyOn(PaymentClient, 'usePayment').mockReturnValue({
            processPayment: mockProcessPayment,
            loading: false,
            error: null,
        });

        render(<LandingPage />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Pay $10.00' })).toBeVisible();
        });
    });

    it('should log success when payment succeeds', async () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

        vi.spyOn(MetricsClient, 'useMetrics').mockReturnValue({
            saveMetricEvent: mockSaveMetricEvent.mockResolvedValue(undefined),
        });

        vi.spyOn(PaymentClient, 'usePayment').mockReturnValue({
            processPayment: mockProcessPayment.mockResolvedValue({
                success: true,
                paymentIntentId: 'pi_success_123',
            }),
            loading: false,
            error: null,
        });

        const user = userEvent.setup();
        render(<LandingPage />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Pay $10.00' })).toBeVisible();
        });

        const payButton = screen.getByRole('button', { name: 'Pay $10.00' });
        await user.click(payButton);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Payment succeeded:', 'pi_success_123');
        });

        consoleSpy.mockRestore();
    });

    it('should log error when payment fails', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        vi.spyOn(MetricsClient, 'useMetrics').mockReturnValue({
            saveMetricEvent: mockSaveMetricEvent.mockResolvedValue(undefined),
        });

        vi.spyOn(PaymentClient, 'usePayment').mockReturnValue({
            processPayment: mockProcessPayment.mockResolvedValue({
                success: false,
                error: 'Card declined',
            }),
            loading: false,
            error: null,
        });

        const user = userEvent.setup();
        render(<LandingPage />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Pay $10.00' })).toBeVisible();
        });

        const payButton = screen.getByRole('button', { name: 'Pay $10.00' });
        await user.click(payButton);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Payment failed:', 'Card declined');
        });

        consoleSpy.mockRestore();
    });
});
