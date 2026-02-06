package com.fortuna.metrics.repository.model;

import jakarta.persistence.*;
import java.sql.Timestamp;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnTransformer;

@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "metrics")
public class MetricEventEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String event;
    Timestamp eventTime;

    @ColumnTransformer(write = "?::jsonb")
    String metadata;

    @Column(nullable = true)
    private Long userId;
}
