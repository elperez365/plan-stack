"use client";

import React, { useState } from "react";
import { Sidebar, Header } from "../components/layout/Navigation";
import { useProjectStore } from "../store/projectStore";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Avatar } from "../components/ui/Avatar";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Flag,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { it } from "date-fns/locale";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "milestone" | "deadline" | "meeting" | "review";
  projectId: string;
  projectName: string;
  color: string;
}

const eventColors: Record<string, string> = {
  milestone: "bg-green-500",
  deadline: "bg-red-500",
  meeting: "bg-blue-500",
  review: "bg-amber-500",
};

const eventLabels: Record<string, string> = {
  milestone: "Milestone",
  deadline: "Scadenza",
  meeting: "Riunione",
  review: "Review",
};

export default function CalendarPage() {
  const { projects } = useProjectStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<"month" | "week">("month");

  // Generate calendar events from projects
  const events: CalendarEvent[] = [];

  projects.forEach((project) => {
    // Add milestones
    project.milestones.forEach((milestone) => {
      events.push({
        id: `milestone-${milestone.id}`,
        title: milestone.title,
        date: milestone.dueDate,
        type: "milestone",
        projectId: project.id,
        projectName: project.name,
        color: eventColors.milestone,
      });
    });

    // Add task deadlines
    project.tasks.forEach((task) => {
      if (task.dueDate) {
        events.push({
          id: `task-${task.id}`,
          title: task.title,
          date: task.dueDate,
          type: "deadline",
          projectId: project.id,
          projectName: project.name,
          color: eventColors.deadline,
        });
      }
    });

    // Add project end date
    if (project.endDate) {
      events.push({
        id: `project-end-${project.id}`,
        title: `Fine: ${project.name}`,
        date: project.endDate,
        type: "deadline",
        projectId: project.id,
        projectName: project.name,
        color: eventColors.deadline,
      });
    }
  });

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.date), date));
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  };

  const days = generateCalendarDays();
  const weekDays = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

  // Selected date events
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  // Upcoming events (next 7 days)
  const upcomingEvents = events
    .filter((event) => {
      const eventDate = new Date(event.date);
      const now = new Date();
      const weekFromNow = addDays(now, 7);
      return eventDate >= now && eventDate <= weekFromNow;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Calendario</h1>
              <p className="text-gray-500 mt-1">
                Milestone, scadenze e eventi dei progetti
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setView("month")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    view === "month"
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  Mese
                </button>
                <button
                  onClick={() => setView("week")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    view === "week"
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  Settimana
                </button>
              </div>
              <Button>
                <Plus className="w-4 h-4" />
                Nuovo Evento
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {/* Calendar */}
            <div className="col-span-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <h2 className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
                      {format(currentDate, "MMMM yyyy", { locale: it })}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Oggi
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Week days header */}
                  <div className="grid grid-cols-7 border-b border-gray-200">
                    {weekDays.map((day) => (
                      <div
                        key={day}
                        className="py-3 text-center text-sm font-medium text-gray-500"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar grid */}
                  <div className="grid grid-cols-7">
                    {days.map((day, idx) => {
                      const dayEvents = getEventsForDate(day);
                      const isCurrentMonth = isSameMonth(day, currentDate);
                      const isSelected =
                        selectedDate && isSameDay(day, selectedDate);
                      const isCurrentDay = isToday(day);

                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedDate(day)}
                          className={`min-h-[100px] p-2 border-b border-r border-gray-100 text-left transition-colors hover:bg-gray-50 ${
                            !isCurrentMonth ? "bg-gray-50" : ""
                          } ${isSelected ? "bg-violet-50" : ""}`}
                        >
                          <span
                            className={`inline-flex items-center justify-center w-7 h-7 text-sm rounded-full ${
                              isCurrentDay
                                ? "bg-violet-600 text-white font-semibold"
                                : isCurrentMonth
                                ? "text-gray-900"
                                : "text-gray-400"
                            }`}
                          >
                            {format(day, "d")}
                          </span>
                          <div className="mt-1 space-y-1">
                            {dayEvents.slice(0, 3).map((event) => (
                              <div
                                key={event.id}
                                className={`px-2 py-0.5 rounded text-xs text-white truncate ${event.color}`}
                              >
                                {event.title}
                              </div>
                            ))}
                            {dayEvents.length > 3 && (
                              <div className="px-2 text-xs text-gray-500">
                                +{dayEvents.length - 3} altri
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Selected Date Events */}
              {selectedDate && (
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold text-gray-900">
                      {format(selectedDate, "d MMMM yyyy", { locale: it })}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    {selectedDateEvents.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">
                        Nessun evento
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {selectedDateEvents.map((event) => (
                          <div
                            key={event.id}
                            className="flex items-start gap-3"
                          >
                            <div
                              className={`w-3 h-3 rounded-full mt-1.5 ${event.color}`}
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {event.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {event.projectName}
                              </p>
                              <Badge size="sm" className="mt-1">
                                {eventLabels[event.type]}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-gray-900">
                    Prossimi Eventi
                  </h3>
                  <p className="text-xs text-gray-500">Prossimi 7 giorni</p>
                </CardHeader>
                <CardContent>
                  {upcomingEvents.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Nessun evento in programma
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {upcomingEvents.slice(0, 5).map((event) => (
                        <div key={event.id} className="flex items-start gap-3">
                          <div
                            className={`w-3 h-3 rounded-full mt-1.5 ${event.color}`}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {event.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {event.projectName}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-400">
                                {format(new Date(event.date), "d MMM", {
                                  locale: it,
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Legend */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-gray-900">Legenda</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(eventColors).map(([type, color]) => (
                      <div key={type} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${color}`} />
                        <span className="text-sm text-gray-600">
                          {eventLabels[type]}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
