// Tipi di progetto
export type ProjectType =
  | "web"
  | "mobile"
  | "desktop"
  | "api"
  | "fullstack"
  | "other";

// Stato del progetto
export type ProjectStatus =
  | "planning"
  | "in-progress"
  | "review"
  | "completed"
  | "on-hold";

// Priorità
export type Priority = "low" | "medium" | "high" | "urgent";

// Complessità
export type Complexity = "low" | "medium" | "high" | "critical";

// Livello di confidenza per stime
export type ConfidenceLevel = "low" | "medium" | "high";

// Categoria per stime
export type EstimationCategory =
  | "development"
  | "design"
  | "testing"
  | "devops"
  | "management"
  | "documentation"
  | "other";

// Severity per defect
export type DefectSeverity = "critical" | "high" | "medium" | "low";

// Status per defect
export type DefectStatus =
  | "open"
  | "in-progress"
  | "resolved"
  | "closed"
  | "reopened"
  | "rejected";

// Risultato test
export type TestResult =
  | "pending"
  | "passed"
  | "failed"
  | "blocked"
  | "skipped";

// Ruoli utente
export type UserRole =
  | "ceo"
  | "project-manager"
  | "developer"
  | "designer"
  | "qa"
  | "devops"
  | "other";

// Utente
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  department?: string;
}

// Tecnologia
export interface Technology {
  id: string;
  name: string;
  category: "frontend" | "backend" | "database" | "devops" | "design" | "other";
  color: string;
}

// Task
export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "done";
  priority: Priority;
  assignee?: User;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  estimatedHours?: number;
  actualHours?: number;
  functionalRequirementId?: string;
}

// Messaggio
export interface Message {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  attachments?: Attachment[];
  reactions?: { emoji: string; users: string[] }[];
  isAnnouncement?: boolean;
  mentions?: string[];
  replyTo?: string;
}

// Allegato
export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

// Milestone
export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "pending" | "in-progress" | "completed";
  progress: number;
}

// ========================================
// ANALISI FUNZIONALE
// ========================================

export type RequirementType =
  | "functional"
  | "non-functional"
  | "technical"
  | "business"
  | "user-story";
export type RequirementPriority =
  | "must-have"
  | "should-have"
  | "could-have"
  | "wont-have";
export type RequirementStatus =
  | "draft"
  | "review"
  | "approved"
  | "implemented"
  | "rejected";

export interface FunctionalRequirement {
  id: string;
  code: string;
  title: string;
  description: string;
  type: RequirementType;
  priority: RequirementPriority;
  status: RequirementStatus;
  acceptanceCriteria: string[];
  dependencies: string[];
  author: User;
  reviewer?: User;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  approvedBy?: User;
  comments: RequirementComment[];
  attachments: Attachment[];
  linkedTasks: string[];
  version: number;
  history: RequirementHistoryEntry[];
}

export interface RequirementComment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  resolved: boolean;
}

export interface RequirementHistoryEntry {
  id: string;
  field: string;
  oldValue: string;
  newValue: string;
  changedBy: User;
  changedAt: string;
}

export interface FunctionalAnalysis {
  id: string;
  projectId: string;
  title: string;
  version: string;
  status: "draft" | "review" | "approved" | "superseded";
  description: string;
  scope: string;
  outOfScope: string;
  assumptions: string[];
  constraints: string[];
  requirements: FunctionalRequirement[];
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  approvedBy?: User;
  approvedAt?: string;
}

// ========================================
// STIME E EFFORT
// ========================================

export type EstimationMethod = "hours" | "story-points" | "t-shirt";
export type TShirtSize = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export interface EstimationItem {
  id: string;
  title: string;
  description: string;
  category: EstimationCategory;
  estimatedHours: number;
  complexity: Complexity;
  confidence: ConfidenceLevel;
  assumptions?: string[];
  risks?: string[];
  notes?: string;
  assignedRole?: UserRole;
  linkedRequirementId?: string;
}

export interface Estimation {
  id: string;
  projectId: string;
  title: string;
  version: string;
  status: "draft" | "review" | "approved" | "rejected";
  description?: string;
  method?: EstimationMethod;
  items: EstimationItem[];
  totalHours: number;
  bufferPercentage: number;
  contingencyPercentage?: number;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  approvedBy?: User;
  approvedAt?: string;
  comments?: EstimationComment[];
}

export interface EstimationComment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  itemId?: string;
}

export interface TimeEntry {
  id: string;
  userId: string;
  projectId: string;
  taskId?: string;
  date: string;
  hours: number;
  description: string;
  billable: boolean;
  createdAt: string;
}

// ========================================
// TEST CASES E RISULTATI
// ========================================

export type TestType =
  | "unit"
  | "integration"
  | "e2e"
  | "manual"
  | "automated"
  | "regression"
  | "smoke"
  | "uat"
  | "performance";
export type TestPriority = "critical" | "high" | "medium" | "low";
export type TestStatus = "draft" | "active" | "blocked" | "deprecated";

export interface TestStep {
  id: string;
  stepNumber: number;
  action: string;
  expectedResult: string;
  actualResult?: string;
  status?: TestResult;
  notes?: string;
  screenshot?: string;
}

export interface TestCase {
  id: string;
  code: string;
  title: string;
  description: string;
  type: "manual" | "automated";
  priority: TestPriority;
  status: TestStatus;
  preconditions?: string;
  steps: TestStep[];
  linkedRequirement?: string;
  tags?: string[];
  estimatedDuration?: number;
  createdAt: string;
  updatedAt: string;
  author: User;
  createdBy?: User;
  lastModifiedBy?: User;
}

export interface TestExecution {
  id: string;
  testCase: TestCase;
  testCaseId: string;
  testCycleId?: string;
  executedBy: User;
  executedAt: string;
  result: TestResult;
  executionTime?: number;
  duration?: number;
  environment?: string;
  browser?: string;
  device?: string;
  steps?: TestStep[];
  notes?: string;
  defects?: string[];
  attachments?: Attachment[];
}

export interface TestCycle {
  id: string;
  projectId: string;
  name: string;
  description: string;
  version?: string;
  environment: string;
  build?: string;
  status: "planned" | "in-progress" | "completed" | "aborted";
  startDate?: string;
  endDate?: string;
  testCases: TestCase[];
  executions: TestExecution[];
  createdAt: string;
  createdBy: User;
  summary?: TestCycleSummary;
}

export interface TestCycleSummary {
  total: number;
  passed: number;
  failed: number;
  blocked: number;
  skipped: number;
  notRun: number;
  passRate: number;
  executionProgress: number;
}

export interface Defect {
  id: string;
  code: string;
  title: string;
  description: string;
  severity: DefectSeverity;
  priority: Priority;
  status: DefectStatus;
  stepsToReproduce: string[];
  expectedBehavior: string;
  actualBehavior: string;
  environment: string;
  browser?: string;
  device?: string;
  assignedTo?: User;
  reportedBy: User;
  linkedTestCase?: string;
  linkedRequirement?: string;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolvedBy?: User;
}

// ========================================
// PROGETTO ESTESO
// ========================================

export interface Project {
  id: string;
  name: string;
  description: string;
  type: ProjectType;
  status: ProjectStatus;
  priority: Priority;
  technologies: Technology[];
  team: User[];
  tasks: Task[];
  messages: Message[];
  milestones: Milestone[];
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  budget?: number;
  client?: string;
  repository?: string;
  figmaLink?: string;
  documentationLink?: string;
  functionalAnalyses: FunctionalAnalysis[];
  estimations: Estimation[];
  testCases: TestCase[];
  testCycles: TestCycle[];
  defects: Defect[];
  timeEntries: TimeEntry[];
}

// Activity log
export interface Activity {
  id: string;
  projectId: string;
  userId: string;
  action: string;
  details: string;
  entityType?:
    | "project"
    | "task"
    | "requirement"
    | "estimation"
    | "test"
    | "defect";
  entityId?: string;
  createdAt: string;
}
