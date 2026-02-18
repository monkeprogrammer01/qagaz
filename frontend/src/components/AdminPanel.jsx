import React, { useState, useEffect } from 'react';
import { getApplications, updateApplication } from '../../api/applications.js';
import ApplicationCard from './BookingCard';

const AdminPanel = () => {
    const [applications, setApplications] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            setLoading(true);
            const data = await getApplications();
            setApplications(data);
            setError(null);
        } catch (err) {
            console.error('Failed to load applications:', err);
            setError('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const handleAssignAdmin = async (id, adminId) => {
        if (!adminId || !adminId.trim()) return;
        
        try {
            // Обновить в БД
            await updateApplication(id, { 
                adminId, 
                status: 'assigned' 
            });
            
            // Обновить локальный state
            setApplications(prev => 
                prev.map(app => 
                    app.id === id 
                        ? { ...app, adminId, status: 'assigned' } 
                        : app
                )
            );
            
            alert('Admin assigned successfully!');
        } catch (err) {
            console.error('Failed to assign admin:', err);
            alert('Failed to assign admin');
        }
    };

    const handleMarkComplete = async (id) => {
        try {
            // Обновить в БД
            await updateApplication(id, { status: 'completed' });
            
            // Обновить локальный state
            setApplications(prev => 
                prev.map(app => 
                    app.id === id 
                        ? { ...app, status: 'completed' } 
                        : app
                )
            );
        } catch (err) {
            console.error('Failed to mark complete:', err);
            alert('Failed to update status');
        }
    };

    const filtered = filter === 'all'
        ? applications
        : applications.filter(app => app.status === filter);

    const countByStatus = (status) => 
        applications.filter(app => app.status === status).length;

    if (loading) {
        return <div className="loading">Loading applications...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div>
            <div className="panel-header">
                <h1 className="panel-title">Application Management</h1>
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