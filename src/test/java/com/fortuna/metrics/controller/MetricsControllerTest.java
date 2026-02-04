package com.fortuna.metrics.controller;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fortuna.metrics.controller.model.MetricEventDTO;
import com.fortuna.metrics.controller.model.MetricEventType;
import com.fortuna.metrics.service.MetricsService;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class MetricsControllerTest {

    private MockMvc mockMvc;

    @Mock private MetricsService mockMetricsService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        MetricsController controller = new MetricsController(mockMetricsService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    @DisplayName("when a metric request is received, the service is called and 201 is returned")
    void whenMetricEventDTOIsReceived_MetricsServiceIsCalled_NoContentIsReturned()
            throws Exception {
        MetricEventDTO metricEventDTO =
                new MetricEventDTO(
                        MetricEventType.BUTTON_CLICK,
                        Map.of("buttonId", "submit", "screen", "login"),
                        null);

        String requestJson = objectMapper.writeValueAsString(metricEventDTO);

        mockMvc.perform(
                        post("/api/save-metric")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestJson))
                .andExpect(status().isCreated());

        verify(mockMetricsService, times(1)).saveMetricEvent(any(MetricEventDTO.class));
    }

    @Test
    @DisplayName("Should return 400 when request body is invalid JSON")
    void shouldReturn400WhenRequestBodyIsInvalidJson() throws Exception {
        mockMvc.perform(
                        post("/api/save-metric")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{ invalid json }"))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(mockMetricsService);
    }

    @Test
    @DisplayName("Should return 500 when service throws exception")
    void shouldReturn500WhenServiceThrowsException() throws Exception {
        MetricEventDTO metricEventDTO =
                new MetricEventDTO(MetricEventType.BUTTON_CLICK, Map.of("screen", "home"), null);

        doThrow(new RuntimeException("Database error"))
                .when(mockMetricsService)
                .saveMetricEvent(any(MetricEventDTO.class));

        String requestJson = objectMapper.writeValueAsString(metricEventDTO);

        mockMvc.perform(
                        post("/api/save-metric")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestJson))
                .andExpect(status().isInternalServerError());

        verify(mockMetricsService, times(1)).saveMetricEvent(any(MetricEventDTO.class));
    }

    @Test
    @DisplayName("Should return 400 when MetricEventDTO is missing required fields")
    void shouldReturn400WhenRequiredFieldsAreMissing() throws Exception {
        String requestJson = "{}";

        mockMvc.perform(
                        post("/api/save-metric")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestJson))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(mockMetricsService);
    }

    @Test
    @DisplayName("Should return 201 with userId provided")
    void shouldReturn201WithUserIdProvided() throws Exception {
        MetricEventDTO metricEventDTO =
                new MetricEventDTO(MetricEventType.BUTTON_CLICK, Map.of("screen", "home"), 123L);

        String requestJson = objectMapper.writeValueAsString(metricEventDTO);

        mockMvc.perform(
                        post("/api/save-metric")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestJson))
                .andExpect(status().isCreated());

        verify(mockMetricsService, times(1)).saveMetricEvent(any(MetricEventDTO.class));
    }
}
