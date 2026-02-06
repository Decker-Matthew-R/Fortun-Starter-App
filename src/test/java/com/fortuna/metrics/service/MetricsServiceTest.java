package com.fortuna.metrics.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fortuna.metrics.controller.model.MetricEventDTO;
import com.fortuna.metrics.controller.model.MetricEventType;
import com.fortuna.metrics.exception.MetricSerializationException;
import com.fortuna.metrics.repository.MetricsRepository;
import com.fortuna.metrics.repository.model.MetricEventEntity;
import java.sql.Timestamp;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class MetricsServiceTest {

    @Mock MetricsRepository mockMetricsRepository;
    @Mock ObjectMapper mockObjectMapper;

    @InjectMocks MetricsService metricsService;

    @BeforeEach
    void setUp() throws Exception {
        when(mockObjectMapper.writeValueAsString(any()))
                .thenAnswer(
                        invocation -> {
                            Object arg = invocation.getArgument(0);
                            return arg != null ? arg.toString() : "{}";
                        });
    }

    @Test
    @DisplayName("when a metric event is received, the repository is called with correct data")
    void whenMetricEventDTOIsReceived_RepositorySavesWithCorrectData() {
        MetricEventDTO metricEventDTO =
                new MetricEventDTO(
                        MetricEventType.BUTTON_CLICK,
                        Map.of("buttonId", "submit", "screen", "login"),
                        null);

        metricsService.saveMetricEvent(metricEventDTO);

        ArgumentCaptor<MetricEventEntity> captor = ArgumentCaptor.forClass(MetricEventEntity.class);
        verify(mockMetricsRepository).save(captor.capture());

        MetricEventEntity capturedEntity = captor.getValue();

        assertEquals(MetricEventType.BUTTON_CLICK.toString(), capturedEntity.getEvent());
        assertNotNull(capturedEntity.getMetadata());
        assertTrue(capturedEntity.getMetadata().contains("buttonId"));
        assertTrue(capturedEntity.getMetadata().contains("submit"));
    }

    @Test
    @DisplayName("should save metric with userId when provided")
    void shouldSaveMetricWithUserId() {
        MetricEventDTO metricEventDTO =
                new MetricEventDTO(MetricEventType.BUTTON_CLICK, Map.of("screen", "home"), 123L);

        metricsService.saveMetricEvent(metricEventDTO);

        ArgumentCaptor<MetricEventEntity> captor = ArgumentCaptor.forClass(MetricEventEntity.class);
        verify(mockMetricsRepository).save(captor.capture());

        MetricEventEntity capturedEntity = captor.getValue();
        assertEquals(123L, capturedEntity.getUserId());
    }

    @Test
    @DisplayName("should save metric without userId when null")
    void shouldSaveMetricWithoutUserId() {
        MetricEventDTO metricEventDTO =
                new MetricEventDTO(MetricEventType.BUTTON_CLICK, Map.of("screen", "home"), null);

        metricsService.saveMetricEvent(metricEventDTO);

        ArgumentCaptor<MetricEventEntity> captor = ArgumentCaptor.forClass(MetricEventEntity.class);
        verify(mockMetricsRepository).save(captor.capture());

        MetricEventEntity capturedEntity = captor.getValue();
        assertNull(capturedEntity.getUserId());
    }

    @Test
    @DisplayName("should set eventTime to current time")
    void shouldSetEventTimeToCurrentTime() {
        MetricEventDTO metricEventDTO =
                new MetricEventDTO(MetricEventType.BUTTON_CLICK, Map.of("screen", "home"), null);

        Timestamp before = new Timestamp(System.currentTimeMillis() - 1000); // 1 second before
        metricsService.saveMetricEvent(metricEventDTO);
        Timestamp after = new Timestamp(System.currentTimeMillis() + 1000); // 1 second after

        ArgumentCaptor<MetricEventEntity> captor = ArgumentCaptor.forClass(MetricEventEntity.class);
        verify(mockMetricsRepository).save(captor.capture());

        MetricEventEntity capturedEntity = captor.getValue();

        assertTrue(
                capturedEntity.getEventTime().after(before)
                        && capturedEntity.getEventTime().before(after),
                "Event time should be within 2 seconds of current time");
    }

    @Test
    @DisplayName("should call repository exactly once per service call")
    void shouldCallRepositoryExactlyOnce() {
        MetricEventDTO metricEventDTO =
                new MetricEventDTO(MetricEventType.BUTTON_CLICK, Map.of("screen", "home"), null);

        metricsService.saveMetricEvent(metricEventDTO);

        verify(mockMetricsRepository)
                .save(ArgumentCaptor.forClass(MetricEventEntity.class).capture());
    }

    @Test
    @DisplayName("should throw MetricSerializationException when ObjectMapper fails")
    void shouldThrowMetricSerializationExceptionWhenObjectMapperFails() throws Exception {
        MetricEventDTO metricEventDTO =
                new MetricEventDTO(MetricEventType.BUTTON_CLICK, Map.of("screen", "home"), null);

        when(mockObjectMapper.writeValueAsString(any()))
                .thenThrow(new RuntimeException("Serialization failed"));

        MetricSerializationException exception =
                assertThrows(
                        MetricSerializationException.class,
                        () -> {
                            metricsService.saveMetricEvent(metricEventDTO);
                        });

        assertEquals(MetricSerializationException.MESSAGE, exception.getMessage());
    }
}
