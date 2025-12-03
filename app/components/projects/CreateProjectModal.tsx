"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input, TextArea, Select } from "../ui/Input";
import { useProjectStore } from "../../store/projectStore";
import { ProjectType, Priority, Technology } from "../../types";
import {
  Monitor,
  Smartphone,
  Server,
  Globe,
  Layers,
  MoreHorizontal,
  X,
  Check,
  Plus,
  Users,
  Calendar,
  Link as LinkIcon,
} from "lucide-react";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const projectTypes: {
  value: ProjectType;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    value: "web",
    label: "Web App",
    icon: <Globe className="w-6 h-6" />,
    description: "Applicazione web responsive",
  },
  {
    value: "mobile",
    label: "Mobile App",
    icon: <Smartphone className="w-6 h-6" />,
    description: "iOS, Android o Cross-platform",
  },
  {
    value: "desktop",
    label: "Desktop App",
    icon: <Monitor className="w-6 h-6" />,
    description: "Applicazione desktop nativa",
  },
  {
    value: "api",
    label: "API / Backend",
    icon: <Server className="w-6 h-6" />,
    description: "Servizi backend e API REST",
  },
  {
    value: "fullstack",
    label: "Full Stack",
    icon: <Layers className="w-6 h-6" />,
    description: "Frontend + Backend completo",
  },
  {
    value: "other",
    label: "Altro",
    icon: <MoreHorizontal className="w-6 h-6" />,
    description: "Altri tipi di progetto",
  },
];

const priorityOptions = [
  { value: "low", label: "Bassa" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
  { value: "urgent", label: "Urgente" },
];

export function CreateProjectModal({
  isOpen,
  onClose,
}: CreateProjectModalProps) {
  const { addProject, technologies, users, currentUser } = useProjectStore();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    type: ProjectType | null;
    priority: Priority;
    selectedTechnologies: Technology[];
    selectedTeam: string[];
    startDate: string;
    endDate: string;
    client: string;
    repository: string;
    figmaLink: string;
  }>({
    name: "",
    description: "",
    type: null,
    priority: "medium",
    selectedTechnologies: [],
    selectedTeam: [],
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    client: "",
    repository: "",
    figmaLink: "",
  });

  const handleTypeSelect = (type: ProjectType) => {
    setFormData({ ...formData, type });
  };

  const handleTechToggle = (tech: Technology) => {
    const isSelected = formData.selectedTechnologies.find(
      (t) => t.id === tech.id
    );
    if (isSelected) {
      setFormData({
        ...formData,
        selectedTechnologies: formData.selectedTechnologies.filter(
          (t) => t.id !== tech.id
        ),
      });
    } else {
      setFormData({
        ...formData,
        selectedTechnologies: [...formData.selectedTechnologies, tech],
      });
    }
  };

  const handleTeamToggle = (userId: string) => {
    const isSelected = formData.selectedTeam.includes(userId);
    if (isSelected) {
      setFormData({
        ...formData,
        selectedTeam: formData.selectedTeam.filter((id) => id !== userId),
      });
    } else {
      setFormData({
        ...formData,
        selectedTeam: [...formData.selectedTeam, userId],
      });
    }
  };

  const handleSubmit = () => {
    const teamMembers = users.filter((u) =>
      formData.selectedTeam.includes(u.id)
    );

    // Aggiungi l'utente corrente al team se non è già presente
    if (currentUser && !teamMembers.find((u) => u.id === currentUser.id)) {
      teamMembers.push(currentUser);
    }

    addProject({
      name: formData.name,
      description: formData.description,
      type: formData.type!,
      status: "planning",
      priority: formData.priority,
      technologies: formData.selectedTechnologies,
      team: teamMembers,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      client: formData.client || undefined,
      repository: formData.repository || undefined,
      figmaLink: formData.figmaLink || undefined,
    });

    // Reset form
    setFormData({
      name: "",
      description: "",
      type: null,
      priority: "medium",
      selectedTechnologies: [],
      selectedTeam: [],
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      client: "",
      repository: "",
      figmaLink: "",
    });
    setStep(1);
    onClose();
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.type !== null;
      case 2:
        return (
          formData.name.trim() !== "" && formData.description.trim() !== ""
        );
      case 3:
        return formData.selectedTechnologies.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const groupedTechnologies = {
    frontend: technologies.filter((t) => t.category === "frontend"),
    backend: technologies.filter((t) => t.category === "backend"),
    database: technologies.filter((t) => t.category === "database"),
    devops: technologies.filter((t) => t.category === "devops"),
    design: technologies.filter((t) => t.category === "design"),
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuovo Progetto" size="lg">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <React.Fragment key={s}>
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                transition-all duration-200
                ${
                  step === s
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg"
                    : step > s
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-400"
                }
              `}
            >
              {step > s ? <Check className="w-5 h-5" /> : s}
            </div>
            {s < 4 && (
              <div
                className={`w-12 h-1 rounded ${
                  step > s ? "bg-emerald-500" : "bg-gray-100"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Tipo Progetto */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Che tipo di progetto vuoi creare?
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Seleziona la tipologia che meglio descrive il progetto
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {projectTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => handleTypeSelect(type.value)}
                className={`
                  p-4 rounded-xl border-2 text-left transition-all duration-200
                  ${
                    formData.type === type.value
                      ? "border-violet-600 bg-violet-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                <div
                  className={`
                  w-12 h-12 rounded-xl flex items-center justify-center mb-3
                  ${
                    formData.type === type.value
                      ? "bg-violet-600 text-white"
                      : "bg-gray-100 text-gray-500"
                  }
                `}
                >
                  {type.icon}
                </div>
                <h4 className="font-medium text-gray-900">{type.label}</h4>
                <p className="text-sm text-gray-500 mt-1">{type.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Dettagli Progetto */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Dettagli del Progetto
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Inserisci le informazioni principali
            </p>
          </div>
          <Input
            label="Nome Progetto *"
            placeholder="Es: App E-commerce Mobile"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextArea
            label="Descrizione *"
            placeholder="Descrivi brevemente gli obiettivi e lo scope del progetto..."
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priorità"
              options={priorityOptions}
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: e.target.value as Priority,
                })
              }
            />
            <Input
              label="Cliente (opzionale)"
              placeholder="Nome cliente"
              value={formData.client}
              onChange={(e) =>
                setFormData({ ...formData, client: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Data Inizio"
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
            <Input
              label="Data Fine (opzionale)"
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
            />
          </div>
        </div>
      )}

      {/* Step 3: Tecnologie */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Stack Tecnologico
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Seleziona le tecnologie che utilizzerai
            </p>
          </div>

          {/* Selected Technologies */}
          {formData.selectedTechnologies.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-violet-50 rounded-xl mb-4">
              {formData.selectedTechnologies.map((tech) => (
                <span
                  key={tech.id}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-white text-gray-700 shadow-sm"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: tech.color }}
                  />
                  {tech.name}
                  <button
                    onClick={() => handleTechToggle(tech)}
                    className="ml-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="space-y-4 max-h-64 overflow-y-auto">
            {Object.entries(groupedTechnologies).map(([category, techs]) => (
              <div key={category}>
                <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">
                  {category === "frontend"
                    ? "Frontend"
                    : category === "backend"
                    ? "Backend"
                    : category === "database"
                    ? "Database"
                    : category === "devops"
                    ? "DevOps"
                    : "Design"}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {techs.map((tech) => {
                    const isSelected = formData.selectedTechnologies.find(
                      (t) => t.id === tech.id
                    );
                    return (
                      <button
                        key={tech.id}
                        onClick={() => handleTechToggle(tech)}
                        className={`
                          inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
                          transition-all duration-200
                          ${
                            isSelected
                              ? "bg-violet-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }
                        `}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: isSelected ? "white" : tech.color,
                          }}
                        />
                        {tech.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Team e Link */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Team e Risorse
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Assegna il team e aggiungi link utili
            </p>
          </div>

          {/* Team Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-2" />
              Membri del Team
            </label>
            <div className="grid grid-cols-2 gap-2">
              {users.map((user) => {
                const isSelected = formData.selectedTeam.includes(user.id);
                return (
                  <button
                    key={user.id}
                    onClick={() => handleTeamToggle(user.id)}
                    className={`
                      flex items-center gap-3 p-3 rounded-xl text-left transition-all
                      ${
                        isSelected
                          ? "bg-violet-50 border-2 border-violet-600"
                          : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                      }
                    `}
                  >
                    <div
                      className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold
                      ${isSelected ? "bg-violet-600" : "bg-gray-400"}
                    `}
                    >
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user.role.replace("-", " ")}
                      </p>
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 text-violet-600 ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <Input
              label="Repository Git (opzionale)"
              placeholder="https://github.com/..."
              icon={<LinkIcon className="w-4 h-4" />}
              value={formData.repository}
              onChange={(e) =>
                setFormData({ ...formData, repository: e.target.value })
              }
            />
            <Input
              label="Link Figma (opzionale)"
              placeholder="https://figma.com/..."
              icon={<LinkIcon className="w-4 h-4" />}
              value={formData.figmaLink}
              onChange={(e) =>
                setFormData({ ...formData, figmaLink: e.target.value })
              }
            />
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
        <Button
          variant="ghost"
          onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
        >
          {step > 1 ? "Indietro" : "Annulla"}
        </Button>
        <Button
          onClick={() => (step < 4 ? setStep(step + 1) : handleSubmit())}
          disabled={!canProceed()}
        >
          {step < 4 ? "Continua" : "Crea Progetto"}
        </Button>
      </div>
    </Modal>
  );
}
