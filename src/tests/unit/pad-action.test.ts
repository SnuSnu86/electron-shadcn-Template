// @vitest-environment node

import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

let testUserData = "";

vi.mock("electron", () => ({
  app: {
    getPath: (name: string) => {
      if (name === "exe") {
        return path.join("C:", "Program Files", "JOZI", "JOZI-Docs.exe");
      }
      if (name !== "userData") {
        throw new Error(`Unexpected app path: ${name}`);
      }
      return testUserData;
    },
  },
}));

describe("Power Automate Desktop action", () => {
  beforeEach(() => {
    testUserData = mkdtempSync(path.join(tmpdir(), "jozi-pad-action-"));
    vi.resetModules();
  });

  afterEach(async () => {
    const { closeDb } = await import("@/main/db/database");
    closeDb();
    rmSync(testUserData, { force: true, recursive: true });
  });

  test("builds a concrete PAD run URL from environment and workflow ids", async () => {
    const { buildPadRunUrl } = await import("@/main/execution/pad-url");

    expect(
      buildPadRunUrl({
        environmentId: "f5eaa9d6-cb8e-e5b2-b60a-4aa38e133e46",
        workflowId: "0fdc73b7-78b9-4b4e-887a-ca73268683a8",
      })
    ).toBe(
      "ms-powerautomate:/console/flow/run?environmentid=f5eaa9d6-cb8e-e5b2-b60a-4aa38e133e46&workflowid=0fdc73b7-78b9-4b4e-887a-ca73268683a8&source=Other"
    );
  });

  test("backfills the existing Servicegrad process with the concrete PAD run metadata", async () => {
    const { bootstrapRealProcesses } = await import(
      "@/main/db/seed-servicegrad"
    );
    const { getProcess } = await import("@/main/db/repository");
    const { SERVICEGRAD_PROCESS_NAME } = await import(
      "@/main/db/processes/servicegrad"
    );

    bootstrapRealProcesses();
    bootstrapRealProcesses();

    const db = await import("@/main/db/database");
    const row = db
      .getDb()
      .prepare("SELECT id FROM processes WHERE name = ?")
      .get(SERVICEGRAD_PROCESS_NAME) as { id: number };

    const process = getProcess(row.id);

    expect(process?.action).toMatchObject({
      type: "pad",
      padEnvironmentId: "f5eaa9d6-cb8e-e5b2-b60a-4aa38e133e46",
      padWorkflowId: "0fdc73b7-78b9-4b4e-887a-ca73268683a8",
      padUrl:
        "ms-powerautomate:/console/flow/run?environmentid=f5eaa9d6-cb8e-e5b2-b60a-4aa38e133e46&workflowid=0fdc73b7-78b9-4b4e-887a-ca73268683a8&source=Other",
    });
  });
});
