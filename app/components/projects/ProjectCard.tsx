"use client";

import React from "react";
import Link from "next/link";
import { Project } from "../../types";
import { Card } from "../ui/Card";
import { StatusBadge, PriorityBadge } from "../ui/Badge";
import { AvatarGroup } from "../ui/Avatar";
import {
  Calendar,
  MessageSquare,
  CheckSquare,
  Globe,
  Smartphone,
  Monitor,
  Server,
  Layers,
  MoreHorizontal,
  ArrowRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";

interface ProjectCardProps {
  project: Project;
}

const typeIcons = {
  web: Globe,
  mobile: Smartphone,
  desktop: Monitor,
  api: Server,
  fullstack: Layers,
  other: MoreHorizontal,
};

export function ProjectCard({ project }: ProjectCardProps) {
  const TypeIcon = typeIcons[project.type];
  const completedTasks = project.tasks.filter(
    (t) => t.status === "done"
  ).length;
  const totalTasks = project.tasks.length;
  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Link href={`/projects/${project.id}`}>
      <Card hover className="group">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
                <TypeIcon className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-violet-600 transition-colors">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-500 capitalize">
                  {project.type === "api"
                    ? "API / Backend"
                    : project.type.replace("-", " ")}
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" />
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {project.description}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: tech.color }}
                />
                {tech.name}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-500">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>

          {/* Progress */}
          {totalTasks > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Progresso</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <CheckSquare className="w-4 h-4" />
                <span>
                  {completedTasks}/{totalTasks}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>{project.messages.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs">
                  {formatDistanceToNow(new Date(project.createdAt), {
                    addSuffix: true,
                    locale: it,
                  })}
                </span>
              </div>
            </div>

            {project.team.length > 0 && (
              <AvatarGroup users={project.team} max={3} size="sm" />
            )}
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 mt-4">
            <StatusBadge status={project.status} />
            <PriorityBadge priority={project.priority} />
          </div>
        </div>
      </Card>
    </Link>
  );
}

// Compact version for sidebar or lists
export function ProjectCardCompact({ project }: ProjectCardProps) {
  const TypeIcon = typeIcons[project.type];

  return (
    <Link href={`/projects/${project.id}`}>
      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
        <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
          <TypeIcon className="w-5 h-5 text-violet-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-violet-600">
            {project.name}
          </h4>
          <div className="flex items-center gap-2 mt-0.5">
            <StatusBadge status={project.status} />
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-violet-600 flex-shrink-0" />
      </div>
    </Link>
  );
}
