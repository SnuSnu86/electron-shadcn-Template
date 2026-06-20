// @vitest-environment node

import { createHash } from "node:crypto";
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

  test("refreshes an unchanged seeded Servicegrad tutorial", async () => {
    const { bootstrapRealProcesses } = await import(
      "@/main/db/seed-servicegrad"
    );
    const { getTutorialByProcess, setSetting, upsertStep } = await import(
      "@/main/db/repository"
    );
    const { getDb } = await import("@/main/db/database");
    const { SERVICEGRAD_PROCESS_NAME } = await import(
      "@/main/db/processes/servicegrad"
    );

    bootstrapRealProcesses();
    const process = getDb()
      .prepare("SELECT id FROM processes WHERE name = ?")
      .get(SERVICEGRAD_PROCESS_NAME) as { id: number };
    const tutorial = getTutorialByProcess(process.id);
    const firstStep = tutorial?.steps[0];

    expect(tutorial).not.toBeNull();
    expect(firstStep).toBeDefined();
    expect(
      getDb()
        .prepare("SELECT value FROM settings WHERE key = ?")
        .get("servicegrad.tutorial.seed-fingerprint")
    ).toBeDefined();
    if (!(tutorial && firstStep)) {
      throw new Error("Seeded Servicegrad tutorial is incomplete");
    }

    upsertStep(
      { ...firstStep, description: "Veralteter Standardtext" },
      firstStep.id
    );
    const staleFingerprint = createHash("sha256")
      .update(
        JSON.stringify({
          title: tutorial.title,
          description: tutorial.description,
          steps: tutorial.steps.map((step, index) => ({
            group: step.group,
            title: step.title,
            description:
              index === 0 ? "Veralteter Standardtext" : step.description,
            expectedResult: step.expectedResult,
          })),
        })
      )
      .digest("hex");
    setSetting("servicegrad.tutorial.seed-fingerprint", staleFingerprint);

    bootstrapRealProcesses();

    expect(getTutorialByProcess(process.id)?.steps[0]?.description).not.toBe(
      "Veralteter Standardtext"
    );
  });

  test("preserves a manually changed Servicegrad tutorial", async () => {
    const { bootstrapRealProcesses } = await import(
      "@/main/db/seed-servicegrad"
    );
    const { getTutorialByProcess, upsertStep } = await import(
      "@/main/db/repository"
    );
    const { getDb } = await import("@/main/db/database");
    const { SERVICEGRAD_PROCESS_NAME } = await import(
      "@/main/db/processes/servicegrad"
    );

    bootstrapRealProcesses();
    const process = getDb()
      .prepare("SELECT id FROM processes WHERE name = ?")
      .get(SERVICEGRAD_PROCESS_NAME) as { id: number };
    const tutorial = getTutorialByProcess(process.id);
    const firstStep = tutorial?.steps[0];
    if (!firstStep) {
      throw new Error("Seeded Servicegrad tutorial is incomplete");
    }

    upsertStep(
      { ...firstStep, description: "Eigene lokale Zusatzanweisung" },
      firstStep.id
    );

    bootstrapRealProcesses();

    expect(getTutorialByProcess(process.id)?.steps[0]?.description).toBe(
      "Eigene lokale Zusatzanweisung"
    );
  });
});
