const API_BASE =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE ||
  "";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // если отправляем JSON и body не строка/не FormData — проставим Content-Type и stringify
  let body = options.body;
  const isForm = body instanceof FormData;
  const isString = typeof body === "string";
  const hasBody = body !== undefined && body !== null;

  if (hasBody && !isForm && !isString && !(headers["Content-Type"] || headers["content-type"])) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;

  const res = await fetch(url, { ...options, headers, body });

  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json") ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && (data.message || data.error)) ||
      (typeof data === "string" && data) ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}
