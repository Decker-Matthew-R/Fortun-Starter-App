package com.fortuna.metrics.repository;

import com.fortuna.metrics.repository.model.MetricEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MetricsRepository extends JpaRepository<MetricEventEntity, Long> {}
