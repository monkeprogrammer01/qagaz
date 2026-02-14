import React, { useState, useEffect } from 'react';
import { getBookings, saveBookings } from '../utils/storage';
import BookingCard from './BookingCard';

const FILTERS = ['all', 'new', 'assigned', 'completed'];

const AdminPanel = () => {
    const [bookings, setBookings] = useState([]);
    const [filter, setFilter]     = useState('all');

    useEffect(() => {
        setBookings(getBookings());
    }, []);

    const updateBookings = (updated) => {
        saveBookings(updated);
        setBookings(updated);
    };

    const handleAssignAdmin = (id, adminId) => {
        if (!adminId || !adminId.trim()) return;
        const updated = bookings.map(b =>
            b.id === id ? { ...b, adminId, status: 'assigned' } : b
        );
        updateBookings(updated);
        alert('Admin assigned successfully!');
    };

    const handleMarkComplete = (id) => {
        const updated = bookings.map(b =>
            b.id === id ? { ...b, status: 'completed' } : b
        );
        updateBookings(updated);
    };

    const filtered = filter === 'all'
        ? bookings
        : bookings.filter(b => b.status === filter);

    const countByStatus = (status) => bookings.filter(b => b.status === status).length;

    return (
        <div>
            <div className="panel-header">
                <h1 className="panel-title">Booking Management</h1>
                <div className="tabs">
                    <button
                        className={`tab ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All ({bookings.length})
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
                    <div className="empty-state">No bookings found</div>
                ) : (
                    filtered.map(booking => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
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
