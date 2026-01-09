// lib/auth.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export type StoredAuth = {
  userId: number;
  token?: string;
  username?: string;
  email?: string;
};

const AUTH_KEY = "plms_auth_v1";
const EXP_MS = 24 * 60 * 60 * 1000; // 24h (matches backend JwtUtil)

function safeJsonParse<T>(s: string | null): T | null {
  if (!s) return null;
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

function decodeBase64(s: string): string {
  // atob exists on web; on native, global.atob is usually available in RN/Expo.
  // Fallback to Buffer if available.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g: any = globalThis as any;

  if (typeof g.atob === "function") return g.atob(s);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const B: any = (g as any).Buffer;
  if (B) return B.from(s, "base64").toString("utf8");

  throw new Error("No base64 decoder available");
}

export function extractUserIdFromToken(token?: string): number | null {
  if (!token) return null;
  try {
    const decoded = decodeBase64(token);
    const parts = decoded.split(":");
    if (parts.length < 4) return null;

    const n = Number(parts[0]);
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}

export function extractUsernameFromToken(token?: string): string | null {
  if (!token) return null;
  try {
    const decoded = decodeBase64(token);
    const parts = decoded.split(":");
    if (parts.length < 4) return null;
    return parts[1] || null;
  } catch {
    return null;
  }
}

export function isTokenValid(token?: string): boolean {
  if (!token) return true; // allow sessions without token (some endpoints use X-User-Id only)
  try {
    const decoded = decodeBase64(token);
    const parts = decoded.split(":");
    if (parts.length < 4) return false;

    const ts = Number(parts[2]);
    if (!Number.isFinite(ts)) return false;

    const now = Date.now();
    return now - ts <= EXP_MS;
  } catch {
    return false;
  }
}

export async function getStoredAuth(): Promise<StoredAuth | null> {
  const raw = await AsyncStorage.getItem(AUTH_KEY);
  const auth = safeJsonParse<StoredAuth>(raw);
  if (!auth) return null;

  // If token exists but expired/invalid -> clear.
  if (auth.token && !isTokenValid(auth.token)) {
    await clearStoredAuth();
    return null;
  }

  if (!auth.userId || !Number.isFinite(Number(auth.userId))) return null;
  return auth;
}

export async function setStoredAuth(auth: StoredAuth): Promise<void> {
  await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(auth));
}

export async function clearStoredAuth(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_KEY);
}

export async function getUserIdOrDefault(fallback: number = 1): Promise<number> {
  const auth = await getStoredAuth();
  const n = Number(auth?.userId);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export async function getTokenOrUndefined(): Promise<string | undefined> {
  const auth = await getStoredAuth();
  return auth?.token;
}

