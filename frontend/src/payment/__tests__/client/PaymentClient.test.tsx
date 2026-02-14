import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { usePayment, verifyPayment } from '../../client/PaymentClient.ts';
import * as StripeReact from '@stripe/react-stripe-js';
import { PaymentResult } from '../../model/PaymentTypes.ts';

vi.mock('@stripe/react-stripe-js', async () => {
    const actual = await vi.importActual('@stripe/react-stripe-js');
    return {
        ...actual,
        useStripe: vi.fn(),
        useElements: vi.fn(),
        CardElement: {},
    };
});

describe('PaymentClient', () => {
    let mockFetch: Mock;

    const mockStripe = {
        confirmCardPayment: vi.fn(),
    };

    const mockCardElement = {
        mount: vi.fn(),
        destroy: vi.fn(),
        on: vi.fn(),
        update: vi.fn(),
    };

    const mockElements = {
        getElement: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockFetch = vi.spyOn(globalThis, 'fetch') as Mock;
        vi.mocked(StripeReact.useStripe).mockReturnValue(mockStripe as never);
        vi.mocked(StripeReact.useElements).mockReturnValue(mockElements as never);
        mockElements.getElement.mockReturnValue(mockCardElement);
    });

    afterEach(() => {
        mockFetch.mockRestore();
    });

    it('should return true when verifying successful payment', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true }),
        });

        const result = await verifyPayment('pi_123');

        expect(result).toBe(true);
        expect(mockFetch).toHaveBeenCalledWith('/api/payments/verify/pi_123');
    });

    it('should return false when verifying unsuccessful payment', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: false }),
        });

        const result = await verifyPayment('pi_failed');

        expect(result).toBe(false);
    });

    it('should return loading false and no error initially', () => {
        const { result } = renderHook(() => usePayment());

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
        expect(typeof result.current.processPayment).toBe('function');
    });

    it('should return error when stripe is not loaded', async () => {
        vi.mocked(StripeReact.useStripe).mockReturnValue(null);
        vi.mocked(StripeReact.useElements).mockReturnValue(mockElements as never);

        const { result } = renderHook(() => usePayment());

        let paymentResult: PaymentResult | undefined;
        await act(async () => {
            paymentResult = await result.current.processPayment(1000, 'usd');
        });

        expect(paymentResult?.success).toBe(false);
        expect(paymentResult?.error).toBe('Stripe has not loaded yet');
        expect(result.current.error).toBe('Stripe has not loaded yet');
    });

    it('should successfully process payment', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                clientSecret: 'pi_secret_123',
                paymentIntentId: 'pi_123',
                amount: 1000,
                currency: 'usd',
            }),
        });

        mockStripe.confirmCardPayment.mockResolvedValueOnce({
            paymentIntent: {
                status: 'succeeded',
                id: 'pi_123',
            },
        });

        const { result } = renderHook(() => usePayment());

        let paymentResult: PaymentResult | undefined;
        await act(async () => {
            paymentResult = await result.current.processPayment(1000, 'usd');
        });

        expect(paymentResult?.success).toBe(true);
        expect(paymentResult?.paymentIntentId).toBe('pi_123');
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);

        expect(mockFetch).toHaveBeenCalledWith('/api/payments/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: 1000,
                currency: 'usd',
                description: 'Test payment from Fortuna',
            }),
        });

        expect(mockStripe.confirmCardPayment).toHaveBeenCalledWith('pi_secret_123', {
            payment_method: {
                card: mockCardElement,
            },
        });
    });

    it('should handle payment intent creation failure', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({
                message: 'Invalid amount',
            }),
        });

        const { result } = renderHook(() => usePayment());

        let paymentResult: PaymentResult | undefined;
        await act(async () => {
            paymentResult = await result.current.processPayment(10, 'usd');
        });

        expect(paymentResult?.success).toBe(false);
        expect(paymentResult?.error).toBe('Invalid amount');
        expect(result.current.error).toBe('Invalid amount');
        expect(result.current.loading).toBe(false);
    });

    it('should handle missing card element', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                clientSecret: 'pi_secret_123',
                paymentIntentId: 'pi_123',
            }),
        });

        mockElements.getElement.mockReturnValue(null);

        const { result } = renderHook(() => usePayment());

        let paymentResult: PaymentResult | undefined;
        await act(async () => {
            paymentResult = await result.current.processPayment(1000, 'usd');
        });

        expect(paymentResult?.success).toBe(false);
        expect(paymentResult?.error).toBe('Card element not found');
        expect(result.current.error).toBe('Card element not found');
    });

    it('should handle stripe payment confirmation error', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                clientSecret: 'pi_secret_123',
                paymentIntentId: 'pi_123',
            }),
        });

        mockStripe.confirmCardPayment.mockResolvedValueOnce({
            error: {
                message: 'Your card was declined',
                type: 'card_error',
            },
        });

        const { result } = renderHook(() => usePayment());

        let paymentResult: PaymentResult | undefined;
        await act(async () => {
            paymentResult = await result.current.processPayment(1000, 'usd');
        });

        expect(paymentResult?.success).toBe(false);
        expect(paymentResult?.error).toBe('Your card was declined');
        expect(result.current.error).toBe('Your card was declined');
    });

    it('should handle payment intent not succeeded status', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                clientSecret: 'pi_secret_123',
                paymentIntentId: 'pi_123',
            }),
        });

        mockStripe.confirmCardPayment.mockResolvedValueOnce({
            paymentIntent: {
                status: 'requires_action',
                id: 'pi_123',
            },
        });

        const { result } = renderHook(() => usePayment());

        let paymentResult: PaymentResult | undefined;
        await act(async () => {
            paymentResult = await result.current.processPayment(1000, 'usd');
        });

        expect(paymentResult?.success).toBe(false);
        expect(paymentResult?.error).toBe('Payment did not succeed');
    });

    it('should use default currency of usd', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                clientSecret: 'pi_secret_123',
                paymentIntentId: 'pi_123',
            }),
        });

        mockStripe.confirmCardPayment.mockResolvedValueOnce({
            paymentIntent: {
                status: 'succeeded',
                id: 'pi_123',
            },
        });

        const { result } = renderHook(() => usePayment());

        await act(async () => {
            await result.current.processPayment(1000);
        });

        expect(mockFetch).toHaveBeenCalledWith(
            '/api/payments/create-payment-intent',
            expect.objectContaining({
                body: JSON.stringify({
                    amount: 1000,
                    currency: 'usd',
                    description: 'Test payment from Fortuna',
                }),
            })
        );
    });

    it('should handle unknown errors', async () => {
        mockFetch.mockRejectedValueOnce('Network error');

        const { result } = renderHook(() => usePayment());

        let paymentResult: PaymentResult | undefined;
        await act(async () => {
            paymentResult = await result.current.processPayment(1000, 'usd');
        });

        expect(paymentResult?.success).toBe(false);
        expect(paymentResult?.error).toBe('Unknown error');
        expect(result.current.error).toBe('Unknown error');
    });

    it('should set loading to true during payment processing', async () => {
        let resolveFetch: (() => void) | undefined;
        mockFetch.mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolveFetch = () =>
                        resolve({
                            ok: true,
                            json: async () => ({
                                clientSecret: 'pi_secret_123',
                                paymentIntentId: 'pi_123',
                            }),
                        });
                })
        );

        mockStripe.confirmCardPayment.mockResolvedValueOnce({
            paymentIntent: {
                status: 'succeeded',
                id: 'pi_123',
            },
        });

        const { result } = renderHook(() => usePayment());

        let paymentPromise: Promise<PaymentResult> | undefined;
        act(() => {
            paymentPromise = result.current.processPayment(1000, 'usd');
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(true);
        });

        await act(async () => {
            resolveFetch?.();
            await paymentPromise;
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
    });
    it('should handle payment intent creation failure without error message', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({}),
        });

        const { result } = renderHook(() => usePayment());

        let paymentResult: PaymentResult | undefined;
        await act(async () => {
            paymentResult = await result.current.processPayment(10, 'usd');
        });

        expect(paymentResult?.success).toBe(false);
        expect(paymentResult?.error).toBe('Failed to create payment intent');
        expect(result.current.error).toBe('Failed to create payment intent');
        expect(result.current.loading).toBe(false);
    });

    it('should handle stripe payment confirmation error without message', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                clientSecret: 'pi_secret_123',
                paymentIntentId: 'pi_123',
            }),
        });

        mockStripe.confirmCardPayment.mockResolvedValueOnce({
            error: {
                type: 'card_error',
            },
        });

        const { result } = renderHook(() => usePayment());

        let paymentResult: PaymentResult | undefined;
        await act(async () => {
            paymentResult = await result.current.processPayment(1000, 'usd');
        });

        expect(paymentResult?.success).toBe(false);
        expect(paymentResult?.error).toBe('Payment failed');
        expect(result.current.error).toBe('Payment failed');
    });
});
