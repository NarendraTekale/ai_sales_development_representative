import { cn } from "@/utils/cn";
import { LeadStatus } from "@/types";

interface BadgeProps {
  status: LeadStatus;
  className?: string;
}

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  new: { label: "New", className: "bg-blue-100 text-blue-800" },
  qualified: { label: "Qualified", className: "bg-green-100 text-green-800" },
  contacted: { label: "Contacted", className: "bg-yellow-100 text-yellow-800" },
  converted: { label: "Converted", className: "bg-purple-100 text-purple-800" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-800" },
};

export function StatusBadge({ status, className }: BadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
