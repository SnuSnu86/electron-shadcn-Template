import { buildPadRunUrl } from "@/main/execution/pad-url";
import type { FlowDiagram, ProcessAction } from "@/shared/domain";
import macrosMarkdown from "../../../../docs/Servicegrad/Makros.md?raw";
import padMarkdown from "../../../../docs/Servicegrad/PAD.md?raw";
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

function markdownSection(markdown: string, heading: string): string {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const headingPattern = new RegExp(`^##\\s+${escapedHeading}\\s*$`, "m");
  const match = headingPattern.exec(markdown);

  if (!match || match.index === undefined) {
    throw new Error(`Servicegrad-Codeabschnitt nicht gefunden: ${heading}`);
  }

  const start = match.index;
  const nextHeading = /^##\s+/gm;
  nextHeading.lastIndex = start + match[0].length;
  const end = nextHeading.exec(markdown)?.index;
  return markdown.slice(start, end).trim();
}

function excelMacroStep(instruction: string, macroName: string): string {
  return `${instruction}

**So fügst du das Makro in Excel ein:** Öffne **Servicegradermittlung.xlsm**. Drücke **Alt + F11**, wähle im VBA-Editor **Einfügen > Modul**, füge den folgenden Code in das neue Standardmodul ein und speichere die Arbeitsmappe wieder als **Excel-Arbeitsmappe mit Makros (*.xlsm)**. Starte es zum Testen über **Alt + F8**.

${markdownSection(macrosMarkdown, macroName)}`;
}

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
    "Servicegrad-Ermittlungsprozesses: Power Automate Cloud Scheduler (Mo–Fr 01:00) startet einen Power-Automate-Desktop-Flow, der SAP-Daten per GUI Skripting exportiert, in Servicegradermittlung.xlsm berechnet, Kennzahlen in eine Reporting-Datei überträgt und das Ergebnis per Outlook an den Verteiler sendet. Standorte: WM Stuttgart LC1, WM Ludwigsburg LC6, WM Hannover LC3, WM Polen LC9, WM Illingen LC8. Vollständige technische Beschreibung: docs/Servicegrad/Servicegrad.md",
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
      "SAP GUI Skripting ist aktiviert",
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
        problem: "SAP-Export schlägt fehl (Skripting / Berechtigung)",
        solution:
          "SAP GUI Skripting in den Optionen aktivieren, Anmeldung PS4/Mandant 009 mit 5100LSS1 prüfen, Transaktion /LSGIT/VS_DLV_CHECK manuell testen.",
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
    "Lerne wie der Servicegrad Prozess funktioniert und baue deinen eigenen Servicegrad-Prozess auf deinem Rechner nach. Dieses Tutorial führt dich Schritt für Schritt durch den Prozess und erklärt, wie du die einzelnen Komponenten einrichtest.",
  steps: [
    {
      group: "Überblick",
      title: "Servicegrad-Ablauf verstehen",
      description:
        "Der feste Ablauf ist: Bestimmt das Auswertungsdatum, exportiert die SAP-Lieferdaten, berechnet den Servicegrad in Excel, schreibt die Kennzahlen in eine Datei und versendet das Ergebnis per E-Mail. Mit den folgenden Schritten richtest du deine eigene Servicegrad automatisierung ein.",
      expectedResult:
        "Du kennst Eingabe, Verarbeitung und Ergebnis des Servicegrad-Prozesses.",
    },
    {
      group: "Vorbereitung",
      title: "Systemzugänge und Berechtigungen prüfen",
      description:
        "Prüfe auf deinem Rechner SAP GUI mit Zugriff auf PS4/Mandant 009, aktivierbares SAP GUI Skripting, Excel mit Makro-Unterstützung, Power Automate Desktop, Power Automate Cloud und Outlook. Stelle außerdem sicher, dass du auf die benötigten SAP-Daten und Zielordner zugreifen kannst.",
      expectedResult:
        "Alle benötigten Programme, Zugänge und Konfigurationen stehen für den Nachbau bereit.",
    },
    {
      group: "Vorbereitung",
      title: "SAP-Vorbereitung für das GUI Skripting",
      description: `Prüfe zuerst die SAP GUI Skripting-Unterstützung und die Sicherheitskonfiguration in deinen SAP Einstellungen, damit die Skripte Barrierefrei ausführbar sind:

- [[Optionen|images/SAP/SAP-optionen.png]]: In deinem **SAP Logon 800** klicke auf das SAP Icon oben links und wähle **Optionen**.
- [[Skriptunterstützung|images/SAP/SAP-Scripting.png]]: Unter dem Reiter **Barrierefreiheit & Skripting** den Menüpunkt **Skriptunterstützung** aktivieren und in der Checkbox **Skriptunterstützung aktivieren**.
- [[Sicherheit|images/SAP/SAP-Sicherheit.png]]: Unter dem Reiter **Sicherheit** den Menüpunkt **Sicherheitskonfiguration** setze den **Status** auf **Deaktiviert**.`,
      expectedResult:
        "SAP GUI Skripting ist nutzbar, die Transaktion öffnet sich und der lokale Exportordner existiert.",
    },
    {
      group: "Vorbereitung",
      title: "SAP Berechtigung für Transaktion prüfen",
      description:
        "Öffne das PS4 -Production S/4 HANA Modul und prüfe die Berechtigung für die Transaktion `/n/LSGIT/VS_DLV_CHECK`, indem du oben links im [[Eingabefeld|images/SAP/SAP-Transaktion.png]] den Text `/n/LSGIT/VS_DLV_CHECK` eingibst und Enter drückst. Wenn die Transaktion sich öffnet hast du die Berechtigung.",
      expectedResult:
        "Die Transaktion öffnet sich ohne Fehlermeldung.",
    },
    {
      group: "Vorbereitung",
      title: "Arbeitsordner und Dateinamen anlegen",
      description:
        "Lege in deinem eigenen Arbeitsordner einen Exportordner an, zum Beispiel `C:\\Users\\<User>\\Documents\\SG\\`. Dieser definiert den lokalen Exportordner für die SAP-Exportdatei, den du später in deinem VBScript eintragen musst.",
      expectedResult: "Exportordner ist angelegt und erreichbar.",
    },
    {
      group: "Excel: Files & Codes",
      title: "Erstellung der Servicegradermittlung.xlsm Datei",
      description: `Erstelle die Excel-Datei **Servicegradermittlung.xlsm** und speichere sie als Excel-Arbeitsmappe mit Makros. 

Lege die im Code verwendeten Blätter \`Tabelle1\` und \`Tabelle2\` an; \`Tabelle1\` nimmt Rohdaten auf, \`Tabelle2\` enthält Berechnung und E-Mail-Bereiche. 

Merke dir den Pfad zu dieser Datei für den späteren Einsatz in der PAD-Aktion **Excel starten**.`,
      expectedResult:
        "Die Servicegradermittlung.xlsm Datei ist erstellt und erreichbar.",
    },
    {
      group: "Excel: Files & Codes",
      title: "Makro NeueBelegnummer fuer die PAD-Aktion einfügen",
      description: excelMacroStep(
        "Die erste `Excel.RunMacro`-Aktion ruft **NeueBelegnummer** auf. Füge deshalb jetzt dieses Bereinigungsmakro in die **Servicegradermittlung.xlsm** ein. Es normalisiert Belegnummern, Datumswerte und Uhrzeiten vor dem Import.",
        "NeueBelegnummer"
      ),
      expectedResult:
        "Die erste PAD-Makroaktion findet `NeueBelegnummer` und die Rohdatenformate sind vorbereitet.",
    },
    {
      group: "Excel: Files & Codes",
      title: "Makro DatenkopierenSAP fuer die PAD-Aktion einfügen",
      description: excelMacroStep(
        "Die zweite `Excel.RunMacro`-Aktion ruft **DatenkopierenSAP** auf. Das Makro erwartet die in **Schritt 14** erzeugte Datei `SG-<Datum>.xlsx`. Trage im Code denselben lokalen Exportordner aus **Schritt 05** und dasselbe Dateinamensformat ein.",
        "DatenkopierenSAP"
      ),
      expectedResult:
        "Die zweite PAD-Makroaktion kopiert die SAP-Exportdaten reproduzierbar in das Rohdatenblatt.",
    },
    {
      group: "Excel: Files & Codes",
      title: "Makro SGrechner fuer die PAD-Aktion einfügen",
      description: excelMacroStep(
        "Die dritte `Excel.RunMacro`-Aktion ruft **SGrechner** auf. Füge den Berechnungscode in die Hauptmappe ein und prüfe die Blattnamen, Bereiche sowie die fünf Standorte LC1, LC3, LC6, LC8 und LC9.",
        "SGrechner"
      ),
      expectedResult:
        "Die dritte PAD-Makroaktion erzeugt Servicegrad-Tabelle, Gesamtergebnis und Diagrammdaten.",
    },
    {
      group: "Excel: Files & Codes",
      title: "Makro DatenUebertragung fuer die PAD-Aktion einfügen",
      description: excelMacroStep(
        "Die vierte `Excel.RunMacro`-Aktion ruft **DatenUebertragung** auf. Lege vor dem Test die Kennzahlen-Datei an oder kopiere eine passende Vorlage in deinen Arbeitsordner. Sie benötigt ein Monatsblatt im Format `MMM JJ`, eine Datumsspalte B und das im Makro erwartete Diagramm. Ersetze den produktiven Netzwerkpfad im Makro durch den lokalen Pfad zu dieser Datei.",
        "DatenUebertragung"
      ),
      expectedResult:
        "Die vierte PAD-Makroaktion schreibt die berechneten Werte in die lokale Kennzahlen-Datei, ohne bestehende Historie zu überschreiben.",
    },
    {
      group: "Excel: Files & Codes",
      title: "Makro Email fuer die PAD-Aktion einfügen",
      description: excelMacroStep(
        "Die fünfte `Excel.RunMacro`-Aktion ruft **Email** auf. Füge das Makro ein und ersetze **To** und **CC** vor dem ersten Test ausschließlich durch deine eigene Testadresse. Prüfe außerdem, dass die Bereiche `Tabelle2!B12:Q19` und `Tabelle2!B22:Q45` in deiner Hauptmappe die gewünschten Ergebnisdaten und das Diagramm enthalten.",
        "EMail"
      ),
      expectedResult:
        "Die fünfte PAD-Makroaktion erstellt eine Testmail mit aktueller Tabelle, Diagramm und korrektem Betreff.",
    },
    {
      group: "Power Automate Desktop Flow",
      title: "PAD-Flow und Subflows anlegen",
      description: `Der PAD-Flow beschreibt den gesamten Prozessablauf. Erstelle zuerst einen [[neuen Flow|images/Servicegrad/NeuFlow.png]] (z.B. Servicegrad) und die [[Subflows|images/Servicegrad/NeuSubflow.png]]:

- **Main**: Bestimmt in welcher Reihenfolge die Subflows durchlaufen sollen
- **Get DateTime**: Definiert das benötigte Datum für die Servicegrad-Daten. Der technische Subflow heißt \`Get_DateTime_Variable\` und ruft **SAP_Process_BackToFriday** (wenn heute Montag ist) oder **SAP_Pocess_BackToYesterday** (wenn heute nicht Montag ist) auf.
- **SAP_Process_BackToFriday**: Startet den SAP-Prozess und exportiert die Servicegrad-Daten
- **SAP_Pocess_BackToYesterday**: Startet den SAP-Prozess und exportiert die Servicegrad-Daten
- **Data_Preperation**: Berechnet den Servicegrad und formatiert den Inhalt für den E-Mail-Versand

Richte [[Main|images/Servicegrad/SubflowStruktur.png]] so ein, dass er diese Subflows genau in dieser Reihenfolge aufruft. Baue ab jetzt jede weitere Tutorial-Aktion direkt in dem Subflow ein, in dem sie später läuft.`,
      expectedResult:
        "Eine Power Automate Desktop Flow mit den Subflows Main, Get DateTime, Get SAP Data und SG Math and Email send hat eine klare Struktur und bildet den gesamten Prozessablauf sichtbar ab.",
    },
    {
      group: "PAD-Flow: Get DateTime",
      title: "Datumsermittlung bauen",
      description: `Baue den untenstehenden Flow in den zuvor erstellten Subflow „Get_DateTime_Variable“ ein oder importiere ihn direkt aus dem RAW-Code in diesen Subflow.

Die enthaltene Logik ermittelt standardmäßig das Datum des Vortages. Fällt der aktuelle Tag auf einen Montag, wird stattdessen das Datum des vorherigen Freitags bestimmt.      

${markdownSection(padMarkdown, "Get_DateTime_Variable")}`,
      expectedResult:
        "Der Flow liefert für jeden Werktag das richtige Auswertungsdatum.",
    },
    {
      group: "PAD-Flow: Get SAP Data",
      title: "SAP-Prozess und Daten Export",
      description: `Baue den untenstehenden Flow in den zuvor erstellten Subflow **SAP_Process_BackToFriday** ein oder importiere ihn direkt aus dem RAW-Code in diesen Subflow.

Der Flow meldet sich im SAP-System an, startet den vorgesehenen SAP-Prozess und erzeugt die Exportdatei **SG-<Datum>.xlsx**.

Passe im VBSkript die folgende Zeile entsprechend an, indem du den Pfad durch den in Schritt 05 definierten Zielpfad ersetzt:
\`session.findById("wnd[1]/usr/ctxtDY_PATH").text = "C:\\Users\\5100LSS1\\Documents\\SG"\`

${markdownSection(padMarkdown, "SAP_Process_BackToFriday")}`,
      expectedResult:
        "Der Subflow erstellt die Exportdatei mit dem erwarteten Namen im definierten Exportordner.",
    },
    {
      group: "PAD-Flow: Berechnung und Email versand",
      title: "Servicegrad Berechnung und Email versand",
      description: `Baue den untenstehenden Flow in den zuvor erstellten Subflow **Data_Preperation** ein oder importiere ihn direkt aus dem RAW-Code in diesen Subflow.

Der Flow öffnet die Datei **Servicegradermittlung.xlsm**, führt die Berechnung des Servicegrads durch und bereitet die Ergebnisse für den E-Mail-Versand auf.

Stelle sicher, dass in der PAD-Aktion **Excel starten** der Dateipfad aus **Schritt 06** zur Datei **Servicegradermittlung.xlsm** hinterlegt ist.

${markdownSection(padMarkdown, "Data_Preperation")}`,
      expectedResult:
        "Der Prozess versendet erfolgreich den Servicegrad-Bericht per E-Mail.",
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
