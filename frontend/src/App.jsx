import React, { useEffect, useState } from "react";
import { getAdmin, setAdmin } from "../api/admin.js";

import Header from "./components/Header.jsx";
import SignIn from "./components/SignIn.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import ClientApplicationForm from "./components/ClientApplicationForm.jsx";

const App = () => {
  const [admin, setCurrentAdmin] = useState(null);

  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onChange = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onChange);
    return () => window.removeEventListener("popstate", onChange);
  }, []);

  const isAdminRoute = path.startsWith("/admin");

  useEffect(() => {
    const savedAdmin = getAdmin();
    if (savedAdmin) setCurrentAdmin(savedAdmin);
  }, []);

  const go = (to) => {
    window.history.pushState({}, "", to);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const handleSignIn = (adminData) => {
    setAdmin(adminData);
    setCurrentAdmin(adminData);
    go("/admin");
  };

  const handleLogout = () => {
    setAdmin(null);
    setCurrentAdmin(null);
    go("/"); 
  };

  if (!isAdminRoute) {
    return (
      <div className="app">
        <ClientApplicationForm />
      </div>
    );
  }

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