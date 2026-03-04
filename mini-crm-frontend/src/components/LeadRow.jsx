import { useState } from "react";

function LeadRow({ lead, fetchLeads }) {
  const [expanded, setExpanded] = useState(false);
  const [noteText, setNoteText] = useState("");

  const handleDelete = () => {
    fetch(`http://localhost:5000/api/leads/${lead._id}`, {
      method: "DELETE"
    }).then(() => fetchLeads());
  };

  const handleStatusChange = (status) => {
    fetch(`http://localhost:5000/api/leads/${lead._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    }).then(() => fetchLeads());
  };

  const handleAddFollowUp = () => {
    if (!noteText.trim()) return;

    fetch(`http://localhost:5000/api/leads/${lead._id}/followup`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: noteText })
    }).then(() => {
      setNoteText("");
      fetchLeads();
    });
  };

  return (
    <>
      <tr>
        <td>{lead.name}</td>
        <td>{lead.email}</td>
        <td>
          <select
            className="status-select"
            value={lead.status}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
          </select>
        </td>
        <td>
          <button
            className="btn-primary"
            onClick={() => setExpanded(!expanded)}
          >
            Notes
          </button>

          <button
            className="btn-danger"
            onClick={handleDelete}
            style={{ marginLeft: "10px" }}
          >
            Delete
          </button>
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan="4">
            <div className="notes-section">
              <h4>Follow Ups</h4>

              {lead.followUps.length === 0 ? (
                <p>No follow-ups yet.</p>
              ) : (
                <ul>
                  {lead.followUps.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              )}

              <div className="add-note">
                <input
                  className="input"
                  placeholder="Add note..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <button
                  className="btn-primary"
                  onClick={handleAddFollowUp}
                >
                  Add
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default LeadRow;