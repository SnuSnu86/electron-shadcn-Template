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
    expect(text).toContain("SAP GUI Skripting");
    expect(text).toContain("VBScript");
    expect(text).toContain("eigenen Arbeitsordner");
    expect(text).toContain("Der PAD-Flow beschreibt den gesamten Prozessablauf");
    expect(text).toContain("Alt + F11");
    expect(text).toContain("Sub DatenkopierenSAP()");
    expect(text).toContain("Sub SGrechner()");
    expect(text).toContain("If Not IsObject(application) Then");
    expect(text).toContain("**Main**: Bestimmt in welcher Reihenfolge");
    expect(text).toContain("**Get DateTime**: Definiert das benötigte Datum");
    expect(text).not.toContain("Automatisierungsziel festlegen");
    expect(text).not.toContain("deinen eigenen Zielprozess");
    expect(text).not.toContain("Berechtigung am RPA-Rechner");
    expect(text).not.toContain("deine eigenen Zielbereiche");
  });

  it("uses the PAD flow as the tutorial spine", () => {
    const titles = servicegradTutorial.steps.map((step) => step.title);
    const indexOf = (title: string) => titles.indexOf(title);

    expect(indexOf("Arbeitsordner und Dateinamen anlegen")).toBeLessThan(
      indexOf("Erstellung der Servicegradermittlung.xlsm Datei")
    );
    expect(
      indexOf("Erstellung der Servicegradermittlung.xlsm Datei")
    ).toBeLessThan(
      indexOf("Makro NeueBelegnummer fuer die PAD-Aktion einfügen")
    );
    expect(
      indexOf("Makro NeueBelegnummer fuer die PAD-Aktion einfügen")
    ).toBeLessThan(
      indexOf("Makro DatenkopierenSAP fuer die PAD-Aktion einfügen")
    );
    expect(
      indexOf("Makro DatenkopierenSAP fuer die PAD-Aktion einfügen")
    ).toBeLessThan(indexOf("Makro SGrechner fuer die PAD-Aktion einfügen"));
    expect(
      indexOf("Makro SGrechner fuer die PAD-Aktion einfügen")
    ).toBeLessThan(
      indexOf("Makro DatenUebertragung fuer die PAD-Aktion einfügen")
    );
    expect(
      indexOf("Makro DatenUebertragung fuer die PAD-Aktion einfügen")
    ).toBeLessThan(indexOf("Makro Email fuer die PAD-Aktion einfügen"));
    expect(indexOf("Makro Email fuer die PAD-Aktion einfügen")).toBeLessThan(
      indexOf("PAD-Flow und Subflows anlegen")
    );
    expect(indexOf("PAD-Flow und Subflows anlegen")).toBeGreaterThanOrEqual(0);
    expect(indexOf("PAD-Flow und Subflows anlegen")).toBeLessThan(
      indexOf("Datumsermittlung bauen")
    );
    expect(indexOf("Datumsermittlung bauen")).toBeLessThan(
      indexOf("SAP-Prozess und Daten Export")
    );
    expect(indexOf("SAP-Prozess und Daten Export")).toBeLessThan(
      indexOf("Servicegrad Berechnung und Email versand")
    );
  });
});
