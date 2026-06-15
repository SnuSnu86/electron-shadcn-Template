// @vitest-environment node

import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

let testUserData = "";

vi.mock("electron", () => ({
  app: {
    getPath: (name: string) => {
      if (name !== "userData") {
        throw new Error(`Unexpected app path: ${name}`);
      }
      return testUserData;
    },
  },
}));

describe("technical artifacts repository", () => {
  beforeEach(() => {
    testUserData = mkdtempSync(path.join(tmpdir(), "jozi-artifacts-"));
    vi.resetModules();
  });

  afterEach(async () => {
    const { closeDb } = await import("@/main/db/database");
    closeDb();
    rmSync(testUserData, { force: true, recursive: true });
  });

  test("stores and replaces technical artifacts for a process", async () => {
    const { createProcess, listTechnicalArtifacts, replaceTechnicalArtifacts } =
      await import("@/main/db/repository");
    const { servicegradInput } = await import(
      "@/main/db/processes/servicegrad"
    );

    const processId = createProcess(servicegradInput);

    replaceTechnicalArtifacts(processId, [
      {
        code: "Sub Email()\nEnd Sub",
        description: "Versendet den Servicegrad-Bericht.",
        kind: "Excel VBA",
        language: "vba",
        source: "seed",
        sortOrder: 1,
        title: "EMail",
      },
      {
        code: 'session.findById("wnd[0]").maximize',
        description: "Steuert SAP GUI.",
        kind: "SAP VBScript",
        language: "vbs",
        source: "seed",
        sortOrder: 0,
        title: "SAP /LSGIT/VS_DLV_CHECK",
      },
    ]);

    expect(listTechnicalArtifacts(processId)).toMatchObject([
      {
        title: "SAP /LSGIT/VS_DLV_CHECK",
        kind: "SAP VBScript",
        sortOrder: 0,
      },
      {
        title: "EMail",
        kind: "Excel VBA",
        sortOrder: 1,
      },
    ]);

    replaceTechnicalArtifacts(processId, [
      {
        code: "Text.ConvertDateTimeToText.FromDateTime",
        description: "Berechnet das Auswertungsdatum.",
        kind: "Power Automate Desktop",
        language: "pad",
        source: "seed",
        sortOrder: 0,
        title: "Get_DateTime_Variable",
      },
    ]);

    expect(listTechnicalArtifacts(processId)).toHaveLength(1);
    expect(listTechnicalArtifacts(processId)[0]).toMatchObject({
      title: "Get_DateTime_Variable",
      processId,
    });
  });
});
