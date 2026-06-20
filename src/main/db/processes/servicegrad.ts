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
  title: "Servicegrad-Prozess selbst nachbauen",
  description:
    "Geführter Aufbau des bestehenden Servicegrad-Prozesses auf einem eigenen Rechner: Dateien und Makros erstellen, SAP GUI Scripting aufnehmen, Power Automate Desktop und Cloud einrichten, testen und dokumentieren.",
  steps: [
    {
      group: "Überblick",
      title: "Servicegrad-Ablauf verstehen",
      description:
        "Der feste Ablauf ist: SAP-Lieferdaten exportieren, den Servicegrad in Excel berechnen, Kennzahlen fortschreiben und das Ergebnis per E-Mail versenden. Die folgenden Schritte richten genau diesen Ablauf auf deinem Rechner ein.",
      expectedResult:
        "Du kennst Eingabe, Verarbeitung und Ergebnis des Servicegrad-Prozesses.",
    },
    {
      group: "Vorbereitung",
      title: "Systemzugänge und Berechtigungen prüfen",
      description:
        "Prüfe auf deinem Rechner SAP GUI mit Zugriff auf PS4/Mandant 009, aktivierbares SAP GUI Scripting, Excel mit Makro-Unterstützung, Power Automate Desktop, Power Automate Cloud und Outlook. Stelle außerdem sicher, dass du auf die benötigten SAP-Daten und Zielordner zugreifen kannst.",
      expectedResult:
        "Alle benötigten Programme, Zugänge und Konfigurationen stehen für den Nachbau bereit.",
    },
    {
      group: "Vorbereitung",
      title: "Arbeitsordner und Dateinamen anlegen",
      description:
        "Lege auf deinem Rechner einen eigenen Arbeitsordner und einen Exportordner an. Definiere das Dateinamensschema SG-<Datum>.xlsx sowie die Speicherorte für Hauptmappe, Kennzahlen-Datei und VBScript. Du bestimmst diese Pfade selbst.",
      expectedResult:
        "Arbeitsordner, Exportordner, Hauptdatei, Kennzahlen-Datei, VBScript und Dateinamensschema sind festgelegt und erreichbar.",
    },
    {
      group: "Vorbereitung",
      title: "Pfade in allen Bestandteilen hinterlegen",
      description:
        "Übertrage die von dir gewählten Speicherorte einheitlich in den PAD-Flow, das VBScript und die VBA-Makros. Prüfe insbesondere Exportpfad, Dateiname, Hauptmappe und Kennzahlen-Datei.",
      expectedResult:
        "PAD-Flow, VBScript und VBA-Makros verwenden dieselben, auf deinem Rechner gültigen Pfade.",
    },
    {
      group: "Excel-Makros",
      title: "Hauptmappe als XLSM erstellen",
      description:
        "Erstelle die Excel-Hauptdatei Servicegradermittlung.xlsm. Lege die benoetigten Tabellenblaetter fuer SAP-Rohdaten, Berechnung, Ergebnis-Tabelle und Diagramm an. Speichere die Datei als makrofaehige Arbeitsmappe.",
      expectedResult:
        "Die XLSM-Datei existiert, enthaelt die benoetigten Blaetter und kann Makros ausfuehren.",
    },
    {
      group: "Excel-Makros",
      title: "Makro fuer SAP-Datenimport bauen",
      description:
        "Erstelle ein VBA-Makro nach dem Muster DatenkopierenSAP. Es sucht die exportierte SG-Datei fuer das Auswertungsdatum, oeffnet sie, kopiert die Rohdaten in die Hauptmappe und schliesst die Exportdatei wieder.",
      expectedResult:
        "Ein manueller Makrostart kopiert die SAP-Exportdaten reproduzierbar in das Rohdatenblatt.",
    },
    {
      group: "Excel-Makros",
      title: "Makro fuer Datenbereinigung erstellen",
      description:
        "Erstelle ein Bereinigungsmakro nach dem Muster NeueBelegnummer. Normalisiere Belegnummern, Datumswerte und Uhrzeiten so, dass deine Berechnung keine manuelle Nacharbeit braucht.",
      expectedResult:
        "Die importierten SAP-Daten haben stabile Spaltenformate und koennen direkt weiterverarbeitet werden.",
    },
    {
      group: "Excel-Makros",
      title: "Makro fuer Kennzahlenberechnung erstellen",
      description:
        "Erstelle das zentrale Berechnungsmakro nach dem Muster SGrechner. Zaehle Erreicht/Nicht Erreicht je Standort oder Kategorie, berechne die Quote und schreibe Tabelle sowie Diagrammdaten in das Ergebnisblatt.",
      expectedResult:
        "Die Servicegrad-Tabelle zeigt Werte für LC1, LC3, LC6, LC8, LC9 und ein Gesamtergebnis.",
    },
    {
      group: "Excel-Makros",
      title: "Makro fuer Kennzahlenuebertragung erstellen",
      description:
        "Erstelle ein Makro nach dem Muster DatenUebertragung. Es oeffnet die zentrale Kennzahlen-Datei, sucht die Position fuer das Auswertungsdatum und schreibt die berechneten Werte fort.",
      expectedResult:
        "Die Kennzahlen-Datei wird automatisch aktualisiert, ohne bestehende Historie zu ueberschreiben.",
    },
    {
      group: "Excel-Makros",
      title: "Makro fuer E-Mail-Versand erstellen",
      description:
        "Erstelle ein Outlook-Makro nach dem Muster Email. Fuege Tabelle und Diagramm aus Excel in eine HTML-Mail ein, setze Betreff und Verteiler und teste zuerst mit deiner eigenen Adresse.",
      expectedResult:
        "Eine Testmail enthaelt die aktuelle Ergebnis-Tabelle, das Diagramm und den korrekten Betreff.",
    },
    {
      group: "SAP VBScript",
      title: "SAP GUI Scripting aktivieren",
      description:
        "Aktiviere in SAP GUI die Scripting-Unterstuetzung und pruefe, ob der SAP-Server Scripting erlaubt. Starte SAP neu und teste die spaetere Transaktion manuell, z.B. /LSGIT/VS_DLV_CHECK.",
      expectedResult:
        "SAP GUI Scripting ist nutzbar und die Transaktion laesst sich mit dem Ausfuehrungskonto oeffnen.",
    },
    {
      group: "SAP VBScript",
      title: "SAP-Ablauf aufzeichnen",
      description:
        "Nutze den SAP Script Recorder. Zeichne exakt die Schritte auf: System oeffnen, Transaktion starten, Selektionsdatum setzen, optionale Belegnummernfilter setzen, Layout auswaehlen und Export als Excel ausloesen.",
      expectedResult:
        "Eine VBS-Datei enthaelt den aufgezeichneten SAP-Ablauf von der Transaktion bis zum Exportdialog.",
    },
    {
      group: "SAP VBScript",
      title: "VBScript parametrisieren und stabilisieren",
      description:
        "Ersetze feste Testwerte im VBScript durch Variablen fuer Datum, Exportpfad und Dateiname. Entferne unnoetige Recorder-Zeilen, pruefe Fenster-IDs und fuege einfache Warte- oder Existenzpruefungen fuer SAP-Dialoge ein.",
      expectedResult:
        "Das SAP VBScript laeuft mehrfach hintereinander und schreibt die Exportdatei in den definierten Ordner.",
    },
    {
      group: "Power Automate Desktop",
      title: "PAD-Flow und Subflows anlegen",
      description:
        "Erstelle einen neuen Power Automate Desktop Flow. Lege Subflows nach dem Servicegrad-Muster an: Main, Get DateTime, Get SAP Data und SG Math and Email send. Main ruft die Subflows in genau dieser Reihenfolge auf.",
      expectedResult:
        "Der PAD-Flow hat eine klare Struktur und bildet den gesamten Prozessablauf sichtbar ab.",
    },
    {
      group: "Power Automate Desktop",
      title: "Datumsermittlung bauen",
      description:
        "Baue im Subflow Get DateTime die Datumslogik. Standard ist Vortag; montags wird auf Freitag zurueckgerechnet. Speichere Anzeigeformat, SAP-Format und Dateinamensformat in Variablen.",
      expectedResult:
        "Der Flow liefert fuer jeden Werktag das richtige Auswertungsdatum und den passenden Exportdateinamen.",
    },
    {
      group: "Power Automate Desktop",
      title: "SAP VBScript aus PAD starten",
      description:
        "Baue den Subflow Get SAP Data. Starte SAP bzw. die VBS-Datei, uebergib Datum und Exportpfad, warte auf die Exportdatei und brich mit klarer Fehlermeldung ab, wenn die Datei nicht entsteht.",
      expectedResult:
        "PAD erzeugt den SAP-Export automatisch und erkennt fehlgeschlagene Exporte.",
    },
    {
      group: "Power Automate Desktop",
      title: "Excel-Makros aus PAD ausfuehren",
      description:
        "Baue den Subflow SG Math and Email send. Beende stoerende Excel-Instanzen, oeffne die XLSM-Datei, fuehre die Makros in Reihenfolge aus und schliesse Excel kontrolliert.",
      expectedResult:
        "Ein PAD-Testlauf fuehrt Import, Berechnung, Kennzahlenuebertragung und E-Mail-Versand ohne manuelle Klicks aus.",
    },
    {
      group: "Power Automate Cloud",
      title: "Cloud-Flow als Scheduler erstellen",
      description:
        "Erstelle in Power Automate Cloud einen geplanten Flow, z.B. Mo-Fr um 01:00 Uhr. Waehle die Aktion zum Starten des Desktop-Flows auf dem RPA-Rechner und verbinde sie mit dem PAD-Flow.",
      expectedResult:
        "Der Cloud-Flow kann den Desktop-Flow geplant oder testweise manuell starten.",
    },
    {
      group: "Power Automate Cloud",
      title: "Unattended-Ausfuehrung pruefen",
      description:
        "Teste den Cloud-Start mit gesperrtem oder unbeaufsichtigtem RPA-Rechner, je nach Umgebung. Pruefe Machine Group, Verbindung, Benutzerkonto und ob Excel, SAP und Outlook im unattended Kontext funktionieren.",
      expectedResult:
        "Der Prozess startet ohne interaktive Bedienung und nutzt das richtige Windows- und SAP-Konto.",
    },
    {
      group: "Testlauf",
      title: "End-to-End-Test mit Testverteiler ausfuehren",
      description:
        "Fuehre den kompletten Ablauf mit Testverteiler aus: Cloud oder PAD starten, SAP-Export pruefen, XLSM-Ergebnis pruefen, Kennzahlen-Datei kontrollieren und Mailinhalt validieren.",
      expectedResult:
        "Alle Artefakte entstehen: SAP-Exportdatei, berechnete Tabelle, aktualisierte Kennzahlen-Datei und E-Mail.",
    },
    {
      group: "Testlauf",
      title: "Fehlerfaelle bewusst testen",
      description:
        "Teste typische Stoerungen: fehlendes Netzlaufwerk, gesperrte Excel-Datei, falsches SAP-Datum, fehlende Exportdatei und Outlook-Probleme. Notiere je Fehler die Meldung und den Workaround.",
      expectedResult:
        "Der Servicegrad-Prozess hat nachvollziehbare Fehlermeldungen und bekannte Workarounds.",
    },
    {
      group: "Dokumentation",
      title: "Servicegrad-Prozess in JOZI dokumentieren",
      description:
        "Erfasse für den Servicegrad-Prozess Business-Zweck, Systeme, Dateien, PAD-Flow, Cloud-Scheduler, SAP VBScript, Makros, Parameter, Runbook und Fehlerbehandlung in JOZI.",
      expectedResult:
        "Der Servicegrad-Prozess ist in JOZI vollständig dokumentiert.",
    },
    {
      group: "Dokumentation",
      title: "Übergabe dokumentieren",
      description:
        "Ergänze lokale Besonderheiten wie deine gewählten Pfade, Zugänge und Ansprechpersonen. Führe eine zweite Person Schritt für Schritt durch den Servicegrad-Ablauf und passe unklare Stellen direkt an.",
      expectedResult:
        "Eine neue Person kann den Servicegrad-Prozess anhand der Dokumentation nachbauen und betreiben.",
    },
  ],
};
