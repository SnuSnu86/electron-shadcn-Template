import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { app } from "electron";

let db: DatabaseSync | null = null;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS processes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description_short TEXT NOT NULL DEFAULT '',
  description_long TEXT NOT NULL DEFAULT '',
  business_owner TEXT NOT NULL DEFAULT '',
  technical_owner TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Allgemein',
  frequency TEXT NOT NULL DEFAULT 'ondemand',
  status TEXT NOT NULL DEFAULT 'active',
  systems_json TEXT NOT NULL DEFAULT '[]',
  tags_json TEXT NOT NULL DEFAULT '[]',
  favorite INTEGER NOT NULL DEFAULT 0,
  business_json TEXT NOT NULL DEFAULT '{}',
  tech_json TEXT NOT NULL DEFAULT '{}',
  runbook_json TEXT NOT NULL DEFAULT '{}',
  diagram_json TEXT NOT NULL DEFAULT '{}',
  action_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS process_parameters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  process_id INTEGER NOT NULL REFERENCES processes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'string',
  default_value TEXT NOT NULL DEFAULT '',
  required INTEGER NOT NULL DEFAULT 0,
  group_name TEXT NOT NULL DEFAULT 'Allgemein',
  description TEXT NOT NULL DEFAULT '',
  options_json TEXT NOT NULL DEFAULT '[]',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS process_technical_artifacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  process_id INTEGER NOT NULL REFERENCES processes(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  kind TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  language TEXT NOT NULL DEFAULT '',
  code TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS process_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  process_id INTEGER NOT NULL REFERENCES processes(id) ON DELETE CASCADE,
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  finished_at TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  duration_ms INTEGER,
  executed_by TEXT NOT NULL DEFAULT '',
  parameters_json TEXT NOT NULL DEFAULT '{}',
  error_summary TEXT
);

CREATE TABLE IF NOT EXISTS run_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id INTEGER NOT NULL REFERENCES process_runs(id) ON DELETE CASCADE,
  timestamp TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%f', 'now')),
  level TEXT NOT NULL DEFAULT 'info',
  message TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'app'
);

CREATE TABLE IF NOT EXISTS tutorials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  process_id INTEGER NOT NULL REFERENCES processes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS tutorial_steps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tutorial_id INTEGER NOT NULL REFERENCES tutorials(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  group_name TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  expected_result TEXT NOT NULL DEFAULT '',
  media_url TEXT
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_runs_process ON process_runs(process_id);
CREATE INDEX IF NOT EXISTS idx_logs_run ON run_logs(run_id);
CREATE INDEX IF NOT EXISTS idx_steps_tutorial ON tutorial_steps(tutorial_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_process ON process_technical_artifacts(process_id);
`;

function columnExists(table: string, column: string): boolean {
  const rows = getDb().prepare(`PRAGMA table_info(${table})`).all() as {
    name: string;
  }[];
  return rows.some((row) => row.name === column);
}

function runMigrations(): void {
  if (columnExists("processes", "criticality")) {
    getDb().exec("ALTER TABLE processes DROP COLUMN criticality");
  }
}

export function getDbPath(): string {
  const portableDataDir = process.env.JOZI_PORTABLE_DATA_DIR;
  if (portableDataDir) {
    return path.join(portableDataDir, "jozi-control-center.db");
  }

  const exeDir = path.dirname(app.getPath("exe"));
  if (path.basename(exeDir).toLowerCase() === "app") {
    return path.join(path.dirname(exeDir), "data", "jozi-control-center.db");
  }

  return path.join(app.getPath("userData"), "jozi-control-center.db");
}

export function getDb(): DatabaseSync {
  if (!db) {
    const dbPath = getDbPath();
    mkdirSync(path.dirname(dbPath), { recursive: true });
    db = new DatabaseSync(dbPath);
    db.exec("PRAGMA journal_mode = WAL");
    db.exec("PRAGMA foreign_keys = ON");
    db.exec(SCHEMA);
    runMigrations();
  }
  return db;
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}
