import React, { useEffect, useMemo, useState } from "react";
import { getApplications, updateApplication } from "../../api/applications.js";
import { getAdmins, getAdmin } from "../../api/admin.js";
import ApplicationCard from "./BookingCard";
import AssignAdminModal from "./AssignAdminModal.jsx";

const STATUSES = ["new", "assigned", "completed"];

const normalize = (s) => String(s || "").toLowerCase();

const parseDate = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfToday = () => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
};

// Неделя: Пн–Вс (можешь поменять на Вс–Сб если хочешь)
const startOfThisWeek = () => {
  const d = new Date();
  const day = d.getDay(); // 0=Sun..6=Sat
  const diffToMonday = (day + 6) % 7; // Mon=0
  d.setDate(d.getDate() - diffToMonday);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfThisWeek = () => {
  const d = startOfThisWeek();
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
};

const AdminPanel = () => {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [assignForId, setAssignForId] = useState(null);

  // admins list state
  const [admins, setAdmins] = useState([]);
  const [adminsLoading, setAdminsLoading] = useState(false);

  // extra filters
  const currentAdmin = getAdmin();
  const [onlyMine, setOnlyMine] = useState(false);
  const [q, setQ] = useState("");
  const [datePreset, setDatePreset] = useState("all"); // all | today | week

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getApplications();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load applications:", err);
      setError(err?.response?.data?.error || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const countByStatus = (status) =>
    applications.reduce((acc, a) => (a.status === status ? acc + 1 : acc), 0);

  const filtered = useMemo(() => {
    let list = [...applications];

    // status filter
    if (filter !== "all") list = list.filter((a) => a.status === filter);

    // my applications
    if (onlyMine) {
      const myEmail = currentAdmin?.email;
      list = list.filter((a) => (a.admin?.email || "") === myEmail);
    }

    // search
    const s = normalize(q).trim();
    if (s) {
      list = list.filter((a) => {
        const hay = [
          a.clientName,
          a.phone,
          a.room,
          a.admin?.email,
          a.admin?.name,
        ]
          .map(normalize)
          .join(" ");
        return hay.includes(s);
      });
    }

    // date preset filter (use time if exists else createdAt)
    let from = null;
    let to = null;
    if (datePreset === "today") {
      from = startOfToday();
      to = endOfToday();
    } else if (datePreset === "week") {
      from = startOfThisWeek();
      to = endOfThisWeek();
    }

    if (from && to) {
      list = list.filter((a) => {
        const d = parseDate(a.time || a.createdAt);
        if (!d) return false;
        return d >= from && d <= to;
      });
    }

    // sort by time/createdAt desc
    list.sort((a, b) => {
      const da = parseDate(a.time || a.createdAt)?.getTime() ?? 0;
      const db = parseDate(b.time || b.createdAt)?.getTime() ?? 0;
      return db - da;
    });

    return list;
  }, [applications, filter, onlyMine, q, datePreset, currentAdmin]);

  const openAssignModal = async (applicationId) => {
    try {
      setAssignForId(applicationId);
      setModalOpen(true);

      if (admins.length === 0) {
        setAdminsLoading(true);
        const list = await getAdmins();
        setAdmins(list);
        setAdminsLoading(false);
      }
    } catch (e) {
      console.error(e);
      setAdminsLoading(false);
      setModalOpen(false);
      setAssignForId(null);
      alert(e?.response?.data?.error || "Failed to load admins");
    }
  };

  const closeAssignModal = () => {
    setModalOpen(false);
    setAssignForId(null);
  };

  const handleSelectAdmin = async (admin) => {
    try {
      const updated = await updateApplication(assignForId, {
        adminEmail: admin.email,
        status: "assigned",
      });

      setApplications((prev) =>
        prev.map((a) => (a.id === assignForId ? updated : a))
      );

      closeAssignModal();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.error || "Failed to assign admin");
    }
  };

  const handleMarkComplete = async (id) => {
    try {
      const updated = await updateApplication(id, { status: "completed" });
      setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.error || "Failed to update status");
    }
  };

  if (loading) return <div className="loading">Loading applications...</div>;

  if (error) {
    return (
      <div className="error">
        {error}{" "}
        <button className="btn btn-primary" onClick={loadApplications}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <AssignAdminModal
        open={modalOpen}
        admins={admins}
        loading={adminsLoading}
        onClose={closeAssignModal}
        onSelect={handleSelectAdmin}
      />

      <div className="panel-header">
        <h1 className="panel-title">Application Management</h1>

        <div className="tabs">
          <button
            className={`tab ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({applications.length})
          </button>

          {STATUSES.map((status) => (
            <button
              key={status}
              className={`tab ${filter === status ? "active" : ""}`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} (
              {countByStatus(status)})
            </button>
          ))}
        </div>

        {/* extra filters (без ugly date inputs) */}
        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              className="input-field"
              style={{ maxWidth: 320 }}
              placeholder="Search: name / phone / room"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />

            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={onlyMine}
                onChange={(e) => setOnlyMine(e.target.checked)}
              />
              My applications
            </label>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              className={`tab ${datePreset === "all" ? "active" : ""}`}
              onClick={() => setDatePreset("all")}
            >
              All time
            </button>
            <button
              type="button"
              className={`tab ${datePreset === "today" ? "active" : ""}`}
              onClick={() => setDatePreset("today")}
            >
              Today
            </button>
            <button
              type="button"
              className={`tab ${datePreset === "week" ? "active" : ""}`}
              onClick={() => setDatePreset("week")}
            >
              This week
            </button>

            <button
              className="logout-btn"
              type="button"
              onClick={() => {
                setQ("");
                setOnlyMine(false);
                setDatePreset("all");
                setFilter("all");
              }}
            >
              Reset filters
            </button>
          </div>
        </div>
      </div>

      <div className="bookings-container">
        {filtered.length === 0 ? (
          <div className="empty-state">No applications found</div>
        ) : (
          filtered.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onAssignAdmin={() => openAssignModal(application.id)}
              onMarkComplete={() => handleMarkComplete(application.id)}
            />
          ))
        )}
      </div>
    </>
  );
};

export default AdminPanel;