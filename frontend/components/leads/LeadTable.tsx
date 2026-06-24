"use client";
import Link from "next/link";
import { Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Lead, LeadsPage } from "@/types";
import { StatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface LeadTableProps {
  data: LeadsPage;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
  deletingId?: string;
}

export function LeadTable({ data, onDelete, onPageChange, deletingId }: LeadTableProps) {
  if (data.items.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg font-medium">No leads found</p>
        <p className="text-sm mt-1">Create your first lead to get started.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {["Name", "Company", "Industry", "Job Title", "Score", "Status", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.items.map((lead: Lead) => (
              <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{lead.name}</td>
                <td className="px-4 py-3 text-gray-600">{lead.company}</td>
                <td className="px-4 py-3 text-gray-600">{lead.industry}</td>
                <td className="px-4 py-3 text-gray-600">{lead.job_title}</td>
                <td className="px-4 py-3">
                  {lead.qualification_score != null ? (
                    <span className={`font-bold ${lead.qualification_score >= 70 ? "text-green-600" : lead.qualification_score >= 40 ? "text-yellow-600" : "text-red-600"}`}>
                      {lead.qualification_score}
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/leads/${lead.id}`}>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      loading={deletingId === lead.id}
                      onClick={() => onDelete(lead.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.pages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing {(data.page - 1) * data.limit + 1}–{Math.min(data.page * data.limit, data.total)} of {data.total}
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={data.page <= 1}
              onClick={() => onPageChange(data.page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={data.page >= data.pages}
              onClick={() => onPageChange(data.page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
