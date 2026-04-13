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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-slate-800 rounded-xl">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">CaseWise</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-slate-800 text-slate-800"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
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
                <h1 className="text-2xl font-bold text-slate-800">
                  Case Registration
                </h1>
                <p className="text-slate-500 mt-1">
                  Search existing cases or register a new one
                </p>
              </div>
              <button
                onClick={() => setShowRegistrationModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Register New Case
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, case number, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent text-slate-800 placeholder:text-slate-400"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <div className="flex gap-2">
                    {(["all", "Open", "Pending", "Closed"] as StatusFilter[]).map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() => setStatusFilter(status)}
                          className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                            statusFilter === status
                              ? "bg-slate-800 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
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
                  className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 text-slate-700 bg-white"
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
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-slate-500">
              Showing {filteredCases.length} of {cases.length} cases
            </div>

            {/* Case Table */}
            {isLoading ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <RefreshCw className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-4" />
                <p className="text-slate-500">Loading cases...</p>
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
                <h1 className="text-2xl font-bold text-slate-800">My Cases</h1>
                <p className="text-slate-500 mt-1">
                  Cases you have registered or been assigned to
                </p>
              </div>
            </div>

            {myCases.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                  <FolderOpen className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-800 mb-2">
                  No cases yet
                </h3>
                <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                  You have not registered any cases. Start by registering a new
                  case.
                </p>
                <button
                  onClick={() => setActiveTab("registration")}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
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
              <h1 className="text-2xl font-bold text-slate-800">Laws Reference</h1>
              <p className="text-slate-500 mt-1">
                Legal reference materials and documentation
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                <BookOpen className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">
                Coming Soon
              </h3>
              <p className="text-slate-500 max-w-sm mx-auto">
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
