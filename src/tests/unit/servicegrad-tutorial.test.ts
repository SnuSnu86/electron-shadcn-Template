import { describe, expect, it } from "vitest";
import { servicegradTutorial } from "@/main/db/processes/servicegrad";

describe("servicegradTutorial", () => {
  it("guides users through a local Servicegrad setup", () => {
    const text = [
      servicegradTutorial.title,
      servicegradTutorial.description,
      ...servicegradTutorial.steps.flatMap((step) => [
        step.group,
        step.title,
        step.description,
        step.expectedResult,
      ]),
    ].join("\n");

    expect(servicegradTutorial.title).toContain("Servicegrad");
    expect(servicegradTutorial.steps.length).toBeGreaterThanOrEqual(18);
    expect(text).toContain("Makro");
    expect(text).toContain("Power Automate");
    expect(text).toContain("SAP GUI Scripting");
    expect(text).toContain("VBScript");
    expect(text).toContain("eigenen Arbeitsordner");
    expect(text).toContain("PAD-Flow, VBScript und VBA-Makros");
    expect(text).not.toContain("Automatisierungsziel festlegen");
    expect(text).not.toContain("deinen eigenen Zielprozess");
    expect(text).not.toContain("Berechtigung am RPA-Rechner");
    expect(text).not.toContain("deine eigenen Zielbereiche");
  });
});
