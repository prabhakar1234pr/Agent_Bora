import Head from "next/head";
import { useRequireAuth } from "../context/AuthContext";
import { DemoStoreProvider } from "../context/DemoStore";
import Workspace from "../components/workspace/Workspace";

export default function AppPage() {
  const { user, loading, signOut } = useRequireAuth();

  if (loading || !user) {
    return (
      <main className="page">
        <section className="hero-card">
          <p className="subtitle">Loading your workspace…</p>
        </section>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Agent Bora</title>
      </Head>
      <DemoStoreProvider user={user}>
        <Workspace onSignOut={() => void signOut()} />
      </DemoStoreProvider>
    </>
  );
}
