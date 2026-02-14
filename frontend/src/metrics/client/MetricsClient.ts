import { API_ENDPOINTS } from '../../apiEndpoints/API_ENDPOINTS.ts';
import axiosInstance from '../../axiosInstance/AxiosInstance.ts';
import { MetadataType } from '../model/MetadataType.ts';
import { METRIC_EVENT_TYPE } from '../model/METRIC_EVENT_TYPE.ts';
import { MetricEventType } from '../model/MetricEventType.ts';

export const useMetrics = () => {
    const saveMetricEvent = async (
        event: METRIC_EVENT_TYPE,
        eventMetadata: MetadataType
    ): Promise<void> => {
        try {
            const metricEvent: MetricEventType = {
                event,
                eventMetadata,
                userId: undefined,
            };

            await axiosInstance.post(API_ENDPOINTS.RECORD_METRIC_EVENT, metricEvent);
        } catch {
            throw new Error('Failed to capture metric event.');
        }
    };

    return { saveMetricEvent };
};
