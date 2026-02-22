import api from "./api";

// init payment for contract
export async function apiPaymentInit(contractId) {
  const r = await api.post(`/contracts/${contractId}/payments/init`, {});
  return r.data;
}

// capture payment by paymentId
export async function apiPaymentCapture(paymentId) {
  const r = await api.post(`/payments/${paymentId}/capture`, {});
  return r.data;
}
