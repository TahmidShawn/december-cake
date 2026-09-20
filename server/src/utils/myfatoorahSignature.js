import crypto from "crypto";

export const verifyMyFatoorahSignature = (req) => {
    const signature = req.headers["myfatoorah-signature"];

    if (!signature) {
        return false;
    }

    const data = req.body?.Data || {};
    const invoice = data.Invoice || {};
    const transaction = data.Transaction || {};

    const signatureData = [
        `Invoice.Id=${invoice.Id ?? ""}`,
        `Invoice.Status=${invoice.Status ?? ""}`,
        `Transaction.Status=${transaction.Status ?? ""}`,
        `Transaction.PaymentId=${transaction.PaymentId ?? ""}`,
        `Invoice.ExternalIdentifier=${invoice.ExternalIdentifier ?? ""}`,
    ].join(",");

    const expectedSignature = crypto
        .createHmac("sha256", process.env.MYFATOORAH_WEBHOOK_SECRET)
        .update(signatureData, "utf8")
        .digest("base64");

    const receivedBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (receivedBuffer.length !== expectedBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(receivedBuffer, expectedBuffer);
};