export interface CreatePaymentIntentRequest {
    amount: number;
    currency: string;
    description?: string;
    customerEmail?: string;
    orderId?: string;
    userId?: string;
}

export interface CreatePaymentIntentResponse {
    clientSecret: string;
    paymentIntentId: string;
    amount: number;
    currency: string;
}

export interface PaymentResult {
    success: boolean;
    paymentIntentId?: string;
    error?: string;
}
