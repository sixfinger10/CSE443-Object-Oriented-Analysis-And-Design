// lib/api.ts
import { API_BASE } from "@/constants/api";
import { clearStoredAuth, getStoredAuth } from "@/lib/auth";

export type ApiRequestOptions = RequestInit & {
  withUserId?: boolean;
  withAuth?: boolean;
};

function looksLikeJson(text: string): boolean {
  const t = text.trim();
  return t.startsWith("{") || t.startsWith("[");
}

function parseLoose(text: string): any {
  const t = text.trim();
  if (!t) return null;

  if (looksLikeJson(t)) {
    try {
      return JSON.parse(t);
    } catch {
      return t;
    }
  }

  const n = Number(t);
  if (Number.isFinite(n) && String(n) === t.replace(/^\+/, "")) return n;

  return t;
}

function isFormData(body: any): boolean {
  // FormData exists in RN/Expo; this guards the JSON headers.
  return typeof FormData !== "undefined" && body instanceof FormData;
}

export async function apiFetch(path: string, init: ApiRequestOptions = {}): Promise<Response> {
  const url = `${API_BASE}${path}`;

  const {
    withUserId = false,
    withAuth = true,
    headers: headersIn,
    ...rest
  } = init;

  const auth = await getStoredAuth();

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(typeof headersIn === "object" ? (headersIn as any) : {}),
  };

  if (withUserId && auth?.userId) {
    headers["X-User-Id"] = String(auth.userId);
  }

  if (withAuth && auth?.token) {
    // harmless if backend ignores
    headers["Authorization"] = `Bearer ${auth.token}`;
    headers["X-Auth-Token"] = auth.token;
  }

  // If JSON body and Content-Type not set, set it.
  if (rest.body && !isFormData(rest.body)) {
    const hasCT =
      Object.keys(headers).some((k) => k.toLowerCase() === "content-type");
    if (!hasCT) headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    ...rest,
    headers,
  });

  if (res.status === 401) {
    // token expired / invalid session
    await clearStoredAuth();
  }

  return res;
}

export async function apiGetJson<T>(path: string, init: ApiRequestOptions = {}): Promise<T> {
  const res = await apiFetch(path, { ...init, method: "GET" });

  const text = await res.text();
  const data = parseLoose(text);

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data as T;
}

export async function apiPostJson<T>(
  path: string,
  body: any,
  init: ApiRequestOptions = {}
): Promise<T> {
  const res = await apiFetch(path, {
    ...init,
    method: init.method ?? "POST",
    body: isFormData(body) ? body : JSON.stringify(body ?? {}),
  });

  const text = await res.text();
  const data = parseLoose(text);

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data as T;
}

export async function apiDelete<T>(path: string, init: ApiRequestOptions = {}): Promise<T> {
  const res = await apiFetch(path, { ...init, method: "DELETE" });

  const text = await res.text();
  const data = parseLoose(text);

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data as T;
}

