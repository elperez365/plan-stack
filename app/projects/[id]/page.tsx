"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar, Header } from "../../components/layout/Navigation";
import { useProjectStore } from "../../store/projectStore";
import { Card, CardHeader, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge, StatusBadge, PriorityBadge } from "../../components/ui/Badge";
import { Avatar, AvatarGroup } from "../../components/ui/Avatar";
import { Input, TextArea, Select } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import {
  ArrowLeft,
  Settings,
  MessageSquare,
  CheckSquare,
  Calendar,
  FileText,
  TestTube,
  Calculator,
  Users,
  Plus,
  Send,
  Megaphone,
  Clock,
  ExternalLink,
  GitBranch,
  Figma,
  MoreHorizontal,
  Edit,
  Trash2,
  Bug,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { it } from "date-fns/locale";

type TabType =
  | "overview"
  | "tasks"
  | "messages"
  | "requirements"
  | "estimates"
  | "tests"
  | "team";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const { projects, addMessage, addTask, updateTask, currentUser } =
    useProjectStore();
  const project = projects.find((p) => p.id === projectId);

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [newMessage, setNewMessage] = useState("");
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
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

  const tabs: {
    id: TabType;
    label: string;
    icon: React.ReactNode;
    count?: number;
  }[] = [
    {
      id: "overview",
      label: "Panoramica",
      icon: <Settings className="w-4 h-4" />,
    },
    {
      id: "tasks",
      label: "Task",
      icon: <CheckSquare className="w-4 h-4" />,
      count: project.tasks.length,
    },
    {
      id: "messages",
      label: "Comunicazioni",
      icon: <MessageSquare className="w-4 h-4" />,
      count: project.messages.length,
    },
    {
      id: "requirements",
      label: "Requisiti",
      icon: <FileText className="w-4 h-4" />,
      count: project.functionalAnalyses.reduce(
        (s, a) => s + a.requirements.length,
        0
      ),
    },
    {
      id: "estimates",
      label: "Stime",
      icon: <Calculator className="w-4 h-4" />,
      count: project.estimations.length,
    },
    {
      id: "tests",
      label: "Test",
      icon: <TestTube className="w-4 h-4" />,
      count: project.testCases.length,
    },
    {
      id: "team",
      label: "Team",
      icon: <Users className="w-4 h-4" />,
      count: project.team.length,
    },
  ];

  const completedTasks = project.tasks.filter(
    (t) => t.status === "done"
  ).length;
  const progress =
    project.tasks.length > 0
      ? Math.round((completedTasks / project.tasks.length) * 100)
      : 0;

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      addMessage(projectId, newMessage, isAnnouncement);
      setNewMessage("");
      setIsAnnouncement(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-6">
          {/* Back & Header */}
          <div className="mb-6">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Torna ai progetti
            </Link>

            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {project.name}
                  </h1>
                  <StatusBadge status={project.status} />
                  <PriorityBadge priority={project.priority} />
                </div>
                <p className="text-gray-500 max-w-2xl">{project.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {project.repository && (
                  <a
                    href={project.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <GitBranch className="w-5 h-5" />
                  </a>
                )}
                {project.figmaLink && (
                  <a
                    href={project.figmaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <Figma className="w-5 h-5" />
                  </a>
                )}
                <Button variant="secondary" size="sm">
                  <Settings className="w-4 h-4" />
                  Impostazioni
                </Button>
              </div>
            </div>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mt-4">
              {project.technologies.map((tech) => (
                <span
                  key={tech.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium bg-white border border-gray-200"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: tech.color }}
                  />
                  {tech.name}
                </span>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-violet-600 text-violet-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.count !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        activeTab === tab.id ? "bg-violet-100" : "bg-gray-100"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Progress Card */}
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Progresso</h3>
                <div className="relative pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      {completedTasks} di {project.tasks.length} task
                    </span>
                    <span className="text-sm font-bold text-violet-600">
                      {progress}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        project.tasks.filter((t) => t.status === "in-progress")
                          .length
                      }
                    </p>
                    <p className="text-xs text-gray-500">In Corso</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        project.tasks.filter((t) => t.status === "review")
                          .length
                      }
                    </p>
                    <p className="text-xs text-gray-500">In Review</p>
                  </div>
                </div>
              </Card>

              {/* Quick Stats */}
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Documentazione
                </h3>
                <div className="space-y-3">
                  <Link
                    href={`/projects/${projectId}/requirements`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm font-medium">
                        Analisi Funzionali
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {project.functionalAnalyses.length}
                    </span>
                  </Link>
                  <Link
                    href={`/projects/${projectId}/estimates`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Calculator className="w-5 h-5 text-orange-600" />
                      <span className="text-sm font-medium">Stime</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {project.estimations.length}
                    </span>
                  </Link>
                  <Link
                    href={`/projects/${projectId}/tests`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <TestTube className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium">Test Cases</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {project.testCases.length}
                    </span>
                  </Link>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Bug className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium">Bug Aperti</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {
                        project.defects.filter((d) => d.status === "open")
                          .length
                      }
                    </span>
                  </div>
                </div>
              </Card>

              {/* Team */}
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Team</h3>
                <div className="space-y-3">
                  {project.team.slice(0, 5).map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar name={member.name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {member.name}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {member.role.replace("-", " ")}
                        </p>
                      </div>
                    </div>
                  ))}
                  {project.team.length > 5 && (
                    <p className="text-sm text-gray-500 text-center">
                      +{project.team.length - 5} altri membri
                    </p>
                  )}
                </div>
              </Card>
            </div>
          )}

          {activeTab === "tasks" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Task del Progetto</h2>
                <Button onClick={() => setShowTaskModal(true)} size="sm">
                  <Plus className="w-4 h-4" />
                  Nuovo Task
                </Button>
              </div>

              {/* Kanban Board */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {(["todo", "in-progress", "review", "done"] as const).map(
                  (status) => (
                    <div key={status} className="bg-gray-100 rounded-xl p-4">
                      <h3 className="font-medium text-gray-700 mb-3 capitalize">
                        {status === "todo"
                          ? "Da Fare"
                          : status === "in-progress"
                          ? "In Corso"
                          : status === "review"
                          ? "Review"
                          : "Completati"}
                        <span className="ml-2 text-gray-400">
                          (
                          {
                            project.tasks.filter((t) => t.status === status)
                              .length
                          }
                          )
                        </span>
                      </h3>
                      <div className="space-y-2">
                        {project.tasks
                          .filter((t) => t.status === status)
                          .map((task) => (
                            <Card
                              key={task.id}
                              className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                            >
                              <h4 className="text-sm font-medium text-gray-900 mb-2">
                                {task.title}
                              </h4>
                              <div className="flex items-center justify-between">
                                <PriorityBadge priority={task.priority} />
                                {task.assignee && (
                                  <Avatar name={task.assignee.name} size="sm" />
                                )}
                              </div>
                            </Card>
                          ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="max-w-4xl">
              <Card>
                <CardContent className="p-0">
                  {/* Messages List */}
                  <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                    {project.messages.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        Nessun messaggio ancora. Inizia la conversazione!
                      </div>
                    ) : (
                      [...project.messages].reverse().map((message) => (
                        <div
                          key={message.id}
                          className={`p-4 ${
                            message.isAnnouncement ? "bg-amber-50" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar name={message.author.name} size="sm" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-gray-900">
                                  {message.author.name}
                                </span>
                                {message.isAnnouncement && (
                                  <Badge variant="warning">
                                    <Megaphone className="w-3 h-3 mr-1" />
                                    Annuncio
                                  </Badge>
                                )}
                                <span className="text-xs text-gray-400">
                                  {formatDistanceToNow(
                                    new Date(message.createdAt),
                                    { addSuffix: true, locale: it }
                                  )}
                                </span>
                              </div>
                              <p className="text-gray-700">{message.content}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-100">
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <TextArea
                          placeholder="Scrivi un messaggio..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          rows={2}
                        />
                        <div className="flex items-center gap-2 mt-2">
                          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isAnnouncement}
                              onChange={(e) =>
                                setIsAnnouncement(e.target.checked)
                              }
                              className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                            />
                            <Megaphone className="w-4 h-4" />
                            Invia come annuncio
                          </label>
                        </div>
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                      >
                        <Send className="w-4 h-4" />
                        Invia
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "requirements" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Analisi Funzionali</h2>
                <Link href={`/projects/${projectId}/requirements`}>
                  <Button size="sm">
                    <Plus className="w-4 h-4" />
                    Nuova Analisi
                  </Button>
                </Link>
              </div>
              {project.functionalAnalyses.length === 0 ? (
                <Card className="p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">
                    Nessuna analisi funzionale
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Crea la prima analisi per documentare i requisiti del
                    progetto.
                  </p>
                  <Link href={`/projects/${projectId}/requirements`}>
                    <Button>Crea Analisi</Button>
                  </Link>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.functionalAnalyses.map((analysis) => (
                    <Link
                      key={analysis.id}
                      href={`/projects/${projectId}/requirements`}
                    >
                      <Card hover className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">
                            {analysis.title}
                          </h3>
                          <Badge
                            variant={
                              analysis.status === "approved"
                                ? "success"
                                : analysis.status === "review"
                                ? "warning"
                                : "default"
                            }
                          >
                            {analysis.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">
                          {analysis.description}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            {analysis.requirements.length} requisiti
                          </span>
                          <span className="text-gray-400">
                            v{analysis.version}
                          </span>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "estimates" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Stime e Preventivi</h2>
                <Link href={`/projects/${projectId}/estimates`}>
                  <Button size="sm">
                    <Plus className="w-4 h-4" />
                    Nuova Stima
                  </Button>
                </Link>
              </div>
              {project.estimations.length === 0 ? (
                <Card className="p-8 text-center">
                  <Calculator className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">
                    Nessuna stima
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Crea la prima stima per quantificare l&apos;effort del
                    progetto.
                  </p>
                  <Link href={`/projects/${projectId}/estimates`}>
                    <Button>Crea Stima</Button>
                  </Link>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.estimations.map((estimation) => (
                    <Link
                      key={estimation.id}
                      href={`/projects/${projectId}/estimates`}
                    >
                      <Card hover className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">
                            {estimation.title}
                          </h3>
                          <Badge
                            variant={
                              estimation.status === "approved"
                                ? "success"
                                : estimation.status === "review"
                                ? "warning"
                                : "default"
                            }
                          >
                            {estimation.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-xl font-bold text-gray-900">
                              {estimation.totalHours}h
                            </p>
                            <p className="text-xs text-gray-500">Ore Totali</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-xl font-bold text-gray-900">
                              {estimation.items.length}
                            </p>
                            <p className="text-xs text-gray-500">Voci</p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "tests" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Test Cases</h2>
                <Link href={`/projects/${projectId}/tests`}>
                  <Button size="sm">
                    <Plus className="w-4 h-4" />
                    Nuovo Test
                  </Button>
                </Link>
              </div>
              {project.testCases.length === 0 ? (
                <Card className="p-8 text-center">
                  <TestTube className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">
                    Nessun test case
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Crea il primo test case per verificare la qualità del
                    progetto.
                  </p>
                  <Link href={`/projects/${projectId}/tests`}>
                    <Button>Crea Test</Button>
                  </Link>
                </Card>
              ) : (
                <div className="space-y-2">
                  {project.testCases.map((tc) => (
                    <Card key={tc.id} hover className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm text-violet-600">
                            {tc.code}
                          </span>
                          <span className="font-medium text-gray-900">
                            {tc.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              tc.priority === "critical"
                                ? "danger"
                                : tc.priority === "high"
                                ? "warning"
                                : "default"
                            }
                          >
                            {tc.priority}
                          </Badge>
                          <Badge>{tc.type}</Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "team" && (
            <div className="max-w-2xl">
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">Membri del Team</h2>
                </CardHeader>
                <CardContent className="divide-y divide-gray-100">
                  {project.team.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between py-3"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar name={member.name} />
                        <div>
                          <p className="font-medium text-gray-900">
                            {member.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <Badge>{member.role.replace("-", " ")}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
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
