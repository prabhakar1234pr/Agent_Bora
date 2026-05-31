import { setAuthCookies } from "../../../lib/insforge/auth-cookies";
import { createCookieWriter } from "../../../lib/insforge/pages-api";
import { createInsForgeAdminClient } from "../../../lib/insforge/server";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, otp } = req.body || {};
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and verification code are required" });
  }

  const client = createInsForgeAdminClient();
  const { data, error } = await client.auth.verifyEmail({ email, otp });

  if (error || !data?.accessToken) {
    return res.status(error?.statusCode || 400).json({
      message: error?.message || "Verification failed",
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
