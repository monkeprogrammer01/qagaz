import React, { useEffect, useState } from "react";
import { getAdmin, setAdmin } from "../api/admin.js";

import Header from "./components/Header.jsx";
import SignIn from "./components/SignIn.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import ClientApplicationForm from "./components/ClientApplicationForm.jsx";

const App = () => {
  const [admin, setCurrentAdmin] = useState(null);

  // простая маршрутизация без react-router
  const isAdminRoute = window.location.pathname.startsWith("/admin");

  useEffect(() => {
    const savedAdmin = getAdmin();
    if (savedAdmin) setCurrentAdmin(savedAdmin);
  }, []);

  const handleSignIn = (adminData) => {
    setCurrentAdmin(adminData);
    // после логина кидаем в админку
    window.history.pushState({}, "", "/admin");
  };

  const handleLogout = () => {
    setAdmin(null);
    setCurrentAdmin(null);
    window.history.pushState({}, "", "/"); // обратно на клиентскую страницу
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