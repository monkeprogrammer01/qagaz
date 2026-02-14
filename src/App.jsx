import React, { useState, useEffect } from 'react';
import { getUser, setUser } from '../utils/storage';
import Header from './Header';
import SignIn from './SignIn';
import AdminPanel from './AdminPanel';

const App = () => {
    const [user, setCurrentUser] = useState(null);

    useEffect(() => {
        const savedUser = getUser();
        if (savedUser) {
            setCurrentUser(savedUser);
        }
    }, []);

    const handleSignIn = (userData) => {
        setCurrentUser(userData);
    };

    const handleLogout = () => {
        setUser(null);
        setCurrentUser(null);
    };

    if (!user) {
        return (
            <div className="app">
                <SignIn onSignIn={handleSignIn} />
            </div>
        );
    }

    return (
        <div className="app">
            <Header user={user} onLogout={handleLogout} />
            <main className="main-content">
                <AdminPanel />
            </main>
        </div>
    );
};

export default App;
