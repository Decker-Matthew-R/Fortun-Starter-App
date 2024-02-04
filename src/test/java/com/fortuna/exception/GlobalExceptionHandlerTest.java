package com.fortuna.exception;

import static org.junit.jupiter.api.Assertions.*;

import com.fortuna.exception.model.ErrorResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.ServletWebRequest;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    @DisplayName("should handle MetricSerializationException with 500 status")
    void shouldHandleMetricSerializationException() {
        MetricSerializationException exception =
                new MetricSerializationException(new RuntimeException("Test error"));
        ServletWebRequest request = new ServletWebRequest(new MockHttpServletRequest());

        ResponseEntity<ErrorResponse> response =
                handler.handleMetricSerializationException(exception, request);

        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(MetricSerializationException.MESSAGE, response.getBody().getMessage());
        assertEquals(500, response.getBody().getStatus());
        assertNotNull(response.getBody().getErrorId());
        assertFalse(response.getBody().getErrorId().isEmpty());
        assertTrue(response.getBody().getTimestamp() > 0);
    }

    @Test
    @DisplayName("should handle IllegalArgumentException with 400 status")
    void shouldHandleIllegalArgumentException() {
        IllegalArgumentException exception = new IllegalArgumentException("Invalid argument");
        ServletWebRequest request = new ServletWebRequest(new MockHttpServletRequest());

        ResponseEntity<ErrorResponse> response =
                handler.handleIllegalArgumentException(exception, request);

        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Invalid argument", response.getBody().getMessage());
        assertEquals(400, response.getBody().getStatus());
        assertNotNull(response.getBody().getErrorId());
    }

    @Test
    @DisplayName("should handle RuntimeException with 500 status")
    void shouldHandleRuntimeException() {
        RuntimeException exception = new RuntimeException("Runtime error");
        ServletWebRequest request = new ServletWebRequest(new MockHttpServletRequest());

        ResponseEntity<ErrorResponse> response = handler.handleRuntimeException(exception, request);

        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Runtime error", response.getBody().getMessage());
        assertEquals(500, response.getBody().getStatus());
        assertNotNull(response.getBody().getErrorId());
    }

    @Test
    @DisplayName("should handle generic Exception with 500 status")
    void shouldHandleGenericException() {
        Exception exception = new Exception("Generic error");
        ServletWebRequest request = new ServletWebRequest(new MockHttpServletRequest());

        ResponseEntity<ErrorResponse> response = handler.handleGenericException(exception, request);

        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("An unexpected error occurred", response.getBody().getMessage());
        assertEquals(500, response.getBody().getStatus());
        assertNotNull(response.getBody().getErrorId());
    }

    @Test
    @DisplayName("should generate unique errorIds for each exception")
    void shouldGenerateUniqueErrorIds() {
        MetricSerializationException exception1 =
                new MetricSerializationException(new RuntimeException("Test"));
        MetricSerializationException exception2 =
                new MetricSerializationException(new RuntimeException("Test"));
        ServletWebRequest request = new ServletWebRequest(new MockHttpServletRequest());

        ResponseEntity<ErrorResponse> response1 =
                handler.handleMetricSerializationException(exception1, request);
        ResponseEntity<ErrorResponse> response2 =
                handler.handleMetricSerializationException(exception2, request);

        assert response1.getBody() != null;
        assert response2.getBody() != null;
        assertNotEquals(
                response1.getBody().getErrorId(),
                response2.getBody().getErrorId(),
                "Each exception should have a unique errorId");
    }
}
