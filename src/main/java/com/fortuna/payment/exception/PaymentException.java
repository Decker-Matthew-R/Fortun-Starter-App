package com.fortuna.payment.exception;

import com.stripe.exception.StripeException;

public class PaymentException extends RuntimeException {

    public PaymentException(String message) {
        super(message);
    }

    public PaymentException(Throwable cause) {
        super("Failed to process payment", cause);
    }

    public PaymentException(StripeException cause) {
        super("Failed to process payment: " + cause.getMessage(), cause);
    }
}

