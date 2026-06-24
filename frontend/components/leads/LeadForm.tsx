"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { LeadCreate, LeadStatus } from "@/types";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  company: z.string().min(1, "Company is required"),
  job_title: z.string().min(1, "Job title is required"),
  industry: z.string().min(1, "Industry is required"),
  status: z.enum(["new", "qualified", "contacted", "converted", "rejected"]).default("new"),
});

type FormData = z.infer<typeof schema>;

interface LeadFormProps {
  defaultValues?: Partial<FormData>;
  onSubmit: (data: LeadCreate) => void;
  loading?: boolean;
  submitLabel?: string;
}

const industries = [
  "Technology", "Finance", "Healthcare", "Retail", "Manufacturing",
  "Education", "Real Estate", "Media", "Energy", "Consulting", "Other"
];

const statuses: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "qualified", label: "Qualified" },
  { value: "contacted", label: "Contacted" },
  { value: "converted", label: "Converted" },
  { value: "rejected", label: "Rejected" },
];

export function LeadForm({ defaultValues, onSubmit, loading, submitLabel = "Create Lead" }: LeadFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: "new", ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Full Name" id="name" placeholder="John Smith" error={errors.name?.message} {...register("name")} />
        <Input label="Email" id="email" type="email" placeholder="john@company.com" error={errors.email?.message} {...register("email")} />
        <Input label="Company" id="company" placeholder="Acme Corp" error={errors.company?.message} {...register("company")} />
        <Input label="Job Title" id="job_title" placeholder="Chief Technology Officer" error={errors.job_title?.message} {...register("job_title")} />

        <div className="space-y-1">
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700">Industry</label>
          <select
            id="industry"
            {...register("industry")}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Select industry</option>
            {industries.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
          {errors.industry && <p className="text-xs text-red-600">{errors.industry.message}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            {...register("status")}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
