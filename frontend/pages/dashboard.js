export default function DashboardPage() {
  const cards = [
    { title: "Agents", value: "0", helper: "Create your first agent" },
    { title: "Meetings", value: "0", helper: "No meetings yet" },
    { title: "Open actions", value: "0", helper: "No action items yet" },
  ];

  return (
    <main className="page">
      <section className="hero-card">
        <p className="badge">Dashboard</p>
        <h1>Basic prototype structure</h1>
        <p className="subtitle">
          This mirrors your prototype direction with a simple layout you can build on.
        </p>
      </section>

      <section className="grid">
        {cards.map((card) => (
          <article key={card.title} className="stat-card">
            <p className="label">{card.title}</p>
            <p className="value">{card.value}</p>
            <p className="helper">{card.helper}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
