/**
 * Gemeinsame Domain-Typen für Main- und Renderer-Prozess.
 * Die JSON-Spalten der SQLite-Tabellen werden hier als strukturierte Typen abgebildet.
 */

export type Criticality = "low" | "medium" | "high";
export type Frequency = "adhoc" | "daily" | "weekly" | "monthly" | "ondemand";
export type ProcessStatus = "active" | "deprecated" | "maintenance";
export type ActionType = "shell" | "pad" | "cloudflow" | "file";
export type RunStatus =
  | "pending"
  | "running"
  | "success"
  | "failed"
  | "canceled";
export type LogLevel = "info" | "warn" | "error";
export type LogSource = "app" | "script" | "external";
export type ParamType = "string" | "number" | "date" | "boolean" | "enum";
export type UserRole = "viewer" | "operator" | "editor";

export interface BusinessInfo {
  benefit: string;
  istProcess: string;
  sollProcess: string;
}

export interface TechFlow {
  /** z.B. "Power Automate Desktop", "Power Automate Cloud", "VBA-Makro" */
  kind: string;
  link?: string;
  name: string;
}

export interface TechFile {
  path: string;
  purpose: string;
}

export interface TechSystem {
  detail?: string;
  name: string;
}

export interface TechInfo {
  files: TechFile[];
  flows: TechFlow[];
  notes?: string;
  systems: TechSystem[];
}

export interface RunbookError {
  escalation?: string;
  problem: string;
  solution: string;
}

export interface RunbookInfo {
  errors: RunbookError[];
  expectedResults: string[];
  prerequisites: string[];
  steps: string[];
  whenToUse: string;
}

export type DiagramNodeKind =
  | "start"
  | "input"
  | "system"
  | "decision"
  | "output"
  | "end";

export interface DiagramNode {
  id: string;
  kind: DiagramNodeKind;
  label: string;
  sublabel?: string;
}

export interface DiagramEdge {
  from: string;
  label?: string;
  to: string;
}

export interface FlowDiagram {
  edges: DiagramEdge[];
  nodes: DiagramNode[];
}

export interface ProcessAction {
  bodyTemplate?: string;
  /** shell: Kommando inkl. Argumente (Parameter via {{key}} ersetzbar) */
  command?: string;
  cwd?: string;
  /** file: zu öffnende Datei (z.B. Excel mit Auto-Makro) */
  filePath?: string;
  headers?: Record<string, string>;
  method?: "POST" | "GET";
  /** pad: Flow-Name bzw. ms-powerautomate-URL */
  padFlowName?: string;
  padUrl?: string;
  type: ActionType;
  /** cloudflow: HTTP-Trigger */
  url?: string;
}

export interface ProcessSummary {
  actionType: ActionType;
  businessOwner: string;
  category: string;
  criticality: Criticality;
  descriptionShort: string;
  favorite: boolean;
  frequency: Frequency;
  hasTutorial: boolean;
  id: number;
  lastRunAt: string | null;
  lastRunStatus: RunStatus | null;
  name: string;
  runCount: number;
  status: ProcessStatus;
  systems: string[];
  tags: string[];
  technicalOwner: string;
  updatedAt: string;
}

export interface ProcessDetail extends ProcessSummary {
  action: ProcessAction;
  business: BusinessInfo;
  createdAt: string;
  descriptionLong: string;
  diagram: FlowDiagram;
  runbook: RunbookInfo;
  tech: TechInfo;
}

export interface ProcessParameter {
  defaultValue: string;
  description: string;
  group: string;
  id: number;
  key: string;
  name: string;
  options: string[];
  processId: number;
  required: boolean;
  sortOrder: number;
  type: ParamType;
}

export type TechnicalArtifactKind =
  | "Power Automate Desktop"
  | "Excel VBA"
  | "SAP VBScript";

export interface ProcessTechnicalArtifact {
  code: string;
  description: string;
  id: number;
  kind: TechnicalArtifactKind;
  language: string;
  processId: number;
  sortOrder: number;
  source: string;
  title: string;
}

export interface ProcessRun {
  durationMs: number | null;
  errorSummary: string | null;
  executedBy: string;
  finishedAt: string | null;
  id: number;
  parameters: Record<string, string>;
  processId: number;
  processName?: string;
  startedAt: string;
  status: RunStatus;
}

export interface RunLogEntry {
  id: number;
  level: LogLevel;
  message: string;
  runId: number;
  source: LogSource;
  timestamp: string;
}

export interface TutorialStep {
  description: string;
  expectedResult: string;
  group: string;
  id: number;
  mediaUrl: string | null;
  sortOrder: number;
  title: string;
  tutorialId: number;
}

export interface Tutorial {
  description: string;
  id: number;
  processId: number;
  steps: TutorialStep[];
  title: string;
}

export interface DashboardStats {
  activeProcesses: number;
  categories: { category: string; count: number }[];
  criticalProcesses: ProcessSummary[];
  failedLast30Days: number;
  highCriticality: number;
  recentRuns: ProcessRun[];
  runningNow: number;
  runsLast30Days: number;
  successRate30Days: number | null;
  totalProcesses: number;
  totalRuns: number;
}

export const CRITICALITY_LABELS: Record<Criticality, string> = {
  low: "Niedrig",
  medium: "Mittel",
  high: "Hoch",
};

export const FREQUENCY_LABELS: Record<Frequency, string> = {
  adhoc: "Ad-hoc",
  daily: "Täglich",
  weekly: "Wöchentlich",
  monthly: "Monatlich",
  ondemand: "On-Demand",
};

export const PROCESS_STATUS_LABELS: Record<ProcessStatus, string> = {
  active: "Aktiv",
  deprecated: "Veraltet",
  maintenance: "In Wartung",
};

export const RUN_STATUS_LABELS: Record<RunStatus, string> = {
  pending: "Wartend",
  running: "Läuft",
  success: "Erfolgreich",
  failed: "Fehlgeschlagen",
  canceled: "Abgebrochen",
};

export const ACTION_TYPE_LABELS: Record<ActionType, string> = {
  shell: "Skript / Shell",
  pad: "Power Automate Desktop",
  cloudflow: "Cloud-Flow (HTTP)",
  file: "Datei öffnen",
};

export const ROLE_LABELS: Record<UserRole, string> = {
  viewer: "Viewer",
  operator: "Operator",
  editor: "Editor",
};

export const PARAM_TYPE_LABELS: Record<ParamType, string> = {
  string: "Text",
  number: "Zahl",
  date: "Datum",
  boolean: "Ja/Nein",
  enum: "Auswahl",
};
