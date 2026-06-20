// @vitest-environment node

import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { afterEach, describe, expect, test, vi } from "vitest";

const appPaths = {
  exe: path.join("E:", "JOZI", "portable", "app", "JOZI-Docs.exe"),
  userData: path.join("C:", "Users", "Test", "AppData", "Roaming", "JOZI"),
};

vi.mock("electron", () => ({
  app: {
    getPath: (name: string) => {
      if (name !== "userData" && name !== "exe") {
        throw new Error(`Unexpected app path: ${name}`);
      }
      return appPaths[name as keyof typeof appPaths];
    },
  },
}));

describe("database path", () => {
  let tempDir: string | null = null;

  afterEach(async () => {
    const { closeDb } = await import("@/main/db/database");
    closeDb();
    delete process.env.JOZI_PORTABLE_DATA_DIR;
    appPaths.exe = path.join("E:", "JOZI", "portable", "app", "JOZI-Docs.exe");
    appPaths.userData = path.join(
      "C:",
      "Users",
      "Test",
      "AppData",
      "Roaming",
      "JOZI"
    );
    if (tempDir) {
      rmSync(tempDir, { recursive: true, force: true });
      tempDir = null;
    }
    vi.resetModules();
  });

  test("uses the portable data directory when configured", async () => {
    process.env.JOZI_PORTABLE_DATA_DIR = path.join(
      "D:",
      "Tools",
      "JOZI",
      "data"
    );

    const { getDbPath } = await import("@/main/db/database");

    expect(getDbPath()).toBe(
      path.join("D:", "Tools", "JOZI", "data", "jozi-control-center.db")
    );
  });

  test("uses portable data next to the app when launched from a portable folder", async () => {
    appPaths.exe = path.join(
      "D:",
      "Tools",
      "JOZI",
      "portable",
      "app",
      "JOZI-Docs.exe"
    );

    const { getDbPath } = await import("@/main/db/database");

    expect(getDbPath()).toBe(
      path.join(
        "D:",
        "Tools",
        "JOZI",
        "portable",
        "data",
        "jozi-control-center.db"
      )
    );
  });

  test("migrates existing process tables by removing criticality", async () => {
    tempDir = mkdtempSync(path.join(tmpdir(), "jozi-db-"));
    process.env.JOZI_PORTABLE_DATA_DIR = tempDir;
    const dbPath = path.join(tempDir, "jozi-control-center.db");
    const existing = new DatabaseSync(dbPath);
    existing.exec(`
      CREATE TABLE processes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description_short TEXT NOT NULL DEFAULT '',
        description_long TEXT NOT NULL DEFAULT '',
        business_owner TEXT NOT NULL DEFAULT '',
        technical_owner TEXT NOT NULL DEFAULT '',
        category TEXT NOT NULL DEFAULT 'Allgemein',
        criticality TEXT NOT NULL DEFAULT 'medium',
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
      INSERT INTO processes (name, criticality, frequency)
      VALUES ('Altprozess', 'high', 'daily');
    `);
    existing.close();

    const { getDb } = await import("@/main/db/database");
    const db = getDb();

    const columns = db
      .prepare("PRAGMA table_info(processes)")
      .all()
      .map((column) => column.name);
    expect(columns).not.toContain("criticality");
    expect(
      db.prepare("SELECT name, frequency FROM processes").get()
    ).toMatchObject({ name: "Altprozess", frequency: "daily" });
  });
});
