function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Mini CRM</h2>
      <p>Dashboard</p>
      <p>Leads</p>
      <button
        className="btn-danger"
        onClick={() => {
          localStorage.removeItem("auth");
          window.location.reload();
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Sidebar;