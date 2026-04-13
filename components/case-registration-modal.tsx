"use client";

import { useState } from "react";
import { X, Plus, ChevronDown, ChevronUp, User, Loader2, AlertCircle } from "lucide-react";
import { CaseParty, CaseRequest, CaseResponse } from "@/lib/types";
import { createCase } from "@/lib/api";

interface CaseRegistrationModalProps {
  onClose: () => void;
  onCaseRegistered: (caseData: CaseResponse) => void;
}

const CRIME_CATEGORIES = [
  "Criminal Case",
  "Civil Case",
  "Family Case",
  "Traffic Violation",
  "Corporate Case",
];

const GENDERS = ["Male", "Female", "Other"];
const ROLES = ["Witness", "Suspect", "Defendant", "Plaintiff", "Victim"];

const inputStyle = {
  width: "100%",
  padding: "0.625rem 1rem",
  border: "1px solid #d1d5db",
  borderRadius: "0.5rem",
  color: "#1e293b",
  backgroundColor: "#ffffff",
  outline: "none",
};

export default function CaseRegistrationModal({
  onClose,
  onCaseRegistered,
}: CaseRegistrationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [expandedPartyIndex, setExpandedPartyIndex] = useState<number | null>(null);

  const [caseTitle, setCaseTitle] = useState("");
  const [courtName, setCourtName] = useState("");
  const [caseSummary, setCaseSummary] = useState("");
  const [crimeCategory, setCrimeCategory] = useState("");
  const [crimeType, setCrimeType] = useState("");
  const [crimeDescription, setCrimeDescription] = useState("");
  const [crimeCommittedDate, setCrimeCommittedDate] = useState("");
  const [crimeCommittedTime, setCrimeCommittedTime] = useState("");

  const [parties, setParties] = useState<CaseParty[]>([]);
  const [newParty, setNewParty] = useState<CaseParty>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    email: "",
    role: "",
  });

  const addParty = () => {
    if (!newParty.firstName || !newParty.lastName || !newParty.role) return;
    setParties([...parties, { ...newParty }]);
    setNewParty({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      phoneNumber: "",
      email: "",
      role: "",
    });
  };

  const removeParty = (index: number) => {
    setParties(parties.filter((_, i) => i !== index));
  };

  const canSubmit = caseTitle.trim() && parties.length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setError("");

    try {
      const request: CaseRequest = {
        firstName: parties[0]?.firstName || "",
        lastName: parties[0]?.lastName || "",
        caseTitle,
        courtName,
        caseSummary,
        crimeCategory,
        crimeType,
        crimeDescription,
        crimeCommittedDate,
        crimeCommittedTime,
        caseParties: parties,
      };

      const response = await createCase(request);

      if (response.success && response.data) {
        onCaseRegistered(response.data);
      } else {
        setError(response.message || "Failed to register case");
      }
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
    >
      <div 
        className="w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col rounded-2xl"
        style={{ backgroundColor: "#ffffff", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid #e2e8f0" }}
        >
          <h2 className="text-xl font-semibold" style={{ color: "#1e293b" }}>Register New Case</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors cursor-pointer"
            style={{ color: "#9ca3af" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f1f5f9";
              e.currentTarget.style.color = "#475569";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#9ca3af";
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div 
              className="p-3 rounded-lg flex items-center gap-2 text-sm"
              style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626" }}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Case Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium" style={{ color: "#1e293b" }}>Case Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
                  Case Title <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  placeholder="Enter case title"
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Court Name</label>
                <input
                  type="text"
                  value={courtName}
                  onChange={(e) => setCourtName(e.target.value)}
                  placeholder="Enter court name"
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Crime Category</label>
                <select value={crimeCategory} onChange={(e) => setCrimeCategory(e.target.value)} style={inputStyle}>
                  <option value="">Select category</option>
                  {CRIME_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Crime Type</label>
                <input
                  type="text"
                  value={crimeType}
                  onChange={(e) => setCrimeType(e.target.value)}
                  placeholder="Enter crime type"
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Crime Date</label>
                <input type="date" value={crimeCommittedDate} onChange={(e) => setCrimeCommittedDate(e.target.value)} style={inputStyle} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Crime Time</label>
                <input type="time" value={crimeCommittedTime} onChange={(e) => setCrimeCommittedTime(e.target.value)} style={inputStyle} />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Crime Description</label>
                <textarea
                  value={crimeDescription}
                  onChange={(e) => setCrimeDescription(e.target.value)}
                  placeholder="Describe the crime details"
                  rows={2}
                  style={{ ...inputStyle, resize: "none" }}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Case Summary</label>
                <textarea
                  value={caseSummary}
                  onChange={(e) => setCaseSummary(e.target.value)}
                  placeholder="Provide a summary of the case"
                  rows={3}
                  style={{ ...inputStyle, resize: "none" }}
                />
              </div>
            </div>
          </div>

          {/* Case Parties */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium" style={{ color: "#1e293b" }}>
              Case Parties <span style={{ color: "#ef4444" }}>*</span>
            </h3>

            {parties.length > 0 && (
              <div className="space-y-2">
                {parties.map((party, index) => (
                  <div key={index} className="rounded-lg overflow-hidden" style={{ border: "1px solid #e2e8f0" }}>
                    <button
                      onClick={() => setExpandedPartyIndex(expandedPartyIndex === index ? null : index)}
                      className="w-full flex items-center justify-between px-4 py-3 cursor-pointer"
                      style={{ backgroundColor: "#f8fafc" }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#e2e8f0" }}>
                          <User className="w-4 h-4" style={{ color: "#475569" }} />
                        </div>
                        <div className="text-left">
                          <p className="font-medium" style={{ color: "#1e293b" }}>{party.firstName} {party.lastName}</p>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#e2e8f0", color: "#374151" }}>{party.role}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); removeParty(index); }}
                          className="text-sm cursor-pointer"
                          style={{ color: "#ef4444" }}
                        >
                          Remove
                        </button>
                        {expandedPartyIndex === index ? <ChevronUp className="w-4 h-4" style={{ color: "#9ca3af" }} /> : <ChevronDown className="w-4 h-4" style={{ color: "#9ca3af" }} />}
                      </div>
                    </button>
                    {expandedPartyIndex === index && (
                      <div className="px-4 py-3 grid grid-cols-2 gap-3 text-sm" style={{ backgroundColor: "#ffffff", borderTop: "1px solid #f1f5f9" }}>
                        <div><span style={{ color: "#64748b" }}>Gender:</span> <span style={{ color: "#1e293b" }}>{party.gender || "-"}</span></div>
                        <div><span style={{ color: "#64748b" }}>DOB:</span> <span style={{ color: "#1e293b" }}>{party.dateOfBirth || "-"}</span></div>
                        <div><span style={{ color: "#64748b" }}>Phone:</span> <span style={{ color: "#1e293b" }}>{party.phoneNumber || "-"}</span></div>
                        <div><span style={{ color: "#64748b" }}>Email:</span> <span style={{ color: "#1e293b" }}>{party.email || "-"}</span></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add New Party Form */}
            <div className="rounded-lg p-4 space-y-4" style={{ backgroundColor: "#f8fafc" }}>
              <p className="text-sm font-medium" style={{ color: "#374151" }}>Add a case party</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" value={newParty.firstName} onChange={(e) => setNewParty({ ...newParty, firstName: e.target.value })} placeholder="First Name *" style={inputStyle} />
                <input type="text" value={newParty.lastName} onChange={(e) => setNewParty({ ...newParty, lastName: e.target.value })} placeholder="Last Name *" style={inputStyle} />
                <select value={newParty.gender} onChange={(e) => setNewParty({ ...newParty, gender: e.target.value })} style={inputStyle}>
                  <option value="">Select Gender</option>
                  {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
                <input type="date" value={newParty.dateOfBirth} onChange={(e) => setNewParty({ ...newParty, dateOfBirth: e.target.value })} style={inputStyle} />
                <input type="tel" value={newParty.phoneNumber} onChange={(e) => setNewParty({ ...newParty, phoneNumber: e.target.value })} placeholder="Phone Number" style={inputStyle} />
                <input type="email" value={newParty.email} onChange={(e) => setNewParty({ ...newParty, email: e.target.value })} placeholder="Email Address" style={inputStyle} />
                <div className="md:col-span-2">
                  <select value={newParty.role} onChange={(e) => setNewParty({ ...newParty, role: e.target.value })} style={inputStyle}>
                    <option value="">Select Role *</option>
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <button
                onClick={addParty}
                disabled={!newParty.firstName || !newParty.lastName || !newParty.role}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ color: "#374151", backgroundColor: "#ffffff", border: "1px solid #d1d5db" }}
              >
                <Plus className="w-4 h-4" />
                Add Case Party
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div 
          className="flex items-center justify-end gap-3 px-6 py-4"
          style={{ borderTop: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium rounded-lg cursor-pointer"
            style={{ color: "#374151", border: "1px solid #d1d5db" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#059669", color: "#ffffff", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Register Case"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
