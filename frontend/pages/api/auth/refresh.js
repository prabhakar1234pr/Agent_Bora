import { refreshAuth } from "../../../lib/insforge/auth-cookies";
import { createRequestFromReq, sendWebResponse } from "../../../lib/insforge/pages-api";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const request = createRequestFromReq(req);
  const { response } = await refreshAuth({ request });
  await sendWebResponse(res, response);
}
