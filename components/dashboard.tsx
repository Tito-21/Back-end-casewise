"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Scale,
  Search,
  Plus,
  FileText,
  FolderOpen,
  BookOpen,
  LogOut,
  Filter,
  RefreshCw,
} from "lucide-react";
import { CaseResponse, TabType, StatusFilter } from "@/lib/types";
import { getCases, removeAuthToken } from "@/lib/api";
import CaseTable from "./case-table";
import CaseRegistrationModal from "./case-registration-modal";
import CaseDetailsModal from "./case-details-modal";

interface DashboardProps {
  onLogout: () => void;
}

const CRIME_CATEGORIES = [
  "All Categories",
  "Criminal Case",
  "Civil Case",
  "Family Case",
  "Traffic Violation",
  "Corporate Case",
];

export default function Dashboard({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("registration");
  const [cases, setCases] = useState<CaseResponse[]>([]);
  const [myCases, setMyCases] = useState<CaseResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseResponse | null>(null);

  const fetchCases = async () => {
    setIsLoading(true);
    try {
      const response = await getCases();
      if (response.success && response.data) {
        setCases(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch cases:", error);
      if ((error as Error).message === "Session expired") {
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleLogout = () => {
    removeAuthToken();
    onLogout();
  };

  const handleCaseRegistered = (newCase: CaseResponse) => {
    setCases((prev) => [newCase, ...prev]);
    setMyCases((prev) => [newCase, ...prev]);
    setShowRegistrationModal(false);
  };

  const filteredCases = useMemo(() => {
    let result = cases;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.firstName?.toLowerCase().includes(query) ||
          c.lastName?.toLowerCase().includes(query) ||
          c.caseNumber?.toLowerCase().includes(query) ||
          c.description?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(
        (c) => c.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (categoryFilter !== "All Categories") {
      result = result.filter((c) =>
        c.crimes?.some((crime) =>
          crime.toLowerCase().includes(categoryFilter.toLowerCase())
        )
      );
    }

    return result;
  }, [cases, searchQuery, statusFilter, categoryFilter]);

  const tabs = [
    { id: "registration" as const, label: "Case Registration", icon: FileText },
    { id: "my-cases" as const, label: "My Cases", icon: FolderOpen },
    { id: "laws" as const, label: "Laws", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8fafc" }}>
      {/* Header */}
      <header 
        className="sticky top-0 z-40"
        style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div 
                className="flex items-center justify-center w-10 h-10 rounded-xl"
                style={{ backgroundColor: "#1e293b" }}
              >
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold" style={{ color: "#1e293b" }}>CaseWise</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer"
              style={{ color: "#475569" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f1f5f9";
                e.currentTarget.style.color = "#1e293b";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#475569";
              }}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 py-4 text-sm font-medium transition-colors cursor-pointer"
                style={{
                  borderBottom: activeTab === tab.id ? "2px solid #1e293b" : "2px solid transparent",
                  color: activeTab === tab.id ? "#1e293b" : "#64748b",
                  marginBottom: "-1px",
                }}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "registration" && (
          <div className="space-y-6">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold" style={{ color: "#1e293b" }}>
                  Case Registration
                </h1>
                <p className="mt-1" style={{ color: "#64748b" }}>
                  Search existing cases or register a new one
                </p>
              </div>
              <button
                onClick={() => setShowRegistrationModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 font-medium rounded-lg transition-colors cursor-pointer"
                style={{ 
                  backgroundColor: "#1e293b", 
                  color: "#ffffff",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#334155"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#1e293b"}
              >
                <Plus className="w-4 h-4" />
                Register New Case
              </button>
            </div>

            {/* Filters */}
            <div 
              className="rounded-xl p-4"
              style={{ 
                backgroundColor: "#ffffff", 
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
              }}
            >
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search 
                    className="absolute left-3 top-1/2 w-5 h-5" 
                    style={{ transform: "translateY(-50%)", color: "#9ca3af" }}
                  />
                  <input
                    type="text"
                    placeholder="Search by name, case number, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg outline-none"
                    style={{ border: "1px solid #d1d5db", color: "#1e293b" }}
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

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" style={{ color: "#9ca3af" }} />
                  <div className="flex gap-2">
                    {(["all", "Open", "Pending", "Closed"] as StatusFilter[]).map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() => setStatusFilter(status)}
                          className="px-3 py-1.5 text-sm font-medium rounded-full transition-colors cursor-pointer"
                          style={{
                            backgroundColor: statusFilter === status ? "#1e293b" : "#f1f5f9",
                            color: statusFilter === status ? "#ffffff" : "#475569",
                          }}
                        >
                          {status === "all" ? "All" : status}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-lg outline-none cursor-pointer"
                  style={{ 
                    border: "1px solid #d1d5db", 
                    color: "#374151",
                    backgroundColor: "#ffffff"
                  }}
                >
                  {CRIME_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                {/* Refresh */}
                <button
                  onClick={fetchCases}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                  style={{ border: "1px solid #d1d5db", color: "#374151" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm" style={{ color: "#64748b" }}>
              Showing {filteredCases.length} of {cases.length} cases
            </div>

            {/* Case Table */}
            {isLoading ? (
              <div 
                className="rounded-xl p-12 text-center"
                style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
              >
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: "#9ca3af" }} />
                <p style={{ color: "#64748b" }}>Loading cases...</p>
              </div>
            ) : (
              <CaseTable
                cases={filteredCases}
                onViewCase={setSelectedCase}
                emptyMessage="No cases match your search criteria"
              />
            )}
          </div>
        )}

        {activeTab === "my-cases" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold" style={{ color: "#1e293b" }}>My Cases</h1>
                <p className="mt-1" style={{ color: "#64748b" }}>
                  Cases you have registered or been assigned to
                </p>
              </div>
            </div>

            {myCases.length === 0 ? (
              <div 
                className="rounded-xl p-12 text-center"
                style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
              >
                <div 
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                  style={{ backgroundColor: "#f1f5f9" }}
                >
                  <FolderOpen className="w-8 h-8" style={{ color: "#9ca3af" }} />
                </div>
                <h3 className="text-lg font-medium mb-2" style={{ color: "#1e293b" }}>
                  No cases yet
                </h3>
                <p className="mb-6 max-w-sm mx-auto" style={{ color: "#64748b" }}>
                  You have not registered any cases. Start by registering a new case.
                </p>
                <button
                  onClick={() => setActiveTab("registration")}
                  className="inline-flex items-center gap-2 px-4 py-2.5 font-medium rounded-lg transition-colors cursor-pointer"
                  style={{ backgroundColor: "#1e293b", color: "#ffffff" }}
                >
                  Go to Case Registration
                </button>
              </div>
            ) : (
              <CaseTable
                cases={myCases}
                onViewCase={setSelectedCase}
                emptyMessage="No cases found"
              />
            )}
          </div>
        )}

        {activeTab === "laws" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "#1e293b" }}>Laws Reference</h1>
              <p className="mt-1" style={{ color: "#64748b" }}>
                Legal reference materials and documentation
              </p>
            </div>
            <div 
              className="rounded-xl p-12 text-center"
              style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
            >
              <div 
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{ backgroundColor: "#f1f5f9" }}
              >
                <BookOpen className="w-8 h-8" style={{ color: "#9ca3af" }} />
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: "#1e293b" }}>
                Coming Soon
              </h3>
              <p className="max-w-sm mx-auto" style={{ color: "#64748b" }}>
                The laws reference section is under development. Check back later
                for legal documentation and resources.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {showRegistrationModal && (
        <CaseRegistrationModal
          onClose={() => setShowRegistrationModal(false)}
          onCaseRegistered={handleCaseRegistered}
        />
      )}

      {selectedCase && (
        <CaseDetailsModal
          caseData={selectedCase}
          onClose={() => setSelectedCase(null)}
        />
      )}
    </div>
  );
}
