import { useState } from "react";

function AddLeadForm({ fetchLeads }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("website");

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        source,
        status: "new"
      })
    })
      .then(res => res.json())
      .then(() => {
        setName("");
        setEmail("");
        setSource("website");
        fetchLeads();
      });
  };

  return (
    <div className="card">
      <h3>Add New Lead</h3>

      <form onSubmit={handleSubmit} className="form-row">
        <input
          className="input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <select
          className="input"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        >
          <option value="website">Website</option>
          <option value="linkedin">LinkedIn</option>
          <option value="referral">Referral</option>
        </select>

        <button className="btn-primary">Add</button>
      </form>
    </div>
  );
}

export default AddLeadForm;