package com.fortuna.payment.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.fortuna.payment.controller.model.PaymentIntentRequestDTO;
import com.fortuna.payment.controller.model.PaymentIntentResponseDTO;
import com.fortuna.payment.exception.PaymentException;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;

class PaymentServiceTest {

    private PaymentService paymentService;

    @BeforeEach
    void setUp() {
        paymentService = new PaymentService();
    }

    @Test
    @DisplayName("should create payment intent successfully")
    void shouldCreatePaymentIntentSuccessfully() throws StripeException {
        PaymentIntentRequestDTO requestDTO =
                PaymentIntentRequestDTO.builder()
                        .amount(1000L)
                        .currency("usd")
                        .description("Test payment")
                        .customerEmail("test@example.com")
                        .orderId("order123")
                        .userId("user456")
                        .build();

        PaymentIntent mockIntent = mock(PaymentIntent.class);
        when(mockIntent.getClientSecret()).thenReturn("pi_test_secret_123");
        when(mockIntent.getId()).thenReturn("pi_test_123");
        when(mockIntent.getAmount()).thenReturn(1000L);
        when(mockIntent.getCurrency()).thenReturn("usd");

        try (MockedStatic<PaymentIntent> mockedStatic = mockStatic(PaymentIntent.class)) {
            mockedStatic
                    .when(() -> PaymentIntent.create(any(PaymentIntentCreateParams.class)))
                    .thenReturn(mockIntent);

            PaymentIntentResponseDTO response = paymentService.createPaymentIntent(requestDTO);

            assertNotNull(response);
            assertEquals("pi_test_secret_123", response.getClientSecret());
            assertEquals("pi_test_123", response.getPaymentIntentId());
            assertEquals(1000L, response.getAmount());
            assertEquals("usd", response.getCurrency());

            mockedStatic.verify(
                    () -> PaymentIntent.create(any(PaymentIntentCreateParams.class)), times(1));
        }
    }

    @Test
    @DisplayName("should create payment intent with minimal fields")
    void shouldCreatePaymentIntentWithMinimalFields() throws StripeException {
        PaymentIntentRequestDTO requestDTO =
                PaymentIntentRequestDTO.builder().amount(500L).currency("eur").build();

        PaymentIntent mockIntent = mock(PaymentIntent.class);
        when(mockIntent.getClientSecret()).thenReturn("pi_minimal_secret");
        when(mockIntent.getId()).thenReturn("pi_minimal");
        when(mockIntent.getAmount()).thenReturn(500L);
        when(mockIntent.getCurrency()).thenReturn("eur");

        try (MockedStatic<PaymentIntent> mockedStatic = mockStatic(PaymentIntent.class)) {
            mockedStatic
                    .when(() -> PaymentIntent.create(any(PaymentIntentCreateParams.class)))
                    .thenReturn(mockIntent);

            PaymentIntentResponseDTO response = paymentService.createPaymentIntent(requestDTO);

            assertNotNull(response);
            assertEquals("pi_minimal_secret", response.getClientSecret());
            assertEquals("pi_minimal", response.getPaymentIntentId());
            assertEquals(500L, response.getAmount());
            assertEquals("eur", response.getCurrency());
        }
    }

    @Test
    @DisplayName("should throw PaymentException when Stripe API fails")
    void shouldThrowPaymentExceptionWhenStripeApiFails() throws StripeException {
        PaymentIntentRequestDTO requestDTO =
                PaymentIntentRequestDTO.builder().amount(1000L).currency("usd").build();

        try (MockedStatic<PaymentIntent> mockedStatic = mockStatic(PaymentIntent.class)) {
            mockedStatic
                    .when(() -> PaymentIntent.create(any(PaymentIntentCreateParams.class)))
                    .thenThrow(new StripeException("API Error", "req_123", "code", 400) {});

            PaymentException exception =
                    assertThrows(
                            PaymentException.class,
                            () -> paymentService.createPaymentIntent(requestDTO));

            assertNotNull(exception.getCause());
            assertTrue(exception.getCause() instanceof StripeException);
        }
    }

    @Test
    @DisplayName("should retrieve payment intent successfully")
    void shouldRetrievePaymentIntentSuccessfully() throws StripeException {
        String paymentIntentId = "pi_test_123";

        PaymentIntent mockIntent = mock(PaymentIntent.class);
        when(mockIntent.getId()).thenReturn(paymentIntentId);

        try (MockedStatic<PaymentIntent> mockedStatic = mockStatic(PaymentIntent.class)) {
            mockedStatic.when(() -> PaymentIntent.retrieve(paymentIntentId)).thenReturn(mockIntent);

            PaymentIntent result = paymentService.retrievePaymentIntent(paymentIntentId);

            assertNotNull(result);
            assertEquals(paymentIntentId, result.getId());

            mockedStatic.verify(() -> PaymentIntent.retrieve(paymentIntentId), times(1));
        }
    }

    @Test
    @DisplayName("should throw PaymentException when retrieve fails")
    void shouldThrowPaymentExceptionWhenRetrieveFails() throws StripeException {
        String paymentIntentId = "pi_invalid";

        try (MockedStatic<PaymentIntent> mockedStatic = mockStatic(PaymentIntent.class)) {
            mockedStatic
                    .when(() -> PaymentIntent.retrieve(paymentIntentId))
                    .thenThrow(new StripeException("Not found", "req_123", "code", 404) {});

            PaymentException exception =
                    assertThrows(
                            PaymentException.class,
                            () -> paymentService.retrievePaymentIntent(paymentIntentId));

            assertNotNull(exception.getCause());
            assertTrue(exception.getCause() instanceof StripeException);
        }
    }

    @Test
    @DisplayName("should verify payment success when status is succeeded")
    void shouldVerifyPaymentSuccessWhenStatusIsSucceeded() throws StripeException {
        String paymentIntentId = "pi_succeeded";

        PaymentIntent mockIntent = mock(PaymentIntent.class);
        when(mockIntent.getStatus()).thenReturn("succeeded");

        try (MockedStatic<PaymentIntent> mockedStatic = mockStatic(PaymentIntent.class)) {
            mockedStatic.when(() -> PaymentIntent.retrieve(paymentIntentId)).thenReturn(mockIntent);

            boolean result = paymentService.verifyPaymentSuccess(paymentIntentId);

            assertTrue(result);
        }
    }

    @Test
    @DisplayName("should verify payment failure when status is not succeeded")
    void shouldVerifyPaymentFailureWhenStatusIsNotSucceeded() throws StripeException {
        String paymentIntentId = "pi_pending";

        PaymentIntent mockIntent = mock(PaymentIntent.class);
        when(mockIntent.getStatus()).thenReturn("requires_payment_method");

        try (MockedStatic<PaymentIntent> mockedStatic = mockStatic(PaymentIntent.class)) {
            mockedStatic.when(() -> PaymentIntent.retrieve(paymentIntentId)).thenReturn(mockIntent);

            boolean result = paymentService.verifyPaymentSuccess(paymentIntentId);

            assertFalse(result);
        }
    }

    @Test
    @DisplayName("should throw PaymentException when verify payment fails")
    void shouldThrowPaymentExceptionWhenVerifyPaymentFails() throws StripeException {
        String paymentIntentId = "pi_error";

        try (MockedStatic<PaymentIntent> mockedStatic = mockStatic(PaymentIntent.class)) {
            mockedStatic
                    .when(() -> PaymentIntent.retrieve(paymentIntentId))
                    .thenThrow(new StripeException("Connection error", "req_123", "code", 500) {});

            assertThrows(
                    PaymentException.class,
                    () -> paymentService.verifyPaymentSuccess(paymentIntentId));
        }
    }
}
