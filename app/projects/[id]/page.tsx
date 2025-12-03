"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar, Header } from "../../components/layout/Navigation";
import { useProjectStore } from "../../store/projectStore";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { StatusBadge, PriorityBadge } from "../../components/ui/Badge";
import { Avatar } from "../../components/ui/Avatar";
import {
  ArrowLeft,
  Settings,
  MessageSquare,
  CheckSquare,
  FileText,
  TestTube,
  Calculator,
  Users,
  GitBranch,
  Figma,
  Bug,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const { projects } = useProjectStore();
  const project = projects.find((p) => p.id === projectId);

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

  const completedTasks = project.tasks.filter(
    (t) => t.status === "done"
  ).length;
  const progress =
    project.tasks.length > 0
      ? Math.round((completedTasks / project.tasks.length) * 100)
      : 0;

  const openDefects = project.defects.filter((d) => d.status === "open").length;
  const activeTests = project.testCases.filter(
    (t) => t.status === "active"
  ).length;
  const totalRequirements = project.functionalAnalyses.reduce(
    (s, a) => s + a.requirements.length,
    0
  );

  // Sezioni/Box della pagina progetto
  const sections = [
    {
      id: "tasks",
      title: "Task",
      description: "Gestisci i task e le attività del progetto",
      icon: <CheckSquare className="w-8 h-8" />,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      href: `/projects/${projectId}/tasks`,
      stats: [
        { label: "Totali", value: project.tasks.length },
        { label: "Completati", value: completedTasks },
        {
          label: "In Corso",
          value: project.tasks.filter((t) => t.status === "in-progress").length,
        },
      ],
    },
    {
      id: "requirements",
      title: "Requisiti",
      description: "Analisi funzionali e documentazione requisiti",
      icon: <FileText className="w-8 h-8" />,
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
      href: `/projects/${projectId}/requirements`,
      stats: [
        { label: "Analisi", value: project.functionalAnalyses.length },
        { label: "Requisiti", value: totalRequirements },
        {
          label: "Approvate",
          value: project.functionalAnalyses.filter(
            (a) => a.status === "approved"
          ).length,
        },
      ],
    },
    {
      id: "estimates",
      title: "Stime",
      description: "Preventivi e stime effort del progetto",
      icon: <Calculator className="w-8 h-8" />,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      href: `/projects/${projectId}/estimates`,
      stats: [
        { label: "Stime", value: project.estimations.length },
        {
          label: "Ore Totali",
          value: project.estimations.reduce((s, e) => s + e.totalHours, 0),
        },
        {
          label: "Approvate",
          value: project.estimations.filter((e) => e.status === "approved")
            .length,
        },
      ],
    },
    {
      id: "tests",
      title: "Test",
      description: "Test cases, cicli di test e risultati",
      icon: <TestTube className="w-8 h-8" />,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      href: `/projects/${projectId}/tests`,
      stats: [
        { label: "Test Cases", value: project.testCases.length },
        { label: "Attivi", value: activeTests },
        { label: "Cicli", value: project.testCycles?.length || 0 },
      ],
    },
    {
      id: "defects",
      title: "Defects",
      description: "Bug tracking e gestione difetti",
      icon: <Bug className="w-8 h-8" />,
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      href: `/projects/${projectId}/defects`,
      stats: [
        { label: "Totali", value: project.defects.length },
        { label: "Aperti", value: openDefects },
        {
          label: "Risolti",
          value: project.defects.filter((d) => d.status === "closed").length,
        },
      ],
    },
    {
      id: "messages",
      title: "Comunicazioni",
      description: "Messaggi e annunci del team",
      icon: <MessageSquare className="w-8 h-8" />,
      bgColor: "bg-violet-50",
      iconColor: "text-violet-600",
      href: `/projects/${projectId}/messages`,
      stats: [
        { label: "Messaggi", value: project.messages.length },
        {
          label: "Annunci",
          value: project.messages.filter((m) => m.isAnnouncement).length,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-6">
          {/* Back & Header */}
          <div className="mb-8">
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
                  <h1 className="text-3xl font-bold text-gray-900">
                    {project.name}
                  </h1>
                  <StatusBadge status={project.status} />
                  <PriorityBadge priority={project.priority} />
                </div>
                <p className="text-gray-500 max-w-2xl text-lg">
                  {project.description}
                </p>
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

          {/* Progress Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-5 bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-violet-100 text-sm">Progresso</p>
                  <p className="text-3xl font-bold">{progress}%</p>
                </div>
                <TrendingUp className="w-10 h-10 text-violet-200" />
              </div>
              <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <CheckSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Task</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {completedTasks}/{project.tasks.length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-50 rounded-xl">
                  <Bug className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Bug Aperti</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {openDefects}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-violet-50 rounded-xl">
                  <Users className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Team</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {project.team.length}
                    </p>
                    <div className="flex -space-x-2">
                      {project.team.slice(0, 3).map((member) => (
                        <Avatar key={member.id} name={member.name} size="sm" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sections Grid */}
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Sezioni del Progetto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => (
              <Link key={section.id} href={section.href}>
                <Card
                  hover
                  className="p-6 h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${section.bgColor}`}>
                      <div className={section.iconColor}>{section.icon}</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {section.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    {section.description}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {section.stats.map((stat, i) => (
                      <div key={i} className="text-center">
                        <p className="text-lg font-bold text-gray-900">
                          {stat.value}
                        </p>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Team Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Team</h2>
            </div>
            <Card className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {project.team.map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-col items-center text-center p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <Avatar name={member.name} size="lg" />
                    <p className="font-medium text-gray-900 mt-2 text-sm">
                      {member.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {member.role.replace("-", " ")}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
