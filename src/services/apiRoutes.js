import api from './api'

// contracts
export async function apiListContracts(role = 'buyer', status = '') {
  const { data } = await api.get('/contracts', { params: { role, status } })
  return data
}
export async function apiGetContract(id) {
  const { data } = await api.get(`/contracts/${id}`)
  return data
}

// payments
export async function apiInitPayment(contract_id, method='card') {
  const { data } = await api.post('/payments/init', { contract_id, method })
  return data
}
export async function apiListPayments(contract_id) {
  const { data } = await api.get('/payments', { params: { contract_id } })
  return data
}
export async function apiGetPayment(id) {
  const { data } = await api.get(`/payments/${id}`)
  return data
}

// regulator
export async function apiRegDashboard() {
  const { data } = await api.get('/regulator/dashboard')
  return data
}
export async function apiRegContractsReport() {
  const { data } = await api.get('/regulator/reports/contracts')
  return data
}
export async function apiRegPaymentsReport() {
  const { data } = await api.get('/regulator/reports/payments')
  return data
}
export async function apiRegStockReport() {
  const { data } = await api.get('/regulator/reports/stock')
  return data
}

// partner
export async function apiPartnerBankPayments() {
  const { data } = await api.get('/partner/bank/payments')
  return data
}
export async function apiPartnerBankPaymentDetails(id) {
  const { data } = await api.get(`/partner/bank/payments/${id}`)
  return data
}
export async function apiPartnerListShipments() {
  const { data } = await api.get('/partner/logistics/shipments')
  return data
}
export async function apiPartnerCreateShipment(payload) {
  const { data } = await api.post('/partner/logistics/shipments', payload)
  return data
}
export async function apiPartnerUpdateShipmentStatus(id, status) {
  const { data } = await api.post(`/partner/logistics/shipments/${id}/status`, { status })
  return data
}

// contract actions
export async function apiSendContract(id) {
  const { data } = await api.post(`/contracts/${id}/send`)
  return data
}
export async function apiSignContract(id) {
  const { data } = await api.post(`/contracts/${id}/sign`)
  return data
}

// documents
export async function apiCreateDoc(contractId, doc_type) {
  const { data } = await api.post(`/contracts/${contractId}/documents`, { doc_type })
  return data
}
export async function apiSendDoc(contractId, docId) {
  const { data } = await api.post(`/contracts/${contractId}/documents/${docId}/send`)
  return data
}
export async function apiSignDoc(contractId, docId) {
  const { data } = await api.post(`/contracts/${contractId}/documents/${docId}/sign`)
  return data
}
export async function apiRejectDoc(contractId, docId) {
  const { data } = await api.post(`/contracts/${contractId}/documents/${docId}/reject`)
  return data
}
