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
  TestCase,
  TestCycle,
  TestExecution,
  TestStep,
  TestResult,
  TestPriority,
} from "../../../types";
import {
  ArrowLeft,
  Plus,
  FlaskConical,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Edit,
  Play,
  FileText,
  Download,
  BarChart3,
  ChevronRight,
  Filter,
  Search,
  Zap,
  X,
  ChevronDown,
  Minus,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { v4 as uuidv4 } from "uuid";

export default function TestsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const {
    projects,
    addTestCase,
    addTestCycle,
    addTestExecution,
    updateTestCase,
  } = useProjectStore();
  const project = projects.find((p) => p.id === projectId);

  const [activeTab, setActiveTab] = useState<"cases" | "cycles" | "executions">(
    "cases"
  );
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [showNewCycleModal, setShowNewCycleModal] = useState(false);
  const [showExecutionModal, setShowExecutionModal] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(
    null
  );
  const [selectedCycle, setSelectedCycle] = useState<TestCycle | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [newCase, setNewCase] = useState({
    title: "",
    description: "",
    priority: "medium" as TestPriority,
    type: "manual" as "manual" | "automated",
    preconditions: "",
    steps: [{ stepNumber: 1, action: "", expectedResult: "" }] as Omit<
      TestStep,
      "id"
    >[],
    linkedRequirement: "",
  });

  const [newCycle, setNewCycle] = useState({
    name: "",
    description: "",
    environment: "",
    build: "",
    testCases: [] as string[],
  });

  const [executionResult, setExecutionResult] = useState<{
    result: TestResult;
    notes: string;
    defects: string[];
    executionTime: number;
  }>({
    result: "pending",
    notes: "",
    defects: [],
    executionTime: 0,
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

  const getResultIcon = (result: TestResult) => {
    switch (result) {
      case "passed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "blocked":
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case "skipped":
        return <Minus className="w-4 h-4 text-gray-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getResultLabel = (result: TestResult): string => {
    const labels: Record<TestResult, string> = {
      pending: "In Attesa",
      passed: "Passato",
      failed: "Fallito",
      blocked: "Bloccato",
      skipped: "Saltato",
    };
    return labels[result];
  };

  const getResultColor = (
    result: TestResult
  ): "success" | "danger" | "warning" | "default" => {
    const colors: Record<
      TestResult,
      "success" | "danger" | "warning" | "default"
    > = {
      pending: "default",
      passed: "success",
      failed: "danger",
      blocked: "warning",
      skipped: "default",
    };
    return colors[result];
  };

  const getPriorityLabel = (priority: TestPriority): string => {
    return { low: "Bassa", medium: "Media", high: "Alta", critical: "Critica" }[
      priority
    ];
  };

  const getPriorityColor = (
    priority: TestPriority
  ): "success" | "warning" | "danger" | "default" => {
    return {
      low: "default",
      medium: "warning",
      high: "danger",
      critical: "danger",
    }[priority] as "success" | "warning" | "danger" | "default";
  };

  // Filter test cases
  const filteredCases = project.testCases.filter((tc) => {
    const matchesSearch =
      tc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tc.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || tc.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    totalCases: project.testCases.length,
    activeCases: project.testCases.filter((tc) => tc.status === "active")
      .length,
    totalCycles: project.testCycles.length,
    passRate:
      project.testCycles.length > 0
        ? Math.round(
            project.testCycles.reduce((acc, cycle) => {
              const passed = cycle.executions.filter(
                (e) => e.result === "passed"
              ).length;
              const total = cycle.executions.length;
              return acc + (total > 0 ? (passed / total) * 100 : 0);
            }, 0) / project.testCycles.length
          )
        : 0,
  };

  const handleCreateCase = () => {
    if (newCase.title.trim()) {
      addTestCase(projectId, {
        title: newCase.title,
        description: newCase.description,
        priority: newCase.priority,
        type: newCase.type,
        status: "active",
        preconditions: newCase.preconditions,
        steps: newCase.steps
          .filter((s) => s.action.trim())
          .map((s) => ({ ...s, id: uuidv4() })),
        linkedRequirement: newCase.linkedRequirement || undefined,
        author: project.team[0],
      });
      setShowNewCaseModal(false);
      setNewCase({
        title: "",
        description: "",
        priority: "medium",
        type: "manual",
        preconditions: "",
        steps: [{ stepNumber: 1, action: "", expectedResult: "" }],
        linkedRequirement: "",
      });
    }
  };

  const handleCreateCycle = () => {
    if (newCycle.name.trim()) {
      const cycle = addTestCycle(projectId, {
        name: newCycle.name,
        description: newCycle.description,
        status: "planned",
        environment: newCycle.environment,
        build: newCycle.build,
        testCases: project.testCases.filter((tc) =>
          newCycle.testCases.includes(tc.id)
        ),
        createdBy: project.team[0],
      });
      setSelectedCycle(cycle);
      setShowNewCycleModal(false);
      setNewCycle({
        name: "",
        description: "",
        environment: "",
        build: "",
        testCases: [],
      });
    }
  };

  const handleExecuteTest = (testCase: TestCase, cycle: TestCycle) => {
    addTestExecution(projectId, cycle.id, {
      testCase,
      testCaseId: testCase.id,
      result: executionResult.result,
      executedBy: project.team[0],
      executedAt: new Date().toISOString(),
      notes: executionResult.notes,
      defects: executionResult.defects,
      executionTime: executionResult.executionTime,
    });
    setShowExecutionModal(false);
    setExecutionResult({
      result: "pending",
      notes: "",
      defects: [],
      executionTime: 0,
    });
  };

  const addStep = () => {
    setNewCase({
      ...newCase,
      steps: [
        ...newCase.steps,
        {
          stepNumber: newCase.steps.length + 1,
          action: "",
          expectedResult: "",
        },
      ],
    });
  };

  const removeStep = (index: number) => {
    const updated = newCase.steps.filter((_, i) => i !== index);
    setNewCase({
      ...newCase,
      steps: updated.map((s, i) => ({ ...s, stepNumber: i + 1 })),
    });
  };

  const updateStep = (
    index: number,
    field: "action" | "expectedResult",
    value: string
  ) => {
    const updated = [...newCase.steps];
    updated[index] = { ...updated[index], [field]: value };
    setNewCase({ ...newCase, steps: updated });
  };

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
                  Test Management
                </h1>
                <p className="text-gray-500 mt-1">
                  {project.name} - Gestione test
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="py-4 text-center">
                <FlaskConical className="w-8 h-8 mx-auto mb-2 text-violet-500" />
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalCases}
                </p>
                <p className="text-sm text-gray-500">Test Cases</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4 text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold text-gray-900">
                  {stats.activeCases}
                </p>
                <p className="text-sm text-gray-500">Attivi</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4 text-center">
                <Zap className="w-8 h-8 mx-auto mb-2 text-amber-500" />
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalCycles}
                </p>
                <p className="text-sm text-gray-500">Cicli di Test</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4 text-center">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold text-gray-900">
                  {stats.passRate}%
                </p>
                <p className="text-sm text-gray-500">Pass Rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex gap-8">
              {[
                {
                  key: "cases",
                  label: "Test Cases",
                  count: project.testCases.length,
                },
                {
                  key: "cycles",
                  label: "Cicli di Test",
                  count: project.testCycles.length,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? "border-violet-600 text-violet-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                  <Badge variant="default" size="sm" className="ml-2">
                    {tab.count}
                  </Badge>
                </button>
              ))}
            </nav>
          </div>

          {/* Test Cases Tab */}
          {activeTab === "cases" && (
            <>
              {/* Filters & Actions */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cerca test cases..."
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
                    <option value="active">Attivo</option>
                    <option value="draft">Bozza</option>
                    <option value="deprecated">Deprecato</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/tests">
                    <Button variant="secondary">
                      <ExternalLink className="w-4 h-4" />
                      Test Management
                    </Button>
                  </Link>
                  <Button onClick={() => setShowNewCaseModal(true)}>
                    <Plus className="w-4 h-4" />
                    Nuovo Test Case
                  </Button>
                </div>
              </div>

              {/* Test Cases List */}
              {filteredCases.length === 0 ? (
                <EmptyState
                  icon={FlaskConical}
                  title="Nessun test case"
                  description="Crea il primo test case per iniziare a testare il progetto."
                  action={{
                    label: "Crea Test Case",
                    onClick: () => setShowNewCaseModal(true),
                  }}
                />
              ) : (
                <div className="space-y-3">
                  {filteredCases.map((tc) => (
                    <Card
                      key={tc.id}
                      hover
                      className="cursor-pointer"
                      onClick={() => setSelectedTestCase(tc)}
                    >
                      <CardContent className="py-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            <FlaskConical
                              className={`w-5 h-5 ${
                                tc.type === "automated"
                                  ? "text-blue-500"
                                  : "text-violet-500"
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-sm text-violet-600">
                                {tc.code}
                              </span>
                              <h4 className="font-medium text-gray-900">
                                {tc.title}
                              </h4>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-1 mb-2">
                              {tc.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={getPriorityColor(tc.priority)}
                                size="sm"
                              >
                                {getPriorityLabel(tc.priority)}
                              </Badge>
                              <Badge size="sm">
                                {tc.type === "automated"
                                  ? "Automatico"
                                  : "Manuale"}
                              </Badge>
                              <span className="text-xs text-gray-400">
                                {tc.steps.length} step
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Avatar name={tc.author.name} size="sm" />
                            <ChevronRight className="w-4 h-4 text-gray-300" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Test Cycles Tab */}
          {activeTab === "cycles" && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-700">Cicli di Test</h3>
                <div className="flex items-center gap-2">
                  <Link href="/tests">
                    <Button variant="secondary">
                      <ExternalLink className="w-4 h-4" />
                      Test Management
                    </Button>
                  </Link>
                  <Button onClick={() => setShowNewCycleModal(true)}>
                    <Plus className="w-4 h-4" />
                    Nuovo Ciclo
                  </Button>
                </div>
              </div>

              {project.testCycles.length === 0 ? (
                <EmptyState
                  icon={Zap}
                  title="Nessun ciclo di test"
                  description="Crea un ciclo di test per eseguire i test cases."
                  action={{
                    label: "Crea Ciclo",
                    onClick: () => setShowNewCycleModal(true),
                  }}
                />
              ) : (
                <div className="space-y-4">
                  {project.testCycles.map((cycle) => {
                    const passed = cycle.executions.filter(
                      (e) => e.result === "passed"
                    ).length;
                    const failed = cycle.executions.filter(
                      (e) => e.result === "failed"
                    ).length;
                    const pending =
                      cycle.testCases.length - cycle.executions.length;
                    const passRate =
                      cycle.executions.length > 0
                        ? Math.round((passed / cycle.executions.length) * 100)
                        : 0;

                    return (
                      <Card key={cycle.id}>
                        <CardContent className="py-4">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-bold text-gray-900">
                                  {cycle.name}
                                </h3>
                                <Badge
                                  variant={
                                    cycle.status === "completed"
                                      ? "success"
                                      : cycle.status === "in-progress"
                                      ? "warning"
                                      : "default"
                                  }
                                >
                                  {cycle.status === "completed"
                                    ? "Completato"
                                    : cycle.status === "in-progress"
                                    ? "In Corso"
                                    : "Pianificato"}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500">
                                {cycle.description}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                <span>Ambiente: {cycle.environment}</span>
                                <span>Build: {cycle.build}</span>
                              </div>
                            </div>
                            <Button
                              variant="secondary"
                              onClick={() => setSelectedCycle(cycle)}
                            >
                              <Play className="w-4 h-4" />
                              Esegui Test
                            </Button>
                          </div>

                          {/* Progress */}
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-600">
                                Progresso
                              </span>
                              <span className="text-sm font-medium">
                                {passRate}% Pass Rate
                              </span>
                            </div>
                            <div className="flex h-2 rounded-full overflow-hidden bg-gray-200">
                              <div
                                className="bg-green-500"
                                style={{
                                  width: `${
                                    (passed / cycle.testCases.length) * 100
                                  }%`,
                                }}
                              />
                              <div
                                className="bg-red-500"
                                style={{
                                  width: `${
                                    (failed / cycle.testCases.length) * 100
                                  }%`,
                                }}
                              />
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <CheckCircle className="w-3 h-3 text-green-500" />{" "}
                                {passed} passati
                              </span>
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <XCircle className="w-3 h-3 text-red-500" />{" "}
                                {failed} falliti
                              </span>
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3 text-gray-400" />{" "}
                                {pending} in attesa
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* New Test Case Modal */}
      <Modal
        isOpen={showNewCaseModal}
        onClose={() => setShowNewCaseModal(false)}
        title="Nuovo Test Case"
        size="lg"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <Input
            label="Titolo"
            value={newCase.title}
            onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
            placeholder="Es: Verifica login utente"
          />
          <TextArea
            label="Descrizione"
            value={newCase.description}
            onChange={(e) =>
              setNewCase({ ...newCase, description: e.target.value })
            }
            placeholder="Descrivi lo scopo del test..."
            rows={2}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priorità"
              value={newCase.priority}
              onChange={(e) =>
                setNewCase({
                  ...newCase,
                  priority: e.target.value as TestPriority,
                })
              }
              options={[
                { value: "low", label: "Bassa" },
                { value: "medium", label: "Media" },
                { value: "high", label: "Alta" },
                { value: "critical", label: "Critica" },
              ]}
            />
            <Select
              label="Tipo"
              value={newCase.type}
              onChange={(e) =>
                setNewCase({
                  ...newCase,
                  type: e.target.value as "manual" | "automated",
                })
              }
              options={[
                { value: "manual", label: "Manuale" },
                { value: "automated", label: "Automatico" },
              ]}
            />
          </div>
          <TextArea
            label="Precondizioni"
            value={newCase.preconditions}
            onChange={(e) =>
              setNewCase({ ...newCase, preconditions: e.target.value })
            }
            placeholder="Condizioni necessarie prima dell'esecuzione..."
            rows={2}
          />

          {/* Steps */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Step di Test
            </label>
            <div className="space-y-3">
              {newCase.steps.map((step, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Step {step.stepNumber}
                    </span>
                    {newCase.steps.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStep(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Azione"
                      value={step.action}
                      onChange={(e) =>
                        updateStep(index, "action", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Risultato atteso"
                      value={step.expectedResult}
                      onChange={(e) =>
                        updateStep(index, "expectedResult", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={addStep}>
                <Plus className="w-4 h-4" />
                Aggiungi Step
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="ghost" onClick={() => setShowNewCaseModal(false)}>
              Annulla
            </Button>
            <Button onClick={handleCreateCase}>Crea Test Case</Button>
          </div>
        </div>
      </Modal>

      {/* New Cycle Modal */}
      <Modal
        isOpen={showNewCycleModal}
        onClose={() => setShowNewCycleModal(false)}
        title="Nuovo Ciclo di Test"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Nome"
            value={newCycle.name}
            onChange={(e) => setNewCycle({ ...newCycle, name: e.target.value })}
            placeholder="Es: Ciclo Regressione v1.0"
          />
          <TextArea
            label="Descrizione"
            value={newCycle.description}
            onChange={(e) =>
              setNewCycle({ ...newCycle, description: e.target.value })
            }
            placeholder="Descrivi lo scopo del ciclo..."
            rows={2}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Ambiente"
              value={newCycle.environment}
              onChange={(e) =>
                setNewCycle({ ...newCycle, environment: e.target.value })
              }
              placeholder="Es: Staging"
            />
            <Input
              label="Build"
              value={newCycle.build}
              onChange={(e) =>
                setNewCycle({ ...newCycle, build: e.target.value })
              }
              placeholder="Es: v1.0.0-beta"
            />
          </div>

          {/* Test Case Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Cases ({newCycle.testCases.length} selezionati)
            </label>
            <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
              {project.testCases.length === 0 ? (
                <p className="p-4 text-sm text-gray-500 text-center">
                  Nessun test case disponibile
                </p>
              ) : (
                project.testCases
                  .filter((tc) => tc.status === "active")
                  .map((tc) => (
                    <label
                      key={tc.id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={newCycle.testCases.includes(tc.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewCycle({
                              ...newCycle,
                              testCases: [...newCycle.testCases, tc.id],
                            });
                          } else {
                            setNewCycle({
                              ...newCycle,
                              testCases: newCycle.testCases.filter(
                                (id) => id !== tc.id
                              ),
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                      />
                      <div>
                        <span className="font-mono text-xs text-violet-600">
                          {tc.code}
                        </span>
                        <p className="text-sm text-gray-900">{tc.title}</p>
                      </div>
                    </label>
                  ))
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowNewCycleModal(false)}>
              Annulla
            </Button>
            <Button onClick={handleCreateCycle}>Crea Ciclo</Button>
          </div>
        </div>
      </Modal>

      {/* Test Case Detail Modal */}
      <Modal
        isOpen={!!selectedTestCase}
        onClose={() => setSelectedTestCase(null)}
        title={
          selectedTestCase
            ? `${selectedTestCase.code} - ${selectedTestCase.title}`
            : ""
        }
        size="lg"
      >
        {selectedTestCase && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Badge variant={getPriorityColor(selectedTestCase.priority)}>
                {getPriorityLabel(selectedTestCase.priority)}
              </Badge>
              <Badge>
                {selectedTestCase.type === "automated"
                  ? "Automatico"
                  : "Manuale"}
              </Badge>
              <Badge
                variant={
                  selectedTestCase.status === "active" ? "success" : "default"
                }
              >
                {selectedTestCase.status === "active"
                  ? "Attivo"
                  : selectedTestCase.status}
              </Badge>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Descrizione
              </h4>
              <p className="text-gray-900">{selectedTestCase.description}</p>
            </div>

            {selectedTestCase.preconditions && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Precondizioni
                </h4>
                <p className="text-gray-900">
                  {selectedTestCase.preconditions}
                </p>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Step di Test
              </h4>
              <div className="space-y-2">
                {selectedTestCase.steps.map((step) => (
                  <div
                    key={step.id}
                    className="flex gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-medium">
                      {step.stepNumber}
                    </span>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{step.action}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        → {step.expectedResult}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <Avatar name={selectedTestCase.author.name} size="sm" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedTestCase.author.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Creato il{" "}
                    {format(
                      new Date(selectedTestCase.createdAt),
                      "dd MMM yyyy",
                      { locale: it }
                    )}
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

      {/* Cycle Execution Modal */}
      <Modal
        isOpen={!!selectedCycle}
        onClose={() => setSelectedCycle(null)}
        title={selectedCycle ? `Esegui: ${selectedCycle.name}` : ""}
        size="lg"
      >
        {selectedCycle && (
          <div className="space-y-4">
            <p className="text-gray-500">Seleziona un test case da eseguire:</p>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {selectedCycle.testCases.map((tc) => {
                const execution = selectedCycle.executions.find(
                  (e) => e.testCase.id === tc.id
                );
                return (
                  <div
                    key={tc.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      {execution ? (
                        getResultIcon(execution.result)
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400" />
                      )}
                      <div>
                        <span className="font-mono text-xs text-violet-600">
                          {tc.code}
                        </span>
                        <p className="text-sm font-medium text-gray-900">
                          {tc.title}
                        </p>
                      </div>
                    </div>
                    {execution ? (
                      <Badge variant={getResultColor(execution.result)}>
                        {getResultLabel(execution.result)}
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => {
                          setShowExecutionModal(true);
                          setSelectedTestCase(tc);
                        }}
                      >
                        <Play className="w-4 h-4" />
                        Esegui
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Modal>

      {/* Execution Result Modal */}
      <Modal
        isOpen={showExecutionModal && !!selectedTestCase && !!selectedCycle}
        onClose={() => setShowExecutionModal(false)}
        title={`Esecuzione: ${selectedTestCase?.code}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Risultato
            </label>
            <div className="flex gap-2">
              {(["passed", "failed", "blocked", "skipped"] as TestResult[]).map(
                (result) => (
                  <button
                    key={result}
                    onClick={() =>
                      setExecutionResult({ ...executionResult, result })
                    }
                    className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                      executionResult.result === result
                        ? result === "passed"
                          ? "border-green-500 bg-green-50"
                          : result === "failed"
                          ? "border-red-500 bg-red-50"
                          : result === "blocked"
                          ? "border-amber-500 bg-amber-50"
                          : "border-gray-500 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {getResultIcon(result)}
                    <span className="block text-xs mt-1">
                      {getResultLabel(result)}
                    </span>
                  </button>
                )
              )}
            </div>
          </div>

          <Input
            type="number"
            label="Tempo di esecuzione (minuti)"
            value={executionResult.executionTime.toString()}
            onChange={(e) =>
              setExecutionResult({
                ...executionResult,
                executionTime: parseInt(e.target.value) || 0,
              })
            }
          />

          <TextArea
            label="Note"
            value={executionResult.notes}
            onChange={(e) =>
              setExecutionResult({ ...executionResult, notes: e.target.value })
            }
            placeholder="Osservazioni durante l'esecuzione..."
            rows={3}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => setShowExecutionModal(false)}
            >
              Annulla
            </Button>
            <Button
              onClick={() =>
                selectedTestCase &&
                selectedCycle &&
                handleExecuteTest(selectedTestCase, selectedCycle)
              }
            >
              Salva Risultato
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
