import api from "src/services/api";

export const myProducts = () => api.get("/api/my/products").then(r => r.data);

export const createProduct = (p) => {
  // Копируем данные из формы и добавляем обязательные для бэкенда поля
  const payload = {
    ...p,
    crop_name: p.crop_name || p.title || "Не указано", // Удовлетворяем бэкенд
    unit: p.unit || "kg"                               // Ставим кг по умолчанию
  };
  
  return api.post("/api/products", payload).then(r => r.data);
};

export const publishProduct = (id) => api.post(`/api/products/${id}/publish`).then(r => r.data);
export const unpublishProduct = (id) => api.post(`/api/products/${id}/unpublish`).then(r => r.data);
