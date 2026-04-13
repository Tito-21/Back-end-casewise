"use client";

import { useState, useEffect } from "react";
import Login from "@/components/login";
import Dashboard from "@/components/dashboard";
import { getAuthToken, validateToken, removeAuthToken } from "@/lib/api";
import { Scale, Loader2 } from "lucide-react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      
      if (token) {
        // Validate the token with the backend
        const isValid = await validateToken();
        
        if (isValid) {
          setIsAuthenticated(true);
        } else {
          removeAuthToken();
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-2xl mb-4">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading CaseWise...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}
