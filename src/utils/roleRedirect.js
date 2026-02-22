export function roleToPath(role) {
  if (!role) return "/";

  if (role === "farmer") return "/seller";
  if (role === "buyer_b2b" || role === "buyer_c2b") return "/buyer";
  if (role === "regulator" || role === "admin") return "/regulator";
  if (role === "partner_bank" || role === "partner_logistics") return "/partner";
  return "/";
}

export function isBuyer(role) {
  return role === "buyer_b2b" || role === "buyer_c2b";
}
