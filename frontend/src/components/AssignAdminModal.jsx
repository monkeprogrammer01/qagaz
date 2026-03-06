import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";

const AssignAdminModal = ({ open, admins, loading, onClose, onSelect }) => {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return admins;
    return admins.filter(
      (a) =>
        a.email.toLowerCase().includes(s) ||
        (a.name || "").toLowerCase().includes(s)
    );
  }, [admins, q]);

  if (!open) return null;

  const modal = (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Assign admin</div>
            <div className="modal-subtitle">Choose an admin from the list</div>
          </div>

          <button className="btn btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        <input
          className="input-field"
          placeholder="Search by email or name..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <div className="modal-list">
          {loading ? (
            <div className="modal-loading">Loading admins...</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">No admins found</div>
          ) : (
            filtered.map((a) => (
              <button
                key={a.id}
                className="modal-list-item"
                onClick={() => onSelect(a)}
              >
                <div className="admin-email">{a.email}</div>
                <div className="admin-name">{a.name}</div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default AssignAdminModal;
