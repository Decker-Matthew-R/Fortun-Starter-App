package com.fortuna.metrics.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fortuna.metrics.controller.model.MetricEventDTO;
import com.fortuna.metrics.repository.MetricEventEntity;
import com.fortuna.metrics.repository.MetricsRepository;
import java.sql.Timestamp;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@AllArgsConstructor
public class MetricsService {

    private final MetricsRepository metricsRepository;
    private final ObjectMapper objectMapper;

    public void saveMetricEvent(MetricEventDTO metricEventDTO) {
        MetricEventEntity metricEventEntity =
                metricEventDTOToMetricEventEntityConversion(metricEventDTO);
        metricsRepository.save(metricEventEntity);
    }

    private MetricEventEntity metricEventDTOToMetricEventEntityConversion(
            MetricEventDTO metricEventDTO) {
        try {
            String jsonMetadata =
                    objectMapper.writeValueAsString(metricEventDTO.getEventMetadata());

            return MetricEventEntity.builder()
                    .event(metricEventDTO.getEvent().name())
                    .eventTime(Timestamp.from(Instant.now()))
                    .metadata(jsonMetadata) // Now valid JSON
                    .userId(metricEventDTO.getUserId())
                    .build();
        } catch (Exception e) {
            log.error("Failed to serialize metric event metadata", e);
            throw new RuntimeException("Failed to serialize metadata", e);
        }
    }
}
