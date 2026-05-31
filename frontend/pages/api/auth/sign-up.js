import { setAuthCookies } from "../../../lib/insforge/auth-cookies";
import { createCookieWriter, getAppUrl } from "../../../lib/insforge/pages-api";
import { createInsForgeAdminClient } from "../../../lib/insforge/server";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password, name } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const client = createInsForgeAdminClient();
  const appUrl = getAppUrl(req);
  const { data, error } = await client.auth.signUp({
    email,
    password,
    name: name || undefined,
    redirectTo: `${appUrl}/login`,
  });

  if (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Sign up failed",
      error: error.error,
    });
  }

  if (data?.requireEmailVerification) {
    return res.status(200).json({
      requireEmailVerification: true,
      email,
      user: data.user,
    });
  }

  if (data?.accessToken) {
    const { writer, apply } = createCookieWriter(res);
    setAuthCookies(writer, {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
    apply();
  }

  return res.status(200).json({
    user: data.user,
    requireEmailVerification: data?.requireEmailVerification || false,
    email,
  });
}
