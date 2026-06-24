"use client";
import { use, useState } from "react";
import { ArrowLeft, Edit2 } from "lucide-react";
import Link from "next/link";
import { useLead, useQualifyLead, useGenerateEmail, useUpdateLead } from "@/hooks/useLeads";
import { LeadDetails } from "@/components/leads/LeadDetails";
import { LeadForm } from "@/components/leads/LeadForm";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { Modal } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { LeadCreate } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function LeadDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [editOpen, setEditOpen] = useState(false);
  const { data: lead, isLoading } = useLead(id);
  const qualifyMutation = useQualifyLead();
  const emailMutation = useGenerateEmail();
  const updateMutation = useUpdateLead(id);

  const handleUpdate = async (data: LeadCreate) => {
    await updateMutation.mutateAsync(data);
    setEditOpen(false);
  };

  if (isLoading) return <PageLoader />;
  if (!lead) return <div className="text-center py-16 text-gray-500">Lead not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/leads" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lead Details</h1>
            <p className="text-gray-500 text-sm">View and manage AI insights</p>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
          <Edit2 className="h-4 w-4 mr-1.5" /> Edit Lead
        </Button>
      </div>

      <LeadDetails
        lead={lead}
        onQualify={() => qualifyMutation.mutateAsync(id)}
        onGenerateEmail={() => emailMutation.mutateAsync(id)}
        qualifyLoading={qualifyMutation.isPending}
        emailLoading={emailMutation.isPending}
      />

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Lead">
        <LeadForm
          defaultValues={{
            name: lead.name,
            email: lead.email,
            company: lead.company,
            job_title: lead.job_title,
            industry: lead.industry,
            status: lead.status,
          }}
          onSubmit={handleUpdate}
          loading={updateMutation.isPending}
          submitLabel="Save Changes"
        />
      </Modal>
    </div>
  );
}
