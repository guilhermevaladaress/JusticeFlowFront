const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5062/api";
const TOKEN_KEY = "justiceflow_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

async function parseErro(res) {
  let body = null;
  try {
    body = await res.json();
  } catch {
    // resposta sem corpo JSON
  }
  const msg =
    body?.mensagem ||
    body?.detail ||
    body?.message ||
    body?.title ||
    (res.status === 401
      ? "Sessão expirada. Entre novamente."
      : res.status === 403
        ? "Você não tem permissão para esta ação."
        : `Falha na requisição (${res.status}).`);
  return new ApiError(msg, res.status, body);
}

export async function request(path, opts = {}) {
  const { method = "GET", body, auth = true, query } = opts;

  let url = `${BASE_URL}${path}`;
  if (query) {
    const qs = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.append(k, v);
    });
    const s = qs.toString();
    if (s) url += `?${s}`;
  }

  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    clearToken();
  }

  if (!res.ok) {
    throw await parseErro(res);
  }

  if (res.status === 204) return null;

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return res.json();
  }
  return res.text();
}

export const http = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  del: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};
