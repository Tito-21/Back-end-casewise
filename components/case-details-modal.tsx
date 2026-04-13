"use client";

import { useState, useEffect } from "react";
import { X, FileText, User, Calendar, Building, Loader2 } from "lucide-react";
import { CaseResponse } from "@/lib/types";
import { getCaseById } from "@/lib/api";

interface CaseDetailsModalProps {
  caseData: CaseResponse;
  onClose: () => void;
}

export default function CaseDetailsModal({ caseData, onClose }: CaseDetailsModalProps) {
  const [fullCase, setFullCase] = useState<CaseResponse>(caseData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFullCase = async () => {
      setIsLoading(true);
      try {
        const response = await getCaseById(caseData.id);
        if (response.success && response.data) {
          setFullCase(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch case details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFullCase();
  }, [caseData.id]);

  const getStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    
    if (statusLower === 'open') {
      return (
        <span 
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
          style={{ backgroundColor: "#d1fae5", color: "#065f46" }}
        >
          Open
        </span>
      );
    }
    if (statusLower === 'pending') {
      return (
        <span 
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
          style={{ backgroundColor: "#fef3c7", color: "#92400e" }}
        >
          Pending
        </span>
      );
    }
    if (statusLower === 'closed') {
      return (
        <span 
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
          style={{ backgroundColor: "#f1f5f9", color: "#1e293b" }}
        >
          Closed
        </span>
      );
    }
    return (
      <span 
        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
        style={{ backgroundColor: "#f1f5f9", color: "#475569" }}
      >
        {status || 'Unknown'}
      </span>
    );
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
    >
      <div 
        className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-2xl"
        style={{ backgroundColor: "#ffffff", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#1e293b" }}
            >
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold" style={{ color: "#1e293b" }}>Case Details</h2>
              <p className="text-sm font-mono" style={{ color: "#64748b" }}>{fullCase.caseNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors cursor-pointer"
            style={{ color: "#9ca3af" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#e2e8f0";
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
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#9ca3af" }} />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Status & Basic Info */}
              <div className="flex items-center justify-between">
                {getStatusBadge(fullCase.status)}
                {fullCase.createdAt && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: "#64748b" }}>
                    <Calendar className="w-4 h-4" />
                    <span>
                      Created{" "}
                      {new Date(fullCase.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* Case Information Grid */}
              <div className="rounded-xl p-5 space-y-4" style={{ backgroundColor: "#f8fafc" }}>
                <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#1e293b" }}>
                  Case Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm mb-1" style={{ color: "#64748b" }}>Case Number</p>
                    <p className="font-medium font-mono" style={{ color: "#1e293b" }}>
                      {fullCase.caseNumber || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm mb-1" style={{ color: "#64748b" }}>Status</p>
                    <p className="font-medium" style={{ color: "#1e293b" }}>{fullCase.status || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm mb-1" style={{ color: "#64748b" }}>First Name</p>
                    <p className="font-medium" style={{ color: "#1e293b" }}>{fullCase.firstName || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm mb-1" style={{ color: "#64748b" }}>Last Name</p>
                    <p className="font-medium" style={{ color: "#1e293b" }}>{fullCase.lastName || '-'}</p>
                  </div>
                  {fullCase.courtName && (
                    <div className="col-span-2">
                      <p className="text-sm mb-1 flex items-center gap-1.5" style={{ color: "#64748b" }}>
                        <Building className="w-4 h-4" />
                        Court
                      </p>
                      <p className="font-medium" style={{ color: "#1e293b" }}>{fullCase.courtName}</p>
                    </div>
                  )}
                  {fullCase.createdBy && (
                    <div className="col-span-2">
                      <p className="text-sm mb-1" style={{ color: "#64748b" }}>Created By</p>
                      <p className="font-medium" style={{ color: "#1e293b" }}>{fullCase.createdBy}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {fullCase.description && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#1e293b" }}>
                    Case Description
                  </h3>
                  <div className="rounded-xl p-5" style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}>
                    <p className="leading-relaxed whitespace-pre-wrap" style={{ color: "#374151" }}>
                      {fullCase.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Crime Types */}
              {fullCase.crimes && fullCase.crimes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#1e293b" }}>
                    Related Crimes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {fullCase.crimes.map((crime, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-full text-sm font-medium"
                        style={{ backgroundColor: "#fef2f2", color: "#b91c1c" }}
                      >
                        {crime}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Case Parties */}
              {fullCase.caseParties && fullCase.caseParties.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#1e293b" }}>
                    Case Parties ({fullCase.caseParties.length})
                  </h3>
                  <div className="space-y-2">
                    {fullCase.caseParties.map((party, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 rounded-xl"
                        style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
                      >
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: "#f1f5f9" }}
                        >
                          <User className="w-5 h-5" style={{ color: "#475569" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium" style={{ color: "#1e293b" }}>
                            {party.partyName || `${party.firstName || ''} ${party.lastName || ''}`.trim() || 'Unknown'}
                          </p>
                          <div className="flex items-center gap-3 text-sm mt-0.5" style={{ color: "#64748b" }}>
                            {party.partyType && (
                              <span 
                                className="px-2 py-0.5 rounded-full text-xs font-medium"
                                style={{ backgroundColor: "#f1f5f9" }}
                              >
                                {party.partyType}
                              </span>
                            )}
                            {party.role && (
                              <span 
                                className="px-2 py-0.5 rounded-full text-xs font-medium"
                                style={{ backgroundColor: "#f1f5f9" }}
                              >
                                {party.role}
                              </span>
                            )}
                            {party.email && <span>{party.email}</span>}
                            {party.phoneNumber && <span>{party.phoneNumber}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div 
          className="flex items-center justify-end px-6 py-4"
          style={{ borderTop: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}
        >
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium rounded-lg cursor-pointer"
            style={{ backgroundColor: "#1e293b", color: "#ffffff" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#334155"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#1e293b"}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
