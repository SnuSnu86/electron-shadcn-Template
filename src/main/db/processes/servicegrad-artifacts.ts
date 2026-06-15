import macrosMarkdown from "../../../../docs/Servicegrad/Makros.md?raw";
import padMarkdown from "../../../../docs/Servicegrad/PAD.md?raw";
import sapVbScriptMarkdown from "../../../../docs/Servicegrad/SAP-VBScript.md?raw";
import type { TechnicalArtifactInput } from "../repository";

const SECTION_PATTERN = /^##\s+(.+?)\s*$([\s\S]*?)(?=^##\s+|(?![\s\S]))/gm;
const CODE_BLOCK_PATTERN = /```(\w+)?\s*\n([\s\S]*?)```/;

const ARTIFACT_DESCRIPTIONS: Record<string, string> = {
  Get_DateTime_Variable:
    "Ermittelt den relevanten Auswertungstag. Montags wird auf Freitag zurückgerechnet, an anderen Tagen auf den Vortag; die Werte werden für SAP-Export und Dateinamen bereitgestellt.",
  SAP_Process:
    "Startet SAP S/4 HANA PS4, ruft /LSGIT/VS_DLV_CHECK auf, setzt Selektionsdatum, Belegnummer und Layout und exportiert die Lieferdaten als Excel-Datei.",
  Data_Preperation:
    "Öffnet die Servicegradermittlung.xlsm und führt die VBA-Makros für Datenimport, Berechnung, Übertragung und E-Mail-Versand in fester Reihenfolge aus.",
  SGrechner:
    "Berechnet erreichte und nicht erreichte Lieferunterpositionen, bildet Servicegrad-KPIs je Standort und bereitet Tabelle sowie Diagrammbasis auf.",
  NeueBelegnummer:
    "Bereinigt und normalisiert die aus SAP gelieferten Beleg-, Datums- und Uhrzeitspalten, damit die nachgelagerten Auswertungen stabil arbeiten.",
  DatenkopierenSAP:
    "Sucht die exportierte SG-Datei des vorherigen Werktags lokal oder im Netzwerk und kopiert die SAP-Rohdaten in die Auswertungsmappe.",
  DatenUebertragung:
    "Überträgt die berechneten Standort-Kennzahlen in die zentrale Kennzahlen-Datei und kopiert das aktuelle Diagramm in die Servicegrad-Auswertung.",
  EMail:
    "Erstellt die Outlook-Nachricht an den definierten Verteiler, fügt Tabelle und Diagramm aus Excel ein und versendet den Servicegrad-Bericht.",
  "SAP /LSGIT/VS_DLV_CHECK":
    "SAP-GUI-Scripting für Transaktion /LSGIT/VS_DLV_CHECK: Selektion setzen, Layout UIL_SLM anwenden und XXL-Export in den lokalen SG-Ordner schreiben.",
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
          "Technischer Bestandteil des Servicegrad-Prozesses.",
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
  "docs/Servicegrad/PAD.md",
  "pad",
  0
);
const sapArtifacts = parseArtifacts(
  sapVbScriptMarkdown,
  "SAP VBScript",
  "docs/Servicegrad/SAP-VBScript.md",
  "vbs",
  padArtifacts.length
);
const macroArtifacts = parseArtifacts(
  macrosMarkdown,
  "Excel VBA",
  "docs/Servicegrad/Makros.md",
  "vba",
  padArtifacts.length + sapArtifacts.length
);

export const servicegradTechnicalArtifacts: TechnicalArtifactInput[] = [
  ...padArtifacts,
  ...sapArtifacts,
  ...macroArtifacts,
];
