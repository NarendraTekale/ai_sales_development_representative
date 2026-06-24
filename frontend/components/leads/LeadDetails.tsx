"use client";
import { Brain, Mail } from "lucide-react";
import { Lead } from "@/types";
import { StatusBadge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface LeadDetailsProps {
  lead: Lead;
  onQualify: () => void;
  onGenerateEmail: () => void;
  qualifyLoading: boolean;
  emailLoading: boolean;
}

export function LeadDetails({ lead, onQualify, onGenerateEmail, qualifyLoading, emailLoading }: LeadDetailsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{lead.name}</h2>
              <p className="text-gray-500 text-sm">{lead.job_title} at {lead.company}</p>
            </div>
            <StatusBadge status={lead.status} />
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              { label: "Email", value: lead.email },
              { label: "Company", value: lead.company },
              { label: "Industry", value: lead.industry },
              { label: "Job Title", value: lead.job_title },
              { label: "Created", value: new Date(lead.created_at).toLocaleDateString() },
              { label: "Updated", value: new Date(lead.updated_at).toLocaleDateString() },
            ].map(({ label, value }) => (
              <div key={label}>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</dt>
                <dd className="mt-1 text-sm text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-600" /> AI Qualification
              </h3>
              <Button size="sm" variant="secondary" onClick={onQualify} loading={qualifyLoading}>
                {lead.qualification_score != null ? "Re-qualify" : "Qualify Lead"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {lead.qualification_score != null ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`text-4xl font-bold ${lead.qualification_score >= 70 ? "text-green-600" : lead.qualification_score >= 40 ? "text-yellow-600" : "text-red-600"}`}>
                    {lead.qualification_score}
                  </div>
                  <div className="text-sm text-gray-500">/ 100</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${lead.qualification_score >= 70 ? "bg-green-500" : lead.qualification_score >= 40 ? "bg-yellow-500" : "bg-red-500"}`}
                    style={{ width: `${lead.qualification_score}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">{lead.qualification_reason}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Click &quot;Qualify Lead&quot; to get an AI-powered qualification score.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" /> Generated Email
              </h3>
              <Button size="sm" variant="secondary" onClick={onGenerateEmail} loading={emailLoading}>
                {lead.generated_email_body ? "Regenerate" : "Generate Email"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {lead.generated_email_body ? (
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Subject</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{lead.generated_email_subject}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Body</p>
                  <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{lead.generated_email_body}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Call to Action</p>
                  <p className="text-sm text-blue-600 font-medium mt-1">{lead.generated_email_cta}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Click &quot;Generate Email&quot; to create a personalized outreach email.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
