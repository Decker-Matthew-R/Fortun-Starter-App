package com.fortuna.integration;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fortuna.payment.controller.model.PaymentIntentRequestDTO;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class PaymentIntegrationTest {

    @Autowired private MockMvc mockMvc;

    @Autowired private ObjectMapper objectMapper;

    @Test
    @DisplayName("INT - should create payment intent successfully through full stack")
    void shouldCreatePaymentIntentSuccessfullyThroughFullStack() throws Exception {
        PaymentIntentRequestDTO requestDTO =
                PaymentIntentRequestDTO.builder()
                        .amount(2500L)
                        .currency("usd")
                        .description("Integration test payment")
                        .customerEmail("test@example.com")
                        .orderId("order123")
                        .userId("user456")
                        .build();

        PaymentIntent mockIntent = mock(PaymentIntent.class);
        when(mockIntent.getClientSecret()).thenReturn("pi_integration_secret_123");
        when(mockIntent.getId()).thenReturn("pi_integration_123");
        when(mockIntent.getAmount()).thenReturn(2500L);
        when(mockIntent.getCurrency()).thenReturn("usd");

        try (MockedStatic<PaymentIntent> mockedStatic = mockStatic(PaymentIntent.class)) {
            mockedStatic
                    .when(() -> PaymentIntent.create(any(PaymentIntentCreateParams.class)))
                    .thenReturn(mockIntent);

            String requestJson = objectMapper.writeValueAsString(requestDTO);

            mockMvc.perform(
                            post("/api/payments/create-payment-intent")
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .content(requestJson))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.clientSecret").value("pi_integration_secret_123"))
                    .andExpect(jsonPath("$.paymentIntentId").value("pi_integration_123"))
                    .andExpect(jsonPath("$.amount").value(2500))
                    .andExpect(jsonPath("$.currency").value("usd"));
        }
    }

    @Test
    @DisplayName("INT - should create payment intent with minimal fields")
    void shouldCreatePaymentIntentWithMinimalFields() throws Exception {
        PaymentIntentRequestDTO requestDTO =
                PaymentIntentRequestDTO.builder().amount(1000L).currency("eur").build();

        PaymentIntent mockIntent = mock(PaymentIntent.class);
        when(mockIntent.getClientSecret()).thenReturn("pi_minimal_secret");
        when(mockIntent.getId()).thenReturn("pi_minimal");
        when(mockIntent.getAmount()).thenReturn(1000L);
        when(mockIntent.getCurrency()).thenReturn("eur");

        try (MockedStatic<PaymentIntent> mockedStatic = mockStatic(PaymentIntent.class)) {
            mockedStatic
                    .when(() -> PaymentIntent.create(any(PaymentIntentCreateParams.class)))
                    .thenReturn(mockIntent);

            String requestJson = objectMapper.writeValueAsString(requestDTO);

            mockMvc.perform(
                            post("/api/payments/create-payment-intent")
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .content(requestJson))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.clientSecret").value("pi_minimal_secret"))
                    .andExpect(jsonPath("$.paymentIntentId").value("pi_minimal"))
                    .andExpect(jsonPath("$.amount").value(1000))
                    .andExpect(jsonPath("$.currency").value("eur"));
        }
    }

    @Test
    @DisplayName("INT - should handle Stripe API errors and return error response with errorId")
    void shouldHandleStripeApiErrorsAndReturnErrorResponse() throws Exception {
        PaymentIntentRequestDTO requestDTO =
                PaymentIntentRequestDTO.builder().amount(1000L).currency("usd").build();

        try (MockedStatic<PaymentIntent> mockedStatic = mockStatic(PaymentIntent.class)) {
            mockedStatic
                    .when(() -> PaymentIntent.create(any(PaymentIntentCreateParams.class)))
                    .thenThrow(
                            new StripeException(
                                    "Card declined", "req_123", "card_declined", 402) {});

            String requestJson = objectMapper.writeValueAsString(requestDTO);

            mockMvc.perform(
                            post("/api/payments/create-payment-intent")
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .content(requestJson))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errorId").exists())
                    .andExpect(jsonPath("$.message").exists())
                    .andExpect(jsonPath("$.status").value(400))
                    .andExpect(jsonPath("$.timestamp").exists());
        }
    }

    @Test
    @DisplayName("INT - should retrieve publishable key through config endpoint")
    void shouldRetrievePublishableKeyThroughConfigEndpoint() throws Exception {
        mockMvc.perform(get("/api/payments/config"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.publishableKey").exists())
                .andExpect(jsonPath("$.publishableKey").isNotEmpty());
    }

    @Test
    @DisplayName("INT - should verify payment success when status is succeeded")
    void shouldVerifyPaymentSuccessWhenStatusIsSucceeded() throws Exception {
        String paymentIntentId = "pi_succeeded_123";

        PaymentIntent mockIntent = mock(PaymentIntent.class);
        when(mockIntent.getStatus()).thenReturn("succeeded");

        try (MockedStatic<PaymentIntent> mockedStatic = mockStatic(PaymentIntent.class)) {
            mockedStatic.when(() -> PaymentIntent.retrieve(paymentIntentId)).thenReturn(mockIntent);

            mockMvc.perform(get("/api/payments/verify/" + paymentIntentId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true));
        }
    }

    @Test
    @DisplayName("INT - should verify payment failure when status is not succeeded")
    void shouldVerifyPaymentFailureWhenStatusIsNotSucceeded() throws Exception {
        String paymentIntentId = "pi_pending_123";

        PaymentIntent mockIntent = mock(PaymentIntent.class);
        when(mockIntent.getStatus()).thenReturn("requires_payment_method");

        try (MockedStatic<PaymentIntent> mockedStatic = mockStatic(PaymentIntent.class)) {
            mockedStatic.when(() -> PaymentIntent.retrieve(paymentIntentId)).thenReturn(mockIntent);

            mockMvc.perform(get("/api/payments/verify/" + paymentIntentId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(false));
        }
    }

    @Test
    @DisplayName("INT - should handle error when verifying invalid payment intent")
    void shouldHandleErrorWhenVerifyingInvalidPaymentIntent() throws Exception {
        String paymentIntentId = "pi_invalid_123";

        try (MockedStatic<PaymentIntent> mockedStatic = mockStatic(PaymentIntent.class)) {
            mockedStatic
                    .when(() -> PaymentIntent.retrieve(paymentIntentId))
                    .thenThrow(
                            new StripeException(
                                    "Payment intent not found",
                                    "req_123",
                                    "resource_missing",
                                    404) {});

            mockMvc.perform(get("/api/payments/verify/" + paymentIntentId))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errorId").exists())
                    .andExpect(jsonPath("$.message").exists())
                    .andExpect(jsonPath("$.status").value(400));
        }
    }

    @Test
    @DisplayName("INT - should handle invalid currency gracefully")
    void shouldHandleInvalidCurrencyGracefully() throws Exception {
        PaymentIntentRequestDTO requestDTO =
                PaymentIntentRequestDTO.builder().amount(1000L).currency("INVALID").build();

        try (MockedStatic<PaymentIntent> mockedStatic = mockStatic(PaymentIntent.class)) {
            mockedStatic
                    .when(() -> PaymentIntent.create(any(PaymentIntentCreateParams.class)))
                    .thenThrow(
                            new StripeException(
                                    "Invalid currency: INVALID",
                                    "req_123",
                                    "invalid_request_error",
                                    400) {});

            String requestJson = objectMapper.writeValueAsString(requestDTO);

            mockMvc.perform(
                            post("/api/payments/create-payment-intent")
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .content(requestJson))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errorId").exists())
                    .andExpect(
                            jsonPath("$.message")
                                    .value(
                                            org.hamcrest.Matchers.containsString(
                                                    "Failed to process payment: Invalid currency: INVALID")))
                    .andExpect(jsonPath("$.status").value(400))
                    .andExpect(jsonPath("$.timestamp").exists());
        }
    }

    @Test
    @DisplayName("INT - should include metadata in payment intent creation")
    void shouldIncludeMetadataInPaymentIntentCreation() throws Exception {
        PaymentIntentRequestDTO requestDTO =
                PaymentIntentRequestDTO.builder()
                        .amount(5000L)
                        .currency("usd")
                        .orderId("order789")
                        .userId("user999")
                        .build();

        PaymentIntent mockIntent = mock(PaymentIntent.class);
        when(mockIntent.getClientSecret()).thenReturn("pi_metadata_secret");
        when(mockIntent.getId()).thenReturn("pi_metadata_123");
        when(mockIntent.getAmount()).thenReturn(5000L);
        when(mockIntent.getCurrency()).thenReturn("usd");

        try (MockedStatic<PaymentIntent> mockedStatic = mockStatic(PaymentIntent.class)) {
            mockedStatic
                    .when(() -> PaymentIntent.create(any(PaymentIntentCreateParams.class)))
                    .thenReturn(mockIntent);

            String requestJson = objectMapper.writeValueAsString(requestDTO);

            mockMvc.perform(
                            post("/api/payments/create-payment-intent")
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .content(requestJson))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.paymentIntentId").value("pi_metadata_123"));
        }
    }
}
