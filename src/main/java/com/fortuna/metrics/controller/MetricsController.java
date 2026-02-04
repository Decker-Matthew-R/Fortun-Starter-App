package com.fortuna.metrics.controller;

import com.fortuna.metrics.controller.model.MetricEventDTO;
import com.fortuna.metrics.service.MetricsService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class MetricsController {

    private final MetricsService metricsService;

    @PostMapping("/api/save-metric")
    public ResponseEntity<Void> saveMetricEvent(@Valid @RequestBody MetricEventDTO metricEventDTO) {
        try {
            metricsService.saveMetricEvent(metricEventDTO);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
