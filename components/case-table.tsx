"use client";

import { CaseResponse } from "@/lib/types";
import { FileText, Eye } from "lucide-react";

interface CaseTableProps {
  cases: CaseResponse[];
  onViewCase: (caseItem: CaseResponse) => void;
  emptyMessage?: string;
}

export default function CaseTable({ cases, onViewCase, emptyMessage = "No cases found" }: CaseTableProps) {
  const getStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    
    if (statusLower === 'open') {
      return (
        <span 
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          style={{ backgroundColor: "#d1fae5", color: "#065f46" }}
        >
          Open
        </span>
      );
    }
    if (statusLower === 'pending') {
      return (
        <span 
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          style={{ backgroundColor: "#fef3c7", color: "#92400e" }}
        >
          Pending
        </span>
      );
    }
    if (statusLower === 'closed') {
      return (
        <span 
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          style={{ backgroundColor: "#f1f5f9", color: "#1e293b" }}
        >
          Closed
        </span>
      );
    }
    return (
      <span 
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        style={{ backgroundColor: "#f1f5f9", color: "#475569" }}
      >
        {status || 'Unknown'}
      </span>
    );
  };

  if (cases.length === 0) {
    return (
      <div 
        className="rounded-xl p-12 text-center"
        style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
      >
        <div 
          className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
          style={{ backgroundColor: "#f1f5f9" }}
        >
          <FileText className="w-6 h-6" style={{ color: "#9ca3af" }} />
        </div>
        <p style={{ color: "#64748b" }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div 
      className="rounded-xl overflow-hidden"
      style={{ 
        backgroundColor: "#ffffff", 
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              <th 
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#475569" }}
              >
                First Name
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#475569" }}
              >
                Last Name
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#475569" }}
              >
                Case Number
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#475569" }}
              >
                Status
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#475569" }}
              >
                Case Summary
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#475569" }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {cases.map((caseItem, index) => (
              <tr 
                key={caseItem.id} 
                className="transition-colors cursor-pointer"
                style={{ 
                  borderBottom: index < cases.length - 1 ? "1px solid #f1f5f9" : "none"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <td className="px-6 py-4 text-sm font-medium" style={{ color: "#1e293b" }}>
                  {caseItem.firstName || '-'}
                </td>
                <td className="px-6 py-4 text-sm" style={{ color: "#1e293b" }}>
                  {caseItem.lastName || '-'}
                </td>
                <td className="px-6 py-4 text-sm font-mono" style={{ color: "#475569" }}>
                  {caseItem.caseNumber || '-'}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(caseItem.status)}
                </td>
                <td className="px-6 py-4 max-w-xs">
                  <button
                    onClick={() => onViewCase(caseItem)}
                    className="text-sm text-left truncate block max-w-full cursor-pointer"
                    style={{ color: "#2563eb" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#1d4ed8";
                      e.currentTarget.style.textDecoration = "underline";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#2563eb";
                      e.currentTarget.style.textDecoration = "none";
                    }}
                    title={caseItem.description || 'View details'}
                  >
                    {caseItem.description 
                      ? (caseItem.description.length > 50 
                          ? `${caseItem.description.substring(0, 50)}...` 
                          : caseItem.description)
                      : 'View details'}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onViewCase(caseItem)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer"
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
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
