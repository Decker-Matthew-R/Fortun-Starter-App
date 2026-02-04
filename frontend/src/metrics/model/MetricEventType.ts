import { MetadataType } from './MetadataType.ts';
import { METRIC_EVENT_TYPE } from './METRIC_EVENT_TYPE.ts';

export type MetricEventType = {
    event: METRIC_EVENT_TYPE;
    eventMetadata: MetadataType;
    userId?: number;
};
