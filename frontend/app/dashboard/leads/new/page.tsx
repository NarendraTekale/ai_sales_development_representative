"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCreateLead } from "@/hooks/useLeads";
import { LeadForm } from "@/components/leads/LeadForm";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { LeadCreate } from "@/types";

export default function NewLeadPage() {
  const router = useRouter();
  const createMutation = useCreateLead();

  const handleSubmit = async (data: LeadCreate) => {
    const lead = await createMutation.mutateAsync(data);
    router.push(`/dashboard/leads/${lead.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/leads" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Lead</h1>
          <p className="text-gray-500 text-sm">Add a new lead to qualify with AI</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Lead Information</h2>
        </CardHeader>
        <CardContent>
          <LeadForm onSubmit={handleSubmit} loading={createMutation.isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
