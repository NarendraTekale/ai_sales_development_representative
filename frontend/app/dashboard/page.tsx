"use client";
import { useLeadStats, useLeads } from "@/hooks/useLeads";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useLeadStats();
  const { data: recentLeads, isLoading: leadsLoading } = useLeads({ page: 1, limit: 5 });

  if (statsLoading || leadsLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Overview of your leads and AI activity</p>
        </div>
        <Link href="/dashboard/leads/new">
          <Button>
            <Plus className="h-4 w-4 mr-1.5" /> Add Lead
          </Button>
        </Link>
      </div>

      {stats && <StatsCards stats={stats} />}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Leads</h2>
            <Link href="/dashboard/leads" className="text-sm text-blue-600 hover:text-blue-700">
              View all →
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {recentLeads?.items.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No leads yet. <Link href="/dashboard/leads/new" className="text-blue-600 hover:underline">Create your first lead</Link></p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Name", "Company", "Industry", "Score", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentLeads?.items.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">
                      <Link href={`/dashboard/leads/${lead.id}`} className="hover:text-blue-600">
                        {lead.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{lead.company}</td>
                    <td className="px-4 py-3 text-gray-600">{lead.industry}</td>
                    <td className="px-4 py-3">
                      {lead.qualification_score != null ? (
                        <span className={`font-bold ${lead.qualification_score >= 70 ? "text-green-600" : "text-yellow-600"}`}>
                          {lead.qualification_score}
                        </span>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
