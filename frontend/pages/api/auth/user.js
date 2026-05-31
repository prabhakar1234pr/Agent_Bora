import { createInsForgeServerClient } from "../../../lib/insforge/pages-api";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = createInsForgeServerClient(req);
    const { data, error } = await client.auth.getCurrentUser();

    if (error || !data?.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    return res.status(200).json({ user: data.user });
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
