import React from 'react';

const Header = ({ admin, onLogout }) => {
    return (
        <header className="header">
            <div className="header-container">
                <div className="brand">BookingHub</div>
                <div className="header-actions">
                    <span className="user-info">{admin.identifier}</span>
                    <button className="logout-btn" onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
