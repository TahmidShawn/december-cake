const MYFATOORAH_API_URL = process.env.MYFATOORAH_API_URL;
const MYFATOORAH_API_KEY = process.env.MYFATOORAH_API_KEY;

const myFatoorahRequest = async (endpoint, options = {}) => {
    if (!MYFATOORAH_API_URL || !MYFATOORAH_API_KEY) {
        throw new Error("MyFatoorah configuration is missing");
    }

    const response = await fetch(`${MYFATOORAH_API_URL}${endpoint}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${MYFATOORAH_API_KEY}`,
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    });

    const data = await response.json();

    if (!response.ok || !data.IsSuccess) {
        const message =
            data.Message ||
            data.ValidationErrors?.map((error) => error.Message)
                .filter(Boolean)
                .join(", ") ||
            "MyFatoorah request failed";

        throw new Error(message);
    }

    return data.Data;
};

export const createMyFatoorahPayment = async ({
    amount,
    orderId,
    customer,
}) => {
    return myFatoorahRequest("/v3/payments", {
        method: "POST",
        body: JSON.stringify({
            Order: {
                Amount: amount,
            },

            Customer: {
                Name: customer.name,
                Email: customer.email,
            },

            IntegrationUrls: {
                Redirection: process.env.MYFATOORAH_REDIRECTION_URL,
            },

            NotificationOption: "LINK",
            CustomerReference: orderId,
        }),
    });
};

export const getMyFatoorahPayment = async (paymentId) => {
    return myFatoorahRequest(`/v3/payments/${encodeURIComponent(paymentId)}`, {
        method: "GET",
    });
};