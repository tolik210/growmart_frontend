// src/services/payments.js
import api from "src/services/api";

export async function apiPaymentInit(contractId) {
  const r = await api.post(`/payments/${contractId}/init`);
  return r.data;
}

export async function apiPaymentCapture(paymentId) {
  const r = await api.post(`/payments/${paymentId}/capture`);
  return r.data;
}
