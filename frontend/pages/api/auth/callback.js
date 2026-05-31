import { setAuthCookies } from "../../../lib/insforge/auth-cookies";
import { createCookieWriter } from "../../../lib/insforge/pages-api";
import { createInsForgeAdminClient } from "../../../lib/insforge/server";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const code = req.query.insforge_code;
  const oauthError = req.query.error;

  if (oauthError || !code || typeof code !== "string") {
    return res.redirect("/login?error=oauth_failed");
  }

  const codeVerifier = req.cookies?.insforge_code_verifier;
  if (!codeVerifier) {
    return res.redirect("/login?error=missing_verifier");
  }

  const client = createInsForgeAdminClient();
  const { data, error } = await client.auth.exchangeOAuthCode(code, codeVerifier);

  if (error || !data?.accessToken) {
    return res.redirect("/login?error=exchange_failed");
  }

  const { writer, apply } = createCookieWriter(res);
  setAuthCookies(writer, {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });

  writer.set("insforge_code_verifier", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  apply();
  res.redirect(302, "/dashboard");
}
