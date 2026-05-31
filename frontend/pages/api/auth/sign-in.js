import { setAuthCookies } from "../../../lib/insforge/auth-cookies";
import { createCookieWriter } from "../../../lib/insforge/pages-api";
import { createInsForgeAdminClient } from "../../../lib/insforge/server";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const client = createInsForgeAdminClient();
  const { data, error } = await client.auth.signInWithPassword({ email, password });

  if (error || !data?.accessToken) {
    return res.status(error?.statusCode || 401).json({
      message: error?.message || "Sign in failed",
      error: error?.error,
    });
  }

  const { writer, apply } = createCookieWriter(res);
  setAuthCookies(writer, {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });
  apply();

  return res.status(200).json({ user: data.user });
}
