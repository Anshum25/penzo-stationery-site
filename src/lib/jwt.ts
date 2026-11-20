import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "penzo_admin";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export type SessionPayload = { userId: number; email: string };

function key() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set. Add it to .env.local.");
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(key());
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    return { userId: Number(payload.userId), email: String(payload.email) };
  } catch {
    return null;
  }
}
