import { api } from "./http"

export const partnerBankPayments = () => api("/partner/bank/payments")
export const partnerBankPaymentDetails = (id) => api(`/partner/bank/payments/${id}`)

export const listShipments = () => api("/partner/logistics/shipments")
export const createShipment = (body) => api("/partner/logistics/shipments", { method:"POST", body })
export const updateShipmentStatus = (id, body) => api(`/partner/logistics/shipments/${id}/status`, { method:"POST", body })
