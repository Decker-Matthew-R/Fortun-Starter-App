import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { getStripePublishableKey } from '../../config/StripeConfig.ts';

describe('StripeConfig', () => {
    let mockFetch: Mock;

    beforeEach(() => {
        vi.clearAllMocks();
        mockFetch = vi.spyOn(globalThis, 'fetch');
    });

    afterEach(() => {
        mockFetch.mockRestore();
    });

    it('should fetch and return stripe publishable key', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                publishableKey: 'pk_test_123456789',
            }),
        });

        const key = await getStripePublishableKey();

        expect(key).toBe('pk_test_123456789');
        expect(mockFetch).toHaveBeenCalledWith('/api/payments/config');
    });

    it('should handle fetch errors', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        await expect(getStripePublishableKey()).rejects.toThrow('Network error');
    });

    it('should handle invalid response', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: async () => ({ error: 'Server error' }),
        });

        await expect(getStripePublishableKey()).resolves.toBeUndefined();
    });
});
