import Head from "next/head";
import { useEffect, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export default function HomePage() {
  const [apiState, setApiState] = useState({
    loading: true,
    ok: false,
    message: "",
  });

  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/health`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        setApiState({
          loading: false,
          ok: true,
          message: data.message || "Backend is reachable",
        });
      } catch (error) {
        setApiState({
          loading: false,
          ok: false,
          message:
            "Backend unreachable. Start FastAPI on port 8000 and verify CORS.",
        });
      }
    };

    checkApi();
  }, []);

  return (
    <>
      <Head>
        <title>Agent Bora - Prototype Starter</title>
        <meta name="description" content="Prototype starter with Next.js and FastAPI" />
      </Head>

      <main className="page">
        <section className="hero-card">
          <p className="badge">Prototype Starter</p>
          <h1>Send an agent to the meeting.</h1>
          <p className="subtitle">
            Next.js frontend connected to FastAPI backend. This is a minimal base you can
            extend.
          </p>

          <div className="status">
            <span className={`dot ${apiState.ok ? "ok" : "bad"}`} />
            <p>
              {apiState.loading
                ? "Checking backend connection..."
                : apiState.message}
            </p>
          </div>

          <div className="actions">
            <a href="/dashboard" className="btn primary">
              Open dashboard
            </a>
            <a
              href={`${API_BASE_URL}/docs`}
              target="_blank"
              rel="noreferrer"
              className="btn secondary"
            >
              FastAPI docs
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
