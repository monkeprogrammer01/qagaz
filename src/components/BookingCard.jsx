import React from 'react';

const getStatusClass = (status) => {
    switch (status) {
        case 'new':       return 'status-new';
        case 'assigned':  return 'status-assigned';
        case 'completed': return 'status-completed';
        default:          return 'status-new';
    }
};

const getStatusText = (status) => {
    switch (status) {
        case 'new':       return 'New';
        case 'assigned':  return 'Assigned';
        case 'completed': return 'Completed';
        default:          return status;
    }
};

const BookingCard = ({ booking, onAssignAdmin, onMarkComplete }) => {
    const handleAssign = () => {
        const adminId = prompt('Enter admin ID:');
        if (adminId) onAssignAdmin(booking.id, adminId);
    };

    return (
        <div className="booking-item">
            <div className="booking-top">
                <div className="booking-number">#{booking.id}</div>
                <div className={`status-badge ${getStatusClass(booking.status)}`}>
                    {getStatusText(booking.status)}
                </div>
            </div>

            <div className="booking-info">
                <div className="info-line">
                    <span className="info-key">Client</span>
                    <span className="info-value">{booking.clientName}</span>
                </div>
                <div className="info-line">
                    <span className="info-key">Phone</span>
                    <span className="info-value">{booking.phone}</span>
                </div>
                <div className="info-line">
                    <span className="info-key">Room</span>
                    <span className="info-value">{booking.room}</span>
                </div>
                <div className="info-line">
                    <span className="info-key">Time</span>
                    <span className="info-value">
                        {new Date(booking.time).toLocaleString('en-US')}
                    </span>
                </div>
                {booking.adminId && (
                    <div className="info-line">
                        <span className="info-key">Admin</span>
                        <span className="info-value">{booking.adminId}</span>
                    </div>
                )}
            </div>

            {(booking.status === 'new' || booking.status === 'assigned') && (
                <div className="booking-footer">
                    {booking.status === 'new' && (
                        <button className="btn btn-primary" onClick={handleAssign}>
                            Assign Admin
                        </button>
                    )}
                    {booking.status === 'assigned' && (
                        <button
                            className="btn btn-success"
                            onClick={() => onMarkComplete(booking.id)}
                        >
                            Mark Complete
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default BookingCard;
