"use client";

import React from "react";

interface AvatarProps {
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({ name, size = "md", className = "" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sizes = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  // Genera un colore basato sul nome
  const colors = [
    "bg-violet-500",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-cyan-500",
    "bg-indigo-500",
    "bg-fuchsia-500",
  ];

  const colorIndex =
    name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;

  return (
    <div
      className={`
        ${sizes[size]} ${colors[colorIndex]}
        rounded-full flex items-center justify-center text-white font-semibold
        ${className}
      `}
    >
      {initials}
    </div>
  );
}

interface AvatarGroupProps {
  users: { name: string }[];
  max?: number;
  size?: "sm" | "md" | "lg";
}

export function AvatarGroup({ users, max = 4, size = "md" }: AvatarGroupProps) {
  const displayUsers = users.slice(0, max);
  const remaining = users.length - max;

  const sizes = {
    sm: "w-8 h-8 text-xs -ml-2",
    md: "w-10 h-10 text-sm -ml-3",
    lg: "w-12 h-12 text-base -ml-4",
  };

  return (
    <div className="flex items-center">
      {displayUsers.map((user, index) => (
        <div key={index} className={index > 0 ? sizes[size].split(" ")[2] : ""}>
          <Avatar name={user.name} size={size} className="ring-2 ring-white" />
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={`
            ${sizes[size]}
            rounded-full flex items-center justify-center 
            bg-gray-200 text-gray-600 font-medium ring-2 ring-white
          `}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
