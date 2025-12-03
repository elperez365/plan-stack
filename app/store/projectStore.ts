import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Project,
  User,
  Task,
  Message,
  Activity,
  Technology,
  Milestone,
  FunctionalAnalysis,
  FunctionalRequirement,
  Estimation,
  EstimationItem,
  TestCase,
  TestCycle,
  TestExecution,
  Defect,
  TimeEntry,
} from "../types";
import { v4 as uuidv4 } from "uuid";
import {
  demoUsers,
  defaultTechnologies,
  demoProjects,
  demoActivities,
} from "./demoData";

interface ProjectState {
  projects: Project[];
  users: User[];
  technologies: Technology[];
  activities: Activity[];
  currentUser: User | null;

  setCurrentUser: (user: User) => void;
  resetToDemo: () => void;
  addProject: (
    project: Omit<
      Project,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "tasks"
      | "messages"
      | "milestones"
      | "functionalAnalyses"
      | "estimations"
      | "testCases"
      | "testCycles"
      | "defects"
      | "timeEntries"
    >
  ) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  addTask: (
    projectId: string,
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateTask: (
    projectId: string,
    taskId: string,
    updates: Partial<Task>
  ) => void;
  deleteTask: (projectId: string, taskId: string) => void;

  addMessage: (
    projectId: string,
    content: string,
    isAnnouncement?: boolean
  ) => void;

  addMilestone: (projectId: string, milestone: Omit<Milestone, "id">) => void;
  updateMilestone: (
    projectId: string,
    milestoneId: string,
    updates: Partial<Milestone>
  ) => void;

  addTeamMember: (projectId: string, userId: string) => void;
  removeTeamMember: (projectId: string, userId: string) => void;

  addFunctionalAnalysis: (
    projectId: string,
    analysis: Omit<
      FunctionalAnalysis,
      "id" | "projectId" | "createdAt" | "updatedAt" | "requirements"
    >
  ) => FunctionalAnalysis;
  updateFunctionalAnalysis: (
    projectId: string,
    analysisId: string,
    updates: Partial<FunctionalAnalysis>
  ) => void;
  addRequirement: (
    projectId: string,
    analysisId: string,
    requirement: Omit<
      FunctionalRequirement,
      | "id"
      | "code"
      | "createdAt"
      | "updatedAt"
      | "comments"
      | "attachments"
      | "linkedTasks"
      | "version"
      | "history"
    >
  ) => void;
  updateRequirement: (
    projectId: string,
    analysisId: string,
    requirementId: string,
    updates: Partial<FunctionalRequirement>
  ) => void;

  addEstimation: (
    projectId: string,
    estimation: Omit<
      Estimation,
      | "id"
      | "projectId"
      | "createdAt"
      | "updatedAt"
      | "items"
      | "totalHours"
      | "comments"
    >
  ) => Estimation;
  updateEstimation: (
    projectId: string,
    estimationId: string,
    updates: Partial<Estimation>
  ) => void;
  addEstimationItem: (
    projectId: string,
    estimationId: string,
    item: Omit<EstimationItem, "id">
  ) => void;
  updateEstimationItem: (
    projectId: string,
    estimationId: string,
    itemId: string,
    updates: Partial<EstimationItem>
  ) => void;
  deleteEstimationItem: (
    projectId: string,
    estimationId: string,
    itemId: string
  ) => void;

  addTestCase: (
    projectId: string,
    testCase: Omit<TestCase, "id" | "code" | "createdAt" | "updatedAt">
  ) => void;
  updateTestCase: (
    projectId: string,
    testCaseId: string,
    updates: Partial<TestCase>
  ) => void;
  deleteTestCase: (projectId: string, testCaseId: string) => void;

  addTestCycle: (
    projectId: string,
    cycle: Omit<
      TestCycle,
      "id" | "projectId" | "createdAt" | "executions" | "summary"
    >
  ) => TestCycle;
  updateTestCycle: (
    projectId: string,
    cycleId: string,
    updates: Partial<TestCycle>
  ) => void;
  addTestExecution: (
    projectId: string,
    cycleId: string,
    execution: Omit<TestExecution, "id">
  ) => void;

  addDefect: (
    projectId: string,
    defect: Omit<Defect, "id" | "code" | "createdAt" | "updatedAt">
  ) => void;
  updateDefect: (
    projectId: string,
    defectId: string,
    updates: Partial<Defect>
  ) => void;

  addTimeEntry: (entry: Omit<TimeEntry, "id" | "createdAt">) => void;

  logActivity: (
    projectId: string,
    action: string,
    details: string,
    entityType?: string,
    entityId?: string
  ) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: demoProjects,
      users: demoUsers,
      technologies: defaultTechnologies,
      activities: demoActivities,
      currentUser: demoUsers[1],

      setCurrentUser: (user) => set({ currentUser: user }),

      resetToDemo: () =>
        set({
          projects: demoProjects,
          users: demoUsers,
          technologies: defaultTechnologies,
          activities: demoActivities,
          currentUser: demoUsers[1],
        }),

      addProject: (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: uuidv4(),
          tasks: [],
          messages: [],
          milestones: [],
          functionalAnalyses: [],
          estimations: [],
          testCases: [],
          testCycles: [],
          defects: [],
          timeEntries: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ projects: [...state.projects, newProject] }));
        get().logActivity(
          newProject.id,
          "create",
          `Progetto "${newProject.name}" creato`,
          "project",
          newProject.id
        );
        return newProject;
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id
              ? { ...p, ...updates, updatedAt: new Date().toISOString() }
              : p
          ),
        }));
        get().logActivity(id, "update", "Progetto aggiornato", "project", id);
      },

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),

      addTask: (projectId, taskData) => {
        const newTask: Task = {
          ...taskData,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  tasks: [...p.tasks, newTask],
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
        get().logActivity(
          projectId,
          "task_add",
          `Task "${newTask.title}" aggiunto`,
          "task",
          newTask.id
        );
      },

      updateTask: (projectId, taskId, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  tasks: p.tasks.map((t) =>
                    t.id === taskId
                      ? {
                          ...t,
                          ...updates,
                          updatedAt: new Date().toISOString(),
                        }
                      : t
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      deleteTask: (projectId, taskId) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, tasks: p.tasks.filter((t) => t.id !== taskId) }
              : p
          ),
        }));
      },

      addMessage: (projectId, content, isAnnouncement = false) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;
        const newMessage: Message = {
          id: uuidv4(),
          content,
          author: currentUser,
          createdAt: new Date().toISOString(),
          isAnnouncement,
        };
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, messages: [...p.messages, newMessage] }
              : p
          ),
        }));
      },

      addMilestone: (projectId, milestoneData) => {
        const newMilestone: Milestone = { ...milestoneData, id: uuidv4() };
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, milestones: [...p.milestones, newMilestone] }
              : p
          ),
        }));
        get().logActivity(
          projectId,
          "milestone_add",
          `Milestone "${newMilestone.title}" aggiunta`
        );
      },

      updateMilestone: (projectId, milestoneId, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  milestones: p.milestones.map((m) =>
                    m.id === milestoneId ? { ...m, ...updates } : m
                  ),
                }
              : p
          ),
        }));
      },

      addTeamMember: (projectId, userId) => {
        const user = get().users.find((u) => u.id === userId);
        if (!user) return;
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId && !p.team.find((t) => t.id === userId)
              ? { ...p, team: [...p.team, user] }
              : p
          ),
        }));
        get().logActivity(
          projectId,
          "team_add",
          `${user.name} aggiunto al team`
        );
      },

      removeTeamMember: (projectId, userId) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, team: p.team.filter((t) => t.id !== userId) }
              : p
          ),
        }));
      },

      addFunctionalAnalysis: (projectId, analysisData) => {
        const currentUser = get().currentUser;
        if (!currentUser) throw new Error("No current user");
        const newAnalysis: FunctionalAnalysis = {
          ...analysisData,
          id: uuidv4(),
          projectId,
          requirements: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: currentUser,
        };
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  functionalAnalyses: [...p.functionalAnalyses, newAnalysis],
                }
              : p
          ),
        }));
        get().logActivity(
          projectId,
          "analysis_add",
          `Analisi funzionale "${newAnalysis.title}" creata`,
          "requirement",
          newAnalysis.id
        );
        return newAnalysis;
      },

      updateFunctionalAnalysis: (projectId, analysisId, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  functionalAnalyses: p.functionalAnalyses.map((a) =>
                    a.id === analysisId
                      ? {
                          ...a,
                          ...updates,
                          updatedAt: new Date().toISOString(),
                        }
                      : a
                  ),
                }
              : p
          ),
        }));
      },

      addRequirement: (projectId, analysisId, requirementData) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;
        const project = get().projects.find((p) => p.id === projectId);
        const analysis = project?.functionalAnalyses.find(
          (a) => a.id === analysisId
        );
        const reqCount = (analysis?.requirements.length || 0) + 1;
        const newRequirement: FunctionalRequirement = {
          ...requirementData,
          id: uuidv4(),
          code: `REQ-${String(reqCount).padStart(3, "0")}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          comments: [],
          attachments: [],
          linkedTasks: [],
          version: 1,
          history: [],
        };
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  functionalAnalyses: p.functionalAnalyses.map((a) =>
                    a.id === analysisId
                      ? {
                          ...a,
                          requirements: [...a.requirements, newRequirement],
                          updatedAt: new Date().toISOString(),
                        }
                      : a
                  ),
                }
              : p
          ),
        }));
        get().logActivity(
          projectId,
          "requirement_add",
          `Requisito "${newRequirement.code}" aggiunto`,
          "requirement",
          newRequirement.id
        );
      },

      updateRequirement: (projectId, analysisId, requirementId, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  functionalAnalyses: p.functionalAnalyses.map((a) =>
                    a.id === analysisId
                      ? {
                          ...a,
                          requirements: a.requirements.map((r) =>
                            r.id === requirementId
                              ? {
                                  ...r,
                                  ...updates,
                                  updatedAt: new Date().toISOString(),
                                }
                              : r
                          ),
                        }
                      : a
                  ),
                }
              : p
          ),
        }));
      },

      addEstimation: (projectId, estimationData) => {
        const currentUser = get().currentUser;
        if (!currentUser) throw new Error("No current user");
        const newEstimation: Estimation = {
          ...estimationData,
          id: uuidv4(),
          projectId,
          items: [],
          totalHours: 0,
          comments: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: currentUser,
        };
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, estimations: [...p.estimations, newEstimation] }
              : p
          ),
        }));
        get().logActivity(
          projectId,
          "estimation_add",
          `Stima "${newEstimation.title}" creata`,
          "estimation",
          newEstimation.id
        );
        return newEstimation;
      },

      updateEstimation: (projectId, estimationId, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  estimations: p.estimations.map((e) =>
                    e.id === estimationId
                      ? {
                          ...e,
                          ...updates,
                          updatedAt: new Date().toISOString(),
                        }
                      : e
                  ),
                }
              : p
          ),
        }));
      },

      addEstimationItem: (projectId, estimationId, itemData) => {
        const newItem: EstimationItem = { ...itemData, id: uuidv4() };
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  estimations: p.estimations.map((e) => {
                    if (e.id === estimationId) {
                      const updatedItems = [...e.items, newItem];
                      return {
                        ...e,
                        items: updatedItems,
                        totalHours: updatedItems.reduce(
                          (sum, item) => sum + item.estimatedHours,
                          0
                        ),
                        updatedAt: new Date().toISOString(),
                      };
                    }
                    return e;
                  }),
                }
              : p
          ),
        }));
      },

      updateEstimationItem: (projectId, estimationId, itemId, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  estimations: p.estimations.map((e) => {
                    if (e.id === estimationId) {
                      const updatedItems = e.items.map((i) =>
                        i.id === itemId ? { ...i, ...updates } : i
                      );
                      return {
                        ...e,
                        items: updatedItems,
                        totalHours: updatedItems.reduce(
                          (sum, item) => sum + item.estimatedHours,
                          0
                        ),
                        updatedAt: new Date().toISOString(),
                      };
                    }
                    return e;
                  }),
                }
              : p
          ),
        }));
      },

      deleteEstimationItem: (projectId, estimationId, itemId) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  estimations: p.estimations.map((e) => {
                    if (e.id === estimationId) {
                      const updatedItems = e.items.filter(
                        (i) => i.id !== itemId
                      );
                      return {
                        ...e,
                        items: updatedItems,
                        totalHours: updatedItems.reduce(
                          (sum, item) => sum + item.estimatedHours,
                          0
                        ),
                      };
                    }
                    return e;
                  }),
                }
              : p
          ),
        }));
      },

      addTestCase: (projectId, testCaseData) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;
        const project = get().projects.find((p) => p.id === projectId);
        const tcCount = (project?.testCases.length || 0) + 1;
        const newTestCase: TestCase = {
          ...testCaseData,
          id: uuidv4(),
          code: `TC-${String(tcCount).padStart(3, "0")}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: currentUser,
          lastModifiedBy: currentUser,
        };
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, testCases: [...p.testCases, newTestCase] }
              : p
          ),
        }));
        get().logActivity(
          projectId,
          "test_add",
          `Test Case "${newTestCase.code}" aggiunto`,
          "test",
          newTestCase.id
        );
      },

      updateTestCase: (projectId, testCaseId, updates) => {
        const currentUser = get().currentUser;
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  testCases: p.testCases.map((tc) =>
                    tc.id === testCaseId
                      ? {
                          ...tc,
                          ...updates,
                          updatedAt: new Date().toISOString(),
                          lastModifiedBy: currentUser || tc.lastModifiedBy,
                        }
                      : tc
                  ),
                }
              : p
          ),
        }));
      },

      deleteTestCase: (projectId, testCaseId) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  testCases: p.testCases.filter((tc) => tc.id !== testCaseId),
                }
              : p
          ),
        }));
      },

      addTestCycle: (projectId, cycleData) => {
        const currentUser = get().currentUser;
        if (!currentUser) throw new Error("No current user");
        const newCycle: TestCycle = {
          ...cycleData,
          id: uuidv4(),
          projectId,
          executions: [],
          createdAt: new Date().toISOString(),
          createdBy: currentUser,
        };
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, testCycles: [...p.testCycles, newCycle] }
              : p
          ),
        }));
        get().logActivity(
          projectId,
          "cycle_add",
          `Ciclo di test "${newCycle.name}" creato`,
          "test",
          newCycle.id
        );
        return newCycle;
      },

      updateTestCycle: (projectId, cycleId, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  testCycles: p.testCycles.map((c) =>
                    c.id === cycleId ? { ...c, ...updates } : c
                  ),
                }
              : p
          ),
        }));
      },

      addTestExecution: (projectId, cycleId, executionData) => {
        const newExecution: TestExecution = { ...executionData, id: uuidv4() };
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  testCycles: p.testCycles.map((c) => {
                    if (c.id === cycleId) {
                      const executions = [...c.executions, newExecution];
                      const summary = calculateTestCycleSummary(
                        c.testCases.length,
                        executions
                      );
                      return { ...c, executions, summary };
                    }
                    return c;
                  }),
                }
              : p
          ),
        }));
      },

      addDefect: (projectId, defectData) => {
        const project = get().projects.find((p) => p.id === projectId);
        const bugCount = (project?.defects.length || 0) + 1;
        const newDefect: Defect = {
          ...defectData,
          id: uuidv4(),
          code: `BUG-${String(bugCount).padStart(3, "0")}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, defects: [...p.defects, newDefect] }
              : p
          ),
        }));
        get().logActivity(
          projectId,
          "defect_add",
          `Bug "${newDefect.code}" segnalato`,
          "defect",
          newDefect.id
        );
      },

      updateDefect: (projectId, defectId, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  defects: p.defects.map((d) =>
                    d.id === defectId
                      ? {
                          ...d,
                          ...updates,
                          updatedAt: new Date().toISOString(),
                        }
                      : d
                  ),
                }
              : p
          ),
        }));
      },

      addTimeEntry: (entryData) => {
        const newEntry: TimeEntry = {
          ...entryData,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === entryData.projectId
              ? { ...p, timeEntries: [...p.timeEntries, newEntry] }
              : p
          ),
        }));
      },

      logActivity: (projectId, action, details, entityType, entityId) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;
        const activity: Activity = {
          id: uuidv4(),
          projectId,
          userId: currentUser.id,
          action,
          details,
          entityType: entityType as Activity["entityType"],
          entityId,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          activities: [activity, ...state.activities].slice(0, 200),
        }));
      },
    }),
    { name: "planstack-storage" }
  )
);

function calculateTestCycleSummary(
  totalTestCases: number,
  executions: TestExecution[]
) {
  const latestExecutions = new Map<string, TestExecution>();
  executions.forEach((e) => {
    const existing = latestExecutions.get(e.testCaseId);
    if (!existing || new Date(e.executedAt) > new Date(existing.executedAt)) {
      latestExecutions.set(e.testCaseId, e);
    }
  });
  const results = Array.from(latestExecutions.values());
  const passed = results.filter((e) => e.result === "passed").length;
  const failed = results.filter((e) => e.result === "failed").length;
  const blocked = results.filter((e) => e.result === "blocked").length;
  const skipped = results.filter((e) => e.result === "skipped").length;
  const notRun = totalTestCases - results.length;
  return {
    total: totalTestCases,
    passed,
    failed,
    blocked,
    skipped,
    notRun,
    passRate:
      totalTestCases > 0 ? Math.round((passed / totalTestCases) * 100) : 0,
    executionProgress:
      totalTestCases > 0
        ? Math.round((results.length / totalTestCases) * 100)
        : 0,
  };
}
