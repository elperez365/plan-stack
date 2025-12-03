"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "../../../components/layout/AppLayout";
import { useProjectStore } from "../../../store/projectStore";
import { Card, CardHeader, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Avatar } from "../../../components/ui/Avatar";
import { Input, TextArea, Select } from "../../../components/ui/Input";
import { Modal } from "../../../components/ui/Modal";
import { EmptyState } from "../../../components/ui/EmptyState";
import { Defect, DefectSeverity, DefectStatus } from "../../../types";
import {
  ArrowLeft,
  Plus,
  Bug,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  XCircle,
  Edit,
  Trash2,
  Link as LinkIcon,
  ChevronRight,
  Filter,
  Search,
  BarChart3,
  TrendingUp,
  Target,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

export default function DefectsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const { projects, users, addDefect, updateDefect } = useProjectStore();
  const project = projects.find((p) => p.id === projectId);

  const [showNewDefectModal, setShowNewDefectModal] = useState(false);
  const [selectedDefect, setSelectedDefect] = useState<Defect | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [newDefect, setNewDefect] = useState({
    title: "",
    description: "",
    severity: "medium" as DefectSeverity,
    stepsToReproduce: [""],
    expectedBehavior: "",
    actualBehavior: "",
    environment: "",
    linkedTestCase: "",
    linkedRequirement: "",
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

  const getSeverityIcon = (severity: DefectSeverity) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "high":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case "medium":
        return <Info className="w-4 h-4 text-amber-500" />;
      case "low":
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getSeverityLabel = (severity: DefectSeverity): string => {
    return { critical: "Critico", high: "Alto", medium: "Medio", low: "Basso" }[
      severity
    ];
  };

  const getSeverityColor = (
    severity: DefectSeverity
  ): "danger" | "warning" | "info" | "default" => {
    return {
      critical: "danger",
      high: "danger",
      medium: "warning",
      low: "info",
    }[severity] as "danger" | "warning" | "info" | "default";
  };

  const getStatusIcon = (status: DefectStatus) => {
    switch (status) {
      case "closed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-amber-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-gray-400" />;
      case "reopened":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Bug className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: DefectStatus): string => {
    const labels: Record<DefectStatus, string> = {
      open: "Aperto",
      "in-progress": "In Corso",
      resolved: "Risolto",
      closed: "Chiuso",
      reopened: "Riaperto",
      rejected: "Rifiutato",
    };
    return labels[status];
  };

  const getStatusColor = (
    status: DefectStatus
  ): "success" | "warning" | "danger" | "info" | "default" => {
    const colors: Record<
      DefectStatus,
      "success" | "warning" | "danger" | "info" | "default"
    > = {
      open: "danger",
      "in-progress": "warning",
      resolved: "info",
      closed: "success",
      reopened: "danger",
      rejected: "default",
    };
    return colors[status];
  };

  // Filter defects
  const filteredDefects = project.defects.filter((defect) => {
    const matchesSearch =
      defect.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      defect.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || defect.status === filterStatus;
    const matchesSeverity =
      filterSeverity === "all" || defect.severity === filterSeverity;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  // Stats
  const stats = {
    total: project.defects.length,
    open: project.defects.filter(
      (d) => d.status === "open" || d.status === "reopened"
    ).length,
    inProgress: project.defects.filter((d) => d.status === "in-progress")
      .length,
    resolved: project.defects.filter(
      (d) => d.status === "resolved" || d.status === "closed"
    ).length,
    critical: project.defects.filter(
      (d) => d.severity === "critical" && d.status !== "closed"
    ).length,
  };

  const handleCreateDefect = () => {
    if (newDefect.title.trim()) {
      addDefect(projectId, {
        title: newDefect.title,
        description: newDefect.description,
        severity: newDefect.severity,
        priority: "medium",
        status: "open",
        stepsToReproduce: newDefect.stepsToReproduce.filter((s) => s.trim()),
        expectedBehavior: newDefect.expectedBehavior,
        actualBehavior: newDefect.actualBehavior,
        environment: newDefect.environment,
        linkedTestCase: newDefect.linkedTestCase || undefined,
        linkedRequirement: newDefect.linkedRequirement || undefined,
        reportedBy: project.team[0],
        attachments: [],
      });
      setShowNewDefectModal(false);
      setNewDefect({
        title: "",
        description: "",
        severity: "medium",
        stepsToReproduce: [""],
        expectedBehavior: "",
        actualBehavior: "",
        environment: "",
        linkedTestCase: "",
        linkedRequirement: "",
      });
    }
  };

  const handleStatusChange = (defectId: string, newStatus: DefectStatus) => {
    updateDefect(projectId, defectId, {
      status: newStatus,
      ...(newStatus === "resolved" || newStatus === "closed"
        ? { resolvedAt: new Date().toISOString() }
        : {}),
    });
    setSelectedDefect(null);
  };

  const addStep = () => {
    setNewDefect({
      ...newDefect,
      stepsToReproduce: [...newDefect.stepsToReproduce, ""],
    });
  };

  const updateStep = (index: number, value: string) => {
    const updated = [...newDefect.stepsToReproduce];
    updated[index] = value;
    setNewDefect({ ...newDefect, stepsToReproduce: updated });
  };

  const removeStep = (index: number) => {
    const updated = newDefect.stepsToReproduce.filter((_, i) => i !== index);
    setNewDefect({ ...newDefect, stepsToReproduce: updated });
  };

  return (
    <AppLayout>
      {/* Breadcrumb */}
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
              Defects &amp; Bug
            </h1>
            <p className="text-gray-500 mt-1">
              {project.name} - Gestione anomalie
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* <Link href="/defects">
                  <Button variant="secondary">
                    <ExternalLink className="w-4 h-4" />
                    Defects Management
                  </Button>
                </Link> */}
            <Button onClick={() => setShowNewDefectModal(true)}>
              <Plus className="w-4 h-4" />
              Segnala Bug
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="py-4 text-center">
            <Bug className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-500">Totali</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <p className="text-2xl font-bold text-red-600">{stats.open}</p>
            <p className="text-sm text-gray-500">Aperti</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-amber-500" />
            <p className="text-2xl font-bold text-amber-600">
              {stats.inProgress}
            </p>
            <p className="text-sm text-gray-500">In Corso</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold text-green-600">
              {stats.resolved}
            </p>
            <p className="text-sm text-gray-500">Risolti</p>
          </CardContent>
        </Card>
        <Card className={stats.critical > 0 ? "bg-red-50 border-red-200" : ""}>
          <CardContent className="py-4 text-center">
            <AlertTriangle
              className={`w-8 h-8 mx-auto mb-2 ${
                stats.critical > 0 ? "text-red-600" : "text-gray-400"
              }`}
            />
            <p
              className={`text-2xl font-bold ${
                stats.critical > 0 ? "text-red-600" : "text-gray-900"
              }`}
            >
              {stats.critical}
            </p>
            <p className="text-sm text-gray-500">Critici Aperti</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca defects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">Tutti gli stati</option>
            <option value="open">Aperto</option>
            <option value="in-progress">In Corso</option>
            <option value="resolved">Risolto</option>
            <option value="closed">Chiuso</option>
            <option value="reopened">Riaperto</option>
          </select>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">Tutte le severity</option>
            <option value="critical">Critico</option>
            <option value="high">Alto</option>
            <option value="medium">Medio</option>
            <option value="low">Basso</option>
          </select>
        </div>
      </div>

      {/* Defects List */}
      {filteredDefects.length === 0 && project.defects.length === 0 ? (
        <EmptyState
          icon={Bug}
          title="Nessun defect registrato"
          description="Ottimo! Non ci sono bug segnalati per questo progetto."
          action={{
            label: "Segnala Bug",
            onClick: () => setShowNewDefectModal(true),
          }}
        />
      ) : filteredDefects.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">
            Nessun defect corrisponde ai filtri selezionati
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredDefects.map((defect) => (
            <Card
              key={defect.id}
              hover
              className="cursor-pointer"
              onClick={() => setSelectedDefect(defect)}
            >
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getSeverityIcon(defect.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-red-600">
                        {defect.code}
                      </span>
                      <h4 className="font-medium text-gray-900">
                        {defect.title}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1 mb-2">
                      {defect.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={getSeverityColor(defect.severity)}
                        size="sm"
                      >
                        {getSeverityLabel(defect.severity)}
                      </Badge>
                      <Badge variant={getStatusColor(defect.status)} size="sm">
                        {getStatusLabel(defect.status)}
                      </Badge>
                      {defect.assignedTo && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <span>→</span>
                          <Avatar name={defect.assignedTo.name} size="xs" />
                          <span>{defect.assignedTo.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>
                      {format(new Date(defect.createdAt), "dd/MM/yy", {
                        locale: it,
                      })}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* New Defect Modal */}
      <Modal
        isOpen={showNewDefectModal}
        onClose={() => setShowNewDefectModal(false)}
        title="Segnala Bug"
        size="lg"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <Input
            label="Titolo"
            value={newDefect.title}
            onChange={(e) =>
              setNewDefect({ ...newDefect, title: e.target.value })
            }
            placeholder="Es: Errore nel salvataggio del form"
          />
          <TextArea
            label="Descrizione"
            value={newDefect.description}
            onChange={(e) =>
              setNewDefect({ ...newDefect, description: e.target.value })
            }
            placeholder="Descrivi il bug in dettaglio..."
            rows={3}
          />
          <Select
            label="Severity"
            value={newDefect.severity}
            onChange={(e) =>
              setNewDefect({
                ...newDefect,
                severity: e.target.value as DefectSeverity,
              })
            }
            options={[
              { value: "low", label: "🔵 Basso - Non blocca l'uso" },
              { value: "medium", label: "🟡 Medio - Impatto limitato" },
              { value: "high", label: "🟠 Alto - Impatto significativo" },
              { value: "critical", label: "🔴 Critico - Blocca l'uso" },
            ]}
          />

          {/* Steps to Reproduce */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passi per Riprodurre
            </label>
            <div className="space-y-2">
              {newDefect.stepsToReproduce.map((step, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  <Input
                    value={step}
                    onChange={(e) => updateStep(index, e.target.value)}
                    placeholder={`Passo ${index + 1}`}
                  />
                  {newDefect.stepsToReproduce.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStep(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={addStep}>
                <Plus className="w-4 h-4" />
                Aggiungi passo
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextArea
              label="Comportamento Atteso"
              value={newDefect.expectedBehavior}
              onChange={(e) =>
                setNewDefect({ ...newDefect, expectedBehavior: e.target.value })
              }
              placeholder="Cosa dovrebbe succedere..."
              rows={2}
            />
            <TextArea
              label="Comportamento Attuale"
              value={newDefect.actualBehavior}
              onChange={(e) =>
                setNewDefect({ ...newDefect, actualBehavior: e.target.value })
              }
              placeholder="Cosa succede invece..."
              rows={2}
            />
          </div>

          <Input
            label="Ambiente"
            value={newDefect.environment}
            onChange={(e) =>
              setNewDefect({ ...newDefect, environment: e.target.value })
            }
            placeholder="Es: Chrome 120, macOS Sonoma"
          />

          {/* Links */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Collega Test Case"
              value={newDefect.linkedTestCase}
              onChange={(e) =>
                setNewDefect({ ...newDefect, linkedTestCase: e.target.value })
              }
              options={[
                { value: "", label: "Nessuno" },
                ...project.testCases.map((tc) => ({
                  value: tc.id,
                  label: `${tc.code} - ${tc.title}`,
                })),
              ]}
            />
            <Select
              label="Collega Requisito"
              value={newDefect.linkedRequirement}
              onChange={(e) =>
                setNewDefect({
                  ...newDefect,
                  linkedRequirement: e.target.value,
                })
              }
              options={[
                { value: "", label: "Nessuno" },
                ...project.functionalAnalyses.flatMap((fa) =>
                  fa.requirements.map((req) => ({
                    value: req.id,
                    label: `${req.code} - ${req.title}`,
                  }))
                ),
              ]}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => setShowNewDefectModal(false)}
            >
              Annulla
            </Button>
            <Button onClick={handleCreateDefect}>Segnala Bug</Button>
          </div>
        </div>
      </Modal>

      {/* Defect Detail Modal */}
      <Modal
        isOpen={!!selectedDefect}
        onClose={() => setSelectedDefect(null)}
        title={
          selectedDefect
            ? `${selectedDefect.code} - ${selectedDefect.title}`
            : ""
        }
        size="lg"
      >
        {selectedDefect && (
          <div className="space-y-6">
            {/* Status & Severity */}
            <div className="flex items-center gap-4">
              <Badge variant={getSeverityColor(selectedDefect.severity)}>
                {getSeverityLabel(selectedDefect.severity)}
              </Badge>
              <Badge variant={getStatusColor(selectedDefect.status)}>
                {getStatusLabel(selectedDefect.status)}
              </Badge>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Descrizione
              </h4>
              <p className="text-gray-900">{selectedDefect.description}</p>
            </div>

            {/* Steps to Reproduce */}
            {selectedDefect.stepsToReproduce.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Passi per Riprodurre
                </h4>
                <ol className="space-y-2">
                  {selectedDefect.stepsToReproduce.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-sm">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Expected vs Actual */}
            <div className="grid grid-cols-2 gap-4">
              {selectedDefect.expectedBehavior && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="text-sm font-medium text-green-700 mb-1">
                    Comportamento Atteso
                  </h4>
                  <p className="text-sm text-green-800">
                    {selectedDefect.expectedBehavior}
                  </p>
                </div>
              )}
              {selectedDefect.actualBehavior && (
                <div className="p-3 bg-red-50 rounded-lg">
                  <h4 className="text-sm font-medium text-red-700 mb-1">
                    Comportamento Attuale
                  </h4>
                  <p className="text-sm text-red-800">
                    {selectedDefect.actualBehavior}
                  </p>
                </div>
              )}
            </div>

            {/* Environment */}
            {selectedDefect.environment && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Ambiente
                </h4>
                <p className="text-gray-700">{selectedDefect.environment}</p>
              </div>
            )}

            {/* Status Actions */}
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-500 mb-3">
                Cambia Stato
              </h4>
              <div className="flex gap-2 flex-wrap">
                {selectedDefect.status !== "in-progress" && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      handleStatusChange(selectedDefect.id, "in-progress")
                    }
                  >
                    <Clock className="w-4 h-4" />
                    Prendi in Carico
                  </Button>
                )}
                {selectedDefect.status !== "resolved" &&
                  selectedDefect.status !== "closed" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        handleStatusChange(selectedDefect.id, "resolved")
                      }
                    >
                      <CheckCircle className="w-4 h-4" />
                      Risolto
                    </Button>
                  )}
                {selectedDefect.status === "resolved" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() =>
                        handleStatusChange(selectedDefect.id, "closed")
                      }
                    >
                      <CheckCircle className="w-4 h-4" />
                      Chiudi
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() =>
                        handleStatusChange(selectedDefect.id, "reopened")
                      }
                    >
                      <AlertCircle className="w-4 h-4" />
                      Riapri
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Meta */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <Avatar name={selectedDefect.reportedBy.name} size="sm" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedDefect.reportedBy.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Segnalato il{" "}
                    {format(new Date(selectedDefect.createdAt), "dd MMM yyyy", {
                      locale: it,
                    })}
                  </p>
                </div>
              </div>
              <Button variant="secondary" size="sm">
                <Edit className="w-4 h-4" />
                Modifica
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </AppLayout>
  );
}
