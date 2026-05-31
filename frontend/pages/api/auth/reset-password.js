import { createInsForgeAdminClient } from "../../../lib/insforge/server";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, code, newPassword } = req.body || {};
  if (!email || !code || !newPassword) {
    return res.status(400).json({
      message: "Email, verification code, and new password are required",
    });
  }

  const client = createInsForgeAdminClient();
  const { data: tokenData, error: tokenError } =
    await client.auth.exchangeResetPasswordToken({ email, code });

  if (tokenError || !tokenData?.token) {
    return res.status(tokenError?.statusCode || 400).json({
      message: tokenError?.message || "Invalid or expired code",
    });
  }

  const { error } = await client.auth.resetPassword({
    newPassword,
    otp: tokenData.token,
  });

  if (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Failed to reset password",
    });
  }

  return res.status(200).json({ ok: true });
}
