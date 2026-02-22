import api from "src/services/api";

export const apiMyContracts = async () => {
  const { data } = await api.get("/contracts");
  return data;
};

export const apiContract = async (id) => {
  const { data } = await api.get(`/contracts/${id}`);
  return data;
};

export const apiContractSignatures = async (id) => {
  const { data } = await api.get(`/contracts/${id}/signatures`);
  return data;
};

export const apiSigningPayload = async (id) => {
  const { data } = await api.get(`/contracts/${id}/signing-payload`);
  return data;
};

export const apiContractSign = async (id, signature, cert) => {
  const { data } = await api.post(`/contracts/${id}/sign`, { signature, cert });
  return data;
};
