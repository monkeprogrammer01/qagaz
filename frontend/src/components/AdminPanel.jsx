import React, { useState, useEffect } from 'react';
import { getApplications, saveApplications } from '../utils/storage';
import ApplicationCard from './BookingCard';

const FILTERS = ['all', 'new', 'assigned', 'completed'];

const AdminPanel = () => {
    const [applications, setApplications] = useState([]);
    const [filter, setFilter]     = useState('all');

    useEffect(() => {
        setApplications(getApplications());
    }, []);

    const updateApplications = (updated) => {
        saveApplications(updated);
        setApplications(updated);
    };

    const handleAssignAdmin = (id, adminId) => {
        if (!adminId || !adminId.trim()) return;
        const updated = applications.map(b =>
            b.id === id ? { ...b, adminId, status: 'assigned' } : b
        );
        updateApplications(updated);
        alert('Admin assigned successfully!');
    };

    const handleMarkComplete = (id) => {
        const updated = applications.map(b =>
            a.id === id ? { ...a, status: 'completed' } : b
        );
        updateApplications(updated);
    };

    const filtered = filter === 'all'
        ? applications
        : applications.filter(b => b.status === filter);

    const countByStatus = (status) => applications.filter(b => b.status === status).length;

    return (
        <div>
            <div className="panel-header">
                <h1 className="panel-title">Booking Management</h1>
                <div className="tabs">
                    <button
                        className={`tab ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All ({applications.length})
                    </button>
                    {['new', 'assigned', 'completed'].map(status => (
                        <button
                            key={status}
                            className={`tab ${filter === status ? 'active' : ''}`}
                            onClick={() => setFilter(status)}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)} ({countByStatus(status)})
                        </button>
                    ))}
                </div>
            </div>

            <div className="bookings-container">
                {filtered.length === 0 ? (
                    <div className="empty-state">No applications found</div>
                ) : (
                    filtered.map(application => (
                        <ApplicationCard
                            key={application.id}
                            application={application}
                            onAssignAdmin={handleAssignAdmin}
                            onMarkComplete={handleMarkComplete}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
