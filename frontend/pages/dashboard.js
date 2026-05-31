import { useEffect } from "react";
import { useRouter } from "next/router";

/* The dashboard now lives at /app (the full ported workspace).
   Keep /dashboard as a redirect so existing links/bookmarks still work. */
export default function DashboardRedirect() {
  const router = useRouter();
  useEffect(() => {
    void router.replace("/app");
  }, [router]);

  return (
    <main className="page">
      <section className="hero-card">
        <p className="subtitle">Redirecting to your workspace…</p>
      </section>
    </main>
  );
}
