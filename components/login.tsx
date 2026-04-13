"use client";

import { useState } from "react";
import { Scale, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import { login, setAuthToken } from "@/lib/api";

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await login({ email, password });
      
      if (response.success && response.data?.token) {
        setAuthToken(response.data.token);
        onLoginSuccess();
      } else {
        setError(response.message || "Invalid email or password");
      }
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" }}
    >
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ backgroundColor: "#1e293b", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)" }}
          >
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "#1e293b" }}>
            CaseWise
          </h1>
          <p className="mt-2" style={{ color: "#64748b" }}>
            Legal Case Management System
          </p>
        </div>

        {/* Login Card */}
        <div 
          className="rounded-2xl p-8"
          style={{ 
            backgroundColor: "#ffffff", 
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
            border: "1px solid #e2e8f0"
          }}
        >
          <div className="mb-6">
            <h2 className="text-xl font-semibold" style={{ color: "#1e293b" }}>
              Welcome back
            </h2>
            <p className="text-sm mt-1" style={{ color: "#64748b" }}>
              Sign in to access your dashboard
            </p>
          </div>

          {error && (
            <div 
              className="mb-4 p-3 rounded-lg flex items-center gap-2 text-sm"
              style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626" }}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium mb-1.5"
                style={{ color: "#374151" }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail 
                  className="absolute left-3 top-1/2 w-5 h-5" 
                  style={{ transform: "translateY(-50%)", color: "#9ca3af" }}
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg transition-all outline-none"
                  style={{ 
                    border: "1px solid #d1d5db",
                    color: "#1e293b",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#1e293b";
                    e.target.style.boxShadow = "0 0 0 3px rgba(30,41,59,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#d1d5db";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium mb-1.5"
                style={{ color: "#374151" }}
              >
                Password
              </label>
              <div className="relative">
                <Lock 
                  className="absolute left-3 top-1/2 w-5 h-5" 
                  style={{ transform: "translateY(-50%)", color: "#9ca3af" }}
                />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg transition-all outline-none"
                  style={{ 
                    border: "1px solid #d1d5db",
                    color: "#1e293b",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#1e293b";
                    e.target.style.boxShadow = "0 0 0 3px rgba(30,41,59,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#d1d5db";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full font-medium py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: "#1e293b", 
                color: "#ffffff",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) e.currentTarget.style.backgroundColor = "#334155";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#1e293b";
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 text-center" style={{ borderTop: "1px solid #f1f5f9" }}>
            <p className="text-sm" style={{ color: "#64748b" }}>
              Need an account? Contact your administrator
            </p>
          </div>
        </div>

        <p className="text-center text-sm mt-6" style={{ color: "#94a3b8" }}>
          Secure legal case management
        </p>
      </div>
    </div>
  );
}
