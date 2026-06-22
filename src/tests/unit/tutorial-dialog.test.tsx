import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TutorialDialog } from "@/features/tutorial/tutorial-wizard";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Tutorial } from "@/shared/domain";

vi.mock("@/features/tutorial/tutorial-hint-images", () => ({
  resolveTutorialHintImage: (imagePath: string) =>
    imagePath === "images/Servicegrad/NeuFlow.png"
      ? "/mock/NeuFlow.png"
      : null,
}));

const tutorial: Tutorial = {
  id: 1,
  processId: 1,
  title: "Servicegrad selbst nachbauen",
  description: "",
  steps: [
    {
      id: 1,
      tutorialId: 1,
      sortOrder: 1,
      group: "",
      title: "Erster Schritt",
      description:
        "Beschreibung\r\n\r\n```vba\r\nSub Beispiel()\r\nEnd Sub\r\n```",
      expectedResult: "",
      mediaUrl: null,
    },
  ],
};

describe("TutorialDialog", () => {
  it("renders and copies code blocks", async () => {
    const user = userEvent.setup();
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);

    render(
      <TooltipProvider>
        <TutorialDialog
          onClose={vi.fn()}
          processName="Servicegrad"
          tutorial={tutorial}
        />
      </TooltipProvider>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: tutorial.title })
    ).toBeInTheDocument();
    expect(document.querySelector("pre code")).toHaveTextContent(
      "Sub Beispiel()"
    );
    expect(
      screen.getByRole("button", { name: "Code kopieren" })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Code kopieren" }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("Sub Beispiel()\r\nEnd Sub\r\n");
    });
    expect(
      screen.getByRole("button", { name: "Code kopiert" })
    ).toBeInTheDocument();
  });

  it("renders image hint links in step descriptions", () => {
    const hintTutorial: Tutorial = {
      ...tutorial,
      steps: [
        {
          ...tutorial.steps[0],
          description:
            "Erstelle einen [[neuen Flow|images/Servicegrad/NeuFlow.png]] im PAD.",
        },
      ],
    };

    render(
      <TooltipProvider>
        <TutorialDialog
          onClose={vi.fn()}
          processName="Servicegrad"
          tutorial={hintTutorial}
        />
      </TooltipProvider>
    );

    expect(
      screen.getByText("neuen Flow", { selector: "span" })
    ).toHaveClass("underline");
  });

  it("renders markdown h2 headings without hash characters", () => {
    const headingTutorial: Tutorial = {
      ...tutorial,
      steps: [
        {
          ...tutorial.steps[0],
          description:
            "Baue den Flow nach.\n\n## SAP /LSGIT/VS_DLV_CHECK\n\n```\nCALL SAP_Process\n```",
        },
      ],
    };

    render(
      <TooltipProvider>
        <TutorialDialog
          onClose={vi.fn()}
          processName="Servicegrad"
          tutorial={headingTutorial}
        />
      </TooltipProvider>
    );

    expect(
      screen.getByRole("heading", { level: 3, name: "SAP /LSGIT/VS_DLV_CHECK" })
    ).toBeInTheDocument();
    expect(screen.queryByText("## SAP /LSGIT/VS_DLV_CHECK")).not.toBeInTheDocument();
  });

  it("renders bold and inline code in step descriptions", () => {
    const formattedTutorial: Tutorial = {
      ...tutorial,
      steps: [
        {
          ...tutorial.steps[0],
          description:
            "Richte **Main** ein und nutze `Excel.RunMacro` in **Get DateTime**.",
        },
      ],
    };

    render(
      <TooltipProvider>
        <TutorialDialog
          onClose={vi.fn()}
          processName="Servicegrad"
          tutorial={formattedTutorial}
        />
      </TooltipProvider>
    );

    expect(screen.getByText("Main", { selector: "strong" })).toBeInTheDocument();
    expect(
      screen.getByText("Get DateTime", { selector: "strong" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Excel.RunMacro", { selector: "code" })
    ).toBeInTheDocument();
    expect(screen.queryByText("**Main**")).not.toBeInTheDocument();
  });

  it("renders bullet lists in step descriptions", () => {
    const listTutorial: Tutorial = {
      ...tutorial,
      steps: [
        {
          ...tutorial.steps[0],
          description:
            "Lege die Subflows an:\n\n- **Main**: Steuert die Reihenfolge\n- **Get DateTime**: Liefert das Datum",
        },
      ],
    };

    render(
      <TooltipProvider>
        <TutorialDialog
          onClose={vi.fn()}
          processName="Servicegrad"
          tutorial={listTutorial}
        />
      </TooltipProvider>
    );

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(
      screen.getByText("Steuert die Reihenfolge", { exact: false })
    ).toBeInTheDocument();
  });
});
