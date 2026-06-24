export type LeadStatus = "new" | "qualified" | "contacted" | "converted" | "rejected";

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Lead {
  id: string;
  user_id: string;
  name: string;
  email: string;
  company: string;
  job_title: string;
  industry: string;
  status: LeadStatus;
  qualification_score: number | null;
  qualification_reason: string | null;
  generated_email_subject: string | null;
  generated_email_body: string | null;
  generated_email_cta: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadsPage {
  items: Lead[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface LeadCreate {
  name: string;
  email: string;
  company: string;
  job_title: string;
  industry: string;
  status?: LeadStatus;
}

export interface LeadUpdate {
  name?: string;
  email?: string;
  company?: string;
  job_title?: string;
  industry?: string;
  status?: LeadStatus;
}

export interface QualificationResult {
  score: number;
  reason: string;
}

export interface EmailGenerationResult {
  subject: string;
  email: string;
  cta: string;
}

export interface DashboardStats {
  total_leads: number;
  qualified_leads: number;
  average_score: number;
  emails_generated: number;
}

export interface LeadFilters {
  search?: string;
  status?: LeadStatus;
  industry?: string;
  min_score?: number;
  page?: number;
  limit?: number;
}
