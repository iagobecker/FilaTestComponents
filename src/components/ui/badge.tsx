"use client";

import { cn } from "@/lib/utils/cn"

type BadgeVariant = "default" | "success" | "warning" | "danger";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const badgeStyles: Record<BadgeVariant, string> = {
  default: "bg-blue-100 text-blue-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-red-700",
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span className={cn("px-3 py-1 rounded-md text-xs font-medium", badgeStyles[variant])}>
      {children}
    </span>
  );
}
