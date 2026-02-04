package com.fortuna.metrics.controller.model;

import jakarta.validation.constraints.NotNull;
import java.util.Map;
import lombok.*;

@Getter
@Setter
@Builder
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class MetricEventDTO {
    @NotNull(message = "event is required")
    MetricEventType event;

    @NotNull(message = "eventMetadata is required")
    private Map<String, Object> eventMetadata;

    Long userId;
}
