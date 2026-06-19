import { buildPadRunUrl } from "@/main/execution/pad-url";
import type { FlowDiagram, ProcessAction } from "@/shared/domain";
import type { ProcessInput } from "../repository";

/** Eindeutiger Prozessname in der App-Datenbank. */
export const SERVICEGRAD_PROCESS_NAME = "Servicegrad-Ermittlung";

const SAP_EXPORT_DIR = "C:\\Users\\5100LSS1\\Documents\\SG";
const EXCEL_MAIN =
  "G:\\UIL-CL-Zentral\\04 Statistiken & Auswertungen\\01 Statistiken\\Servicegrad LO\\Geschaeftsjahr 2526\\Servicegrad LSS Bot\\Servicegradermittlung.xlsm";
const KENNZAHLEN_FILE =
  "\\\\adsgroup\\Group\\UIL-CL-Zentral\\04 Statistiken & Auswertungen\\01 Statistiken\\Servicegrad LO\\Geschaeftsjahr 2526\\Servicegrad LSS Bot\\Servicegrad Kennzahlen.xlsx";
const SERVICEGRAD_PAD_ENVIRONMENT_ID = "f5eaa9d6-cb8e-e5b2-b60a-4aa38e133e46";
const SERVICEGRAD_PAD_WORKFLOW_ID = "0fdc73b7-78b9-4b4e-887a-ca73268683a8";

function linearDiagram(
  items: {
    kind: FlowDiagram["nodes"][number]["kind"];
    label: string;
    sublabel?: string;
  }[]
): FlowDiagram {
  const nodes = items.map((item, i) => ({ id: `n${i}`, ...item }));
  const edges = nodes
    .slice(0, -1)
    .map((n, i) => ({ from: n.id, to: `n${i + 1}` }));
  return { nodes, edges };
}

export const servicegradAction = {
  type: "pad",
  padFlowName: "Servicegrad",
  padEnvironmentId: SERVICEGRAD_PAD_ENVIRONMENT_ID,
  padWorkflowId: SERVICEGRAD_PAD_WORKFLOW_ID,
  padUrl:
    buildPadRunUrl({
      padEnvironmentId: SERVICEGRAD_PAD_ENVIRONMENT_ID,
      padWorkflowId: SERVICEGRAD_PAD_WORKFLOW_ID,
    }) ?? "ms-powerautomate:",
} satisfies ProcessAction;

export const servicegradInput: ProcessInput = {
  name: SERVICEGRAD_PROCESS_NAME,
  descriptionShort:
    "Tägliche Servicegrad-Ermittlung für LC1, LC3, LC6, LC8 und LC9 aus SAP-Lieferdaten mit Excel-Auswertung und E-Mail-Versand.",
  descriptionLong:
    "Servicegrad-Ermittlungsprozesses: Power Automate Cloud Scheduler (Mo–Fr 01:00) startet einen Power-Automate-Desktop-Flow, der SAP-Daten per GUI Scripting exportiert, in Servicegradermittlung.xlsm berechnet, Kennzahlen in eine Reporting-Datei überträgt und das Ergebnis per Outlook an den Verteiler sendet. Standorte: WM Stuttgart LC1, WM Ludwigsburg LC6, WM Hannover LC3, WM Polen LC9, WM Illingen LC8. Vollständige technische Beschreibung: docs/Servicegrad/Servicegrad.md",
  businessOwner: "LSS / Servicegrad LO",
  technicalOwner: "RPA-Team",
  category: "SAP",
  criticality: "high",
  frequency: "daily",
  status: "active",
  systems: [
    "SAP S/4 HANA (PS4)",
    "Power Automate Desktop",
    "Power Automate Cloud",
    "Microsoft Excel",
    "Microsoft Outlook",
  ],
  tags: ["Servicegrad", "SAP", "Excel", "PAD", "Reporting"],
  business: {
    istProcess:
      "Servicegrad-Kennzahlen wurden manuell aus SAP exportiert, in Excel aufbereitet und per E-Mail verteilt — zeitaufwändig und fehleranfällig.",
    sollProcess:
      "Vollautomatischer Nachtlauf: SAP-Export, VBA-Berechnung für fünf Lagerstandorte, Übertragung in die Kennzahlen-Datei und Versand der Servicegrad-Tabelle inkl. Diagramm an den Verteiler.",
    benefit:
      "Täglich aktuelle Servicegrad-KPIs für alle Standorte ohne manuellen Aufwand; einheitliche Datenbasis für Reporting und Frühwarnung.",
  },
  tech: {
    flows: [
      {
        name: "Main",
        kind: "Power Automate Desktop",
        link: "docs/Servicegrad/Servicegrad.md#31-subflow-main",
      },
      {
        name: "Get DateTime",
        kind: "Power Automate Desktop (Subflow)",
      },
      {
        name: "Get SAP Data",
        kind: "Power Automate Desktop + VBScript",
      },
      {
        name: "SG Math and Email send",
        kind: "Power Automate Desktop + VBA",
      },
      {
        name: "Cloud Scheduler",
        kind: "Power Automate Cloud",
        link: "Mo–Fr 01:00 Uhr",
      },
    ],
    files: [
      {
        path: `${SAP_EXPORT_DIR}\\SG-<Datum>.xlsx`,
        purpose: "SAP-Exportdatei (lokal, Benutzer 5100LSS1)",
      },
      {
        path: EXCEL_MAIN,
        purpose:
          "Haupt-Auswertungsdatei mit Makros DatenkopierenSAP, SGrechner, DatenUebertragung, Email",
      },
      {
        path: KENNZAHLEN_FILE,
        purpose:
          "Historische Kennzahlendatei für abteilungsübergreifendes Reporting",
      },
    ],
    systems: [
      {
        name: "SAP S/4 HANA PS4",
        detail:
          "Mandant 009, Benutzer 5100LSS1 (SSO), Transaktion /LSGIT/VS_DLV_CHECK, Layout „Servicegrad Manuell“",
      },
      {
        name: "Microsoft Excel",
        detail: "VBA-Makros; Modul mdDatenUebertragungLogging erforderlich",
      },
      {
        name: "Microsoft Outlook",
        detail:
          "HTML-Mail, Betreff „Servicegrad“, Verteiler im Email-Makro der xlsm",
      },
    ],
    notes:
      "Version ohne Feiertagslogik. Pfad C:\\Users\\5100LSS1\\Documents\\SG\\ ist an den SAP-User gebunden. Manueller Start in JOZI ruft den konkreten PAD-Flow per Environment-ID und Workflow-ID auf.",
  },
  runbook: {
    whenToUse:
      "Automatisch Mo–Fr um 01:00 Uhr (Cloud Scheduler). Manueller Nachlauf nur bei ausgebliebenem Nachtlauf, Korrekturläufen oder Tests — nicht parallel zum Scheduler.",
    prerequisites: [
      "SAP GUI Scripting ist aktiviert",
      "SAP-Benutzer 5100LSS1 mit Berechtigung für /LSGIT/VS_DLV_CHECK",
      `Lokaler Ordner vorhanden: ${SAP_EXPORT_DIR}`,
      `Netzwerkpfade erreichbar: G:\\UIL-CL-Zentral\\... und ${KENNZAHLEN_FILE}`,
      "Outlook-Profil auf dem RPA-Rechner aktiv",
      "Keine blockierenden Excel-Instanzen (werden vom Flow per Stop-Process beendet)",
    ],
    steps: [
      "Prüfen, ob der Cloud-Lauf um 01:00 bereits erfolgreich war (E-Mail „Servicegrad“ im Posteingang)",
      "Bei manuellem Start: In JOZI „Prozess starten“ wählen; Power Automate wird mit dem Flow „Servicegrad“ aufgerufen",
      "Flow läuft durch: Get DateTime → SAP-Export → Excel-Makros → E-Mail",
      "E-Mail prüfen: Tabelle (Tabelle2 B12:Q19) und Diagramm (B22:Q45), Betreff „Servicegrad“",
      "Optional: Kennzahlen-Datei auf dem Netzlaufwerk auf aktuelle Werte prüfen",
      "Bei Montagsläufen: Auswertungsdatum ist automatisch der vorangegangene Freitag (nicht Sonntag)",
    ],
    expectedResults: [
      "SAP-Export SG-<Datum>.xlsx im lokalen SG-Ordner",
      "Servicegrad-Tabelle in Tabelle2 mit Werten für LC1, LC3, LC6, LC8, LC9 und Gesamtergebnis",
      "Aktualisierte Einträge in Servicegrad Kennzahlen.xlsx",
      "Versendete E-Mail an den internen Verteiler",
    ],
    errors: [
      {
        problem:
          "Keine E-Mail / leerer Report am Feiertag nach langem Wochenende",
        solution:
          "Keine Feiertagslogik im Flow — am Dienstag nach Feiertag wird der Feiertag als Vortag verwendet, für den keine SAP-Daten existieren. Manuell mit korrektem Datum nachfahren oder warten bis nächster Werktag.",
      },
      {
        problem: "SAP-Export schlägt fehl (Scripting / Berechtigung)",
        solution:
          "SAP GUI Scripting in den Optionen aktivieren, Anmeldung PS4/Mandant 009 mit 5100LSS1 prüfen, Transaktion /LSGIT/VS_DLV_CHECK manuell testen.",
        escalation: "SAP-Basis / RPA-Team",
      },
      {
        problem: "Excel-Makro bricht ab (Datei nicht gefunden)",
        solution:
          "Prüfen ob G:-Laufwerk und adsgroup-Pfade vom RPA-Rechner erreichbar sind und Servicegradermittlung.xlsm nicht von einem User geöffnet ist.",
        escalation: "RPA-Team",
      },
      {
        problem: "E-Mail wird nicht versendet (Outlook)",
        solution:
          "Outlook-Profil und Verteiler im Email-Makro prüfen. Hinweis: Im Makro ist On Error Resume Next aktiv — Fehler werden nicht angezeigt.",
        escalation: "RPA-Team / IT Workplace",
      },
      {
        problem: "Flow läuft auf falschem Windows-User / Pfad",
        solution:
          "Exportpfad C:\\Users\\5100LSS1\\Documents\\SG\\ gilt nur für den SAP-Service-User. Auf anderen Konten PAD-Flow und Pfade anpassen.",
        escalation: "RPA-Team",
      },
    ],
  },
  diagram: linearDiagram([
    { kind: "start", label: "Start", sublabel: "Scheduler Mo–Fr 01:00" },
    { kind: "system", label: "Get DateTime", sublabel: "Vortag / Freitag" },
    {
      kind: "system",
      label: "SAP-Export",
      sublabel: "/LSGIT/VS_DLV_CHECK",
    },
    {
      kind: "system",
      label: "Excel-Makros",
      sublabel: "Servicegradermittlung.xlsm",
    },
    { kind: "output", label: "E-Mail", sublabel: "Betreff Servicegrad" },
    { kind: "end", label: "Ende" },
  ]),
  action: servicegradAction,
};

export const servicegradParameters = [
  {
    name: "SAP-System",
    key: "sap_system",
    type: "enum" as const,
    defaultValue: "PS4",
    required: true,
    group: "SAP",
    description: "SAP-Logon-Ziel (Production S/4 HANA).",
    options: ["PS4"],
    sortOrder: 0,
  },
  {
    name: "Mandant",
    key: "sap_mandant",
    type: "string" as const,
    defaultValue: "009",
    required: true,
    group: "SAP",
    description: "SAP-Mandant für die Anmeldung.",
    options: [] as string[],
    sortOrder: 1,
  },
  {
    name: "SAP-Benutzer",
    key: "sap_user",
    type: "string" as const,
    defaultValue: "5100LSS1",
    required: true,
    group: "SAP",
    description: "Service-Account für SSO-Anmeldung und Exportpfad.",
    options: [] as string[],
    sortOrder: 2,
  },
  {
    name: "Auswertungsdatum",
    key: "auswertungsdatum",
    type: "date" as const,
    defaultValue: "",
    required: false,
    group: "Auswertung",
    description:
      "Optional. Leer = PAD berechnet automatisch (Vortag, montags Freitag). Nur für manuelle Nachläufe relevant, wenn der Flow entsprechend erweitert wurde.",
    options: [] as string[],
    sortOrder: 3,
  },
  {
    name: "SAP-Exportordner",
    key: "sap_export_pfad",
    type: "string" as const,
    defaultValue: SAP_EXPORT_DIR,
    required: true,
    group: "Dateien",
    description: "Lokaler Zielordner für den SAP-Excel-Export.",
    options: [] as string[],
    sortOrder: 4,
  },
];

export const servicegradTutorial = {
  title: "Servicegrad-Lauf verstehen und prüfen",
  description:
    "Kurzanleitung für den täglichen Servicegrad-Prozess: automatischer Scheduler, manueller Nachlauf und Ergebniskontrolle.",
  steps: [
    {
      group: "Hintergrund",
      title: "Was macht dieser Prozess?",
      description:
        "Der Bot ermittelt den Servicegrad (Erreicht vs. Nicht Erreicht) für die Lager LC1, LC3, LC6, LC8 und LC9 aus SAP-Lieferdaten, berechnet die Kennzahlen in Excel und versendet eine E-Mail mit Tabelle und Diagramm.",
      expectedResult:
        "Du kennst den Zweck und weißt, dass der Produktivlauf Mo–Fr um 01:00 automatisch startet.",
    },
    {
      group: "Vorbereitung",
      title: "Voraussetzungen prüfen",
      description:
        "Stelle sicher, dass der RPA-Rechner SAP PS4, die Netzlaufwerke G: und adsgroup sowie Outlook erreichen kann. Der Ordner C:\\Users\\5100LSS1\\Documents\\SG\\ muss existieren.",
      expectedResult:
        "Alle Pfade aus dem Runbook sind vom RPA-Rechner aus erreichbar.",
    },
    {
      group: "Automatik",
      title: "Nachtlauf kontrollieren",
      description:
        "Nach 01:00 Uhr (werktags): Prüfe ob die E-Mail mit Betreff „Servicegrad“ im Verteiler eingegangen ist. Enthält Servicegrad-Tabelle und Diagramm.",
      expectedResult:
        "E-Mail ist da, Werte für alle fünf Standorte plus Gesamtergebnis sind plausibel.",
    },
    {
      group: "Manuell",
      title: "Manuellen Lauf starten",
      description:
        "In JOZI „Prozess starten“ wählen — Power Automate wird mit dem Flow „Servicegrad“ aufgerufen. Parameter nur dokumentieren; Datumslogik liegt im Subflow Get DateTime.",
      expectedResult:
        "PAD-Flow läuft durch alle Subflows (siehe Live-Log in PAD, nicht in JOZI).",
    },
    {
      group: "Nachbereitung",
      title: "Kennzahlen-Datei prüfen",
      description:
        "Öffne Servicegrad Kennzahlen.xlsx auf dem Netzlaufwerk und prüfe, ob die aktuellen Werte für das Auswertungsdatum eingetragen wurden.",
      expectedResult:
        "Neue Spalte/Zeile für das Auswertungsdatum ist vorhanden.",
    },
    {
      group: "Fehler",
      title: "Typische Stolpersteine",
      description:
        "Montag = Auswertung für Freitag. Feiertage werden nicht erkannt. Outlook-Fehler werden im Makro still ignoriert — bei fehlender Mail zuerst PAD- und Excel-Log prüfen.",
      expectedResult:
        "Du weißt, wann ein manueller Eingriff nötig ist und wo die Detail-Doku liegt (docs/Servicegrad/Servicegrad.md).",
    },
  ],
};
