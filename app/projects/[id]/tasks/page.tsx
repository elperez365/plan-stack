"use client";

import React, { useState, DragEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar, Header } from "../../../components/layout/Navigation";
import { useProjectStore } from "../../../store/projectStore";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge, PriorityBadge } from "../../../components/ui/Badge";
import { Avatar } from "../../../components/ui/Avatar";
import { Input, TextArea, Select } from "../../../components/ui/Input";
import { Modal } from "../../../components/ui/Modal";
import {
  ArrowLeft,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Clock,
  User,
  Calendar,
  GripVertical,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";

export default function ProjectTasksPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const { projects, addTask, updateTask } = useProjectStore();
  const project = projects.find((p) => p.id === projectId);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
    status: "todo" as const,
  });

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Progetto non trovato
          </h1>
          <Button onClick={() => router.push("/projects")}>
            Torna ai progetti
          </Button>
        </div>
      </div>
    );
  }

  const handleCreateTask = () => {
    if (newTask.title.trim()) {
      addTask(projectId, { ...newTask, tags: [] });
      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        status: "todo",
      });
      setShowTaskModal(false);
    }
  };

  const handleStatusChange = (taskId: string, newStatus: string) => {
    updateTask(projectId, taskId, { status: newStatus as any });
  };

  // Drag and Drop handlers
  const handleDragStart = (e: DragEvent<HTMLDivElement>, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", taskId);
    // Aggiungi una piccola trasparenza al task trascinato
    if (e.currentTarget) {
      setTimeout(() => {
        (e.target as HTMLElement).style.opacity = "0.5";
      }, 0);
    }
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    setDraggedTaskId(null);
    setDragOverColumn(null);
    (e.target as HTMLElement).style.opacity = "1";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    // Solo se stiamo uscendo dalla colonna (non entrando in un figlio)
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, columnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId && draggedTaskId) {
      handleStatusChange(taskId, columnId);
    }
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  // Filtra i task
  const filteredTasks = project.tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || task.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const statusColumns = [
    {
      id: "todo",
      label: "Da Fare",
      color: "bg-gray-100",
      dropColor: "bg-gray-200",
    },
    {
      id: "in-progress",
      label: "In Corso",
      color: "bg-blue-50",
      dropColor: "bg-blue-100",
    },
    {
      id: "review",
      label: "Review",
      color: "bg-amber-50",
      dropColor: "bg-amber-100",
    },
    {
      id: "done",
      label: "Completati",
      color: "bg-green-50",
      dropColor: "bg-green-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-6">
          {/* Header */}
          <div className="mb-6">
            <Link
              href={`/projects/${projectId}`}
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Torna al progetto
            </Link>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Task - {project.name}
                </h1>
                <p className="text-gray-500">
                  Gestisci le attività e i task del progetto
                </p>
              </div>
              <Button onClick={() => setShowTaskModal(true)}>
                <Plus className="w-4 h-4" />
                Nuovo Task
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Cerca task..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: "all", label: "Tutti gli stati" },
                { value: "todo", label: "Da Fare" },
                { value: "in-progress", label: "In Corso" },
                { value: "review", label: "Review" },
                { value: "done", label: "Completati" },
              ]}
            />
            <Select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              options={[
                { value: "all", label: "Tutte le priorità" },
                { value: "low", label: "Bassa" },
                { value: "medium", label: "Media" },
                { value: "high", label: "Alta" },
                { value: "urgent", label: "Urgente" },
              ]}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {statusColumns.map((col) => {
              const count = project.tasks.filter(
                (t) => t.status === col.id
              ).length;
              return (
                <Card key={col.id} className={`p-4 ${col.color}`}>
                  <p className="text-sm text-gray-600">{col.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </Card>
              );
            })}
          </div>

          {/* Kanban Board */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {statusColumns.map((column) => (
              <div
                key={column.id}
                className={`${
                  dragOverColumn === column.id ? column.dropColor : column.color
                } rounded-xl p-4 transition-colors duration-200 ${
                  dragOverColumn === column.id
                    ? "ring-2 ring-violet-400 ring-opacity-50"
                    : ""
                }`}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">
                    {column.label}
                  </h3>
                  <span className="text-sm text-gray-500 bg-white px-2 py-0.5 rounded-full">
                    {filteredTasks.filter((t) => t.status === column.id).length}
                  </span>
                </div>
                <div className="space-y-3 min-h-[100px]">
                  {filteredTasks
                    .filter((t) => t.status === column.id)
                    .map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDragEnd={handleDragEnd}
                        className={`cursor-grab active:cursor-grabbing ${
                          draggedTaskId === task.id ? "opacity-50" : ""
                        }`}
                      >
                        <Card
                          className={`p-4 hover:shadow-md transition-all bg-white ${
                            draggedTaskId === task.id
                              ? "shadow-lg ring-2 ring-violet-400"
                              : ""
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />
                              <h4 className="font-medium text-gray-900 text-sm">
                                {task.title}
                              </h4>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                          {task.description && (
                            <p className="text-xs text-gray-500 mb-3 line-clamp-2 ml-6">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between ml-6">
                            <PriorityBadge priority={task.priority} />
                            {task.assignee && (
                              <Avatar name={task.assignee.name} size="sm" />
                            )}
                          </div>
                          {task.dueDate && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-gray-400 ml-6">
                              <Calendar className="w-3 h-3" />
                              {new Date(task.dueDate).toLocaleDateString(
                                "it-IT"
                              )}
                            </div>
                          )}
                        </Card>
                      </div>
                    ))}
                  {filteredTasks.filter((t) => t.status === column.id)
                    .length === 0 && (
                    <div
                      className={`text-center py-8 text-gray-400 text-sm border-2 border-dashed rounded-lg ${
                        dragOverColumn === column.id
                          ? "border-violet-400 bg-violet-50"
                          : "border-gray-200"
                      }`}
                    >
                      {dragOverColumn === column.id
                        ? "Rilascia qui"
                        : "Nessun task"}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Create Task Modal */}
      <Modal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        title="Nuovo Task"
      >
        <div className="space-y-4">
          <Input
            label="Titolo"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Es: Implementare login"
          />
          <TextArea
            label="Descrizione"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            placeholder="Descrivi il task..."
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priorità"
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({ ...newTask, priority: e.target.value as any })
              }
              options={[
                { value: "low", label: "Bassa" },
                { value: "medium", label: "Media" },
                { value: "high", label: "Alta" },
                { value: "urgent", label: "Urgente" },
              ]}
            />
            <Select
              label="Stato"
              value={newTask.status}
              onChange={(e) =>
                setNewTask({ ...newTask, status: e.target.value as any })
              }
              options={[
                { value: "todo", label: "Da Fare" },
                { value: "in-progress", label: "In Corso" },
                { value: "review", label: "Review" },
                { value: "done", label: "Completato" },
              ]}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowTaskModal(false)}>
              Annulla
            </Button>
            <Button onClick={handleCreateTask}>Crea Task</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
