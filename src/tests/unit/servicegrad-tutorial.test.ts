import { describe, expect, it } from "vitest";
import { servicegradTutorial } from "@/main/db/processes/servicegrad";

describe("servicegradTutorial", () => {
  it("guides users from setup to their own automated servicegrad process", () => {
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

    expect(servicegradTutorial.title).toContain("selbst nachbauen");
    expect(servicegradTutorial.steps.length).toBeGreaterThanOrEqual(18);
    expect(text).toContain("Makro");
    expect(text).toContain("Power Automate");
    expect(text).toContain("SAP GUI Scripting");
    expect(text).toContain("VBScript");
    expect(text).toContain("eigenen Prozess");
  });
});
