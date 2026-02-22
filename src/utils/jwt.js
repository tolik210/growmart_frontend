function b64urlToJson(b64url){
  const pad = '='.repeat((4 - (b64url.length % 4)) % 4);
  const b64 = (b64url + pad).replace(/-/g, '+').replace(/_/g, '/');
  const str = atob(b64);
  return JSON.parse(decodeURIComponent(Array.prototype.map.call(str, c =>
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  ).join('')));
}

export function saveTokens(access, refresh){
  if (access) localStorage.setItem("access_token", access);
  if (refresh) localStorage.setItem("refresh_token", refresh);
}

export function clearTokens(){
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export function getAccessToken(){
  return localStorage.getItem("access_token") || "";
}

export function getJwtPayload(){
  const t = getAccessToken();
  const parts = t.split(".");
  if (parts.length !== 3) return null;
  try { return b64urlToJson(parts[1]); } catch { return null; }
}

export function getRole(){
  const p = getJwtPayload();
  return p?.role || "";
}

export function getUid(){
  const p = getJwtPayload();
  return p?.uid || "";
}

export function isLoggedIn(){
  const p = getJwtPayload();
  if (!p) return false;
  // exp in seconds
  if (!p.exp) return true;
  const now = Math.floor(Date.now()/1000);
  return p.exp > now;
}
