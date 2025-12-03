"use client";

import React, { useState } from "react";
import { Sidebar, Header } from "../components/layout/Navigation";
import { CreateProjectModal } from "../components/projects/CreateProjectModal";
import { ProjectCard } from "../components/projects/ProjectCard";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { EmptyState } from "../components/ui/EmptyState";
import { useProjectStore } from "../store/projectStore";
import {
  Plus,
  FolderKanban,
  Search,
  Filter,
  Grid3X3,
  List,
} from "lucide-react";

export default function ProjectsPage() {
  const { projects } = useProjectStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || project.status === filterStatus;
    const matchesType = filterType === "all" || project.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Progetti</h1>
              <p className="text-gray-500 mt-1">
                Gestisci tutti i tuoi progetti in un unico posto
              </p>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4" />
              Nuovo Progetto
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex-1 min-w-64">
              <Input
                placeholder="Cerca progetti..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="all">Tutti gli stati</option>
                <option value="planning">Pianificazione</option>
                <option value="in-progress">In Corso</option>
                <option value="review">Review</option>
                <option value="completed">Completato</option>
                <option value="on-hold">In Pausa</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="all">Tutti i tipi</option>
                <option value="web">Web App</option>
                <option value="mobile">Mobile App</option>
                <option value="desktop">Desktop</option>
                <option value="api">API / Backend</option>
                <option value="fullstack">Full Stack</option>
                <option value="other">Altro</option>
              </select>

              <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-violet-100 text-violet-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-violet-100 text-violet-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Projects Grid/List */}
          {filteredProjects.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title={
                projects.length === 0 ? "Nessun progetto" : "Nessun risultato"
              }
              description={
                projects.length === 0
                  ? "Crea il tuo primo progetto per iniziare."
                  : "Prova a modificare i filtri di ricerca."
              }
              action={
                projects.length === 0
                  ? {
                      label: "Crea Progetto",
                      onClick: () => setShowCreateModal(true),
                    }
                  : undefined
              }
            />
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-4"
              }
            >
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </main>
      </div>

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
