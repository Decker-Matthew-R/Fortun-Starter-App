package com.fortuna.payment.service;

import com.fortuna.payment.controller.model.PaymentIntentRequestDTO;
import com.fortuna.payment.controller.model.PaymentIntentResponseDTO;
import com.fortuna.payment.exception.PaymentException;
import com.fortuna.payment.service.model.PaymentIntentRequest;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class PaymentService {

    public PaymentIntentResponseDTO createPaymentIntent(PaymentIntentRequestDTO requestDTO) {
        try {
            PaymentIntentRequest request = toServiceModel(requestDTO);
            PaymentIntentCreateParams params = buildStripeParams(request);
            PaymentIntent intent = PaymentIntent.create(params);
            return toResponseDTO(intent);
        } catch (StripeException e) {
            throw new PaymentException(e);
        }
    }

    public PaymentIntent retrievePaymentIntent(String paymentIntentId) {
        try {
            return PaymentIntent.retrieve(paymentIntentId);
        } catch (StripeException e) {
            throw new PaymentException(e);
        }
    }

    public boolean verifyPaymentSuccess(String paymentIntentId) {
        PaymentIntent intent = retrievePaymentIntent(paymentIntentId);
        return "succeeded".equals(intent.getStatus());
    }

    private PaymentIntentCreateParams buildStripeParams(PaymentIntentRequest request) {
        Map<String, String> metadata = buildMetadata(request);

        PaymentIntentCreateParams.Builder paramsBuilder =
                PaymentIntentCreateParams.builder()
                        .setAmount(request.getAmount())
                        .setCurrency(request.getCurrency())
                        .putAllMetadata(metadata)
                        .setAutomaticPaymentMethods(
                                PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                        .setEnabled(true)
                                        .build());

        if (request.getDescription() != null) {
            paramsBuilder.setDescription(request.getDescription());
        }
        if (request.getCustomerEmail() != null) {
            paramsBuilder.setReceiptEmail(request.getCustomerEmail());
        }

        return paramsBuilder.build();
    }

    private Map<String, String> buildMetadata(PaymentIntentRequest request) {
        Map<String, String> metadata = new HashMap<>();
        if (request.getOrderId() != null) {
            metadata.put("orderId", request.getOrderId());
        }
        if (request.getUserId() != null) {
            metadata.put("userId", request.getUserId());
        }
        return metadata;
    }

    private PaymentIntentRequest toServiceModel(PaymentIntentRequestDTO dto) {
        return PaymentIntentRequest.builder()
                .amount(dto.getAmount())
                .currency(dto.getCurrency())
                .description(dto.getDescription())
                .customerEmail(dto.getCustomerEmail())
                .orderId(dto.getOrderId())
                .userId(dto.getUserId())
                .build();
    }

    private PaymentIntentResponseDTO toResponseDTO(PaymentIntent intent) {
        return PaymentIntentResponseDTO.builder()
                .clientSecret(intent.getClientSecret())
                .paymentIntentId(intent.getId())
                .amount(intent.getAmount())
                .currency(intent.getCurrency())
                .build();
    }
}
