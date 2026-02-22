import api from "./api";

// issue ESF for contract: create draft + send
export async function apiEsfIssue(contractId) {
  const d = await api.post(`/contracts/${contractId}/esf`, { payload: {} });
  const esfId = d.data?.esf_id || d.data?.id;
  if (!esfId) throw new Error("ESF draft not created");
  const r = await api.post(`/contracts/${contractId}/esf/${esfId}/send`, {});
  return r.data;
}
