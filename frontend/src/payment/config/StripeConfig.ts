export const getStripePublishableKey = async (): Promise<string> => {
    // eslint-disable-next-line no-undef
    const response = await fetch('/api/payments/config');
    const data = await response.json();
    return data.publishableKey;
};
