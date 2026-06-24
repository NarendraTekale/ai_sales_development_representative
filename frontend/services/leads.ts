import { api } from "./api";
import {
  Lead,
  LeadCreate,
  LeadUpdate,
  LeadsPage,
  LeadFilters,
  QualificationResult,
  EmailGenerationResult,
  DashboardStats,
} from "@/types";

export const leadsService = {
  async create(data: LeadCreate): Promise<Lead> {
    const { data: lead } = await api.post<Lead>("/leads", data);
    return lead;
  },

  async list(filters: LeadFilters = {}): Promise<LeadsPage> {
    const { data } = await api.get<LeadsPage>("/leads", { params: filters });
    return data;
  },

  async getById(id: string): Promise<Lead> {
    const { data } = await api.get<Lead>(`/leads/${id}`);
    return data;
  },

  async update(id: string, data: LeadUpdate): Promise<Lead> {
    const { data: lead } = await api.put<Lead>(`/leads/${id}`, data);
    return lead;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/leads/${id}`);
  },

  async qualify(id: string): Promise<QualificationResult> {
    const { data } = await api.post<QualificationResult>(`/leads/${id}/qualify`);
    return data;
  },

  async generateEmail(id: string): Promise<EmailGenerationResult> {
    const { data } = await api.post<EmailGenerationResult>(`/leads/${id}/generate-email`);
    return data;
  },

  async getStats(): Promise<DashboardStats> {
    const { data } = await api.get<DashboardStats>("/leads/stats");
    return data;
  },
};
