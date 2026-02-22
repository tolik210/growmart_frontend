import api from "src/services/api";
export const listRfq = () => api.get("/api/rfq").then(r => r.data);
export const getRfq = (id) => api.get(`/api/rfq/${id}`).then(r => r.data);
export const createOffer = (id, p) => api.post(`/api/rfq/${id}/offers`, p).then(r => r.data);
