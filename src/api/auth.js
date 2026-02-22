import { apiFetch } from "./client"

export function apiLogin(body){
  return apiFetch("/auth/login", { method:"POST", body })
}

export function apiRegister(body){
  return apiFetch("/auth/register", { method:"POST", body })
}
