package com.fortuna.payment.controller;

import com.fortuna.config.stripe.StripeConfig;
import com.fortuna.payment.controller.model.PaymentIntentRequestDTO;
import com.fortuna.payment.controller.model.PaymentIntentResponseDTO;
import com.fortuna.payment.service.PaymentService;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins:http://localhost:3000}")
public class PaymentController {

    private final PaymentService paymentService;
    private final StripeConfig stripeConfig;

    @PostMapping("/create-payment-intent")
    public ResponseEntity<PaymentIntentResponseDTO> createPaymentIntent(
            @Valid @RequestBody PaymentIntentRequestDTO request) {
        PaymentIntentResponseDTO response = paymentService.createPaymentIntent(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/config")
    public ResponseEntity<Map<String, String>> getPublishableKey() {
        return ResponseEntity.ok(Map.of("publishableKey", stripeConfig.getPublishableKey()));
    }

    @GetMapping("/verify/{paymentIntentId}")
    public ResponseEntity<Map<String, Boolean>> verifyPayment(
            @PathVariable String paymentIntentId) {
        boolean success = paymentService.verifyPaymentSuccess(paymentIntentId);
        return ResponseEntity.ok(Map.of("success", success));
    }
}
