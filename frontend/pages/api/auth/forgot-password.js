import { getAppUrl } from "../../../lib/insforge/pages-api";
import { createInsForgeAdminClient } from "../../../lib/insforge/server";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const client = createInsForgeAdminClient();
  const appUrl = getAppUrl(req);
  const { error } = await client.auth.sendResetPasswordEmail({
    email,
    redirectTo: `${appUrl}/reset-password`,
  });

  if (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Failed to send reset email",
    });
  }

  return res.status(200).json({ ok: true });
}
