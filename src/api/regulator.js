import { api } from "./http"

export const regulatorDashboard = () => api("/regulator/dashboard")
export const reportContracts = () => api("/regulator/reports/contracts")
export const reportPayments = () => api("/regulator/reports/payments")
export const reportStock = () => api("/regulator/reports/stock")
