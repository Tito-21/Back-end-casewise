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
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
          Open
        </span>
      );
    }
    if (statusLower === 'pending') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          Pending
        </span>
      );
    }
    if (statusLower === 'closed') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
          Closed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
        {status || 'Unknown'}
      </span>
    );
  };

  if (cases.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-full mb-4">
          <FileText className="w-6 h-6 text-slate-400" />
        </div>
        <p className="text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                First Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Last Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Case Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Case Summary
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cases.map((caseItem) => (
              <tr key={caseItem.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-800 font-medium">
                  {caseItem.firstName || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-slate-800">
                  {caseItem.lastName || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                  {caseItem.caseNumber || '-'}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(caseItem.status)}
                </td>
                <td className="px-6 py-4 max-w-xs">
                  <button
                    onClick={() => onViewCase(caseItem)}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline text-left truncate block max-w-full"
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
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
