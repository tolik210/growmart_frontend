const BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8080";

export async function apiFetch(path, { method="GET", body=null, headers={} } = {}) {
  const token = localStorage.getItem("access_token") || "";

  const opts = {
    method,
    headers: {
      "Accept": "application/json",
      ...(body ? {"Content-Type":"application/json"} : {}),
      ...(token ? {"Authorization": `Bearer ${token}`} : {}),
      ...headers
    }
  };

  if (body) opts.body = JSON.stringify(body);

  const resp = await fetch(BASE + path, opts);

  let data = null;
  const ct = resp.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    data = await resp.json().catch(() => null);
  } else {
    const text = await resp.text().catch(() => "");
    data = text ? { raw: text } : null;
  }

  if (!resp.ok) {
    const msg = (data && data.error) ? data.error : `HTTP ${resp.status}`;
    throw new Error(msg);
  }

  return data || {};
}
