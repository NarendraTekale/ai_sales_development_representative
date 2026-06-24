"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useLeads, useDeleteLead } from "@/hooks/useLeads";
import { LeadTable } from "@/components/leads/LeadTable";
import { LeadFiltersBar } from "@/components/leads/LeadFilters";
import { Card } from "@/components/ui/Card";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import Button from "@/components/ui/Button";
import { LeadFilters } from "@/types";

export default function LeadsPage() {
  const [filters, setFilters] = useState<LeadFilters>({ page: 1, limit: 20 });
  const [deletingId, setDeletingId] = useState<string | undefined>();
  const { data, isLoading } = useLeads(filters);
  const deleteMutation = useDeleteLead();

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lead? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
    } finally {
      setDeletingId(undefined);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and qualify your sales leads</p>
        </div>
        <Link href="/dashboard/leads/new">
          <Button>
            <Plus className="h-4 w-4 mr-1.5" /> Add Lead
          </Button>
        </Link>
      </div>

      <LeadFiltersBar filters={filters} onChange={setFilters} />

      <Card>
        {isLoading ? (
          <PageLoader />
        ) : data ? (
          <LeadTable
            data={data}
            onDelete={handleDelete}
            onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
            deletingId={deletingId}
          />
        ) : null}
      </Card>
    </div>
  );
}
