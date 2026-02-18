import React, { useState, useEffect } from 'react';
import { getAdmin, setAdmin } from '../api/applications.js';
import Header from './components/Header.jsx';
import SignIn from './components/SignIn.jsx';
import AdminPanel from './components/AdminPanel.jsx';

const App = () => {
    const [admin, setCurrentAdmin] = useState(null);

    useEffect(() => {
        const savedAdmin = getAdmin();
        if (savedAdmin) {
            setCurrentAdmin(savedAdmin);
        }
    }, []);

    const handleSignIn = (adminData) => {
        setCurrentAdmin(adminData);
    };

    const handleLogout = () => {
        setAdmin(null);
        setCurrentAdmin(null);
    };

    if (!admin) {
        return (
            <div className="app">
                <SignIn onSignIn={handleSignIn} />
            </div>
        );
    }

    return (
        <div className="app">
            <Header admin={admin} onLogout={handleLogout} />
            <main className="main-content">
                <AdminPanel />
            </main>
        </div>
    );
};

export default App;
