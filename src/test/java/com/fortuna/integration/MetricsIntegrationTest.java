package com.fortuna.integration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.within;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fortuna.metrics.controller.model.MetricEventDTO;
import com.fortuna.metrics.controller.model.MetricEventType;
import com.fortuna.metrics.repository.MetricEventEntity;
import com.fortuna.metrics.repository.MetricsRepository;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class MetricsIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private EntityManager entityManager;
    @Autowired private MetricsRepository metricsRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void resetDatabase() {
        entityManager
                .createNativeQuery("TRUNCATE TABLE metrics RESTART IDENTITY CASCADE;")
                .executeUpdate();
    }

    @Test
    @DisplayName("INT - when a user performs an action, a metric is recorded to the database")
    @WithMockUser
    void whenAnActionIsPerformed_AMetricIsRecorded() throws Exception {
        Map<String, Object> eventMetadata1 =
                Map.of(
                        "buttonId", "submit",
                        "screen", "login");

        Map<String, Object> eventMetadata2 =
                Map.of(
                        "paymentType", "Card",
                        "screen", "checkout");

        MetricEventDTO metricEventDTO1 =
                new MetricEventDTO(MetricEventType.BUTTON_CLICK, eventMetadata1, null);

        MetricEventDTO metricEventDTO2 =
                new MetricEventDTO(MetricEventType.PAYMENT_SUBMITTED, eventMetadata2, null);

        String requestJson1 = objectMapper.writeValueAsString(metricEventDTO1);
        String requestJson2 = objectMapper.writeValueAsString(metricEventDTO2);

        mockMvc.perform(
                        post("/api/save-metric")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestJson1)
                                .with(csrf()))
                .andExpect(status().isCreated());

        mockMvc.perform(
                        post("/api/save-metric")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestJson2)
                                .with(csrf()))
                .andExpect(status().isCreated());

        List<MetricEventEntity> savedMetrics = metricsRepository.findAll();

        assertThat(savedMetrics).hasSize(2);

        // First metric
        assertThat(savedMetrics.get(0).getEvent())
                .isEqualTo(MetricEventType.BUTTON_CLICK.toString());
        assertThat(savedMetrics.get(0).getMetadata()).contains("buttonId", "submit", "login");
        assertThat(savedMetrics.get(0).getEventTime().toInstant())
                .isCloseTo(Instant.now(), within(3, ChronoUnit.SECONDS));

        // Second metric
        assertThat(savedMetrics.get(1).getEvent())
                .isEqualTo(MetricEventType.PAYMENT_SUBMITTED.toString());
        assertThat(savedMetrics.get(1).getMetadata()).contains("paymentType", "Card", "checkout");
        assertThat(savedMetrics.get(1).getEventTime().toInstant())
                .isCloseTo(Instant.now(), within(3, ChronoUnit.SECONDS));
    }
}
