import { createServerClient } from "@insforge/sdk/ssr";

export function createInsForgeServerClient(req) {
  return createServerClient({
    cookies: {
      get: (name) => req.cookies?.[name],
    },
  });
}

export function getAppUrl(req) {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    `${req.headers["x-forwarded-proto"] || "http"}://${req.headers.host}`
  );
}

export function createRequestFromReq(req, pathname = "/api/auth/refresh") {
  const appUrl = getAppUrl(req);
  const url = new URL(pathname, appUrl);
  return new Request(url.toString(), {
    method: req.method,
    headers: {
      cookie: req.headers.cookie || "",
    },
  });
}

export async function sendWebResponse(res, webResponse) {
  res.status(webResponse.status);

  const setCookies =
    typeof webResponse.headers.getSetCookie === "function"
      ? webResponse.headers.getSetCookie()
      : webResponse.headers.get("set-cookie")
        ? [webResponse.headers.get("set-cookie")]
        : [];

  if (setCookies.length) {
    res.setHeader("Set-Cookie", setCookies);
  }

  webResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") return;
    res.setHeader(key, value);
  });

  const body = await webResponse.text();
  if (body) {
    res.send(body);
    return;
  }

  res.end();
}

export function createCookieWriter(res) {
  const cookies = [];

  return {
    writer: {
      set(name, value, options = {}) {
        const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`];
        if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);
        if (options.path) parts.push(`Path=${options.path}`);
        if (options.expires) parts.push(`Expires=${options.expires.toUTCString()}`);
        if (options.httpOnly) parts.push("HttpOnly");
        if (options.secure) parts.push("Secure");
        if (options.sameSite) {
          const sameSite =
            options.sameSite.charAt(0).toUpperCase() + options.sameSite.slice(1);
          parts.push(`SameSite=${sameSite}`);
        }
        cookies.push(parts.join("; "));
      },
    },
    apply() {
      if (cookies.length) {
        res.setHeader("Set-Cookie", cookies);
      }
    },
  };
}
