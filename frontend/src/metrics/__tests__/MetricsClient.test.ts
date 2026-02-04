import { renderHook } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, vi, beforeEach } from 'vitest';

import { API_ENDPOINTS } from '../../ApiEndpoints/API_ENDPOINTS.ts';
import { useMetrics } from '../client/MetricsClient.ts';
import { MetadataType } from '../model/MetadataType.ts';
import { METRIC_EVENT_TYPE } from '../model/METRIC_EVENT_TYPE.ts';
import { server } from '../../setupTests.ts';

describe('Metrics Client', () => {
    const metadata: MetadataType = { triggerId: 'React Button', screen: 'Home' };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should post correct data to the metrics endpoint without userId', async () => {
        let requestBody;
        const mockHandler = vi.fn(async ({ request }) => {
            requestBody = await request.json();
            return HttpResponse.json({}, { status: 201 });
        });

        server.use(http.post(API_ENDPOINTS.RECORD_METRIC_EVENT, mockHandler));

        const { result } = renderHook(() => useMetrics());

        const savePromise = result.current.saveMetricEvent(
            METRIC_EVENT_TYPE.BUTTON_CLICK,
            metadata
        );

        await expect(savePromise).resolves.toBeUndefined();
        expect(mockHandler).toHaveBeenCalledTimes(1);
        expect(requestBody).toEqual({
            event: METRIC_EVENT_TYPE.BUTTON_CLICK,
            eventMetadata: metadata,
            userId: undefined,
        });
    });

    it('should throw error when request fails', async () => {
        server.use(
            http.post(API_ENDPOINTS.RECORD_METRIC_EVENT, () =>
                HttpResponse.json({}, { status: 500 })
            )
        );

        const { result } = renderHook(() => useMetrics());

        await expect(
            result.current.saveMetricEvent(METRIC_EVENT_TYPE.BUTTON_CLICK, metadata)
        ).rejects.toThrow('Failed to capture metric event.');
    });

    it('should throw error when network request fails', async () => {
        server.use(http.post(API_ENDPOINTS.RECORD_METRIC_EVENT, () => HttpResponse.error()));

        const { result } = renderHook(() => useMetrics());

        await expect(
            result.current.saveMetricEvent(METRIC_EVENT_TYPE.BUTTON_CLICK, metadata)
        ).rejects.toThrow('Failed to capture metric event.');
    });
});
