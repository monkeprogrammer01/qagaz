import React, { useEffect, useMemo, useState } from "react";
import { getApplications, updateApplication } from "../../api/applications.js";
import { getAdmins } from "../../api/admin.js";
import ApplicationCard from "./BookingCard";
import AssignAdminModal from "./AssignAdminModal.jsx";

const STATUSES = ["new", "assigned", "completed"];

const AdminPanel = () => {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [assignForId, setAssignForId] = useState(null);

  const [admins, setAdmins] = useState([]);
  const [adminsLoading, setAdminsLoading] = useState(false);

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
    if (filter === "all") return applications;
    return applications.filter((a) => a.status === filter);
  }, [applications, filter]);

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