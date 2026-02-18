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

const ApplicationCard = ({ application, onAssignAdmin, onMarkComplete }) => {
    const handleAssign = () => {
        const adminId = prompt('Enter admin ID:');
        if (adminId) onAssignAdmin(application.id, adminId);
    };

    return (
        <div className="booking-item">
            <div className="booking-top">
                <div className="booking-number">#{application.id}</div>
                <div className={`status-badge ${getStatusClass(application.status)}`}>
                    {getStatusText(application.status)}
                </div>
            </div>

            <div className="booking-info">
                <div className="info-line">
                    <span className="info-key">Client</span>
                    <span className="info-value">{application.clientName}</span>
                </div>
                <div className="info-line">
                    <span className="info-key">Phone</span>
                    <span className="info-value">{application.phone}</span>
                </div>
                <div className="info-line">
                    <span className="info-key">Room</span>
                    <span className="info-value">{application.room}</span>
                </div>
                <div className="info-line">
                    <span className="info-key">Time</span>
                    <span className="info-value">
                        {new Date(application.time).toLocaleString('en-US')}
                    </span>
                </div>
                {application.adminId && (
                    <div className="info-line">
                        <span className="info-key">Admin</span>
                        <span className="info-value">{application.adminId}</span>
                    </div>
                )}
            </div>

            {(application.status === 'new' || application.status === 'assigned') && (
                <div className="booking-footer">
                    {application.status === 'new' && (
                        <button className="btn btn-primary" onClick={handleAssign}>
                            Assign Admin
                        </button>
                    )}
                    {application.status === 'assigned' && (
                        <button
                            className="btn btn-success"
                            onClick={() => onMarkComplete(application.id)}
                        >
                            Mark Complete
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ApplicationCard;
