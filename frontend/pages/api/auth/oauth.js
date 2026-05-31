import { getAppUrl } from "../../../lib/insforge/pages-api";
import { createInsForgeAdminClient } from "../../../lib/insforge/server";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { provider } = req.query;
  if (!provider || typeof provider !== "string") {
    return res.status(400).json({ message: "Provider is required" });
  }

  const client = createInsForgeAdminClient();
  const appUrl = getAppUrl(req);
  const { data, error } = await client.auth.signInWithOAuth({
    provider,
    redirectTo: `${appUrl}/api/auth/callback`,
    skipBrowserRedirect: true,
  });

  if (error || !data?.url || !data?.codeVerifier) {
    return res.redirect("/login?error=oauth_failed");
  }

  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `insforge_code_verifier=${encodeURIComponent(data.codeVerifier)}; HttpOnly; Path=/; Max-Age=600; SameSite=Lax${secure}`
  );
  res.redirect(302, data.url);
}
