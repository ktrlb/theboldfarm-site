"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AdminPanel } from "@/components/admin-panel";
import { AdminAuth } from "@/components/admin-auth";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    if (typeof window !== 'undefined') {
      const authStatus = sessionStorage.getItem("adminAuthenticated");
      if (authStatus === "true") {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuthenticated");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="bg-gray-50 py-4 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-lg font-medium text-gray-900">Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded border border-gray-300 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </div>
      <AdminPanel onLogout={handleLogout} />
      <Footer />
    </div>
  );
}
