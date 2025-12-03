"use client";

import React, { useState } from "react";
import { Sidebar, Header } from "../components/layout/Navigation";
import { useProjectStore } from "../store/projectStore";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Avatar } from "../components/ui/Avatar";
import { TextArea } from "../components/ui/Input";
import { EmptyState } from "../components/ui/EmptyState";
import { Project, Message } from "../types";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Hash,
  Pin,
  Star,
  MessageSquare,
  ChevronRight,
  Megaphone,
  Clock,
} from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";
import { it } from "date-fns/locale";

export default function MessagesPage() {
  const { projects, currentUser, addMessage } = useProjectStore();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Get projects with messages (sorted by most recent message)
  const projectsWithMessages = projects
    .map((p) => ({
      ...p,
      lastMessage:
        p.messages.length > 0 ? p.messages[p.messages.length - 1] : null,
      unreadCount: Math.floor(Math.random() * 5), // Simulated unread count
    }))
    .sort((a, b) => {
      if (!a.lastMessage && !b.lastMessage) return 0;
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return (
        new Date(b.lastMessage.createdAt).getTime() -
        new Date(a.lastMessage.createdAt).getTime()
      );
    });

  // Filter projects
  const filteredProjects = projectsWithMessages.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return format(date, "HH:mm");
    } else if (isYesterday(date)) {
      return "Ieri";
    }
    return format(date, "dd MMM", { locale: it });
  };

  // Format full date for messages
  const formatFullDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMMM yyyy, HH:mm", { locale: it });
  };

  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach((msg) => {
      const date = format(new Date(msg.createdAt), "yyyy-MM-dd");
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  };

  // Handle send message
  const handleSendMessage = () => {
    if (newMessage.trim() && selectedProject) {
      addMessage(selectedProject.id, newMessage);
      setNewMessage("");
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="h-[calc(100vh-64px)] flex">
          {/* Projects List */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-bold text-lg text-gray-900 mb-3">Messaggi</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cerca conversazioni..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredProjects.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  Nessun progetto trovato
                </div>
              ) : (
                filteredProjects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className={`w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                      selectedProject?.id === project.id
                        ? "bg-violet-50 border-l-2 border-l-violet-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="font-medium text-gray-900 truncate">
                            {project.name}
                          </span>
                        </div>
                        {project.lastMessage ? (
                          <p className="text-sm text-gray-500 truncate mt-1">
                            <span className="font-medium">
                              {project.lastMessage.author.name.split(" ")[0]}:
                            </span>{" "}
                            {project.lastMessage.content}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-400 mt-1">
                            Nessun messaggio
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {project.lastMessage && (
                          <span className="text-xs text-gray-400">
                            {formatMessageDate(project.lastMessage.createdAt)}
                          </span>
                        )}
                        {project.unreadCount > 0 && (
                          <span className="px-2 py-0.5 bg-violet-500 text-white text-xs rounded-full">
                            {project.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white">
            {selectedProject ? (
              <>
                {/* Chat Header */}
                <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <Hash className="w-5 h-5 text-gray-400" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedProject.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {selectedProject.team.length} membri
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Pin className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Star className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {selectedProject.messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500">Nessun messaggio ancora</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Inizia la conversazione!
                        </p>
                      </div>
                    </div>
                  ) : (
                    Object.entries(
                      groupMessagesByDate(selectedProject.messages)
                    ).map(([date, messages]) => (
                      <div key={date}>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex-1 h-px bg-gray-200"></div>
                          <span className="text-xs text-gray-400 font-medium">
                            {isToday(new Date(date))
                              ? "Oggi"
                              : isYesterday(new Date(date))
                              ? "Ieri"
                              : format(new Date(date), "dd MMMM yyyy", {
                                  locale: it,
                                })}
                          </span>
                          <div className="flex-1 h-px bg-gray-200"></div>
                        </div>
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex gap-3 ${
                                message.isAnnouncement
                                  ? "bg-amber-50 p-4 rounded-xl -mx-4"
                                  : ""
                              }`}
                            >
                              <Avatar name={message.author.name} size="md" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-gray-900">
                                    {message.author.name}
                                  </span>
                                  {message.isAnnouncement && (
                                    <Badge variant="warning" size="sm">
                                      <Megaphone className="w-3 h-3 mr-1" />
                                      Annuncio
                                    </Badge>
                                  )}
                                  <span className="text-xs text-gray-400">
                                    {format(
                                      new Date(message.createdAt),
                                      "HH:mm"
                                    )}
                                  </span>
                                </div>
                                <p className="text-gray-700 mt-1 whitespace-pre-wrap">
                                  {message.content}
                                </p>
                                {message.reactions &&
                                  message.reactions.length > 0 && (
                                    <div className="flex items-center gap-1 mt-2">
                                      {message.reactions.map(
                                        (reaction, idx) => (
                                          <span
                                            key={idx}
                                            className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                                          >
                                            {reaction.emoji}{" "}
                                            {reaction.users.length}
                                          </span>
                                        )
                                      )}
                                    </div>
                                  )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-end gap-3">
                    <div className="flex-1 bg-gray-50 rounded-xl p-3">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={`Messaggio in #${selectedProject.name}...`}
                        className="w-full bg-transparent resize-none focus:outline-none text-sm"
                        rows={1}
                        style={{ minHeight: "24px", maxHeight: "120px" }}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-500">
                            <Paperclip className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-500">
                            <Smile className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-xs text-gray-400">
                          Invio per inviare, Shift+Invio per nuova riga
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Seleziona una conversazione
                  </h3>
                  <p className="text-gray-500">
                    Scegli un progetto dalla lista per visualizzare i messaggi
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
