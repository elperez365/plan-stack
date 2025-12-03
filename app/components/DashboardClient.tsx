"use client";

import React, { useState } from "react";
import { AppLayout } from "./layout/AppLayout";
import { CreateProjectModal } from "./projects/CreateProjectModal";
import { ProjectCard } from "./projects/ProjectCard";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { EmptyState } from "./ui/EmptyState";
import { useProjectStore } from "../store/projectStore";
import {
  Plus,
  FolderKanban,
  TrendingUp,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  TestTube,
  Calculator,
} from "lucide-react";

export default function DashboardClient() {
  const { projects, activities, currentUser } = useProjectStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Statistiche
  const totalProjects = projects.length;
  const activeProjects = projects.filter(
    (p) => p.status === "in-progress"
  ).length;
  const completedProjects = projects.filter(
    (p) => p.status === "completed"
  ).length;
  const totalTasks = projects.reduce((sum, p) => sum + p.tasks.length, 0);
  const completedTasks = projects.reduce(
    (sum, p) => sum + p.tasks.filter((t) => t.status === "done").length,
    0
  );
  const totalRequirements = projects.reduce(
    (sum, p) =>
      sum + p.functionalAnalyses.reduce((s, a) => s + a.requirements.length, 0),
    0
  );
  const totalTestCases = projects.reduce(
    (sum, p) => sum + p.testCases.length,
    0
  );
  const totalEstimatedHours = projects.reduce(
    (sum, p) => sum + p.estimations.reduce((s, e) => s + e.totalHours, 0),
    0
  );

  const recentProjects = [...projects]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 4);

  const recentActivities = activities.slice(0, 8);

  return (
    <AppLayout>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Bentornato, {currentUser?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Ecco un riepilogo dei tuoi progetti e delle attività recenti.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
              <FolderKanban className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {totalProjects}
              </p>
              <p className="text-sm text-gray-500">Progetti Totali</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {activeProjects}
              </p>
              <p className="text-sm text-gray-500">In Corso</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {completedTasks}/{totalTasks}
              </p>
              <p className="text-sm text-gray-500">Task Completati</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {totalEstimatedHours}h
              </p>
              <p className="text-sm text-gray-500">Ore Stimate</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {totalRequirements}
              </p>
              <p className="text-xs text-gray-500">Requisiti Documentati</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TestTube className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {totalTestCases}
              </p>
              <p className="text-xs text-gray-500">Test Cases</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Calculator className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {projects.reduce((sum, p) => sum + p.estimations.length, 0)}
              </p>
              <p className="text-xs text-gray-500">Stime Create</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Progetti Recenti
            </h2>
            <Button onClick={() => setShowCreateModal(true)} size="sm">
              <Plus className="w-4 h-4" />
              Nuovo Progetto
            </Button>
          </div>

          {recentProjects.length === 0 ? (
            <Card>
              <EmptyState
                icon={FolderKanban}
                title="Nessun progetto"
                description="Crea il tuo primo progetto per iniziare a gestire il lavoro del team."
                action={{
                  label: "Crea Progetto",
                  onClick: () => setShowCreateModal(true),
                }}
              />
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Attività Recenti
          </h2>
          <Card className="divide-y divide-gray-100">
            {recentActivities.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                Nessuna attività recente
              </div>
            ) : (
              recentActivities.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-gray-50">
                  <p className="text-sm text-gray-900">{activity.details}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(activity.createdAt).toLocaleString("it-IT", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))
            )}
          </Card>
        </div>
      </div>

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </AppLayout>
  );
}
