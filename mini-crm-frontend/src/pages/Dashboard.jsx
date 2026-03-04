import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import AddLeadForm from "../components/AddLeadForm";
import LeadStats from "../components/LeadStats";
import LeadTable from "../components/LeadTable";
import "../App.css";

function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = () => {
    fetch("http://localhost:5000/api/leads")
      .then(res => res.json())
      .then(data => {
        setLeads(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div className="app">
      <Sidebar />

      <div className="main">
        <AddLeadForm fetchLeads={fetchLeads} />
        <LeadStats leads={leads} />
        <LeadTable
          leads={leads}
          loading={loading}
          fetchLeads={fetchLeads}
        />
      </div>
    </div>
  );
}

export default Dashboard;