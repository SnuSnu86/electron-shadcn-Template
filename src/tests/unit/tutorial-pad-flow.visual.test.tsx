import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TutorialPadFlow } from "@/features/tutorial/tutorial-pad-flow";

const SAMPLE_PAD_CODE = `Text.ConvertDateTimeToText.FromDateTime DateTime: CurrentDateTime StandardFormat: Text.WellKnownDateTimeFormat.ShortDate Result=> Today
SET Wochentag TO CurrentDateTime.DayOfWeek
SET Montag TO $'''Monday'''
IF Wochentag = Montag THEN
    DateTime.Add DateTime: CurrentDateTime TimeToAdd: -3 TimeUnit: DateTime.TimeUnit.Days ResultedDate=> GoToFriday
    CALL SAP_Process_BackToFriday
ELSE IF Wochentag <> Montag THEN
    DateTime.Add DateTime: CurrentDateTime TimeToAdd: -1 TimeUnit: DateTime.TimeUnit.Days ResultedDate=> GoToYesterday
END
CALL SAP_Pocess_BackToYesterday`;

describe("TutorialPadFlow", () => {
  it("should render flow view by default", () => {
    render(<TutorialPadFlow code={SAMPLE_PAD_CODE} />);

    // Flow-Tab sollte aktiv sein
    expect(screen.getByRole("tab", { name: /flow/i })).toHaveAttribute(
      "data-state",
      "active"
    );

    // Flow-Aktionen sollten sichtbar sein
    expect(screen.getByText("Datum zu Text konvertieren")).toBeInTheDocument();
    expect(screen.getAllByText("Variable setzen").length).toBeGreaterThan(0);
    expect(screen.getByText("Bedingung prüfen")).toBeInTheDocument();
  });

  it("should switch to raw view when RAW tab is clicked", async () => {
    const user = userEvent.setup();
    render(<TutorialPadFlow code={SAMPLE_PAD_CODE} />);

    // Klick auf RAW-Tab
    const rawTab = screen.getByRole("tab", { name: /raw/i });
    await user.click(rawTab);

    // RAW-Tab sollte aktiv sein
    expect(rawTab).toHaveAttribute("data-state", "active");

    // Raw-Code sollte sichtbar sein
    expect(
      screen.getByText(/SET Wochentag TO CurrentDateTime/)
    ).toBeInTheDocument();
  });

  it("should display correct indentation for nested actions", () => {
    render(<TutorialPadFlow code={SAMPLE_PAD_CODE} />);

    // Hauptebene-Aktionen
    const mainActions = screen.getAllByText("Variable setzen");
    expect(mainActions.length).toBeGreaterThan(0);

    // Verschachtelte Aktionen (innerhalb IF)
    expect(screen.getAllByText("Datum berechnen").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Subflow aufrufen").length).toBeGreaterThan(0);
  });

  it("should show copy button in raw view", async () => {
    const user = userEvent.setup();
    render(<TutorialPadFlow code={SAMPLE_PAD_CODE} />);

    // Wechsel zu RAW-Ansicht
    await user.click(screen.getByRole("tab", { name: /raw/i }));

    // Copy-Button sollte vorhanden sein
    const copyButton = screen.getByRole("button", { name: /code kopieren/i });
    expect(copyButton).toBeInTheDocument();
  });

  it("should display action details", () => {
    render(<TutorialPadFlow code={SAMPLE_PAD_CODE} />);

    // Details für spezifische Aktionen prüfen
    expect(
      screen.getByText(/Wochentag = CurrentDateTime.DayOfWeek/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Montag = 'Monday'/)).toBeInTheDocument();
    expect(screen.getByText(/-3 Days → GoToFriday/)).toBeInTheDocument();
  });

  it("should mark conditional blocks with badges", () => {
    render(<TutorialPadFlow code={SAMPLE_PAD_CODE} />);

    // "Verzweigung" Badges für IF/ELSE IF
    const verzweigungBadges = screen.getAllByText("Verzweigung");
    expect(verzweigungBadges.length).toBeGreaterThan(0);

    // "Ende" Badge für END
    expect(screen.getByText("Ende")).toBeInTheDocument();
  });

  it("should color the end condition like other conditional actions", () => {
    render(<TutorialPadFlow code={SAMPLE_PAD_CODE} />);

    expect(screen.getByText("Ende").closest("div.rounded-lg")).toHaveClass(
      "bg-amber-500/10"
    );
  });
});
