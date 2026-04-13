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
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
          Open
        </span>
      );
    }
    if (statusLower === 'pending') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
          Pending
        </span>
      );
    }
    if (statusLower === 'closed') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-800">
          Closed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-600">
        {status || 'Unknown'}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Case Details</h2>
              <p className="text-sm text-slate-500 font-mono">{fullCase.caseNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Status & Basic Info */}
              <div className="flex items-center justify-between">
                {getStatusBadge(fullCase.status)}
                {fullCase.createdAt && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
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
              <div className="bg-slate-50 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
                  Case Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Case Number</p>
                    <p className="font-medium text-slate-800 font-mono">
                      {fullCase.caseNumber || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Status</p>
                    <p className="font-medium text-slate-800">{fullCase.status || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">First Name</p>
                    <p className="font-medium text-slate-800">{fullCase.firstName || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Last Name</p>
                    <p className="font-medium text-slate-800">{fullCase.lastName || '-'}</p>
                  </div>
                  {fullCase.courtName && (
                    <div className="col-span-2">
                      <p className="text-sm text-slate-500 mb-1 flex items-center gap-1.5">
                        <Building className="w-4 h-4" />
                        Court
                      </p>
                      <p className="font-medium text-slate-800">{fullCase.courtName}</p>
                    </div>
                  )}
                  {fullCase.createdBy && (
                    <div className="col-span-2">
                      <p className="text-sm text-slate-500 mb-1">Created By</p>
                      <p className="font-medium text-slate-800">{fullCase.createdBy}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {fullCase.description && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
                    Case Description
                  </h3>
                  <div className="bg-white border border-slate-200 rounded-xl p-5">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {fullCase.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Crime Types */}
              {fullCase.crimes && fullCase.crimes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
                    Related Crimes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {fullCase.crimes.map((crime, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-sm font-medium"
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
                  <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
                    Case Parties ({fullCase.caseParties.length})
                  </h3>
                  <div className="space-y-2">
                    {fullCase.caseParties.map((party, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl"
                      >
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-slate-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-800">
                            {party.partyName || `${party.firstName || ''} ${party.lastName || ''}`.trim() || 'Unknown'}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-slate-500 mt-0.5">
                            {party.partyType && (
                              <span className="px-2 py-0.5 bg-slate-100 rounded-full text-xs font-medium">
                                {party.partyType}
                              </span>
                            )}
                            {party.role && (
                              <span className="px-2 py-0.5 bg-slate-100 rounded-full text-xs font-medium">
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
        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
