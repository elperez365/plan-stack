"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar, Header } from "../../../components/layout/Navigation";
import { useProjectStore } from "../../../store/projectStore";
import { Card, CardHeader, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Avatar } from "../../../components/ui/Avatar";
import { Input, TextArea, Select } from "../../../components/ui/Input";
import { Modal } from "../../../components/ui/Modal";
import { EmptyState } from "../../../components/ui/EmptyState";
import {
  FunctionalRequirement,
  RequirementType,
  RequirementPriority,
  RequirementStatus,
} from "../../../types";
import {
  ArrowLeft,
  Plus,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
  MessageSquare,
  Link as LinkIcon,
  History,
  Filter,
  Search,
  Download,
  ChevronRight,
  X,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

export default function RequirementsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const {
    projects,
    addFunctionalAnalysis,
    addRequirement,
    updateRequirement,
    updateFunctionalAnalysis,
  } = useProjectStore();
  const project = projects.find((p) => p.id === projectId);

  const [showNewAnalysisModal, setShowNewAnalysisModal] = useState(false);
  const [showNewRequirementModal, setShowNewRequirementModal] = useState(false);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(
    null
  );
  const [selectedRequirement, setSelectedRequirement] =
    useState<FunctionalRequirement | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [newAnalysis, setNewAnalysis] = useState({
    title: "",
    version: "1.0",
    description: "",
    scope: "",
    outOfScope: "",
    assumptions: [""],
    constraints: [""],
  });

  const [newRequirement, setNewRequirement] = useState({
    title: "",
    description: "",
    type: "functional" as RequirementType,
    priority: "should-have" as RequirementPriority,
    acceptanceCriteria: [""],
    dependencies: [] as string[],
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

  const selectedAnalysis = selectedAnalysisId
    ? project.functionalAnalyses.find((a) => a.id === selectedAnalysisId)
    : project.functionalAnalyses[0];

  const filteredRequirements =
    selectedAnalysis?.requirements.filter((req) => {
      const matchesSearch =
        req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || req.status === filterStatus;
      const matchesPriority =
        filterPriority === "all" || req.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    }) || [];

  const handleCreateAnalysis = () => {
    if (newAnalysis.title.trim()) {
      const analysis = addFunctionalAnalysis(projectId, {
        title: newAnalysis.title,
        version: newAnalysis.version,
        status: "draft",
        description: newAnalysis.description,
        scope: newAnalysis.scope,
        outOfScope: newAnalysis.outOfScope,
        assumptions: newAnalysis.assumptions.filter((a) => a.trim()),
        constraints: newAnalysis.constraints.filter((c) => c.trim()),
        createdBy: project.team[0],
      });
      setSelectedAnalysisId(analysis.id);
      setShowNewAnalysisModal(false);
      setNewAnalysis({
        title: "",
        version: "1.0",
        description: "",
        scope: "",
        outOfScope: "",
        assumptions: [""],
        constraints: [""],
      });
    }
  };

  const handleCreateRequirement = () => {
    if (newRequirement.title.trim() && selectedAnalysis) {
      addRequirement(projectId, selectedAnalysis.id, {
        title: newRequirement.title,
        description: newRequirement.description,
        type: newRequirement.type,
        priority: newRequirement.priority,
        status: "draft",
        acceptanceCriteria: newRequirement.acceptanceCriteria.filter((c) =>
          c.trim()
        ),
        dependencies: newRequirement.dependencies,
        author: project.team[0],
      });
      setShowNewRequirementModal(false);
      setNewRequirement({
        title: "",
        description: "",
        type: "functional",
        priority: "should-have",
        acceptanceCriteria: [""],
        dependencies: [],
      });
    }
  };

  const getStatusIcon = (status: RequirementStatus) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "review":
        return <Clock className="w-4 h-4 text-amber-500" />;
      case "rejected":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "implemented":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: RequirementPriority) => {
    switch (priority) {
      case "must-have":
        return "danger";
      case "should-have":
        return "warning";
      case "could-have":
        return "info";
      case "wont-have":
        return "default";
    }
  };

  const getStatusLabel = (status: RequirementStatus) => {
    const labels: Record<RequirementStatus, string> = {
      draft: "Bozza",
      review: "In Review",
      approved: "Approvato",
      implemented: "Implementato",
      rejected: "Rifiutato",
    };
    return labels[status];
  };

  const getPriorityLabel = (priority: RequirementPriority) => {
    const labels: Record<RequirementPriority, string> = {
      "must-have": "Must Have",
      "should-have": "Should Have",
      "could-have": "Could Have",
      "wont-have": "Won't Have",
    };
    return labels[priority];
  };

  // Stats per l'analisi selezionata
  const stats = selectedAnalysis
    ? {
        total: selectedAnalysis.requirements.length,
        approved: selectedAnalysis.requirements.filter(
          (r) => r.status === "approved"
        ).length,
        implemented: selectedAnalysis.requirements.filter(
          (r) => r.status === "implemented"
        ).length,
        mustHave: selectedAnalysis.requirements.filter(
          (r) => r.priority === "must-have"
        ).length,
      }
    : { total: 0, approved: 0, implemented: 0, mustHave: 0 };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-6">
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
                  Analisi Funzionali
                </h1>
                <p className="text-gray-500 mt-1">
                  {project.name} - Documentazione requisiti
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/requirements">
                  <Button variant="secondary">
                    <ExternalLink className="w-4 h-4" />
                    Requisiti Management
                  </Button>
                </Link>
                <Button onClick={() => setShowNewAnalysisModal(true)}>
                  <Plus className="w-4 h-4" />
                  Nuova Analisi
                </Button>
              </div>
            </div>
          </div>

          {project.functionalAnalyses.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Nessuna analisi funzionale"
              description="Crea la prima analisi per documentare i requisiti del progetto in modo strutturato."
              action={{
                label: "Crea Analisi",
                onClick: () => setShowNewAnalysisModal(true),
              }}
            />
          ) : (
            <div className="grid grid-cols-12 gap-6">
              {/* Sidebar Analyses */}
              <div className="col-span-3">
                <Card>
                  <CardHeader className="py-3">
                    <h3 className="font-medium text-gray-700">Documenti</h3>
                  </CardHeader>
                  <div className="divide-y divide-gray-100">
                    {project.functionalAnalyses.map((analysis) => (
                      <button
                        key={analysis.id}
                        onClick={() => setSelectedAnalysisId(analysis.id)}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                          selectedAnalysis?.id === analysis.id
                            ? "bg-violet-50 border-l-2 border-violet-600"
                            : ""
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900 text-sm">
                            {analysis.title}
                          </span>
                          <Badge
                            variant={
                              analysis.status === "approved"
                                ? "success"
                                : analysis.status === "review"
                                ? "warning"
                                : "default"
                            }
                            size="sm"
                          >
                            v{analysis.version}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          {analysis.requirements.length} requisiti
                        </p>
                      </button>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Main Content */}
              <div className="col-span-9">
                {selectedAnalysis && (
                  <>
                    {/* Analysis Header */}
                    <Card className="mb-6">
                      <CardContent className="py-4">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h2 className="text-xl font-bold text-gray-900">
                                {selectedAnalysis.title}
                              </h2>
                              <Badge
                                variant={
                                  selectedAnalysis.status === "approved"
                                    ? "success"
                                    : selectedAnalysis.status === "review"
                                    ? "warning"
                                    : "default"
                                }
                              >
                                {selectedAnalysis.status === "approved"
                                  ? "Approvato"
                                  : selectedAnalysis.status === "review"
                                  ? "In Review"
                                  : "Bozza"}
                              </Badge>
                            </div>
                            <p className="text-gray-500">
                              {selectedAnalysis.description}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                              Esporta
                            </Button>
                            <Button variant="secondary" size="sm">
                              <Edit className="w-4 h-4" />
                              Modifica
                            </Button>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-gray-50 rounded-xl">
                            <p className="text-2xl font-bold text-gray-900">
                              {stats.total}
                            </p>
                            <p className="text-xs text-gray-500">Totali</p>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-xl">
                            <p className="text-2xl font-bold text-green-600">
                              {stats.approved}
                            </p>
                            <p className="text-xs text-gray-500">Approvati</p>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded-xl">
                            <p className="text-2xl font-bold text-blue-600">
                              {stats.implemented}
                            </p>
                            <p className="text-xs text-gray-500">
                              Implementati
                            </p>
                          </div>
                          <div className="text-center p-3 bg-red-50 rounded-xl">
                            <p className="text-2xl font-bold text-red-600">
                              {stats.mustHave}
                            </p>
                            <p className="text-xs text-gray-500">Must Have</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Filters & Actions */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Cerca requisiti..."
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
                          <option value="draft">Bozza</option>
                          <option value="review">In Review</option>
                          <option value="approved">Approvato</option>
                          <option value="implemented">Implementato</option>
                        </select>
                        <select
                          value={filterPriority}
                          onChange={(e) => setFilterPriority(e.target.value)}
                          className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                        >
                          <option value="all">Tutte le priorità</option>
                          <option value="must-have">Must Have</option>
                          <option value="should-have">Should Have</option>
                          <option value="could-have">Could Have</option>
                          <option value="wont-have">Won&apos;t Have</option>
                        </select>
                      </div>
                      <Button onClick={() => setShowNewRequirementModal(true)}>
                        <Plus className="w-4 h-4" />
                        Nuovo Requisito
                      </Button>
                    </div>

                    {/* Requirements List */}
                    <div className="space-y-3">
                      {filteredRequirements.length === 0 ? (
                        <Card className="p-8 text-center">
                          <p className="text-gray-500">
                            Nessun requisito trovato
                          </p>
                        </Card>
                      ) : (
                        filteredRequirements.map((req) => (
                          <Card
                            key={req.id}
                            hover
                            className="cursor-pointer"
                            onClick={() => setSelectedRequirement(req)}
                          >
                            <CardContent className="py-4">
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 mt-1">
                                  {getStatusIcon(req.status)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-mono text-sm text-violet-600">
                                      {req.code}
                                    </span>
                                    <h4 className="font-medium text-gray-900">
                                      {req.title}
                                    </h4>
                                  </div>
                                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                    {req.description}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant={getPriorityColor(req.priority)}
                                      size="sm"
                                    >
                                      {getPriorityLabel(req.priority)}
                                    </Badge>
                                    <Badge size="sm">{req.type}</Badge>
                                    {req.acceptanceCriteria.length > 0 && (
                                      <span className="text-xs text-gray-400">
                                        {req.acceptanceCriteria.length} criteri
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Avatar name={req.author.name} size="sm" />
                                  <ChevronRight className="w-4 h-4 text-gray-300" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* New Analysis Modal */}
      <Modal
        isOpen={showNewAnalysisModal}
        onClose={() => setShowNewAnalysisModal(false)}
        title="Nuova Analisi Funzionale"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Titolo"
              value={newAnalysis.title}
              onChange={(e) =>
                setNewAnalysis({ ...newAnalysis, title: e.target.value })
              }
              placeholder="Es: Analisi Modulo Ordini"
            />
            <Input
              label="Versione"
              value={newAnalysis.version}
              onChange={(e) =>
                setNewAnalysis({ ...newAnalysis, version: e.target.value })
              }
              placeholder="1.0"
            />
          </div>
          <TextArea
            label="Descrizione"
            value={newAnalysis.description}
            onChange={(e) =>
              setNewAnalysis({ ...newAnalysis, description: e.target.value })
            }
            placeholder="Descrivi lo scopo di questa analisi..."
            rows={3}
          />
          <TextArea
            label="Scope"
            value={newAnalysis.scope}
            onChange={(e) =>
              setNewAnalysis({ ...newAnalysis, scope: e.target.value })
            }
            placeholder="Cosa è incluso in questa analisi..."
            rows={2}
          />
          <TextArea
            label="Out of Scope"
            value={newAnalysis.outOfScope}
            onChange={(e) =>
              setNewAnalysis({ ...newAnalysis, outOfScope: e.target.value })
            }
            placeholder="Cosa NON è incluso in questa analisi..."
            rows={2}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => setShowNewAnalysisModal(false)}
            >
              Annulla
            </Button>
            <Button onClick={handleCreateAnalysis}>Crea Analisi</Button>
          </div>
        </div>
      </Modal>

      {/* New Requirement Modal */}
      <Modal
        isOpen={showNewRequirementModal}
        onClose={() => setShowNewRequirementModal(false)}
        title="Nuovo Requisito"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Titolo"
            value={newRequirement.title}
            onChange={(e) =>
              setNewRequirement({ ...newRequirement, title: e.target.value })
            }
            placeholder="Es: L'utente deve poter effettuare il login"
          />
          <TextArea
            label="Descrizione"
            value={newRequirement.description}
            onChange={(e) =>
              setNewRequirement({
                ...newRequirement,
                description: e.target.value,
              })
            }
            placeholder="Descrizione dettagliata del requisito..."
            rows={4}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Tipo"
              value={newRequirement.type}
              onChange={(e) =>
                setNewRequirement({
                  ...newRequirement,
                  type: e.target.value as RequirementType,
                })
              }
              options={[
                { value: "functional", label: "Funzionale" },
                { value: "non-functional", label: "Non Funzionale" },
                { value: "technical", label: "Tecnico" },
                { value: "business", label: "Business" },
                { value: "user-story", label: "User Story" },
              ]}
            />
            <Select
              label="Priorità (MoSCoW)"
              value={newRequirement.priority}
              onChange={(e) =>
                setNewRequirement({
                  ...newRequirement,
                  priority: e.target.value as RequirementPriority,
                })
              }
              options={[
                { value: "must-have", label: "Must Have" },
                { value: "should-have", label: "Should Have" },
                { value: "could-have", label: "Could Have" },
                { value: "wont-have", label: "Won't Have" },
              ]}
            />
          </div>

          {/* Acceptance Criteria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Criteri di Accettazione
            </label>
            <div className="space-y-2">
              {newRequirement.acceptanceCriteria.map((criterion, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={criterion}
                    onChange={(e) => {
                      const updated = [...newRequirement.acceptanceCriteria];
                      updated[index] = e.target.value;
                      setNewRequirement({
                        ...newRequirement,
                        acceptanceCriteria: updated,
                      });
                    }}
                    placeholder={`Criterio ${index + 1}`}
                  />
                  {newRequirement.acceptanceCriteria.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const updated =
                          newRequirement.acceptanceCriteria.filter(
                            (_, i) => i !== index
                          );
                        setNewRequirement({
                          ...newRequirement,
                          acceptanceCriteria: updated,
                        });
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setNewRequirement({
                    ...newRequirement,
                    acceptanceCriteria: [
                      ...newRequirement.acceptanceCriteria,
                      "",
                    ],
                  })
                }
              >
                <Plus className="w-4 h-4" />
                Aggiungi criterio
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => setShowNewRequirementModal(false)}
            >
              Annulla
            </Button>
            <Button onClick={handleCreateRequirement}>Crea Requisito</Button>
          </div>
        </div>
      </Modal>

      {/* Requirement Detail Modal */}
      <Modal
        isOpen={!!selectedRequirement}
        onClose={() => setSelectedRequirement(null)}
        title={
          selectedRequirement
            ? `${selectedRequirement.code} - ${selectedRequirement.title}`
            : ""
        }
        size="lg"
      >
        {selectedRequirement && (
          <div className="space-y-6">
            {/* Status & Priority */}
            <div className="flex items-center gap-4">
              <Badge variant={getPriorityColor(selectedRequirement.priority)}>
                {getPriorityLabel(selectedRequirement.priority)}
              </Badge>
              <Badge
                variant={
                  selectedRequirement.status === "approved"
                    ? "success"
                    : selectedRequirement.status === "review"
                    ? "warning"
                    : "default"
                }
              >
                {getStatusLabel(selectedRequirement.status)}
              </Badge>
              <Badge>{selectedRequirement.type}</Badge>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Descrizione
              </h4>
              <p className="text-gray-900">{selectedRequirement.description}</p>
            </div>

            {/* Acceptance Criteria */}
            {selectedRequirement.acceptanceCriteria.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Criteri di Accettazione
                </h4>
                <ul className="space-y-2">
                  {selectedRequirement.acceptanceCriteria.map(
                    (criterion, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{criterion}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {/* Meta */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <Avatar name={selectedRequirement.author.name} size="sm" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedRequirement.author.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Creato il{" "}
                    {format(
                      new Date(selectedRequirement.createdAt),
                      "dd MMM yyyy",
                      { locale: it }
                    )}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <History className="w-4 h-4" />
                  Storico
                </Button>
                <Button variant="secondary" size="sm">
                  <Edit className="w-4 h-4" />
                  Modifica
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
