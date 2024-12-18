const axios = require("axios");

const PAYMOB_API_BASE_URL = "https://accept.paymob.com/api";
const PAYMOB_API_KEY ="ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2TVRBd05qWXdNaXdpYm1GdFpTSTZJakUzTXpFNE1ERTNPVFl1TlRjMU5EVXpJbjAuelltVXF4UklPRENQWS0tUGNPNjY1THg1S1BmQi1ISG9FRkRwYS02dnVtbWFhVENtNklKZGdJLUsyZFNmdVdyd2dfb0lWcmN2c3NFNFliVEVDTTFCcnc="; // يجب تعريفه في ملف .env
const PAYMOB_INTEGRATION_ID = 4877571; // يجب تعريفه في ملف .env

const authenticate = async () => {
    try {
        const response = await axios.post(`${PAYMOB_API_BASE_URL}/auth/tokens`, {
            api_key: PAYMOB_API_KEY,
        });

        const { token } = response.data;
        console.log("Authentication Token:", token);
        return token;
    } catch (error) {
        console.error("Error authenticating:", error.message);
        throw new Error("Failed to authenticate with Paymob.");
    }
};

const createOrder = async (authToken, amount, currency = "EGP") => {
    try {
        const response = await axios.post(
            `${PAYMOB_API_BASE_URL}/ecommerce/orders`,
            {
                amount_cents: amount * 100, // Convert to cents
                currency,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );

        const { id } = response.data;
        console.log("Order Created:", id);
        return id;
    } catch (error) {
        console.error("Error creating order:", error.message);
        throw new Error("Failed to create order with Paymob.");
    }
};

const generatePaymentKey = async (authToken, orderId, amount, billingData) => {
    try {
        const response = await axios.post(`${PAYMOB_API_BASE_URL}/acceptance/payment_keys`, {
            auth_token: authToken,
            amount_cents: amount * 100,
            expiration: 3600,
            order_id: orderId,
            billing_data: billingData,
            currency: "EGP",
            integration_id: PAYMOB_INTEGRATION_ID,
        });

        const { token } = response.data;
        console.log("Payment Key:", token);
        return token;
    } catch (error) {
        console.error("Error generating payment key:", error.message);
        throw new Error("Failed to generate payment key with Paymob.");
    }
};

module.exports = {
    authenticate,
    createOrder,
    generatePaymentKey,
};
