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

export default function CaseRegistrationModal({
  onClose,
  onCaseRegistered,
}: CaseRegistrationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [expandedPartyIndex, setExpandedPartyIndex] = useState<number | null>(null);

  // Case Information
  const [caseTitle, setCaseTitle] = useState("");
  const [courtName, setCourtName] = useState("");
  const [caseSummary, setCaseSummary] = useState("");
  const [crimeCategory, setCrimeCategory] = useState("");
  const [crimeType, setCrimeType] = useState("");
  const [crimeDescription, setCrimeDescription] = useState("");
  const [crimeCommittedDate, setCrimeCommittedDate] = useState("");
  const [crimeCommittedTime, setCrimeCommittedTime] = useState("");

  // Case Parties
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
    if (!newParty.firstName || !newParty.lastName || !newParty.role) {
      return;
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Register New Case</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Case Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800 flex items-center gap-2">
              Case Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Case Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  placeholder="Enter case title"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Court Name
                </label>
                <input
                  type="text"
                  value={courtName}
                  onChange={(e) => setCourtName(e.target.value)}
                  placeholder="Enter court name"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Crime Category
                </label>
                <select
                  value={crimeCategory}
                  onChange={(e) => setCrimeCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 text-slate-700 bg-white"
                >
                  <option value="">Select category</option>
                  {CRIME_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Crime Type
                </label>
                <input
                  type="text"
                  value={crimeType}
                  onChange={(e) => setCrimeType(e.target.value)}
                  placeholder="Enter crime type"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Crime Committed Date
                </label>
                <input
                  type="date"
                  value={crimeCommittedDate}
                  onChange={(e) => setCrimeCommittedDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 text-slate-700 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Crime Committed Time
                </label>
                <input
                  type="time"
                  value={crimeCommittedTime}
                  onChange={(e) => setCrimeCommittedTime(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 text-slate-700 bg-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Crime Description
                </label>
                <textarea
                  value={crimeDescription}
                  onChange={(e) => setCrimeDescription(e.target.value)}
                  placeholder="Describe the crime details"
                  rows={2}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent text-slate-800 placeholder:text-slate-400 resize-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Case Summary
                </label>
                <textarea
                  value={caseSummary}
                  onChange={(e) => setCaseSummary(e.target.value)}
                  placeholder="Provide a summary of the case"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent text-slate-800 placeholder:text-slate-400 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Case Party Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800">
              Case Parties <span className="text-red-500">*</span>
            </h3>

            {/* Existing Parties */}
            {parties.length > 0 && (
              <div className="space-y-2">
                {parties.map((party, index) => (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpandedPartyIndex(
                          expandedPartyIndex === index ? null : index
                        )
                      }
                      className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-slate-800">
                            {party.firstName} {party.lastName}
                          </p>
                          <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full">
                            {party.role}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeParty(index);
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                        {expandedPartyIndex === index ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </button>
                    {expandedPartyIndex === index && (
                      <div className="px-4 py-3 bg-white border-t border-slate-100 grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-slate-500">Gender:</span>{" "}
                          <span className="text-slate-800">{party.gender || "-"}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">DOB:</span>{" "}
                          <span className="text-slate-800">{party.dateOfBirth || "-"}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Phone:</span>{" "}
                          <span className="text-slate-800">{party.phoneNumber || "-"}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Email:</span>{" "}
                          <span className="text-slate-800">{party.email || "-"}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add New Party Form */}
            <div className="bg-slate-50 rounded-lg p-4 space-y-4">
              <p className="text-sm font-medium text-slate-700">Add a case party</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={newParty.firstName}
                  onChange={(e) =>
                    setNewParty({ ...newParty, firstName: e.target.value })
                  }
                  placeholder="First Name *"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent text-slate-800 placeholder:text-slate-400 bg-white"
                />
                <input
                  type="text"
                  value={newParty.lastName}
                  onChange={(e) =>
                    setNewParty({ ...newParty, lastName: e.target.value })
                  }
                  placeholder="Last Name *"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent text-slate-800 placeholder:text-slate-400 bg-white"
                />
                <select
                  value={newParty.gender}
                  onChange={(e) =>
                    setNewParty({ ...newParty, gender: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 text-slate-700 bg-white"
                >
                  <option value="">Select Gender</option>
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={newParty.dateOfBirth}
                  onChange={(e) =>
                    setNewParty({ ...newParty, dateOfBirth: e.target.value })
                  }
                  placeholder="Date of Birth"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 text-slate-700 bg-white"
                />
                <input
                  type="tel"
                  value={newParty.phoneNumber}
                  onChange={(e) =>
                    setNewParty({ ...newParty, phoneNumber: e.target.value })
                  }
                  placeholder="Phone Number"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent text-slate-800 placeholder:text-slate-400 bg-white"
                />
                <input
                  type="email"
                  value={newParty.email}
                  onChange={(e) =>
                    setNewParty({ ...newParty, email: e.target.value })
                  }
                  placeholder="Email Address"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent text-slate-800 placeholder:text-slate-400 bg-white"
                />
                <div className="md:col-span-2">
                  <select
                    value={newParty.role}
                    onChange={(e) =>
                      setNewParty({ ...newParty, role: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 text-slate-700 bg-white"
                  >
                    <option value="">Select Role *</option>
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={addParty}
                disabled={!newParty.firstName || !newParty.lastName || !newParty.role}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Add Case Party
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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
