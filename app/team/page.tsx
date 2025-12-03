"use client";

import React, { useState } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { useProjectStore } from "../store/projectStore";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge, RoleBadge } from "../components/ui/Badge";
import { Avatar } from "../components/ui/Avatar";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { User, UserRole } from "../types";
import {
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Clock,
  MoreVertical,
  Plus,
  Building2,
  TrendingUp,
  Users as UsersIcon,
} from "lucide-react";

const roleLabels: Record<UserRole, string> = {
  ceo: "CEO",
  "project-manager": "Project Manager",
  developer: "Sviluppatore",
  designer: "Designer",
  qa: "QA Engineer",
  devops: "DevOps Engineer",
  other: "Altro",
};

const departmentColors: Record<string, string> = {
  Management: "bg-purple-100 text-purple-700",
  PMO: "bg-blue-100 text-blue-700",
  Engineering: "bg-green-100 text-green-700",
  Design: "bg-pink-100 text-pink-700",
  Quality: "bg-amber-100 text-amber-700",
};

export default function TeamPage() {
  const { users, projects } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Get unique departments
  const departments = [
    ...new Set(users.map((u) => u.department).filter(Boolean)),
  ];

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesDepartment =
      filterDepartment === "all" || user.department === filterDepartment;
    return matchesSearch && matchesRole && matchesDepartment;
  });

  // Stats
  const stats = {
    totalMembers: users.length,
    departments: departments.length,
    activeProjects: projects.filter((p) => p.status === "in-progress").length,
    avgTeamSize:
      projects.length > 0
        ? Math.round(
            projects.reduce((acc, p) => acc + p.team.length, 0) /
              projects.length
          )
        : 0,
  };

  // Get user projects
  const getUserProjects = (userId: string) => {
    return projects.filter((p) => p.team.some((m) => m.id === userId));
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team</h1>
            <p className="text-gray-500 mt-1">
              Gestisci il team e visualizza le risorse
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4" />
            Aggiungi Membro
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="py-4 text-center">
            <UsersIcon className="w-8 h-8 mx-auto mb-2 text-violet-500" />
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalMembers}
            </p>
            <p className="text-sm text-gray-500">Membri Totali</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <Building2 className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold text-gray-900">
              {stats.departments}
            </p>
            <p className="text-sm text-gray-500">Dipartimenti</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <Briefcase className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold text-gray-900">
              {stats.activeProjects}
            </p>
            <p className="text-sm text-gray-500">Progetti Attivi</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-amber-500" />
            <p className="text-2xl font-bold text-gray-900">
              {stats.avgTeamSize}
            </p>
            <p className="text-sm text-gray-500">Media Team</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cerca membri..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="all">Tutti i ruoli</option>
          {Object.entries(roleLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="all">Tutti i dipartimenti</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filteredUsers.map((user) => {
          const userProjects = getUserProjects(user.id);
          return (
            <Card
              key={user.id}
              hover
              className="cursor-pointer"
              onClick={() => setSelectedUser(user)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar name={user.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <RoleBadge role={user.role} />
                      {user.department && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            departmentColors[user.department] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {user.department}
                        </span>
                      )}
                    </div>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Progetti attivi</span>
                    <span className="font-medium text-gray-900">
                      {
                        userProjects.filter((p) => p.status === "in-progress")
                          .length
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <UsersIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Nessun membro trovato</p>
          </CardContent>
        </Card>
      )}

      {/* User Detail Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title={selectedUser?.name || ""}
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar name={selectedUser.name} size="xl" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedUser.name}
                </h2>
                <p className="text-gray-500">{roleLabels[selectedUser.role]}</p>
                <div className="flex items-center gap-2 mt-2">
                  <RoleBadge role={selectedUser.role} />
                  {selectedUser.department && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        departmentColors[selectedUser.department] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {selectedUser.department}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium">{selectedUser.email}</p>
                </div>
              </div>
              {selectedUser.department && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Dipartimento</p>
                    <p className="text-sm font-medium">
                      {selectedUser.department}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Briefcase className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Progetti Attivi</p>
                  <p className="text-sm font-medium">
                    {
                      getUserProjects(selectedUser.id).filter(
                        (p) => p.status === "in-progress"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">
                Progetti Assegnati
              </h3>
              <div className="space-y-2">
                {getUserProjects(selectedUser.id).length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Nessun progetto assegnato
                  </p>
                ) : (
                  getUserProjects(selectedUser.id).map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {project.name}
                        </p>
                        <p className="text-xs text-gray-500">{project.type}</p>
                      </div>
                      <Badge
                        variant={
                          project.status === "completed"
                            ? "success"
                            : project.status === "in-progress"
                            ? "warning"
                            : "default"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="ghost" onClick={() => setSelectedUser(null)}>
                Chiudi
              </Button>
              <Button>
                <Mail className="w-4 h-4" />
                Contatta
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </AppLayout>
  );
}
