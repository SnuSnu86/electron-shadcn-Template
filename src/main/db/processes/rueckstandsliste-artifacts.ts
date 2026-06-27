import macrosMarkdown from "../../../../docs/Rueckstandsliste/MakrosRSL.md?raw";
import padMarkdown from "../../../../docs/Rueckstandsliste/PAD-Rueckstandsliste.md?raw";
import type { TechnicalArtifactInput } from "../repository";

const SECTION_PATTERN = /^#{1,2}\s+(.+?)\s*$([\s\S]*?)(?=^#{1,2}\s+|(?![\s\S]))/gm;
const CODE_BLOCK_PATTERN = /```(\w+)?\s*\n([\s\S]*?)(?:```|$)/;

const ARTIFACT_DESCRIPTIONS: Record<string, string> = {
  Main: "Steuert den Rueckstandsliste-Desktop-Flow und ruft SAP Login, SAP Scripting und Create RL in fester Reihenfolge auf.",
  "SAP Login":
    "Oeffnet SAP S/4 HANA PS4 per SSO mit Mandant 009 und dem RPA-Benutzer 5100LSS1.",
  "SAP Scripting":
    "Fuehrt den SAP-Bericht per GUI-Scripting aus, setzt das Selektionsdatum, waehlt Layout und Export und schreibt die Rueckstandsdaten in den lokalen Exportordner.",
  "Create RL":
    "Oeffnet Rueckstandsliste Rechner.xlsm und fuehrt die Makros fuer Import, Bereichsdateien, Kommentaruebernahme und E-Mail-Versand aus.",
  DatenkopierenSAP:
    "Importiert die SAP-Exportdatei EXPORT.XLSX aus C:\\TEMP in Tabelle1 der Rueckstandsliste-Rechner-Arbeitsmappe.",
  Spaltenbreite_Anpassen:
    "Formatiert eine Rueckstandsliste, fuegt die Kommentarspalte ein und richtet Dropdown-Kommentarwerte ein.",
  "RSl_create1_1_vom_Geschäft":
    "Filtert SAP-Rohdaten nach LC1, LC3, LC6, SDCH, KIAA und LC9 und speichert die Bereichsdateien als Tageslisten.",
  ÜbertrageKommentareLC1:
    "Uebernimmt Kommentare aus der LC1-Vortagsdatei in die aktuelle LC1-Rueckstandsliste.",
  ÜbertrageKommentareLC3:
    "Uebernimmt Kommentare aus der LC3-Vortagsdatei in die aktuelle LC3-Rueckstandsliste.",
  ÜbertrageKommentareLC6:
    "Uebernimmt Kommentare aus der LC6-Vortagsdatei in die aktuelle LC6-Rueckstandsliste.",
  ÜbertrageKommentareLC9:
    "Uebernimmt Kommentare aus der LC9-Vortagsdatei in die aktuelle LC9-Rueckstandsliste.",
  ÜbertrageKommentareKIAA:
    "Uebernimmt Kommentare aus der KIAA-Vortagsdatei in die aktuelle KIAA-Rueckstandsliste.",
  ÜbertrageKommentareAllInOne:
    "Fuehrt die Kommentaruebernahme fuer LC1, LC3, LC6, LC9 und KIAA gesammelt aus.",
  CreateEmailWithLinks:
    "Erstellt und versendet eine Outlook-Mail mit Links zu den erzeugten Rueckstandslisten.",
};

function parseArtifacts(
  markdown: string,
  kind: TechnicalArtifactInput["kind"],
  source: string,
  fallbackLanguage: string,
  sortOffset: number
): TechnicalArtifactInput[] {
  const artifacts: TechnicalArtifactInput[] = [];
  const sectionPattern = new RegExp(SECTION_PATTERN);
  let sectionMatch = sectionPattern.exec(markdown);

  while (sectionMatch !== null) {
    const title = sectionMatch[1].trim();
    const codeMatch = CODE_BLOCK_PATTERN.exec(sectionMatch[2]);

    if (codeMatch) {
      artifacts.push({
        code: codeMatch[2].trim(),
        description:
          ARTIFACT_DESCRIPTIONS[title] ??
          "Technischer Bestandteil des Rueckstandsliste-Prozesses.",
        kind,
        language: codeMatch[1] || fallbackLanguage,
        source,
        sortOrder: sortOffset + artifacts.length,
        title,
      });
    }

    sectionMatch = sectionPattern.exec(markdown);
  }

  return artifacts;
}

const padArtifacts = parseArtifacts(
  padMarkdown,
  "Power Automate Desktop",
  "docs/Rueckstandsliste/PAD-Rueckstandsliste.md",
  "pad",
  0
);
const macroArtifacts = parseArtifacts(
  macrosMarkdown,
  "Excel VBA",
  "docs/Rueckstandsliste/MakrosRSL.md",
  "vba",
  padArtifacts.length
);

export const rueckstandslisteTechnicalArtifacts: TechnicalArtifactInput[] = [
  ...padArtifacts,
  ...macroArtifacts,
];
