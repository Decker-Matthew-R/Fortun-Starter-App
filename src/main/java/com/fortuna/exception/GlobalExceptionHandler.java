package com.fortuna.exception;

import com.fortuna.exception.model.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.UUID;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(MetricSerializationException.class)
    public ResponseEntity<ErrorResponse> handleMetricSerializationException(
        MetricSerializationException ex,
        WebRequest request) {
        String errorId = UUID.randomUUID().toString();
        log.error("Metric serialization failed [errorId: {}]", errorId, ex);

        ErrorResponse errorResponse = ErrorResponse.builder()
            .errorId(errorId)
            .message(ex.getMessage())
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .timestamp(System.currentTimeMillis())
            .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
        IllegalArgumentException ex,
        WebRequest request) {
        String errorId = UUID.randomUUID().toString();
        log.warn("Illegal argument provided [errorId: {}]", errorId, ex);

        ErrorResponse errorResponse = ErrorResponse.builder()
            .errorId(errorId)
            .message(ex.getMessage())
            .status(HttpStatus.BAD_REQUEST.value())
            .timestamp(System.currentTimeMillis())
            .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(
        RuntimeException ex,
        WebRequest request) {
        String errorId = UUID.randomUUID().toString();
        log.error("Runtime exception occurred [errorId: {}]", errorId, ex);

        ErrorResponse errorResponse = ErrorResponse.builder()
            .errorId(errorId)
            .message(ex.getMessage())
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .timestamp(System.currentTimeMillis())
            .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
        Exception ex,
        WebRequest request) {
        String errorId = UUID.randomUUID().toString();
        log.error("Unhandled exception occurred [errorId: {}]", errorId, ex);

        ErrorResponse errorResponse = ErrorResponse.builder()
            .errorId(errorId)
            .message("An unexpected error occurred")
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .timestamp(System.currentTimeMillis())
            .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
