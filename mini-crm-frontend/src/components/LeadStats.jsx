function LeadStats({ leads }) {
  const total = leads.length;
  const newLeads = leads.filter(l => l.status === "new").length;
  const contacted = leads.filter(l => l.status === "contacted").length;
  const converted = leads.filter(l => l.status === "converted").length;

  return (
    <div className="card">
      <div className="stats">

        <div className="stat-card total">
          <p className="stat-label">Total</p>
          <h2 className="stat-number">{total}</h2>
        </div>

        <div className="stat-card new">
          <p className="stat-label">New</p>
          <h2 className="stat-number">{newLeads}</h2>
        </div>

        <div className="stat-card contacted">
          <p className="stat-label">Contacted</p>
          <h2 className="stat-number">{contacted}</h2>
        </div>

        <div className="stat-card converted">
          <p className="stat-label">Converted</p>
          <h2 className="stat-number">{converted}</h2>
        </div>

      </div>
    </div>
  );
}

export default LeadStats;