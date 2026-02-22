import api from "./api";

// create shipment for contract
export async function apiShipmentCreate(contractId) {
  const r = await api.post(`/contracts/${contractId}/shipments`, {});
  return r.data;
}

// deliver shipment by shipmentId
export async function apiShipmentDeliver(shipmentId) {
  const r = await api.post(`/shipments/${shipmentId}/deliver`, {});
  return r.data;
}
