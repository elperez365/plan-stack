"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  MessageSquare,
  Calendar,
  Settings,
  Bell,
  Search,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useProjectStore } from "../../store/projectStore";
import { Avatar } from "../ui/Avatar";
import { RoleBadge } from "../ui/Badge";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Progetti", href: "/projects", icon: FolderKanban },
  { name: "Team", href: "/team", icon: Users },
  { name: "Messaggi", href: "/messages", icon: MessageSquare },
  { name: "Calendario", href: "/calendar", icon: Calendar },
];

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser, users, setCurrentUser } = useProjectStore();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text">
            PlanStack
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200
                ${
                  isActive
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25"
                    : "text-gray-600 hover:bg-gray-100"
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Menu */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {currentUser && <Avatar name={currentUser.name} size="sm" />}
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentUser?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentUser?.email}
              </p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                showUserMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden">
              <div className="p-2 border-b border-gray-100">
                <p className="px-2 py-1 text-xs font-medium text-gray-400 uppercase">
                  Cambia utente
                </p>
              </div>
              <div className="p-2 max-h-64 overflow-y-auto">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      setCurrentUser(user);
                      setShowUserMenu(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left
                      transition-colors
                      ${
                        currentUser?.id === user.id
                          ? "bg-violet-50"
                          : "hover:bg-gray-50"
                      }
                    `}
                  >
                    <Avatar name={user.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <RoleBadge role={user.role} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export function Header() {
  const { currentUser, projects, activities } = useProjectStore();
  const [showNotifications, setShowNotifications] = React.useState(false);

  const recentActivities = activities.slice(0, 5);

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Cerca progetti, task, membri..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm 
            placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Stats */}
        <div className="hidden lg:flex items-center gap-6 pr-6 border-r border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {projects.length}
            </p>
            <p className="text-xs text-gray-500">Progetti</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {projects.filter((p) => p.status === "in-progress").length}
            </p>
            <p className="text-xs text-gray-500">In Corso</p>
          </div>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Bell className="w-5 h-5" />
            {recentActivities.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden z-50">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">
                  Attività Recenti
                </h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {recentActivities.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    Nessuna attività recente
                  </div>
                ) : (
                  recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="p-4 border-b border-gray-50 hover:bg-gray-50"
                    >
                      <p className="text-sm text-gray-900">
                        {activity.details}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(activity.createdAt).toLocaleString("it-IT")}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <Link
          href="/settings"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <Settings className="w-5 h-5" />
        </Link>
      </div>
    </header>
  );
}
