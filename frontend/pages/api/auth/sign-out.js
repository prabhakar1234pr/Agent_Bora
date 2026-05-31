import { clearAuthCookies } from "../../../lib/insforge/auth-cookies";
import { createCookieWriter } from "../../../lib/insforge/pages-api";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { writer, apply } = createCookieWriter(res);
  clearAuthCookies(writer);
  apply();

  return res.status(200).json({ ok: true });
}
