"use client";

import React, { useState } from "react";
import { Sidebar, Header } from "../components/layout/Navigation";
import { useProjectStore } from "../store/projectStore";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input, TextArea, Select } from "../components/ui/Input";
import { Avatar } from "../components/ui/Avatar";
import { Badge, RoleBadge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { User, UserRole } from "../types";
import {
  Settings,
  User as UserIcon,
  Users,
  Bell,
  Shield,
  Palette,
  Database,
  Globe,
  Mail,
  Building,
  Save,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  RefreshCw,
} from "lucide-react";

type SettingsTab =
  | "profile"
  | "team"
  | "notifications"
  | "appearance"
  | "security"
  | "company"
  | "data";

export default function SettingsPage() {
  const { users, resetToDemo } = useProjectStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState<User | null>(null);

  // Profile settings state
  const [profile, setProfile] = useState({
    name: "Admin Utente",
    email: "admin@azienda.it",
    role: "Administrator",
    phone: "+39 02 1234567",
    bio: "Responsabile della gestione progetti IT",
  });

  // Company settings state
  const [company, setCompany] = useState({
    name: "La Mia Azienda S.r.l.",
    website: "https://www.azienda.it",
    address: "Via Roma 123, 20100 Milano",
    vatNumber: "IT12345678901",
    industry: "Information Technology",
  });

  // Notification settings state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    projectUpdates: true,
    taskAssignments: true,
    mentions: true,
    weeklyDigest: false,
    deadlineReminders: true,
  });

  // Appearance settings state
  const [appearance, setAppearance] = useState({
    theme: "light",
    language: "it",
    dateFormat: "dd/MM/yyyy",
    timeFormat: "24h",
  });

  // New member form state
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "developer" as UserRole,
    skills: "",
  });

  const tabs = [
    { id: "profile" as SettingsTab, label: "Profilo", icon: UserIcon },
    { id: "company" as SettingsTab, label: "Azienda", icon: Building },
    { id: "team" as SettingsTab, label: "Team", icon: Users },
    { id: "notifications" as SettingsTab, label: "Notifiche", icon: Bell },
    { id: "appearance" as SettingsTab, label: "Aspetto", icon: Palette },
    { id: "security" as SettingsTab, label: "Sicurezza", icon: Shield },
    { id: "data" as SettingsTab, label: "Dati", icon: Database },
  ];

  const roleLabels: Record<UserRole, string> = {
    ceo: "CEO",
    "project-manager": "Project Manager",
    developer: "Developer",
    designer: "Designer",
    qa: "QA Engineer",
    devops: "DevOps",
    other: "Altro",
  };

  const handleSaveMember = () => {
    if (!newMember.name || !newMember.email) return;
    // In una vera app, qui si chiamerebbe una API per salvare
    alert("Funzionalità di aggiunta utenti sarà implementata con il backend");
    setNewMember({
      name: "",
      email: "",
      role: "developer",
      skills: "",
    });
    setEditingMember(null);
    setShowAddMemberModal(false);
  };

  const handleEditMember = (member: User) => {
    setEditingMember(member);
    setNewMember({
      name: member.name,
      email: member.email,
      role: member.role,
      skills: "",
    });
    setShowAddMemberModal(true);
  };

  const handleDeleteMember = (id: string) => {
    if (confirm("Sei sicuro di voler rimuovere questo membro del team?")) {
      // In una vera app, qui si chiamerebbe una API per eliminare
      alert(
        "Funzionalità di rimozione utenti sarà implementata con il backend"
      );
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">
            Informazioni Personali
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <Avatar name={profile.name} size="xl" />
            <div>
              <Button variant="secondary" size="sm">
                Cambia foto
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                JPG, PNG o GIF. Max 2MB.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome completo"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />
            <Input
              label="Ruolo"
              value={profile.role}
              onChange={(e) => setProfile({ ...profile, role: e.target.value })}
            />
            <Input
              label="Telefono"
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
            />
          </div>

          <TextArea
            label="Bio"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            rows={3}
          />

          <div className="flex justify-end">
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Salva modifiche
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCompanyTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">
            Informazioni Azienda
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome azienda"
              value={company.name}
              onChange={(e) => setCompany({ ...company, name: e.target.value })}
            />
            <Input
              label="Sito web"
              value={company.website}
              onChange={(e) =>
                setCompany({ ...company, website: e.target.value })
              }
            />
            <Input
              label="Partita IVA"
              value={company.vatNumber}
              onChange={(e) =>
                setCompany({ ...company, vatNumber: e.target.value })
              }
            />
            <Input
              label="Settore"
              value={company.industry}
              onChange={(e) =>
                setCompany({ ...company, industry: e.target.value })
              }
            />
          </div>

          <TextArea
            label="Indirizzo"
            value={company.address}
            onChange={(e) =>
              setCompany({ ...company, address: e.target.value })
            }
            rows={2}
          />

          <div className="flex justify-end">
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Salva modifiche
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTeamTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gestione Team</h3>
          <p className="text-sm text-gray-500">
            {users.length} membri nel team
          </p>
        </div>
        <Button onClick={() => setShowAddMemberModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Aggiungi membro
        </Button>
      </div>

      <div className="grid gap-4">
        {users.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nessun membro nel team
              </h3>
              <p className="text-gray-500 mb-4">
                Aggiungi i membri del tuo team per iniziare a collaborare.
              </p>
              <Button onClick={() => setShowAddMemberModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Aggiungi il primo membro
              </Button>
            </CardContent>
          </Card>
        ) : (
          users.map((member: User) => (
            <Card key={member.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar name={member.name} size="lg" />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {member.name}
                      </h4>
                      <p className="text-sm text-gray-500">{member.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <RoleBadge role={member.role} />
                        {member.department && (
                          <Badge variant="default">{member.department}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditMember(member)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMember(member.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">
            Preferenze Notifiche
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              key: "emailNotifications",
              label: "Notifiche email",
              description: "Ricevi notifiche via email",
            },
            {
              key: "projectUpdates",
              label: "Aggiornamenti progetti",
              description: "Notifiche quando un progetto viene aggiornato",
            },
            {
              key: "taskAssignments",
              label: "Assegnazione task",
              description: "Notifiche quando ti viene assegnato un task",
            },
            {
              key: "mentions",
              label: "Menzioni",
              description: "Notifiche quando vieni menzionato",
            },
            {
              key: "deadlineReminders",
              label: "Promemoria scadenze",
              description: "Ricorda le scadenze imminenti",
            },
            {
              key: "weeklyDigest",
              label: "Riepilogo settimanale",
              description: "Ricevi un riepilogo settimanale via email",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div>
                <p className="font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={
                    notifications[item.key as keyof typeof notifications]
                  }
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      [item.key]: e.target.checked,
                    })
                  }
                  aria-label={item.label}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
              </label>
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Salva preferenze
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">
            Personalizzazione
          </h3>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tema
            </label>
            <div className="flex gap-4">
              {[
                { value: "light", label: "Chiaro", icon: "☀️" },
                { value: "dark", label: "Scuro", icon: "🌙" },
                { value: "system", label: "Sistema", icon: "💻" },
              ].map((theme) => (
                <button
                  key={theme.value}
                  onClick={() =>
                    setAppearance({ ...appearance, theme: theme.value })
                  }
                  className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                    appearance.theme === theme.value
                      ? "border-violet-500 bg-violet-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-2xl mb-2 block">{theme.icon}</span>
                  <span className="text-sm font-medium">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Lingua"
              value={appearance.language}
              onChange={(e) =>
                setAppearance({ ...appearance, language: e.target.value })
              }
              options={[
                { value: "it", label: "Italiano" },
                { value: "en", label: "English" },
                { value: "de", label: "Deutsch" },
                { value: "fr", label: "Français" },
              ]}
            />
            <Select
              label="Formato data"
              value={appearance.dateFormat}
              onChange={(e) =>
                setAppearance({ ...appearance, dateFormat: e.target.value })
              }
              options={[
                { value: "dd/MM/yyyy", label: "DD/MM/YYYY" },
                { value: "MM/dd/yyyy", label: "MM/DD/YYYY" },
                { value: "yyyy-MM-dd", label: "YYYY-MM-DD" },
              ]}
            />
          </div>

          <div className="flex justify-end">
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Salva modifiche
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">
            Sicurezza Account
          </h3>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Cambia password</h4>
            <div className="space-y-4 max-w-md">
              <Input
                label="Password attuale"
                type="password"
                placeholder="••••••••"
              />
              <Input
                label="Nuova password"
                type="password"
                placeholder="••••••••"
              />
              <Input
                label="Conferma nuova password"
                type="password"
                placeholder="••••••••"
              />
              <Button>Aggiorna password</Button>
            </div>
          </div>

          <hr className="border-gray-200" />

          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Autenticazione a due fattori
            </h4>
            <p className="text-sm text-gray-500 mb-4">
              Aggiungi un ulteriore livello di sicurezza al tuo account.
            </p>
            <Button variant="secondary">Configura 2FA</Button>
          </div>

          <hr className="border-gray-200" />

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Sessioni attive</h4>
            <p className="text-sm text-gray-500 mb-4">
              Gestisci le sessioni attive su altri dispositivi.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Chrome su macOS
                    </p>
                    <p className="text-xs text-gray-500">
                      Milano, IT • Sessione corrente
                    </p>
                  </div>
                </div>
                <Badge variant="success">Attiva</Badge>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          <div>
            <h4 className="font-medium text-red-600 mb-2">Zona pericolosa</h4>
            <p className="text-sm text-gray-500 mb-4">
              Azioni irreversibili per il tuo account.
            </p>
            <Button variant="ghost" className="text-red-600 hover:bg-red-50">
              <Trash2 className="w-4 h-4 mr-2" />
              Elimina account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDataTab = () => {
    const handleResetToDemo = () => {
      if (
        confirm(
          "Sei sicuro di voler ripristinare tutti i dati demo? Questa azione sovrascriverà tutti i progetti, task e altri dati correnti."
        )
      ) {
        resetToDemo();
        alert("Dati demo ripristinati con successo! Ricarica la pagina per vedere le modifiche.");
        window.location.reload();
      }
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Gestione Dati
            </h3>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Dati Dimostrativi
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                Ripristina i dati demo per mostrare le funzionalità
                dell&apos;applicazione. Verranno caricati 6 progetti esempio
                con task, messaggi, requisiti, stime, test e defect.
              </p>
              <Button onClick={handleResetToDemo} variant="secondary">
                <RefreshCw className="w-4 h-4 mr-2" />
                Ripristina dati demo
              </Button>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Esportazione Dati
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                Esporta tutti i tuoi dati in formato JSON.
              </p>
              <Button variant="secondary">
                <Database className="w-4 h-4 mr-2" />
                Esporta dati
              </Button>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h4 className="font-medium text-red-600 mb-2">
                Cancella tutti i dati
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                Elimina tutti i progetti, task e altri dati. Questa azione è
                irreversibile.
              </p>
              <Button variant="ghost" className="text-red-600 hover:bg-red-50">
                <Trash2 className="w-4 h-4 mr-2" />
                Cancella tutti i dati
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileTab();
      case "company":
        return renderCompanyTab();
      case "team":
        return renderTeamTab();
      case "notifications":
        return renderNotificationsTab();
      case "appearance":
        return renderAppearanceTab();
      case "security":
        return renderSecurityTab();
      case "data":
        return renderDataTab();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main className="ml-64 pt-16 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Impostazioni</h1>
            <p className="text-gray-500 mt-1">
              Gestisci il tuo profilo, team e preferenze dell&apos;applicazione.
            </p>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Tabs */}
            <div className="w-56 flex-shrink-0">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? "bg-violet-100 text-violet-700"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1">{renderTabContent()}</div>
          </div>
        </div>
      </main>

      {/* Add/Edit Member Modal */}
      <Modal
        isOpen={showAddMemberModal}
        onClose={() => {
          setShowAddMemberModal(false);
          setEditingMember(null);
          setNewMember({
            name: "",
            email: "",
            role: "developer",
            skills: "",
          });
        }}
        title={editingMember ? "Modifica membro" : "Aggiungi membro"}
      >
        <div className="space-y-4">
          <Input
            label="Nome completo"
            value={newMember.name}
            onChange={(e) =>
              setNewMember({ ...newMember, name: e.target.value })
            }
            placeholder="Mario Rossi"
            required
          />
          <Input
            label="Email"
            type="email"
            value={newMember.email}
            onChange={(e) =>
              setNewMember({ ...newMember, email: e.target.value })
            }
            placeholder="mario.rossi@azienda.it"
            required
          />
          <Select
            label="Ruolo"
            value={newMember.role}
            onChange={(e) =>
              setNewMember({ ...newMember, role: e.target.value as UserRole })
            }
            options={Object.entries(roleLabels).map(([value, label]) => ({
              value,
              label,
            }))}
          />
          <Input
            label="Competenze (separate da virgola)"
            value={newMember.skills}
            onChange={(e) =>
              setNewMember({ ...newMember, skills: e.target.value })
            }
            placeholder="React, TypeScript, Node.js"
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddMemberModal(false);
                setEditingMember(null);
              }}
            >
              Annulla
            </Button>
            <Button onClick={handleSaveMember}>
              {editingMember ? "Salva modifiche" : "Aggiungi"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
