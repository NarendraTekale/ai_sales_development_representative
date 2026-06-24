"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leadsService } from "@/services/leads";
import { LeadCreate, LeadUpdate, LeadFilters } from "@/types";

export const LEADS_KEY = "leads";
export const STATS_KEY = "leads-stats";

export function useLeads(filters: LeadFilters = {}) {
  return useQuery({
    queryKey: [LEADS_KEY, filters],
    queryFn: () => leadsService.list(filters),
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: [LEADS_KEY, id],
    queryFn: () => leadsService.getById(id),
    enabled: !!id,
  });
}

export function useLeadStats() {
  return useQuery({
    queryKey: [STATS_KEY],
    queryFn: () => leadsService.getStats(),
  });
}

export function useCreateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: LeadCreate) => leadsService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_KEY] });
      qc.invalidateQueries({ queryKey: [STATS_KEY] });
    },
  });
}

export function useUpdateLead(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: LeadUpdate) => leadsService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_KEY] });
    },
  });
}

export function useDeleteLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leadsService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_KEY] });
      qc.invalidateQueries({ queryKey: [STATS_KEY] });
    },
  });
}

export function useQualifyLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leadsService.qualify(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_KEY] });
      qc.invalidateQueries({ queryKey: [STATS_KEY] });
    },
  });
}

export function useGenerateEmail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leadsService.generateEmail(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_KEY] });
      qc.invalidateQueries({ queryKey: [STATS_KEY] });
    },
  });
}
