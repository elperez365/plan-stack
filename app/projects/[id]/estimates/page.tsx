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
import {
  EstimationItem,
  EstimationCategory,
  Complexity,
  ConfidenceLevel,
} from "../../../types";
import {
  ArrowLeft,
  Plus,
  Calculator,
  Clock,
  TrendingUp,
  DollarSign,
  Edit,
  Trash2,
  FileText,
  Download,
  BarChart3,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

export default function EstimatesPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const {
    projects,
    addEstimation,
    addEstimationItem,
    updateEstimation,
    updateEstimationItem,
  } = useProjectStore();
  const project = projects.find((p) => p.id === projectId);

  const [showNewEstimationModal, setShowNewEstimationModal] = useState(false);
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [selectedEstimationId, setSelectedEstimationId] = useState<
    string | null
  >(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["development", "design", "testing"])
  );

  const [newEstimation, setNewEstimation] = useState({
    title: "",
    version: "1.0",
    description: "",
    bufferPercentage: 20,
  });

  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    category: "development" as EstimationCategory,
    estimatedHours: 8,
    complexity: "medium" as Complexity,
    confidence: "medium" as ConfidenceLevel,
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

  const selectedEstimation = selectedEstimationId
    ? project.estimations.find((e) => e.id === selectedEstimationId)
    : project.estimations[0];

  const getCategoryLabel = (category: EstimationCategory): string => {
    const labels: Record<EstimationCategory, string> = {
      development: "Sviluppo",
      design: "Design",
      testing: "Testing",
      devops: "DevOps",
      management: "Gestione",
      documentation: "Documentazione",
      other: "Altro",
    };
    return labels[category];
  };

  const getCategoryIcon = (category: EstimationCategory) => {
    const icons: Record<EstimationCategory, typeof Calculator> = {
      development: Calculator,
      design: FileText,
      testing: Check,
      devops: TrendingUp,
      management: Clock,
      documentation: FileText,
      other: Calculator,
    };
    const Icon = icons[category];
    return <Icon className="w-5 h-5" />;
  };

  const getComplexityLabel = (complexity: Complexity): string => {
    return { low: "Bassa", medium: "Media", high: "Alta", critical: "Critica" }[
      complexity
    ];
  };

  const getComplexityColor = (
    complexity: Complexity
  ): "success" | "warning" | "danger" | "default" => {
    return {
      low: "success",
      medium: "warning",
      high: "danger",
      critical: "danger",
    }[complexity] as "success" | "warning" | "danger" | "default";
  };

  const getConfidenceLabel = (confidence: ConfidenceLevel): string => {
    return { low: "Bassa", medium: "Media", high: "Alta" }[confidence];
  };

  const getConfidenceColor = (confidence: ConfidenceLevel): string => {
    return {
      low: "text-red-500",
      medium: "text-amber-500",
      high: "text-green-500",
    }[confidence];
  };

  // Calculate stats
  const calculateEstimationStats = (estimation: typeof selectedEstimation) => {
    if (!estimation)
      return {
        totalHours: 0,
        totalWithBuffer: 0,
        bufferHours: 0,
        categories: {},
      };

    const categories: Record<string, { hours: number; count: number }> = {};
    let totalHours = 0;

    estimation.items.forEach((item) => {
      totalHours += item.estimatedHours;
      if (!categories[item.category]) {
        categories[item.category] = { hours: 0, count: 0 };
      }
      categories[item.category].hours += item.estimatedHours;
      categories[item.category].count += 1;
    });

    const bufferHours = totalHours * (estimation.bufferPercentage / 100);
    const totalWithBuffer = totalHours + bufferHours;

    return { totalHours, totalWithBuffer, bufferHours, categories };
  };

  const stats = calculateEstimationStats(selectedEstimation);

  const handleCreateEstimation = () => {
    if (newEstimation.title.trim()) {
      const estimation = addEstimation(projectId, {
        title: newEstimation.title,
        version: newEstimation.version,
        status: "draft",
        description: newEstimation.description,
        bufferPercentage: newEstimation.bufferPercentage,
        createdBy: project.team[0],
      });
      setSelectedEstimationId(estimation.id);
      setShowNewEstimationModal(false);
      setNewEstimation({
        title: "",
        version: "1.0",
        description: "",
        bufferPercentage: 20,
      });
    }
  };

  const handleCreateItem = () => {
    if (newItem.title.trim() && selectedEstimation) {
      addEstimationItem(projectId, selectedEstimation.id, {
        title: newItem.title,
        description: newItem.description,
        category: newItem.category,
        estimatedHours: newItem.estimatedHours,
        complexity: newItem.complexity,
        confidence: newItem.confidence,
      });
      setShowNewItemModal(false);
      setNewItem({
        title: "",
        description: "",
        category: "development",
        estimatedHours: 8,
        complexity: "medium",
        confidence: "medium",
      });
    }
  };

  const toggleCategory = (category: string) => {
    const updated = new Set(expandedCategories);
    if (updated.has(category)) {
      updated.delete(category);
    } else {
      updated.add(category);
    }
    setExpandedCategories(updated);
  };

  // Group items by category
  const itemsByCategory =
    selectedEstimation?.items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, EstimationItem[]>) || {};

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
              Stime &amp; Effort
            </h1>
            <p className="text-gray-500 mt-1">
              {project.name} - Pianificazione effort
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* <Link href="/estimates">
                  <Button variant="secondary">
                    <ExternalLink className="w-4 h-4" />
                    Stime Management
                  </Button>
                </Link> */}
            <Button onClick={() => setShowNewEstimationModal(true)}>
              <Plus className="w-4 h-4" />
              Nuova Stima
            </Button>
          </div>
        </div>
      </div>

      {project.estimations.length === 0 ? (
        <EmptyState
          icon={Calculator}
          title="Nessuna stima presente"
          description="Crea una stima per pianificare le ore di lavoro e i costi del progetto."
          action={{
            label: "Crea Stima",
            onClick: () => setShowNewEstimationModal(true),
          }}
        />
      ) : (
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Estimations */}
          <div className="col-span-3">
            <Card>
              <CardHeader className="py-3">
                <h3 className="font-medium text-gray-700">Documenti</h3>
              </CardHeader>
              <div className="divide-y divide-gray-100">
                {project.estimations.map((estimation) => (
                  <button
                    key={estimation.id}
                    onClick={() => setSelectedEstimationId(estimation.id)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedEstimation?.id === estimation.id
                        ? "bg-violet-50 border-l-2 border-violet-600"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900 text-sm">
                        {estimation.title}
                      </span>
                      <Badge
                        variant={
                          estimation.status === "approved"
                            ? "success"
                            : estimation.status === "review"
                            ? "warning"
                            : "default"
                        }
                        size="sm"
                      >
                        v{estimation.version}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      {estimation.items.length} voci
                    </p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Quick Stats */}
            {selectedEstimation && (
              <Card className="mt-4">
                <CardHeader className="py-3">
                  <h3 className="font-medium text-gray-700">Riepilogo</h3>
                </CardHeader>
                <CardContent className="py-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Ore base</span>
                    <span className="font-medium">{stats.totalHours}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Buffer ({selectedEstimation.bufferPercentage}%)
                    </span>
                    <span className="font-medium text-amber-600">
                      +{stats.bufferHours?.toFixed(0)}h
                    </span>
                  </div>
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Ore totali
                      </span>
                      <span className="font-bold text-lg">
                        {stats.totalWithBuffer.toFixed(0)}h
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            {selectedEstimation && (
              <>
                {/* Estimation Header */}
                <Card className="mb-6">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-xl font-bold text-gray-900">
                            {selectedEstimation.title}
                          </h2>
                          <Badge
                            variant={
                              selectedEstimation.status === "approved"
                                ? "success"
                                : selectedEstimation.status === "review"
                                ? "warning"
                                : "default"
                            }
                          >
                            {selectedEstimation.status === "approved"
                              ? "Approvato"
                              : selectedEstimation.status === "review"
                              ? "In Review"
                              : "Bozza"}
                          </Badge>
                        </div>
                        <p className="text-gray-500">
                          {selectedEstimation.description}
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

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-4">
                      {Object.entries(stats.categories).map(
                        ([category, data]) => (
                          <div
                            key={category}
                            className="p-3 bg-gray-50 rounded-xl"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {getCategoryIcon(category as EstimationCategory)}
                              <span className="text-xs text-gray-500">
                                {getCategoryLabel(
                                  category as EstimationCategory
                                )}
                              </span>
                            </div>
                            <p className="text-xl font-bold text-gray-900">
                              {data.hours}h
                            </p>
                            <p className="text-xs text-gray-400">
                              {data.count} voci
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600 font-medium">
                      Dettaglio voci
                    </span>
                  </div>
                  <Button onClick={() => setShowNewItemModal(true)}>
                    <Plus className="w-4 h-4" />
                    Aggiungi Voce
                  </Button>
                </div>

                {/* Items by Category */}
                <div className="space-y-4">
                  {Object.entries(itemsByCategory).map(([category, items]) => (
                    <Card key={category}>
                      <button
                        onClick={() => toggleCategory(category)}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          {getCategoryIcon(category as EstimationCategory)}
                          <span className="font-medium text-gray-900">
                            {getCategoryLabel(category as EstimationCategory)}
                          </span>
                          <Badge size="sm">{items.length} voci</Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-violet-600">
                            {items.reduce(
                              (sum, item) => sum + item.estimatedHours,
                              0
                            )}
                            h
                          </span>
                          {expandedCategories.has(category) ? (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </button>

                      {expandedCategories.has(category) && (
                        <div className="border-t border-gray-100">
                          {items.map((item, index) => (
                            <div
                              key={item.id}
                              className={`px-4 py-3 flex items-center justify-between ${
                                index !== items.length - 1
                                  ? "border-b border-gray-50"
                                  : ""
                              }`}
                            >
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">
                                  {item.title}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {item.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-4">
                                <Badge
                                  variant={getComplexityColor(item.complexity)}
                                  size="sm"
                                >
                                  {getComplexityLabel(item.complexity)}
                                </Badge>
                                <div className="text-right">
                                  <p className="font-bold text-gray-900">
                                    {item.estimatedHours}h
                                  </p>
                                  <p
                                    className={`text-xs ${getConfidenceColor(
                                      item.confidence
                                    )}`}
                                  >
                                    {getConfidenceLabel(item.confidence)}{" "}
                                    confidenza
                                  </p>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  ))}

                  {Object.keys(itemsByCategory).length === 0 && (
                    <Card className="p-8 text-center">
                      <p className="text-gray-500">
                        Nessuna voce presente. Aggiungi le prime voci di stima.
                      </p>
                    </Card>
                  )}
                </div>

                {/* Buffer Warning */}
                {selectedEstimation.bufferPercentage > 0 && (
                  <Card className="mt-6 bg-amber-50 border-amber-200">
                    <CardContent className="py-3 flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <span className="text-amber-800">
                        Le stime includono un buffer del{" "}
                        {selectedEstimation.bufferPercentage}% per imprevisti e
                        revisioni.
                      </span>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* New Estimation Modal */}
      <Modal
        isOpen={showNewEstimationModal}
        onClose={() => setShowNewEstimationModal(false)}
        title="Nuova Stima"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Titolo"
              value={newEstimation.title}
              onChange={(e) =>
                setNewEstimation({ ...newEstimation, title: e.target.value })
              }
              placeholder="Es: Stima MVP"
            />
            <Input
              label="Versione"
              value={newEstimation.version}
              onChange={(e) =>
                setNewEstimation({ ...newEstimation, version: e.target.value })
              }
              placeholder="1.0"
            />
          </div>
          <TextArea
            label="Descrizione"
            value={newEstimation.description}
            onChange={(e) =>
              setNewEstimation({
                ...newEstimation,
                description: e.target.value,
              })
            }
            placeholder="Descrivi lo scopo di questa stima..."
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Buffer (%)"
              value={newEstimation.bufferPercentage.toString()}
              onChange={(e) =>
                setNewEstimation({
                  ...newEstimation,
                  bufferPercentage: parseInt(e.target.value) || 0,
                })
              }
              placeholder="20"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => setShowNewEstimationModal(false)}
            >
              Annulla
            </Button>
            <Button onClick={handleCreateEstimation}>Crea Stima</Button>
          </div>
        </div>
      </Modal>

      {/* New Item Modal */}
      <Modal
        isOpen={showNewItemModal}
        onClose={() => setShowNewItemModal(false)}
        title="Nuova Voce di Stima"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Titolo"
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            placeholder="Es: Sviluppo API REST"
          />
          <TextArea
            label="Descrizione"
            value={newItem.description}
            onChange={(e) =>
              setNewItem({ ...newItem, description: e.target.value })
            }
            placeholder="Descrivi la voce in dettaglio..."
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Categoria"
              value={newItem.category}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  category: e.target.value as EstimationCategory,
                })
              }
              options={[
                { value: "development", label: "Sviluppo" },
                { value: "design", label: "Design" },
                { value: "testing", label: "Testing" },
                { value: "devops", label: "DevOps" },
                { value: "management", label: "Gestione" },
                { value: "documentation", label: "Documentazione" },
                { value: "other", label: "Altro" },
              ]}
            />
            <Input
              type="number"
              label="Ore Stimate"
              value={newItem.estimatedHours.toString()}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  estimatedHours: parseInt(e.target.value) || 0,
                })
              }
              placeholder="8"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Complessità"
              value={newItem.complexity}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  complexity: e.target.value as Complexity,
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
              label="Livello di Confidenza"
              value={newItem.confidence}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  confidence: e.target.value as ConfidenceLevel,
                })
              }
              options={[
                { value: "low", label: "Bassa" },
                { value: "medium", label: "Media" },
                { value: "high", label: "Alta" },
              ]}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowNewItemModal(false)}>
              Annulla
            </Button>
            <Button onClick={handleCreateItem}>Aggiungi Voce</Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
