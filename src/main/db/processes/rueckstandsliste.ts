import type { FlowDiagram, ProcessAction } from "@/shared/domain";
import macrosMarkdown from "../../../../docs/Rueckstandsliste/MakrosRSL.md?raw";
import padMarkdown from "../../../../docs/Rueckstandsliste/PAD-Rueckstandsliste.md?raw";
import type { ProcessInput } from "../repository";

export const RUECKSTANDSLISTE_PROCESS_NAME = "Rueckstandsliste";

const SAP_EXPORT_DIR = "C:\\Users\\5100LSS1\\Documents\\Rueckstandsliste";
const SAP_IMPORT_FILE = "C:\\TEMP\\EXPORT.XLSX";
const EXCEL_MAIN =
  "C:\\Users\\5100LSS1\\OneDrive - Lapp\\Desktop\\RPA\\Rückstandsliste\\Rückstandsliste Rechner.xlsm";
const OUTPUT_BASE =
  "C:\\Users\\jozi1\\OneDrive - Lapp\\Desktop\\Projekte\\RPA\\Rückstandsliste\\GJ 2324";

function markdownSection(markdown: string, heading: string): string {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const headingPattern = new RegExp(`^#{1,2}\\s+${escapedHeading}\\s*$`, "m");
  const match = headingPattern.exec(markdown);

  if (!match || match.index === undefined) {
    throw new Error(`Rueckstandsliste-Codeabschnitt nicht gefunden: ${heading}`);
  }

  const start = match.index;
  const nextHeading = /^#{1,2}\s+/gm;
  nextHeading.lastIndex = start + match[0].length;
  const end = nextHeading.exec(markdown)?.index;
  return markdown.slice(start, end).trim();
}

function excelMacroStep(instruction: string, macroName: string): string {
  return `${instruction}

**So fügst du das Makro in Excel ein:** Öffne **Rückstandsliste Rechner.xlsm**. Drücke **Alt + F11**, wähle im VBA-Editor **Einfügen > Modul**, füge den folgenden Code in das neue Standardmodul ein und speichere die Arbeitsmappe wieder als **Excel-Arbeitsmappe mit Makros (*.xlsm)**. Starte es zum Testen über **Alt + F8**.

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

export const rueckstandslisteAction = {
  type: "pad",
  padFlowName: "Rueckstandsliste",
  padUrl: "ms-powerautomate:",
} satisfies ProcessAction;

export const rueckstandslisteInput: ProcessInput = {
  name: RUECKSTANDSLISTE_PROCESS_NAME,
  descriptionShort:
    "Tägliche Erstellung von Rückstandslisten für LC1, LC3, LC6, LC9 und KIAA aus SAP-Daten mit Kommentarübernahme und E-Mail-Linkversand.",
  descriptionLong:
    "Rueckstandsliste-Prozess: Power Automate Desktop startet SAP PS4 per SSO, exportiert die aktuellen Rückstandsdaten per GUI-Scripting, öffnet Rückstandsliste Rechner.xlsm, erzeugt Bereichsdateien je Logistikbereich, übernimmt Kommentare aus den Vortagsdateien und versendet eine Outlook-Mail mit Links zu den erzeugten Listen. Vollständige technische Beschreibung: docs/Rueckstandsliste/Rueckstandsliste.md",
  businessOwner: "LSS / Rueckstandsliste",
  technicalOwner: "RPA-Team",
  category: "SAP",
  frequency: "daily",
  status: "active",
  systems: [
    "SAP S/4 HANA (PS4)",
    "Power Automate Desktop",
    "Microsoft Excel",
    "Microsoft Outlook",
  ],
  tags: ["Rueckstandsliste", "SAP", "Excel", "PAD", "Outlook"],
  business: {
    istProcess:
      "Rückstandslisten mussten aus SAP exportiert, manuell nach Bereichen getrennt, kommentiert und verteilt werden.",
    sollProcess:
      "Automatischer PAD-Lauf: SAP-Export, Excel-VBA-Aufbereitung in Bereichslisten, Kommentarübernahme vom Vortag und Versand einer E-Mail mit Links zu den Tagesdateien.",
    benefit:
      "Täglich aktuelle Rückstandslisten für die Logistikbereiche mit weniger manuellem Aufwand und konsistenter Kommentarhistorie.",
  },
  tech: {
    flows: [
      {
        name: "Main",
        kind: "Power Automate Desktop",
        link: "docs/Rueckstandsliste/Rueckstandsliste.md#31-subflow-main",
      },
      { name: "SAP Login", kind: "Power Automate Desktop" },
      { name: "SAP Scripting", kind: "Power Automate Desktop + VBScript" },
      { name: "Create RL", kind: "Power Automate Desktop + VBA" },
    ],
    files: [
      {
        path: `${SAP_EXPORT_DIR}\\rsl-<Datum>.xlsx`,
        purpose: "SAP-Exportdatei aus dem PAD-Flow",
      },
      {
        path: SAP_IMPORT_FILE,
        purpose:
          "Vom Makro DatenkopierenSAP erwartete Importdatei; muss mit dem tatsächlichen SAP-Export abgestimmt werden",
      },
      {
        path: EXCEL_MAIN,
        purpose:
          "Hauptdatei mit VBA-Makros DatenkopierenSAP, RSl_create1_1_vom_Geschäft, ÜbertrageKommentareAllInOne und CreateEmailWithLinks",
      },
      {
        path: `${OUTPUT_BASE}\\<Bereich>\\yyyy-mm-dd TAKI1 Rückstandsliste <Bereich>.xlsx`,
        purpose: "Tagesdateien für LC1, LC3, LC6, LC9 und KIAA",
      },
    ],
    systems: [
      {
        name: "SAP S/4 HANA PS4",
        detail:
          "Mandant 009, Benutzer 5100LSS1 (SSO), SAP GUI Scripting, Bericht aus SAP-Favoritenbaum, Selektionsfeld S_LDDAT-LOW",
      },
      {
        name: "Microsoft Excel",
        detail:
          "Rückstandsliste Rechner.xlsm mit VBA-Makros für Import, Filterung, Formatierung, Kommentarübernahme und Dateispeicherung",
      },
      {
        name: "Microsoft Outlook",
        detail:
          "HTML-Mail mit Betreff „Rückstandsliste“ und Dateilinks; Empfänger im Makro CreateEmailWithLinks",
      },
    ],
    notes:
      "Der dokumentierte PAD-Exportpfad und der VBA-Importpfad weichen voneinander ab. Vor produktiver Nutzung müssen SAP-Export, C:\\TEMP\\EXPORT.XLSX und die lokalen bzw. Netzwerk-Ausgabepfade vereinheitlicht werden.",
  },
  runbook: {
    whenToUse:
      "Täglicher Lauf zur Erstellung der aktuellen Rückstandslisten. Manueller Nachlauf nur, wenn SAP-Export, Excel-Dateien und Outlook-Verteiler vorher geprüft wurden.",
    prerequisites: [
      "SAP GUI Skripting ist aktiviert",
      "SAP-Benutzer 5100LSS1 hat Zugriff auf PS4/Mandant 009 und den verwendeten SAP-Bericht",
      `Lokaler PAD-Exportordner vorhanden: ${SAP_EXPORT_DIR}`,
      `Importpfad fuer das Makro abgestimmt: ${SAP_IMPORT_FILE}`,
      `Rückstandsliste Rechner.xlsm vorhanden: ${EXCEL_MAIN}`,
      "Bereichsordner für LC1, LC3, LC6, LC9 und KIAA sind vorhanden und beschreibbar",
      "Outlook-Profil ist eingerichtet und darf E-Mails senden",
    ],
    steps: [
      "Prüfen, ob keine benötigten Rückstandslisten oder die XLSM-Datei von einem User geöffnet sind",
      "In JOZI „Prozess starten“ wählen oder den PAD-Flow „Rueckstandsliste“ direkt starten",
      "Flow läuft durch: SAP Login → SAP Scripting → Create RL",
      "SAP-Export und Importdatei prüfen, falls DatenkopierenSAP keine Rohdaten übernimmt",
      "Bereichsdateien für LC1, LC3, LC6, LC9 und KIAA auf aktuelles Datum prüfen",
      "Outlook-Mail mit Betreff „Rückstandsliste“ und Links zu den Dateien prüfen",
    ],
    expectedResults: [
      "SAP-Exportdatei im lokalen Rueckstandsliste-Ordner bzw. abgestimmte IMPORT.XLSX/EXPORT.XLSX-Datei",
      "Aktuelle Tagesdateien je Bereich im Format yyyy-mm-dd TAKI1 Rückstandsliste <Bereich>.xlsx",
      "Kommentarwerte aus passenden Vortagsdateien wurden in Spalte J übernommen",
      "Versendete Outlook-Mail mit Links zu KIAA, LC1, LC3, LC6 und LC9",
    ],
    errors: [
      {
        problem: "DatenkopierenSAP findet EXPORT.XLSX nicht",
        solution:
          "PAD-Exportpfad und Makro-Importpfad angleichen oder den SAP-Export nach C:\\TEMP\\EXPORT.XLSX speichern lassen.",
        escalation: "RPA-Team",
      },
      {
        problem: "Bereichsdateien werden nicht gespeichert",
        solution:
          "Lokale jozi1-Pfade bzw. Zielpfade im Makro auf den RPA-Rechner anpassen und Schreibrechte prüfen.",
        escalation: "RPA-Team / Fileservice",
      },
      {
        problem: "Kommentarübernahme bricht bei fehlender Vortagsdatei ab",
        solution:
          "Vortagsdatei im Bereichsordner bereitstellen oder die Makro-Fehlerbehandlung für Erstläufe anpassen.",
        escalation: "RPA-Team",
      },
      {
        problem: "E-Mail wird ohne falsche oder fehlende Links versendet",
        solution:
          "Ordnerpfade und Empfänger im Makro CreateEmailWithLinks vor dem Lauf prüfen; für Tests .Send durch .Display ersetzen.",
        escalation: "RPA-Team / IT Workplace",
      },
      {
        problem: "SAP-Scripting öffnet falschen Bericht oder falsches Layout",
        solution:
          "SAP-Favorit, Varianten-/Layoutauswahl und Feld S_LDDAT-LOW manuell prüfen und das VBScript bei geänderter SAP-GUI-Struktur neu aufzeichnen.",
        escalation: "SAP-Basis / RPA-Team",
      },
    ],
  },
  diagram: linearDiagram([
    { kind: "start", label: "Start", sublabel: "PAD Rueckstandsliste" },
    { kind: "system", label: "SAP Login", sublabel: "PS4 Mandant 009" },
    { kind: "system", label: "SAP Export", sublabel: "rsl-<Datum>" },
    { kind: "system", label: "Excel-Makros", sublabel: "Bereichslisten" },
    { kind: "system", label: "Kommentare", sublabel: "Vortagsdateien" },
    { kind: "output", label: "E-Mail", sublabel: "Links zu Listen" },
    { kind: "end", label: "Ende" },
  ]),
  action: rueckstandslisteAction,
};

export const rueckstandslisteParameters = [
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
    description: "Service-Account für SSO-Anmeldung und lokale Exportpfade.",
    options: [] as string[],
    sortOrder: 2,
  },
  {
    name: "SAP-Exportordner",
    key: "sap_export_pfad",
    type: "string" as const,
    defaultValue: SAP_EXPORT_DIR,
    required: true,
    group: "Dateien",
    description: "Lokaler Zielordner für den SAP-Excel-Export aus PAD.",
    options: [] as string[],
    sortOrder: 3,
  },
  {
    name: "Makro-Importdatei",
    key: "makro_import_datei",
    type: "string" as const,
    defaultValue: SAP_IMPORT_FILE,
    required: true,
    group: "Dateien",
    description:
      "Datei, die DatenkopierenSAP öffnet. Muss zum SAP-Export passen.",
    options: [] as string[],
    sortOrder: 4,
  },
  {
    name: "Ausgabeordner",
    key: "ausgabe_basis_pfad",
    type: "string" as const,
    defaultValue: OUTPUT_BASE,
    required: true,
    group: "Dateien",
    description: "Basisordner mit Unterordnern LC1, LC3, LC6, LC9 und KIAA.",
    options: [] as string[],
    sortOrder: 5,
  },
];

export const rueckstandslisteTutorial = {
  title: "Rueckstandsliste-Prozess selbst nachbauen",
  description:
    "Lerne wie der Rueckstandsliste Prozess funktioniert und baue deinen eigenen Rueckstandsliste-Prozess auf deinem Rechner nach. Dieses Tutorial führt dich Schritt für Schritt durch den Prozess und erklärt, wie du SAP-Export, Excel-Makros, Kommentarübernahme und E-Mail-Versand einrichtest.",
  steps: [
    {
      group: "Überblick",
      title: "Rueckstandsliste-Ablauf verstehen",
      description:
        "Der feste Ablauf ist: SAP anmelden, Rückstandsdaten exportieren, die Daten in Rückstandsliste Rechner.xlsm importieren, je Bereich Tagesdateien erstellen, Kommentare aus den Vortagsdateien übernehmen und eine E-Mail mit Links versenden. Mit den folgenden Schritten richtest du deine eigene Rückstandsliste-Automatisierung ein.",
      expectedResult:
        "Du kennst Eingabe, Verarbeitung und Ergebnis des Rueckstandsliste-Prozesses.",
    },
    {
      group: "Vorbereitung",
      title: "Systemzugänge und Berechtigungen prüfen",
      description:
        "Prüfe auf deinem Rechner SAP GUI mit Zugriff auf PS4/Mandant 009, aktivierbares SAP GUI Skripting, Excel mit Makro-Unterstützung, Power Automate Desktop und Outlook. Stelle außerdem sicher, dass du auf die SAP-Daten und alle Zielordner für LC1, LC3, LC6, LC9 und KIAA zugreifen kannst.",
      expectedResult:
        "Alle benötigten Programme, Zugänge und Zielordner stehen für den Nachbau bereit.",
    },
    {
      group: "Vorbereitung",
      title: "SAP-Vorbereitung für das GUI Skripting",
      description: `Prüfe zuerst die SAP GUI Skripting-Unterstützung und die Sicherheitskonfiguration in deinen SAP Einstellungen, damit die Skripte barrierefrei ausführbar sind:

- [[Optionen|images/SAP/SAP-optionen.png]]: In deinem **SAP Logon 800** klicke auf das SAP Icon oben links und wähle **Optionen**.
- [[Skriptunterstützung|images/SAP/SAP-Scripting.png]]: Unter dem Reiter **Barrierefreiheit & Skripting** den Menüpunkt **Skriptunterstützung** aktivieren und in der Checkbox **Skriptunterstützung aktivieren**.
- [[Sicherheit|images/SAP/SAP-Sicherheit.png]]: Unter dem Reiter **Sicherheit** den Menüpunkt **Sicherheitskonfiguration** setze den **Status** auf **Deaktiviert**.`,
      expectedResult:
        "SAP GUI Skripting ist nutzbar und die SAP-Session kann durch PAD gesteuert werden.",
    },
    {
      group: "Vorbereitung",
      title: "SAP-Bericht und Layout prüfen",
      description:
        "Öffne **10: PS4 - Production S/4 HANA** mit Mandant `009` und prüfe, ob der im Script verwendete SAP-Favorit bzw. Bericht erreichbar ist. Das Script setzt später das Feld `S_LDDAT-LOW`, startet den Bericht und wählt ein ALV-Layout. Wenn sich SAP-Menüs, Favoriten oder Layoutpositionen ändern, muss das VBScript neu aufgezeichnet oder angepasst werden.",
      expectedResult:
        "Der SAP-Bericht öffnet sich, das Datum kann gesetzt werden und ein Excel-Export ist manuell möglich.",
    },
    {
      group: "Vorbereitung",
      title: "Arbeitsordner und Dateinamen anlegen",
      description:
        "Lege einen lokalen Exportordner an, zum Beispiel `C:\\Users\\<User>\\Documents\\Rueckstandsliste\\`. Lege außerdem entweder `C:\\TEMP\\` an oder passe später das Makro **DatenkopierenSAP** so an, dass es genau die von SAP erzeugte Datei öffnet. Der dokumentierte PAD-Flow exportiert nach `C:\\Users\\5100LSS1\\Documents\\Rueckstandsliste`, das Makro liest aber `C:\\TEMP\\EXPORT.XLSX`.",
      expectedResult:
        "Exportordner und Importpfad sind angelegt und die spätere Pfadangleichung ist klar.",
    },
    {
      group: "Excel: Files & Codes",
      title: "Erstellung der Rückstandsliste Rechner.xlsm Datei",
      description: `Erstelle die Excel-Datei **Rückstandsliste Rechner.xlsm** und speichere sie als Excel-Arbeitsmappe mit Makros.

Lege mindestens die Rohdatentabelle \`Tabelle1\` an. Das Makro **DatenkopierenSAP** kopiert den Bereich \`A1:AN15000\` aus dem SAP-Export nach \`Tabelle1!A1\`.

Lege die Zielordner für die Bereichslisten an:

- \`<Ausgabeordner>\\LC1\`
- \`<Ausgabeordner>\\LC3\`
- \`<Ausgabeordner>\\LC6\`
- \`<Ausgabeordner>\\LC9\`
- \`<Ausgabeordner>\\KIAA\`

Merke dir den Pfad zu dieser XLSM-Datei für die spätere PAD-Aktion **Excel starten**.`,
      expectedResult:
        "Die Rückstandsliste Rechner.xlsm Datei ist erstellt und die Zielordner sind erreichbar.",
    },
    {
      group: "Excel: Files & Codes",
      title: "VBA-Modul in Excel erstellen und Makro einfügen",
      description: `Öffne die Datei **Rückstandsliste Rechner.xlsm** und drücke **Alt + F11**, oder klicke unter dem Reiter **Entwicklertools** auf [[Visual Basic for Applications|images/Excel/Entwicklertool.png]] um den VBA-Editor zu öffnen.

Wähle links im Projekt-Explorer die Arbeitsmappe **VBAProject (Rückstandsliste Rechner.xlsm)** aus. Falls der Projekt-Explorer nicht sichtbar ist, blende ihn über **Ansicht > Projekt-Explorer** ein.

Erstelle über [[Einfügen > Modul|images/Excel/ModulErstellen.png]] ein neues Standardmodul. Excel legt dadurch unter **Module** ein neues Modul an, zum Beispiel **Modul1**.

Klicke dieses Modul doppelt an und füge den [[VBA-Code|images/Excel/SkriptEinfuegen.png]] des jeweiligen Makros vollständig in das leere Codefenster ein. Speichere anschließend die Arbeitsmappe wieder als **Excel-Arbeitsmappe mit Makros (*.xlsm)**.

Wiederhole diesen Schritt für jedes weitere Makro oder füge mehrere Makros nacheinander in dasselbe Standardmodul ein, wenn sie gemeinsam in der Rückstandsliste-Datei liegen sollen.`,
      expectedResult:
        "In der Rückstandsliste Rechner.xlsm existiert ein VBA-Standardmodul, in das Makros eingefügt und gespeichert werden können.",
    },
    {
      group: "Excel: Files & Codes",
      title: "Makro DatenkopierenSAP fuer die PAD-Aktion einfügen",
      description: excelMacroStep(
        "Die erste `Excel.RunMacro`-Aktion ruft **DatenkopierenSAP** auf. Das Makro erwartet aktuell `C:\\TEMP\\EXPORT.XLSX`. Trage hier entweder genau diesen Exportpfad ein oder passe den SAP-Export im PAD-Flow so an, dass die Datei dort mit diesem Namen liegt.",
        "DatenkopierenSAP"
      ),
      expectedResult:
        "Die erste PAD-Makroaktion kopiert die SAP-Exportdaten reproduzierbar in Tabelle1.",
    },
    {
      group: "Excel: Files & Codes",
      title: "Makro RSl_create1_1_vom_Geschäft einfügen",
      description: excelMacroStep(
        "Die zweite `Excel.RunMacro`-Aktion ruft **RSl_create1_1_vom_Geschäft** auf. Füge den Code ein und ersetze vor dem ersten Test alle lokalen `C:\\Users\\jozi1\\...` Pfade durch deinen eigenen Ausgabeordner mit den Unterordnern LC1, LC3, LC6, LC9 und KIAA.",
        "RSl_create1_1_vom_Geschäft"
      ),
      expectedResult:
        "Die zweite PAD-Makroaktion erzeugt Tagesdateien je Bereich mit Kommentarspalte und Dropdownwerten.",
    },
    {
      group: "Excel: Files & Codes",
      title: "Makros zur Kommentarübernahme einfügen",
      description: `${excelMacroStep(
        "Die dritte `Excel.RunMacro`-Aktion ruft **ÜbertrageKommentareAllInOne** auf. Füge zuerst das Sammelmakro ein und danach die Bereichsmakros. Passe in jedem Bereichsmakro den Pfad auf deinen jeweiligen Bereichsordner an.",
        "ÜbertrageKommentareAllInOne"
      )}

${markdownSection(macrosMarkdown, "ÜbertrageKommentareLC1")}

${markdownSection(macrosMarkdown, "ÜbertrageKommentareLC3")}

${markdownSection(macrosMarkdown, "ÜbertrageKommentareLC6")}

${markdownSection(macrosMarkdown, "ÜbertrageKommentareLC9")}

${markdownSection(macrosMarkdown, "ÜbertrageKommentareKIAA")}`,
      expectedResult:
        "Die dritte PAD-Makroaktion kann Kommentare aus den Vortagsdateien in die aktuellen Tagesdateien übernehmen.",
    },
    {
      group: "Excel: Files & Codes",
      title: "Makro CreateEmailWithLinks einfügen",
      description: excelMacroStep(
        "Die vierte `Excel.RunMacro`-Aktion ruft **CreateEmailWithLinks** auf. Ersetze die Ordnerpfade durch deine Bereichsordner und ersetze den Empfänger vor dem ersten Test ausschließlich durch deine eigene Testadresse. Für Testläufe ist `.Display` sicherer als `.Send`; produktiv kann wieder direkt gesendet werden.",
        "CreateEmailWithLinks"
      ),
      expectedResult:
        "Die vierte PAD-Makroaktion erstellt eine Outlook-Testmail mit Links zu den erzeugten Rückstandslisten.",
    },
    {
      group: "Power Automate Desktop Flow",
      title: "PAD-Flow und Subflows anlegen",
      description: `Der PAD-Flow beschreibt den gesamten Prozessablauf. Erstelle zuerst einen [[neuen Flow|images/Servicegrad/NeuFlow.png]] (z.B. Rueckstandsliste) und die [[Subflows|images/Servicegrad/NeuSubflow.png]]:

- **Main**: Bestimmt in welcher Reihenfolge die Subflows durchlaufen sollen
- **SAP Login**: Startet SAP PS4 per SSO mit Mandant 009 und Benutzer 5100LSS1
- **SAP Scripting**: Führt den SAP-Bericht aus und exportiert die Rückstandsdaten
- **Create RL**: Öffnet die XLSM-Datei und führt die Makros in Reihenfolge aus

Richte **Main** so ein, dass er diese Subflows genau in dieser Reihenfolge aufruft. Baue ab jetzt jede weitere Tutorial-Aktion direkt in dem Subflow ein, in dem sie später läuft.

${markdownSection(padMarkdown, "Main")}`,
      expectedResult:
        "Ein Power Automate Desktop Flow mit den Subflows Main, SAP Login, SAP Scripting und Create RL bildet den gesamten Prozessablauf sichtbar ab.",
    },
    {
      group: "PAD-Flow: SAP Login",
      title: "SAP Login bauen",
      description: `Baue den untenstehenden Flow in den zuvor erstellten Subflow **SAP Login** ein oder importiere ihn direkt aus dem RAW-Code in diesen Subflow.

Prüfe vor dem Test, ob Beschreibung, Mandant, Benutzer und Sprache zu deinem SAP-Zugang passen.

${markdownSection(padMarkdown, "SAP Login")}`,
      expectedResult:
        "Der Subflow öffnet SAP PS4 per SSO und stellt eine steuerbare SAP-Session bereit.",
    },
    {
      group: "PAD-Flow: SAP Scripting",
      title: "SAP-Prozess und Daten Export",
      description: `Baue den untenstehenden Flow in den zuvor erstellten Subflow **SAP Scripting** ein oder importiere ihn direkt aus dem RAW-Code in diesen Subflow.

Der Flow ermittelt das aktuelle Datum, setzt es im SAP-Selektionsfeld \`S_LDDAT-LOW\`, führt den Bericht aus und erzeugt die Exportdatei **rsl-<Datum>**.

Passe im VBScript die folgende Zeile an, indem du den Pfad durch den in **Schritt 05** definierten Zielpfad ersetzt:
\`session.findById("wnd[1]/usr/ctxtDY_PATH").text = "C:\\Users\\5100LSS1\\Documents\\Rueckstandsliste"\`

Prüfe danach, ob der Exportname und der spätere Makro-Importpfad zusammenpassen.

${markdownSection(padMarkdown, "SAP Scripting")}`,
      expectedResult:
        "Der Subflow erstellt die SAP-Exportdatei im definierten Exportordner.",
    },
    {
      group: "PAD-Flow: Create RL",
      title: "Rueckstandsliste erstellen und Email versenden",
      description: `Baue den untenstehenden Flow in den zuvor erstellten Subflow **Create RL** ein oder importiere ihn direkt aus dem RAW-Code in diesen Subflow.

Der Flow öffnet die Datei **Rückstandsliste Rechner.xlsm**, importiert die SAP-Daten, erzeugt Bereichsdateien, übernimmt Kommentare und versendet die Link-Mail.

Stelle sicher, dass in der PAD-Aktion **Excel starten** der Dateipfad aus **Schritt 06** zur Datei **Rückstandsliste Rechner.xlsm** hinterlegt ist.

${markdownSection(padMarkdown, "Create RL")}`,
      expectedResult:
        "Der Prozess erzeugt die Bereichslisten, übernimmt Kommentare und versendet die Rückstandsliste-E-Mail.",
    },
    {
      group: "Power Automate Cloud",
      title: "Cloud-Flow als Scheduler erstellen",
      description:
        "Erstelle in Power Automate Cloud bei Bedarf einen geplanten Flow, z.B. werktäglich vor Arbeitsbeginn. Wähle die Aktion zum Starten des Desktop-Flows auf dem RPA-Rechner und verbinde sie mit dem PAD-Flow Rueckstandsliste. Trage die tatsächliche Environment-ID und Workflow-ID später in der App nach, wenn der direkte Startbutton auf den konkreten Flow zeigen soll.",
      expectedResult:
        "Der Cloud-Flow kann den Desktop-Flow geplant oder testweise manuell starten.",
    },
    {
      group: "Power Automate Cloud",
      title: "Unattended-Ausfuehrung pruefen",
      description:
        "Teste den Cloud-Start mit gesperrtem oder unbeaufsichtigtem RPA-Rechner, je nach Umgebung. Pruefe Machine Group, Verbindung, Benutzerkonto und ob Excel, SAP und Outlook im unattended Kontext funktionieren. Achte besonders auf benutzergebundene Pfade unter `C:\\Users\\5100LSS1` und `C:\\Users\\jozi1`.",
      expectedResult:
        "Der Prozess startet ohne interaktive Bedienung und nutzt das richtige Windows-, SAP- und Outlook-Konto.",
    },
    {
      group: "Testlauf",
      title: "End-to-End-Test mit Testverteiler ausfuehren",
      description:
        "Fuehre den kompletten Ablauf mit Testverteiler aus: PAD oder Cloud starten, SAP-Export pruefen, Import nach Tabelle1 pruefen, Bereichsdateien kontrollieren, Kommentarübernahme anhand einer Vortagsdatei testen und Mailinhalt validieren.",
      expectedResult:
        "Alle Artefakte entstehen: SAP-Exportdatei, Bereichsdateien, übernommene Kommentare und E-Mail mit Links.",
    },
    {
      group: "Testlauf",
      title: "Fehlerfaelle bewusst testen",
      description:
        "Teste typische Stoerungen: fehlende EXPORT.XLSX, falscher Ausgabeordner, fehlende Vortagsdatei, gesperrte Bereichsdatei, geändertes SAP-Layout und Outlook-Probleme. Notiere je Fehler die Meldung und den Workaround.",
      expectedResult:
        "Der Rueckstandsliste-Prozess hat nachvollziehbare Fehlermeldungen und bekannte Workarounds.",
    },
    {
      group: "Dokumentation",
      title: "JOZI Rueckstandsliste-Prozess tutorial erfolgreich abgeschlossen",
      description:
        "Herzlichen Glückwunsch! Du hast den Rueckstandsliste-Prozess erfolgreich nachgebaut und getestet.",
      expectedResult:
        "Du hast den Rueckstandsliste-Prozess erfolgreich nachgebaut und getestet.",
    },
  ],
};
