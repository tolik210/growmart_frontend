import { getRole } from "./jwt"

export function redirectByRole(router){
  const r = getRole()
  if(r === "gov") return router.push("/regulator")
  if(r === "bank" || r === "logistic_partner") return router.push("/partner")
  if(r === "admin") return router.push("/admin")
  if(r === "farmer") return router.push("/app/seller")
  if(r === "buyer_b2b" || r === "buyer_c2b") return router.push("/app/buyer")
  return router.push("/")
}
