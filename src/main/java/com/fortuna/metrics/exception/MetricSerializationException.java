package com.fortuna.metrics.exception;

public class MetricSerializationException extends RuntimeException {
    public static final String MESSAGE = "Failed to serialize metric event metadata";

    public MetricSerializationException(Throwable cause) {
        super(MESSAGE, cause);
    }
}
