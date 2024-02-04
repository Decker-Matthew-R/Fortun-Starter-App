CREATE TABLE metrics
(
    id          BIGINT GENERATED ALWAYS AS IDENTITY,
    event       VARCHAR(100) NOT NULL,
    event_time  timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metadata    JSONB NOT NULL,
    user_id     BIGINT NULL REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT METRIC_EVENT_PK PRIMARY KEY (id)
);

CREATE INDEX idx_metrics_event_time ON metrics(event_time);
CREATE INDEX idx_metrics_event ON metrics(event);
CREATE INDEX idx_metrics_user_id ON metrics(user_id);
