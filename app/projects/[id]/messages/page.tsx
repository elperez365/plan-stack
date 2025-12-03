"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar, Header } from "../../../components/layout/Navigation";
import { useProjectStore } from "../../../store/projectStore";
import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Avatar } from "../../../components/ui/Avatar";
import { TextArea, Input } from "../../../components/ui/Input";
import {
  ArrowLeft,
  Send,
  Megaphone,
  Search,
  Filter,
  Pin,
  MessageSquare,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { it } from "date-fns/locale";

export default function ProjectMessagesPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const { projects, addMessage, currentUser } = useProjectStore();
  const project = projects.find((p) => p.id === projectId);

  const [newMessage, setNewMessage] = useState("");
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "announcements" | "messages"
  >("all");

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

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      addMessage(projectId, newMessage, isAnnouncement);
      setNewMessage("");
      setIsAnnouncement(false);
    }
  };

  // Filtra i messaggi
  const filteredMessages = project.messages.filter((message) => {
    const matchesSearch = message.content
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      filterType === "all" ||
      (filterType === "announcements" && message.isAnnouncement) ||
      (filterType === "messages" && !message.isAnnouncement);
    return matchesSearch && matchesType;
  });

  const announcements = project.messages.filter((m) => m.isAnnouncement);
  const regularMessages = project.messages.filter((m) => !m.isAnnouncement);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-6">
          {/* Header */}
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
                  Comunicazioni - {project.name}
                </h1>
                <p className="text-gray-500">
                  Messaggi e annunci del team di progetto
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chat Area */}
            <div className="lg:col-span-2">
              {/* Filters */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Cerca nei messaggi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFilterType("all")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filterType === "all"
                        ? "bg-violet-100 text-violet-700"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    Tutti
                  </button>
                  <button
                    onClick={() => setFilterType("announcements")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filterType === "announcements"
                        ? "bg-amber-100 text-amber-700"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <Megaphone className="w-4 h-4 inline mr-1" />
                    Annunci
                  </button>
                  <button
                    onClick={() => setFilterType("messages")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filterType === "messages"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 inline mr-1" />
                    Messaggi
                  </button>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  {/* Messages List */}
                  <div className="max-h-[500px] overflow-y-auto divide-y divide-gray-100">
                    {filteredMessages.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        {searchQuery
                          ? "Nessun messaggio trovato"
                          : "Nessun messaggio ancora. Inizia la conversazione!"}
                      </div>
                    ) : (
                      [...filteredMessages].reverse().map((message) => (
                        <div
                          key={message.id}
                          className={`p-4 ${
                            message.isAnnouncement
                              ? "bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400"
                              : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar name={message.author.name} size="md" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-900">
                                  {message.author.name}
                                </span>
                                <span className="text-xs text-gray-400 capitalize">
                                  {message.author.role.replace("-", " ")}
                                </span>
                                {message.isAnnouncement && (
                                  <Badge variant="warning">
                                    <Megaphone className="w-3 h-3 mr-1" />
                                    Annuncio
                                  </Badge>
                                )}
                              </div>
                              <p className="text-gray-700 whitespace-pre-wrap">
                                {message.content}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-xs text-gray-400">
                                  {formatDistanceToNow(
                                    new Date(message.createdAt),
                                    { addSuffix: true, locale: it }
                                  )}
                                </span>
                                <span className="text-xs text-gray-300">
                                  {format(
                                    new Date(message.createdAt),
                                    "dd MMM yyyy, HH:mm",
                                    { locale: it }
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <div className="flex items-end gap-3">
                      <Avatar name={currentUser?.name || "Utente"} size="sm" />
                      <div className="flex-1">
                        <TextArea
                          placeholder="Scrivi un messaggio..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          rows={3}
                          className="bg-white"
                        />
                        <div className="flex items-center justify-between mt-2">
                          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-amber-600 transition-colors">
                            <input
                              type="checkbox"
                              checked={isAnnouncement}
                              onChange={(e) =>
                                setIsAnnouncement(e.target.checked)
                              }
                              className="rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                            />
                            <Megaphone className="w-4 h-4" />
                            Invia come annuncio
                          </label>
                          <Button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                          >
                            <Send className="w-4 h-4" />
                            Invia
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats */}
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Statistiche
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-gray-900">
                      {project.messages.length}
                    </p>
                    <p className="text-xs text-gray-500">Totali</p>
                  </div>
                  <div className="text-center p-3 bg-amber-50 rounded-xl">
                    <p className="text-2xl font-bold text-amber-600">
                      {announcements.length}
                    </p>
                    <p className="text-xs text-gray-500">Annunci</p>
                  </div>
                </div>
              </Card>

              {/* Recent Announcements */}
              {announcements.length > 0 && (
                <Card className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-amber-500" />
                    Annunci Recenti
                  </h3>
                  <div className="space-y-3">
                    {announcements.slice(0, 3).map((ann) => (
                      <div
                        key={ann.id}
                        className="p-3 bg-amber-50 rounded-lg border border-amber-100"
                      >
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {ann.content}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {ann.author.name} •{" "}
                          {formatDistanceToNow(new Date(ann.createdAt), {
                            addSuffix: true,
                            locale: it,
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Team Members */}
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Membri del Team
                </h3>
                <div className="space-y-2">
                  {project.team.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                    >
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
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
