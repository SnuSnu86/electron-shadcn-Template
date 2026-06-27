import { describe, expect, it } from "vitest";
import { rueckstandslisteTutorial } from "@/main/db/processes/rueckstandsliste";

describe("rueckstandslisteTutorial", () => {
  it("guides users through a local Rueckstandsliste setup", () => {
    const text = [
      rueckstandslisteTutorial.title,
      rueckstandslisteTutorial.description,
      ...rueckstandslisteTutorial.steps.flatMap((step) => [
        step.group,
        step.title,
        step.description,
        step.expectedResult,
      ]),
    ].join("\n");

    expect(rueckstandslisteTutorial.title).toContain("Rueckstandsliste");
    expect(rueckstandslisteTutorial.steps.length).toBeGreaterThanOrEqual(18);
    expect(text).toContain("Makro");
    expect(text).toContain("Power Automate");
    expect(text).toContain("SAP GUI Skripting");
    expect(text).toContain("VBScript");
    expect(text).toContain("Rückstandsliste Rechner.xlsm");
    expect(text).toContain("C:\\TEMP\\EXPORT.XLSX");
    expect(text).toContain("Sub DatenkopierenSAP()");
    expect(text).toContain("Sub RSl_create1_1_vom_Geschäft()");
    expect(text).toContain("Sub ÜbertrageKommentareAllInOne()");
    expect(text).toContain("Sub CreateEmailWithLinks()");
    expect(text).toContain("If Not IsObject(application) Then");
    expect(text).toContain("**SAP Login**");
    expect(text).toContain("**SAP Scripting**");
    expect(text).toContain("**Create RL**");
  });

  it("uses the PAD flow as the tutorial spine", () => {
    const titles = rueckstandslisteTutorial.steps.map((step) => step.title);
    const indexOf = (title: string) => titles.indexOf(title);

    expect(indexOf("Arbeitsordner und Dateinamen anlegen")).toBeLessThan(
      indexOf("Erstellung der Rückstandsliste Rechner.xlsm Datei")
    );
    expect(
      indexOf("Erstellung der Rückstandsliste Rechner.xlsm Datei")
    ).toBeLessThan(
      indexOf("Makro DatenkopierenSAP fuer die PAD-Aktion einfügen")
    );
    expect(
      indexOf("Makro DatenkopierenSAP fuer die PAD-Aktion einfügen")
    ).toBeLessThan(indexOf("Makro RSl_create1_1_vom_Geschäft einfügen"));
    expect(
      indexOf("Makro RSl_create1_1_vom_Geschäft einfügen")
    ).toBeLessThan(indexOf("Makros zur Kommentarübernahme einfügen"));
    expect(indexOf("Makros zur Kommentarübernahme einfügen")).toBeLessThan(
      indexOf("Makro CreateEmailWithLinks einfügen")
    );
    expect(indexOf("Makro CreateEmailWithLinks einfügen")).toBeLessThan(
      indexOf("PAD-Flow und Subflows anlegen")
    );
    expect(indexOf("PAD-Flow und Subflows anlegen")).toBeLessThan(
      indexOf("SAP Login bauen")
    );
    expect(indexOf("SAP Login bauen")).toBeLessThan(
      indexOf("SAP-Prozess und Daten Export")
    );
    expect(indexOf("SAP-Prozess und Daten Export")).toBeLessThan(
      indexOf("Rueckstandsliste erstellen und Email versenden")
    );
  });
});
