package com.fortuna.payment.controller;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fortuna.config.stripe.StripeConfig;
import com.fortuna.exception.GlobalExceptionHandler;
import com.fortuna.payment.controller.model.PaymentIntentRequestDTO;
import com.fortuna.payment.controller.model.PaymentIntentResponseDTO;
import com.fortuna.payment.exception.PaymentException;
import com.fortuna.payment.service.PaymentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class PaymentControllerTest {

    private MockMvc mockMvc;

    @Mock private PaymentService mockPaymentService;
    @Mock private StripeConfig mockStripeConfig;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        PaymentController controller = new PaymentController(mockPaymentService, mockStripeConfig);
        mockMvc =
                MockMvcBuilders.standaloneSetup(controller)
                        .setControllerAdvice(new GlobalExceptionHandler())
                        .build();
    }

    @Test
    @DisplayName(
            "when create payment intent request is received, service is called and 200 is returned")
    void whenCreatePaymentIntentRequestIsReceived_ServiceIsCalled_OkIsReturned() throws Exception {
        PaymentIntentRequestDTO requestDTO =
                PaymentIntentRequestDTO.builder()
                        .amount(1000L)
                        .currency("usd")
                        .description("Test payment")
                        .build();

        PaymentIntentResponseDTO responseDTO =
                PaymentIntentResponseDTO.builder()
                        .clientSecret("pi_test_secret_123")
                        .paymentIntentId("pi_test_123")
                        .amount(1000L)
                        .currency("usd")
                        .build();

        when(mockPaymentService.createPaymentIntent(any(PaymentIntentRequestDTO.class)))
                .thenReturn(responseDTO);

        String requestJson = objectMapper.writeValueAsString(requestDTO);

        mockMvc.perform(
                        post("/api/payments/create-payment-intent")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.clientSecret").value("pi_test_secret_123"))
                .andExpect(jsonPath("$.paymentIntentId").value("pi_test_123"))
                .andExpect(jsonPath("$.amount").value(1000))
                .andExpect(jsonPath("$.currency").value("usd"));

        verify(mockPaymentService, times(1))
                .createPaymentIntent(any(PaymentIntentRequestDTO.class));
    }

    @Test
    @DisplayName("Should return 500 when service throws RuntimeException")
    void shouldReturn500WhenServiceThrowsRuntimeException() throws Exception {
        PaymentIntentRequestDTO requestDTO =
                PaymentIntentRequestDTO.builder().amount(1000L).currency("usd").build();

        when(mockPaymentService.createPaymentIntent(any(PaymentIntentRequestDTO.class)))
                .thenThrow(new RuntimeException("Stripe error"));

        String requestJson = objectMapper.writeValueAsString(requestDTO);

        mockMvc.perform(
                        post("/api/payments/create-payment-intent")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestJson))
                .andExpect(status().isInternalServerError()); // 500, not 400

        verify(mockPaymentService, times(1))
                .createPaymentIntent(any(PaymentIntentRequestDTO.class));
    }

    @Test
    @DisplayName("Should return 400 when service throws PaymentException")
    void shouldReturn400WhenServiceThrowsPaymentException() throws Exception {
        PaymentIntentRequestDTO requestDTO =
                PaymentIntentRequestDTO.builder().amount(1000L).currency("usd").build();

        when(mockPaymentService.createPaymentIntent(any(PaymentIntentRequestDTO.class)))
                .thenThrow(new PaymentException("Card declined"));

        String requestJson = objectMapper.writeValueAsString(requestDTO);

        mockMvc.perform(
                        post("/api/payments/create-payment-intent")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestJson))
                .andExpect(status().isBadRequest()); // 400 for PaymentException

        verify(mockPaymentService, times(1))
                .createPaymentIntent(any(PaymentIntentRequestDTO.class));
    }

    @Test
    @DisplayName("when get config request is received, publishable key is returned")
    void whenGetConfigRequestIsReceived_PublishableKeyIsReturned() throws Exception {
        when(mockStripeConfig.getPublishableKey()).thenReturn("pk_test_123");

        mockMvc.perform(get("/api/payments/config"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.publishableKey").value("pk_test_123"));

        verify(mockStripeConfig, times(1)).getPublishableKey();
    }

    @Test
    @DisplayName(
            "when verify payment request is received, service is called and result is returned")
    void whenVerifyPaymentRequestIsReceived_ServiceIsCalled_ResultIsReturned() throws Exception {
        when(mockPaymentService.verifyPaymentSuccess("pi_test_123")).thenReturn(true);

        mockMvc.perform(get("/api/payments/verify/pi_test_123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        verify(mockPaymentService, times(1)).verifyPaymentSuccess("pi_test_123");
    }

    @Test
    @DisplayName("when verify payment fails, service returns false")
    void whenVerifyPaymentFails_ServiceReturnsFalse() throws Exception {
        when(mockPaymentService.verifyPaymentSuccess("pi_test_123")).thenReturn(false);

        mockMvc.perform(get("/api/payments/verify/pi_test_123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false));

        verify(mockPaymentService, times(1)).verifyPaymentSuccess("pi_test_123");
    }
}
