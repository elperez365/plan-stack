"use client";

import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "purple";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "sm",
  className = "",
}: BadgeProps) {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    purple: "bg-violet-100 text-violet-700",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}

// Badge per le priorità
export function PriorityBadge({
  priority,
}: {
  priority: "low" | "medium" | "high" | "urgent";
}) {
  const config = {
    low: { variant: "default" as const, label: "Bassa" },
    medium: { variant: "info" as const, label: "Media" },
    high: { variant: "warning" as const, label: "Alta" },
    urgent: { variant: "danger" as const, label: "Urgente" },
  };

  return (
    <Badge variant={config[priority].variant}>{config[priority].label}</Badge>
  );
}

// Badge per lo stato del progetto
export function StatusBadge({
  status,
}: {
  status: "planning" | "in-progress" | "review" | "completed" | "on-hold";
}) {
  const config = {
    planning: { variant: "info" as const, label: "Pianificazione" },
    "in-progress": { variant: "purple" as const, label: "In Corso" },
    review: { variant: "warning" as const, label: "Review" },
    completed: { variant: "success" as const, label: "Completato" },
    "on-hold": { variant: "default" as const, label: "In Pausa" },
  };

  return <Badge variant={config[status].variant}>{config[status].label}</Badge>;
}

// Badge per i ruoli
export function RoleBadge({ role }: { role: string }) {
  const config: Record<
    string,
    {
      variant: "default" | "success" | "warning" | "danger" | "info" | "purple";
      label: string;
    }
  > = {
    ceo: { variant: "danger", label: "CEO" },
    "project-manager": { variant: "purple", label: "PM" },
    developer: { variant: "info", label: "Dev" },
    designer: { variant: "warning", label: "Design" },
    qa: { variant: "success", label: "QA" },
    devops: { variant: "default", label: "DevOps" },
    other: { variant: "default", label: "Altro" },
  };

  const roleConfig = config[role] || config.other;
  return <Badge variant={roleConfig.variant}>{roleConfig.label}</Badge>;
}
