# Stripe Test Cards Reference

Use these test card numbers when testing payment flows in development and staging environments. These cards will never charge real money and are provided by Stripe for testing purposes.

## ✅ Successful Payments

### Basic Success
- **Card Number:** `4242 4242 4242 4242`
- **Expiry:** Any future date (e.g., `12/34`)
- **CVC:** Any 3 digits (e.g., `123`)
- **ZIP:** Any 5 digits (e.g., `12345`)
- **Result:** Payment succeeds immediately

### International Cards
- **Visa (US):** `4242 4242 4242 4242`
- **Visa (Debit):** `4000 0566 5566 5556`
- **Mastercard:** `5555 5555 5555 4444`
- **Mastercard (Debit):** `5200 8282 8282 8210`
- **Mastercard (Prepaid):** `5105 1051 0510 5100`
- **American Express:** `3782 822463 10005`
- **Discover:** `6011 1111 1111 1117`
- **Diners Club:** `3056 9300 0902 0004`
- **JCB:** `3566 0020 2036 0505`

## ❌ Declined Payments

### Generic Decline
- **Card Number:** `4000 0000 0000 0002`
- **Result:** Card is declined with generic decline code

### Insufficient Funds
- **Card Number:** `4000 0000 0000 9995`
- **Result:** Card is declined due to insufficient funds

### Lost Card
- **Card Number:** `4000 0000 0000 9987`
- **Result:** Card is declined as lost card

### Stolen Card
- **Card Number:** `4000 0000 0000 9979`
- **Result:** Card is declined as stolen card

### Expired Card
- **Card Number:** `4000 0000 0000 0069`
- **Result:** Card is declined as expired

### Incorrect CVC
- **Card Number:** `4000 0000 0000 0127`
- **Result:** Card is declined due to incorrect CVC

### Processing Error
- **Card Number:** `4000 0000 0000 0119`
- **Result:** Card is declined with processing error

## 🔐 Authentication Required (3D Secure)

### Requires Authentication
- **Card Number:** `4000 0025 0000 3155`
- **Result:** Payment requires additional authentication (3D Secure)
- **Test Action:** A test authentication modal will appear - click "Complete authentication"

### Authentication Fails
- **Card Number:** `4000 0000 0000 9235`
- **Result:** 3D Secure authentication fails

## 🌍 Region-Specific Cards

### Cards by Country

#### Canada
- **Card Number:** `4000 0012 4000 0000`
- **Country:** Canada

#### Mexico
- **Card Number:** `4000 0048 4000 0008`
- **Country:** Mexico

#### United Kingdom
- **Card Number:** `4000 0082 6000 0000`
- **Country:** United Kingdom

#### France
- **Card Number:** `4000 0025 0000 0003`
- **Country:** France

#### Germany
- **Card Number:** `4000 0027 6000 0016`
- **Country:** Germany

## 💰 Special Amounts (for testing specific scenarios)

When using `4242 4242 4242 4242`, you can test specific amounts to trigger different behaviors:

- **Amount ending in .00** (e.g., `$10.00`): Normal success
- **Amount ending in .01** (e.g., `$10.01`): Insufficient funds decline
- **Amount ending in .02** (e.g., `$10.02`): Generic decline
- **Amount ending in .05** (e.g., `$10.05`): Requires 3D Secure

## 🧪 Testing Different Currencies

All test cards work with different currencies. Simply change the currency code in your payment request:
```typescript
// USD (default)
amount: 1000, // $10.00
currency: 'usd'

// EUR
amount: 1000, // €10.00
currency: 'eur'

// GBP
amount: 1000, // £10.00
currency: 'gbp'
```

## 📝 Important Notes

1. **Never use real card numbers** in test mode
2. **Test cards only work in test mode** (API keys starting with `sk_test_` and `pk_test_`)
3. **Expiry date:** Any future date works (e.g., `12/34`, `01/30`)
4. **CVC:** Any 3 digits for Visa/Mastercard/Discover, any 4 digits for Amex
5. **ZIP/Postal Code:** Any valid format for the card's country
6. **Name:** Any name works

## 🔗 Official Documentation

For the most up-to-date list of test cards, visit:
https://docs.stripe.com/testing

## 🎯 Quick Test Workflow

1. Start backend: `./gradlew bootRun`
2. Start frontend: `npm run dev`
3. Navigate to payment page
4. Enter test card: `4242 4242 4242 4242`
5. Expiry: `12/34`
6. CVC: `123`
7. Click "Pay"
8. Verify in Stripe Dashboard: https://dashboard.stripe.com/test/payments

---

**Last Updated:** February 2026  
**Stripe API Version:** Latest
