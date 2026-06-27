import { describe, expect, it } from "vitest";
import { renderProcessPdfHtml } from "@/main/export/document-renderer";
import type { ProcessDetail } from "@/shared/domain";

const process: ProcessDetail = {
  id: 1,
  name: "Demo Prozess",
  descriptionShort: "Kurze Beschreibung",
  descriptionLong: "Lange Beschreibung",
  category: "SAP",
  frequency: "daily",
  status: "active",
  favorite: false,
  hasTutorial: false,
  lastRunAt: null,
  lastRunStatus: null,
  runCount: 0,
  systems: ["SAP"],
  tags: ["Doku"],
  businessOwner: "Business",
  technicalOwner: "Tech",
  updatedAt: "2026-06-27T00:00:00.000Z",
  createdAt: "2026-06-27T00:00:00.000Z",
  actionType: "pad",
  action: { type: "pad" },
  business: {
    istProcess: "Ist",
    sollProcess: "Soll",
    benefit: "Nutzen",
  },
  tech: {
    flows: [],
    files: [],
    systems: [],
  },
  runbook: {
    whenToUse: "Wenn gebraucht",
    prerequisites: ["Zugang"],
    steps: ["Starten"],
    expectedResults: ["Ergebnis"],
    errors: [],
  },
  diagram: { nodes: [], edges: [] },
};

describe("renderProcessPdfHtml", () => {
  it("renders the process documentation into printable html", () => {
    const html = renderProcessPdfHtml(process, [], null);

    expect(html).toContain("<!doctype html>");
    expect(html).toContain("Demo Prozess");
    expect(html).toContain("Kurze Beschreibung");
    expect(html).toContain("Runbook");
    expect(html).toContain("Zugang");
    expect(html).not.toContain("<script");
  });
});
