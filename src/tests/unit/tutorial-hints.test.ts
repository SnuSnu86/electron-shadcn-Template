import { describe, expect, it } from "vitest";
import {
  parseTutorialInline,
  stripTutorialHints,
} from "@/features/tutorial/parse-tutorial-text";
import { resolveTutorialHintImage } from "@/features/tutorial/tutorial-hint-images";

describe("parseTutorialInline", () => {
  it("parses inline image hints", () => {
    expect(
      parseTutorialInline(
        "Erstelle einen [[neuen Flow|images/Servicegrad/NeuFlow.png]] und die [[Subflows|images/Servicegrad/NeuSubflow.png]]."
      )
    ).toEqual([
      { type: "text", value: "Erstelle einen " },
      {
        type: "hint",
        label: "neuen Flow",
        imagePath: "images/Servicegrad/NeuFlow.png",
      },
      { type: "text", value: " und die " },
      {
        type: "hint",
        label: "Subflows",
        imagePath: "images/Servicegrad/NeuSubflow.png",
      },
      { type: "text", value: "." },
    ]);
  });

  it("parses bold and inline code", () => {
    expect(
      parseTutorialInline(
        "Die **Main**-Aktion und `Excel.RunMacro` in **Get DateTime**."
      )
    ).toEqual([
      { type: "text", value: "Die " },
      { type: "bold", value: "Main" },
      { type: "text", value: "-Aktion und " },
      { type: "code", value: "Excel.RunMacro" },
      { type: "text", value: " in " },
      { type: "bold", value: "Get DateTime" },
      { type: "text", value: "." },
    ]);
  });

  it("returns plain text when no formatting is present", () => {
    expect(parseTutorialInline("Nur normaler Text.")).toEqual([
      { type: "text", value: "Nur normaler Text." },
    ]);
  });

  it("strips hint markup for exports", () => {
    expect(
      stripTutorialHints(
        "Erstelle einen [[neuen Flow|images/Servicegrad/NeuFlow.png]] und die [[Subflows|images/Servicegrad/NeuSubflow.png]]."
      )
    ).toBe("Erstelle einen neuen Flow und die Subflows.");
  });
});

describe("resolveTutorialHintImage", () => {
  it("resolves bundled tutorial hint images by process subfolder", () => {
    expect(resolveTutorialHintImage("images/Servicegrad/NeuFlow.png")).toMatch(
      /NeuFlow\.png/
    );
    expect(
      resolveTutorialHintImage("images/Servicegrad/NeuSubflow.png")
    ).toMatch(/NeuSubflow\.png/);
  });
});
