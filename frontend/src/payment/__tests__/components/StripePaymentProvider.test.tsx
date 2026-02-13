import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { StripePaymentProvider } from '../../components/StripePaymentProvider.tsx';
import * as StripeConfig from '../../config/StripeConfig';
import * as StripeJs from '@stripe/stripe-js';

vi.mock('../../config/StripeConfig');
vi.mock('@stripe/stripe-js');

describe('StripePaymentProvider', () => {
    const mockStripe = {
        elements: vi.fn(),
        createToken: vi.fn(),
        createPaymentMethod: vi.fn(),
        confirmCardPayment: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(StripeJs.loadStripe).mockResolvedValue(mockStripe as never);
    });

    it('should show loading state initially', () => {
        vi.mocked(StripeConfig.getStripePublishableKey).mockImplementation(
            () => new Promise(() => {})
        );

        render(
            <StripePaymentProvider>
                <div>Child Content</div>
            </StripePaymentProvider>
        );

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(screen.queryByText('Child Content')).not.toBeInTheDocument();
    });

    it('should render children after successful stripe initialization', async () => {
        vi.mocked(StripeConfig.getStripePublishableKey).mockResolvedValue('pk_test_123');

        render(
            <StripePaymentProvider>
                <div>Child Content</div>
            </StripePaymentProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Child Content')).toBeInTheDocument();
        });

        expect(StripeConfig.getStripePublishableKey).toHaveBeenCalledTimes(1);
        expect(StripeJs.loadStripe).toHaveBeenCalledWith('pk_test_123');
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('should show error message when stripe fails to load', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.mocked(StripeConfig.getStripePublishableKey).mockRejectedValue(
            new Error('Network error')
        );

        render(
            <StripePaymentProvider>
                <div>Child Content</div>
            </StripePaymentProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Failed to load payment system')).toBeInTheDocument();
        });

        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load Stripe:', expect.any(Error));
        expect(screen.queryByText('Child Content')).not.toBeInTheDocument();
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();

        consoleErrorSpy.mockRestore();
    });

    it('should only initialize stripe once on mount', async () => {
        vi.mocked(StripeConfig.getStripePublishableKey).mockResolvedValue('pk_test_123');

        const { rerender } = render(
            <StripePaymentProvider>
                <div>Child Content</div>
            </StripePaymentProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Child Content')).toBeInTheDocument();
        });

        rerender(
            <StripePaymentProvider>
                <div>Updated Content</div>
            </StripePaymentProvider>
        );

        expect(StripeConfig.getStripePublishableKey).toHaveBeenCalledTimes(1);
        expect(StripeJs.loadStripe).toHaveBeenCalledTimes(1);
    });
});
