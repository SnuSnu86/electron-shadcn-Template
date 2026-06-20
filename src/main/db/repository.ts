import type {
  BusinessInfo,
  DashboardStats,
  FlowDiagram,
  Frequency,
  LogLevel,
  LogSource,
  ProcessAction,
  ProcessDetail,
  ProcessParameter,
  ProcessRun,
  ProcessStatus,
  ProcessSummary,
  ProcessTechnicalArtifact,
  RunbookInfo,
  RunLogEntry,
  RunStatus,
  TechInfo,
  Tutorial,
  TutorialStep,
} from "@/shared/domain";
import { getDb } from "./database";

// biome-ignore lint/suspicious/noExplicitAny: SQLite-Rohzeilen
type Row = Record<string, any>;

function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) {
    return fallback;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

const EMPTY_BUSINESS: BusinessInfo = {
  istProcess: "",
  sollProcess: "",
  benefit: "",
};
const EMPTY_TECH: TechInfo = { flows: [], files: [], systems: [], notes: "" };
const EMPTY_RUNBOOK: RunbookInfo = {
  whenToUse: "",
  prerequisites: [],
  steps: [],
  expectedResults: [],
  errors: [],
};
const EMPTY_DIAGRAM: FlowDiagram = { nodes: [], edges: [] };
const EMPTY_ACTION: ProcessAction = { type: "shell", command: "" };

function rowToSummary(row: Row): ProcessSummary {
  const action = parseJson<ProcessAction>(row.action_json, EMPTY_ACTION);
  return {
    id: row.id,
    name: row.name,
    descriptionShort: row.description_short,
    category: row.category,
    frequency: row.frequency as Frequency,
    status: row.status as ProcessStatus,
    businessOwner: row.business_owner,
    technicalOwner: row.technical_owner,
    systems: parseJson<string[]>(row.systems_json, []),
    tags: parseJson<string[]>(row.tags_json, []),
    favorite: row.favorite === 1,
    actionType: action.type ?? "shell",
    lastRunAt: row.last_run_at ?? null,
    lastRunStatus: (row.last_run_status as RunStatus) ?? null,
    runCount: row.run_count ?? 0,
    hasTutorial: (row.tutorial_count ?? 0) > 0,
    updatedAt: row.updated_at,
  };
}

function rowToDetail(row: Row): ProcessDetail {
  return {
    ...rowToSummary(row),
    descriptionLong: row.description_long,
    business: parseJson<BusinessInfo>(row.business_json, EMPTY_BUSINESS),
    tech: parseJson<TechInfo>(row.tech_json, EMPTY_TECH),
    runbook: parseJson<RunbookInfo>(row.runbook_json, EMPTY_RUNBOOK),
    diagram: parseJson<FlowDiagram>(row.diagram_json, EMPTY_DIAGRAM),
    action: parseJson<ProcessAction>(row.action_json, EMPTY_ACTION),
    createdAt: row.created_at,
  };
}

const PROCESS_LIST_SQL = `
SELECT p.*,
  (SELECT started_at FROM process_runs r WHERE r.process_id = p.id ORDER BY r.id DESC LIMIT 1) AS last_run_at,
  (SELECT status FROM process_runs r WHERE r.process_id = p.id ORDER BY r.id DESC LIMIT 1) AS last_run_status,
  (SELECT COUNT(*) FROM process_runs r WHERE r.process_id = p.id) AS run_count,
  (SELECT COUNT(*) FROM tutorials t WHERE t.process_id = p.id) AS tutorial_count
FROM processes p
`;

export interface ProcessFilter {
  category?: string;
  favoritesOnly?: boolean;
  search?: string;
  status?: ProcessStatus;
  tag?: string;
}

export function listProcesses(filter: ProcessFilter = {}): ProcessSummary[] {
  const db = getDb();
  const rows = db
    .prepare(`${PROCESS_LIST_SQL} ORDER BY p.name COLLATE NOCASE`)
    .all() as Row[];
  let result = rows.map(rowToSummary);

  if (filter.search) {
    const q = filter.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.descriptionShort.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.systems.some((s) => s.toLowerCase().includes(q))
    );
  }
  if (filter.category) {
    result = result.filter((p) => p.category === filter.category);
  }
  if (filter.status) {
    result = result.filter((p) => p.status === filter.status);
  }
  if (filter.tag) {
    result = result.filter((p) => p.tags.includes(filter.tag as string));
  }
  if (filter.favoritesOnly) {
    result = result.filter((p) => p.favorite);
  }
  return result;
}

export function getProcess(id: number): ProcessDetail | null {
  const db = getDb();
  const row = db.prepare(`${PROCESS_LIST_SQL} WHERE p.id = ?`).get(id) as
    | Row
    | undefined;
  return row ? rowToDetail(row) : null;
}

export interface ProcessInput {
  action: ProcessAction;
  business: BusinessInfo;
  businessOwner: string;
  category: string;
  descriptionLong: string;
  descriptionShort: string;
  diagram: FlowDiagram;
  frequency: Frequency;
  name: string;
  runbook: RunbookInfo;
  status: ProcessStatus;
  systems: string[];
  tags: string[];
  tech: TechInfo;
  technicalOwner: string;
}

export function createProcess(input: ProcessInput): number {
  const db = getDb();
  const res = db
    .prepare(
      `INSERT INTO processes
        (name, description_short, description_long, business_owner, technical_owner,
         category, frequency, status, systems_json, tags_json,
         business_json, tech_json, runbook_json, diagram_json, action_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      input.name,
      input.descriptionShort,
      input.descriptionLong,
      input.businessOwner,
      input.technicalOwner,
      input.category,
      input.frequency,
      input.status,
      JSON.stringify(input.systems),
      JSON.stringify(input.tags),
      JSON.stringify(input.business),
      JSON.stringify(input.tech),
      JSON.stringify(input.runbook),
      JSON.stringify(input.diagram),
      JSON.stringify(input.action)
    );
  return Number(res.lastInsertRowid);
}

export function updateProcess(id: number, input: ProcessInput): void {
  const db = getDb();
  db.prepare(
    `UPDATE processes SET
       name = ?, description_short = ?, description_long = ?, business_owner = ?,
       technical_owner = ?, category = ?, frequency = ?, status = ?,
       systems_json = ?, tags_json = ?, business_json = ?, tech_json = ?,
       runbook_json = ?, diagram_json = ?, action_json = ?,
       updated_at = datetime('now')
     WHERE id = ?`
  ).run(
    input.name,
    input.descriptionShort,
    input.descriptionLong,
    input.businessOwner,
    input.technicalOwner,
    input.category,
    input.frequency,
    input.status,
    JSON.stringify(input.systems),
    JSON.stringify(input.tags),
    JSON.stringify(input.business),
    JSON.stringify(input.tech),
    JSON.stringify(input.runbook),
    JSON.stringify(input.diagram),
    JSON.stringify(input.action),
    id
  );
}

export function deleteProcess(id: number): void {
  getDb().prepare("DELETE FROM processes WHERE id = ?").run(id);
}

export function toggleFavorite(id: number): boolean {
  const db = getDb();
  db.prepare("UPDATE processes SET favorite = 1 - favorite WHERE id = ?").run(
    id
  );
  const row = db
    .prepare("SELECT favorite FROM processes WHERE id = ?")
    .get(id) as Row | undefined;
  return row?.favorite === 1;
}

export function listCategories(): string[] {
  const rows = getDb()
    .prepare("SELECT DISTINCT category FROM processes ORDER BY category")
    .all() as Row[];
  return rows.map((r) => r.category);
}

export function listTags(): string[] {
  const rows = getDb()
    .prepare("SELECT tags_json FROM processes")
    .all() as Row[];
  const tags = new Set<string>();
  for (const row of rows) {
    for (const tag of parseJson<string[]>(row.tags_json, [])) {
      tags.add(tag);
    }
  }
  return [...tags].sort((a, b) => a.localeCompare(b, "de"));
}

// ---------- Parameter ----------

function rowToParameter(row: Row): ProcessParameter {
  return {
    id: row.id,
    processId: row.process_id,
    name: row.name,
    key: row.key,
    type: row.type,
    defaultValue: row.default_value,
    required: row.required === 1,
    group: row.group_name,
    description: row.description,
    options: parseJson<string[]>(row.options_json, []),
    sortOrder: row.sort_order,
  };
}

export function listParameters(processId: number): ProcessParameter[] {
  const rows = getDb()
    .prepare(
      "SELECT * FROM process_parameters WHERE process_id = ? ORDER BY group_name, sort_order, id"
    )
    .all(processId) as Row[];
  return rows.map(rowToParameter);
}

export interface ParameterInput {
  defaultValue: string;
  description: string;
  group: string;
  key: string;
  name: string;
  options: string[];
  processId: number;
  required: boolean;
  sortOrder: number;
  type: string;
}

export function upsertParameter(input: ParameterInput, id?: number): number {
  const db = getDb();
  if (id) {
    db.prepare(
      `UPDATE process_parameters SET name = ?, key = ?, type = ?, default_value = ?,
        required = ?, group_name = ?, description = ?, options_json = ?, sort_order = ?
       WHERE id = ?`
    ).run(
      input.name,
      input.key,
      input.type,
      input.defaultValue,
      input.required ? 1 : 0,
      input.group,
      input.description,
      JSON.stringify(input.options),
      input.sortOrder,
      id
    );
    return id;
  }
  const res = db
    .prepare(
      `INSERT INTO process_parameters
        (process_id, name, key, type, default_value, required, group_name, description, options_json, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      input.processId,
      input.name,
      input.key,
      input.type,
      input.defaultValue,
      input.required ? 1 : 0,
      input.group,
      input.description,
      JSON.stringify(input.options),
      input.sortOrder
    );
  return Number(res.lastInsertRowid);
}

export function deleteParameter(id: number): void {
  getDb().prepare("DELETE FROM process_parameters WHERE id = ?").run(id);
}

// ---------- Technical Artifacts ----------

function rowToTechnicalArtifact(row: Row): ProcessTechnicalArtifact {
  return {
    id: row.id,
    processId: row.process_id,
    sortOrder: row.sort_order,
    kind: row.kind,
    title: row.title,
    description: row.description,
    language: row.language,
    code: row.code,
    source: row.source,
  };
}

export type TechnicalArtifactInput = Omit<
  ProcessTechnicalArtifact,
  "id" | "processId"
>;

export function listTechnicalArtifacts(
  processId: number
): ProcessTechnicalArtifact[] {
  const rows = getDb()
    .prepare(
      `SELECT * FROM process_technical_artifacts
       WHERE process_id = ?
       ORDER BY sort_order, id`
    )
    .all(processId) as Row[];
  return rows.map(rowToTechnicalArtifact);
}

export function replaceTechnicalArtifacts(
  processId: number,
  artifacts: TechnicalArtifactInput[]
): void {
  const db = getDb();
  db.prepare(
    "DELETE FROM process_technical_artifacts WHERE process_id = ?"
  ).run(processId);

  const insert = db.prepare(
    `INSERT INTO process_technical_artifacts
      (process_id, sort_order, kind, title, description, language, code, source)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );

  for (const artifact of artifacts) {
    insert.run(
      processId,
      artifact.sortOrder,
      artifact.kind,
      artifact.title,
      artifact.description,
      artifact.language,
      artifact.code,
      artifact.source
    );
  }
}

// ---------- Runs & Logs ----------

function rowToRun(row: Row): ProcessRun {
  return {
    id: row.id,
    processId: row.process_id,
    processName: row.process_name ?? undefined,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    status: row.status as RunStatus,
    durationMs: row.duration_ms,
    executedBy: row.executed_by,
    parameters: parseJson<Record<string, string>>(row.parameters_json, {}),
    errorSummary: row.error_summary,
  };
}

export function createRun(
  processId: number,
  executedBy: string,
  parameters: Record<string, string>
): number {
  const res = getDb()
    .prepare(
      `INSERT INTO process_runs (process_id, status, executed_by, parameters_json)
       VALUES (?, 'running', ?, ?)`
    )
    .run(processId, executedBy, JSON.stringify(parameters));
  return Number(res.lastInsertRowid);
}

export function finishRun(
  runId: number,
  status: RunStatus,
  errorSummary?: string
): void {
  getDb()
    .prepare(
      `UPDATE process_runs SET
         status = ?,
         finished_at = datetime('now'),
         duration_ms = CAST((julianday('now') - julianday(started_at)) * 86400000 AS INTEGER),
         error_summary = ?
       WHERE id = ?`
    )
    .run(status, errorSummary ?? null, runId);
}

export function getRun(runId: number): ProcessRun | null {
  const row = getDb()
    .prepare(
      `SELECT r.*, p.name AS process_name
       FROM process_runs r JOIN processes p ON p.id = r.process_id
       WHERE r.id = ?`
    )
    .get(runId) as Row | undefined;
  return row ? rowToRun(row) : null;
}

export function listRunsByProcess(
  processId: number,
  limit = 100
): ProcessRun[] {
  const rows = getDb()
    .prepare(
      `SELECT r.*, p.name AS process_name
       FROM process_runs r JOIN processes p ON p.id = r.process_id
       WHERE r.process_id = ? ORDER BY r.id DESC LIMIT ?`
    )
    .all(processId, limit) as Row[];
  return rows.map(rowToRun);
}

export function listRecentRuns(limit = 25): ProcessRun[] {
  const rows = getDb()
    .prepare(
      `SELECT r.*, p.name AS process_name
       FROM process_runs r JOIN processes p ON p.id = r.process_id
       ORDER BY r.id DESC LIMIT ?`
    )
    .all(limit) as Row[];
  return rows.map(rowToRun);
}

export function addLog(
  runId: number,
  level: LogLevel,
  message: string,
  source: LogSource = "app"
): void {
  getDb()
    .prepare(
      "INSERT INTO run_logs (run_id, level, message, source) VALUES (?, ?, ?, ?)"
    )
    .run(runId, level, message, source);
}

export function getLogs(runId: number, afterId = 0): RunLogEntry[] {
  const rows = getDb()
    .prepare(
      "SELECT * FROM run_logs WHERE run_id = ? AND id > ? ORDER BY id ASC"
    )
    .all(runId, afterId) as Row[];
  return rows.map((row) => ({
    id: row.id,
    runId: row.run_id,
    timestamp: row.timestamp,
    level: row.level as LogLevel,
    message: row.message,
    source: row.source as LogSource,
  }));
}

// ---------- Tutorials ----------

function rowToStep(row: Row): TutorialStep {
  return {
    id: row.id,
    tutorialId: row.tutorial_id,
    sortOrder: row.sort_order,
    group: row.group_name,
    title: row.title,
    description: row.description,
    expectedResult: row.expected_result,
    mediaUrl: row.media_url,
  };
}

export function getTutorialByProcess(processId: number): Tutorial | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM tutorials WHERE process_id = ? LIMIT 1")
    .get(processId) as Row | undefined;
  if (!row) {
    return null;
  }
  const steps = db
    .prepare(
      "SELECT * FROM tutorial_steps WHERE tutorial_id = ? ORDER BY sort_order, id"
    )
    .all(row.id) as Row[];
  return {
    id: row.id,
    processId: row.process_id,
    title: row.title,
    description: row.description,
    steps: steps.map(rowToStep),
  };
}

export function upsertTutorial(
  processId: number,
  title: string,
  description: string
): number {
  const db = getDb();
  const existing = db
    .prepare("SELECT id FROM tutorials WHERE process_id = ? LIMIT 1")
    .get(processId) as Row | undefined;
  if (existing) {
    db.prepare(
      "UPDATE tutorials SET title = ?, description = ? WHERE id = ?"
    ).run(title, description, existing.id);
    return existing.id;
  }
  const res = db
    .prepare(
      "INSERT INTO tutorials (process_id, title, description) VALUES (?, ?, ?)"
    )
    .run(processId, title, description);
  return Number(res.lastInsertRowid);
}

export interface StepInput {
  description: string;
  expectedResult: string;
  group: string;
  mediaUrl: string | null;
  sortOrder: number;
  title: string;
  tutorialId: number;
}

export function upsertStep(input: StepInput, id?: number): number {
  const db = getDb();
  if (id) {
    db.prepare(
      `UPDATE tutorial_steps SET sort_order = ?, group_name = ?, title = ?,
        description = ?, expected_result = ?, media_url = ? WHERE id = ?`
    ).run(
      input.sortOrder,
      input.group,
      input.title,
      input.description,
      input.expectedResult,
      input.mediaUrl,
      id
    );
    return id;
  }
  const res = db
    .prepare(
      `INSERT INTO tutorial_steps (tutorial_id, sort_order, group_name, title, description, expected_result, media_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      input.tutorialId,
      input.sortOrder,
      input.group,
      input.title,
      input.description,
      input.expectedResult,
      input.mediaUrl
    );
  return Number(res.lastInsertRowid);
}

export function deleteStep(id: number): void {
  getDb().prepare("DELETE FROM tutorial_steps WHERE id = ?").run(id);
}

export function deleteTutorial(id: number): void {
  getDb().prepare("DELETE FROM tutorials WHERE id = ?").run(id);
}

// ---------- Settings ----------

export function getSetting(key: string): string | null {
  const row = getDb()
    .prepare("SELECT value FROM settings WHERE key = ?")
    .get(key) as Row | undefined;
  return row?.value ?? null;
}

export function setSetting(key: string, value: string): void {
  getDb()
    .prepare(
      "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
    )
    .run(key, value);
}

// ---------- Dashboard ----------

export function getDashboardStats(): DashboardStats {
  const db = getDb();
  const totals = db
    .prepare(
      `SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active
       FROM processes`
    )
    .get() as Row;
  const runTotals = db
    .prepare(
      `SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN started_at >= datetime('now', '-30 days') THEN 1 ELSE 0 END) AS last30,
        SUM(CASE WHEN started_at >= datetime('now', '-30 days') AND status = 'failed' THEN 1 ELSE 0 END) AS failed30,
        SUM(CASE WHEN started_at >= datetime('now', '-30 days') AND status = 'success' THEN 1 ELSE 0 END) AS success30,
        SUM(CASE WHEN status = 'running' THEN 1 ELSE 0 END) AS running
       FROM process_runs`
    )
    .get() as Row;
  const categories = db
    .prepare(
      "SELECT category, COUNT(*) AS count FROM processes GROUP BY category ORDER BY count DESC"
    )
    .all() as Row[];

  const last30 = runTotals.last30 ?? 0;
  const success30 = runTotals.success30 ?? 0;
  const finished30 = success30 + (runTotals.failed30 ?? 0);

  return {
    totalProcesses: totals.total ?? 0,
    activeProcesses: totals.active ?? 0,
    totalRuns: runTotals.total ?? 0,
    runsLast30Days: last30,
    failedLast30Days: runTotals.failed30 ?? 0,
    successRate30Days:
      finished30 > 0 ? Math.round((success30 / finished30) * 100) : null,
    categories: categories.map((c) => ({
      category: c.category,
      count: c.count,
    })),
    recentRuns: listRecentRuns(8),
    runningNow: runTotals.running ?? 0,
  };
}

// ---------- Export ----------

export interface FullExport {
  exportedAt: string;
  processes: (ProcessDetail & {
    parameters: ProcessParameter[];
    runs: ProcessRun[];
    tutorial: Tutorial | null;
  })[];
}

export function buildFullExport(): FullExport {
  const processes = listProcesses().map((summary) => {
    const detail = getProcess(summary.id) as ProcessDetail;
    return {
      ...detail,
      parameters: listParameters(summary.id),
      runs: listRunsByProcess(summary.id, 50),
      tutorial: getTutorialByProcess(summary.id),
    };
  });
  return {
    exportedAt: new Date().toISOString(),
    processes,
  };
}

export function countProcesses(): number {
  const row = getDb()
    .prepare("SELECT COUNT(*) AS c FROM processes")
    .get() as Row;
  return row.c ?? 0;
}

// Beim App-Start hängengebliebene Runs bereinigen
export function failOrphanedRuns(): void {
  const db = getDb();
  const orphans = db
    .prepare(
      "SELECT id FROM process_runs WHERE status IN ('running', 'pending')"
    )
    .all() as Row[];
  for (const o of orphans) {
    addLog(o.id, "warn", "Run wurde durch App-Neustart unterbrochen.", "app");
    finishRun(o.id, "canceled", "Durch App-Neustart unterbrochen");
  }
}
