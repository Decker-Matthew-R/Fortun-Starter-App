import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PaymentButton } from '../../components/PaymentButton.tsx';
import * as PaymentClient from '../../client/PaymentClient';
import * as MetricsClient from '../../../metrics/client/MetricsClient';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { METRIC_EVENT_TYPE } from '../../../metrics/model/METRIC_EVENT_TYPE';
import React from 'react';

const stripePromise = loadStripe('pk_test_mock_key');

const renderWithStripe = (ui: React.ReactElement) => {
    return render(<Elements stripe={stripePromise}>{ui}</Elements>);
};

describe('PaymentButton', () => {
    const mockProcessPayment = vi.fn();
    const mockSaveMetricEvent = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render payment button with correct amount', () => {
        vi.spyOn(PaymentClient, 'usePayment').mockReturnValue({
            processPayment: mockProcessPayment,
            loading: false,
            error: null,
        });

        vi.spyOn(MetricsClient, 'useMetrics').mockReturnValue({
            saveMetricEvent: mockSaveMetricEvent.mockResolvedValue(undefined),
        });

        renderWithStripe(
            <PaymentButton
                amount={1000}
                currency='usd'
            />
        );

        expect(screen.getByRole('button', { name: 'Pay $10.00' })).toBeVisible();
    });

    it('should call processPayment and save metric when clicked', async () => {
        const user = userEvent.setup();

        vi.spyOn(PaymentClient, 'usePayment').mockReturnValue({
            processPayment: mockProcessPayment.mockResolvedValue({
                success: true,
                paymentIntentId: 'pi_123',
            }),
            loading: false,
            error: null,
        });

        vi.spyOn(MetricsClient, 'useMetrics').mockReturnValue({
            saveMetricEvent: mockSaveMetricEvent.mockResolvedValue(undefined),
        });

        renderWithStripe(
            <PaymentButton
                amount={2500}
                currency='usd'
            />
        );

        const payButton = screen.getByRole('button', { name: 'Pay $25.00' });
        await user.click(payButton);

        await waitFor(() => {
            expect(mockProcessPayment).toHaveBeenCalledWith(2500, 'usd');
            expect(mockSaveMetricEvent).toHaveBeenCalledWith(METRIC_EVENT_TYPE.BUTTON_CLICK, {
                triggerId: 'Pay Now Button',
                screen: 'Home',
            });
        });
    });

    it('should call onSuccess callback when payment succeeds', async () => {
        const user = userEvent.setup();
        const mockOnSuccess = vi.fn();

        vi.spyOn(PaymentClient, 'usePayment').mockReturnValue({
            processPayment: mockProcessPayment.mockResolvedValue({
                success: true,
                paymentIntentId: 'pi_success_123',
            }),
            loading: false,
            error: null,
        });

        vi.spyOn(MetricsClient, 'useMetrics').mockReturnValue({
            saveMetricEvent: mockSaveMetricEvent.mockResolvedValue(undefined),
        });

        renderWithStripe(
            <PaymentButton
                amount={1000}
                currency='usd'
                onSuccess={mockOnSuccess}
            />
        );

        const payButton = screen.getByRole('button', { name: 'Pay $10.00' });
        await user.click(payButton);

        await waitFor(() => {
            expect(mockOnSuccess).toHaveBeenCalledWith('pi_success_123');
        });
    });

    it('should display success message after successful payment', async () => {
        const user = userEvent.setup();

        vi.spyOn(PaymentClient, 'usePayment').mockReturnValue({
            processPayment: mockProcessPayment.mockResolvedValue({
                success: true,
                paymentIntentId: 'pi_123',
            }),
            loading: false,
            error: null,
        });

        vi.spyOn(MetricsClient, 'useMetrics').mockReturnValue({
            saveMetricEvent: mockSaveMetricEvent.mockResolvedValue(undefined),
        });

        renderWithStripe(
            <PaymentButton
                amount={1000}
                currency='usd'
            />
        );

        const payButton = screen.getByRole('button', { name: 'Pay $10.00' });
        await user.click(payButton);

        await waitFor(() => {
            expect(
                screen.getByText('Payment successful! Thank you for your purchase.')
            ).toBeVisible();
        });
    });

    it('should call onError callback when payment fails', async () => {
        const user = userEvent.setup();
        const mockOnError = vi.fn();

        vi.spyOn(PaymentClient, 'usePayment').mockReturnValue({
            processPayment: mockProcessPayment.mockResolvedValue({
                success: false,
                error: 'Card declined',
            }),
            loading: false,
            error: null,
        });

        vi.spyOn(MetricsClient, 'useMetrics').mockReturnValue({
            saveMetricEvent: mockSaveMetricEvent.mockResolvedValue(undefined),
        });

        renderWithStripe(
            <PaymentButton
                amount={1000}
                currency='usd'
                onError={mockOnError}
            />
        );

        const payButton = screen.getByRole('button', { name: 'Pay $10.00' });
        await user.click(payButton);

        await waitFor(() => {
            expect(mockOnError).toHaveBeenCalledWith('Card declined');
        });
    });

    it('should display error message from usePayment hook', () => {
        vi.spyOn(PaymentClient, 'usePayment').mockReturnValue({
            processPayment: mockProcessPayment,
            loading: false,
            error: 'Insufficient funds',
        });

        vi.spyOn(MetricsClient, 'useMetrics').mockReturnValue({
            saveMetricEvent: mockSaveMetricEvent.mockResolvedValue(undefined),
        });

        renderWithStripe(
            <PaymentButton
                amount={1000}
                currency='usd'
            />
        );

        expect(screen.getByText('Insufficient funds')).toBeVisible();
    });

    it('should show loading state during payment processing', () => {
        vi.spyOn(PaymentClient, 'usePayment').mockReturnValue({
            processPayment: mockProcessPayment,
            loading: true,
            error: null,
        });

        vi.spyOn(MetricsClient, 'useMetrics').mockReturnValue({
            saveMetricEvent: mockSaveMetricEvent.mockResolvedValue(undefined),
        });

        renderWithStripe(
            <PaymentButton
                amount={1000}
                currency='usd'
            />
        );

        expect(screen.getByText('Processing...')).toBeVisible();
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should disable button when loading', () => {
        vi.spyOn(PaymentClient, 'usePayment').mockReturnValue({
            processPayment: mockProcessPayment,
            loading: true,
            error: null,
        });

        vi.spyOn(MetricsClient, 'useMetrics').mockReturnValue({
            saveMetricEvent: mockSaveMetricEvent.mockResolvedValue(undefined),
        });

        renderWithStripe(
            <PaymentButton
                amount={1000}
                currency='usd'
            />
        );

        const payButton = screen.getByRole('button');
        expect(payButton).toBeDisabled();
    });

    it('should format amount correctly for different values', () => {
        vi.spyOn(PaymentClient, 'usePayment').mockReturnValue({
            processPayment: mockProcessPayment,
            loading: false,
            error: null,
        });

        vi.spyOn(MetricsClient, 'useMetrics').mockReturnValue({
            saveMetricEvent: mockSaveMetricEvent.mockResolvedValue(undefined),
        });

        const { rerender } = renderWithStripe(
            <PaymentButton
                amount={500}
                currency='usd'
            />
        );
        expect(screen.getByRole('button', { name: 'Pay $5.00' })).toBeVisible();

        rerender(
            <Elements stripe={stripePromise}>
                <PaymentButton
                    amount={12345}
                    currency='usd'
                />
            </Elements>
        );
        expect(screen.getByRole('button', { name: 'Pay $123.45' })).toBeVisible();
    });

    it('should use default currency of usd when not provided', async () => {
        const user = userEvent.setup();

        vi.spyOn(PaymentClient, 'usePayment').mockReturnValue({
            processPayment: mockProcessPayment.mockResolvedValue({
                success: true,
                paymentIntentId: 'pi_123',
            }),
            loading: false,
            error: null,
        });

        vi.spyOn(MetricsClient, 'useMetrics').mockReturnValue({
            saveMetricEvent: mockSaveMetricEvent.mockResolvedValue(undefined),
        });

        renderWithStripe(<PaymentButton amount={1000} />);

        const payButton = screen.getByRole('button', { name: 'Pay $10.00' });
        await user.click(payButton);

        await waitFor(() => {
            expect(mockProcessPayment).toHaveBeenCalledWith(1000, 'usd');
        });
    });

    it('should handle payment failure with no error message', async () => {
        const user = userEvent.setup();
        const mockOnError = vi.fn();

        vi.spyOn(PaymentClient, 'usePayment').mockReturnValue({
            processPayment: mockProcessPayment.mockResolvedValue({
                success: false,
            }),
            loading: false,
            error: null,
        });

        vi.spyOn(MetricsClient, 'useMetrics').mockReturnValue({
            saveMetricEvent: mockSaveMetricEvent.mockResolvedValue(undefined),
        });

        renderWithStripe(
            <PaymentButton
                amount={1000}
                currency='usd'
                onError={mockOnError}
            />
        );

        const payButton = screen.getByRole('button', { name: 'Pay $10.00' });
        await user.click(payButton);

        await waitFor(() => {
            expect(mockProcessPayment).toHaveBeenCalledWith(1000, 'usd');
        });

        expect(mockOnError).not.toHaveBeenCalled();
    });
});
