# JOZI Control & Documentation Center

Desktop-Anwendung zur **Steuerung, Dokumentation und Übergabe von RPA-Prozessen** (Robotic Process Automation). Die App bündelt Prozesswissen, Runbooks, technische Artefakte und Laufhistorie an einem Ort — lokal auf dem Rechner, ohne zentrale Server-Infrastruktur.

## Wofür ist die App da?

RPA-Automationen (Power Automate Desktop, Cloud-Flows, Skripte, Excel-Makros) sind oft über mehrere Systeme verteilt: Flow-Dateien, VBA-Code, SAP-Exporte, Netzwerkpfade. Diese App dient als **Kontroll- und Dokumentationszentrum**, damit Betrieb, Wartung und Übergabe nachvollziehbar bleiben.

Konkret hilft sie dabei:

- **Prozesse zu katalogisieren** — mit Stammdaten, Kritikalität, Owner, Systemen und Tags
- **Wissen zu dokumentieren** — Runbooks, Business-Sicht (Ist/Soll/Nutzen), Ablaufdiagramme, technische Details
- **Prozesse zu starten und zu überwachen** — inkl. Parameter, Laufprotokoll und Erfolgsquote
- **Wissen zu exportieren** — JSON, Markdown-Runbooks und Datenbank-Backup für Audits und Übergaben

## Hauptbereiche

### Leitstand

Dashboard mit Kennzahlen auf einen Blick: Anzahl Prozesse, Läufe der letzten 30 Tage, Erfolgsquote, kritische Prozesse sowie die letzten Ausführungen.

### Prozesskatalog

Durchsuchbare und filterbare Liste aller Automationen. Filter nach Kategorie, Kritikalität, Status, Tags und Favoriten. Prozesse können als Favorit markiert werden.

### Prozessdetail

Jeder Prozess hat mehrere Registerkarten:

| Register | Inhalt |
| --- | --- |
| **Übersicht** | Beschreibung, Business-Sicht, technische Sicht, Ablaufdiagramm |
| **Runbook** | Voraussetzungen, Schritte, erwartete Ergebnisse, Fehlerbehandlung |
| **Technische Details** | Flows, Dateien, Systeme, eingebettete Artefakte (z. B. PAD-Flow, VBA, VBScript) |
| **Konfiguration** | Startaktion und Prozessparameter |
| **Läufe** | Ausführungshistorie mit Status, Dauer und detailliertem Log |
| **Tutorial** | Schritt-für-Schritt-Anleitung zum Prozess |

### Prozesse starten

Je nach Konfiguration unterstützt die App verschiedene Startaktionen:

- **Power Automate Desktop** — PAD-Flow per URL öffnen
- **Skript / Shell** — Kommandozeilenbefehl mit Parameterersetzung (`{{key}}`)
- **Cloud-Flow (HTTP)** — HTTP-Trigger aufrufen
- **Datei öffnen** — z. B. Excel-Datei mit Auto-Makro

Läufe werden protokolliert; Ausgabe von Skripten erscheint im Lauf-Log.

### Einstellungen

- **Rollenmodell** (lokal, ohne Login): Viewer, Operator, Editor
- **Export & Backup**: alle Prozesse als JSON, Runbooks als Markdown, SQLite-Datenbank sichern
- **Darstellung**: heller und dunkler Modus

## Rollen

| Rolle | Rechte |
| --- | --- |
| **Viewer** | Prozesse, Läufe, Logs und Tutorials ansehen |
| **Operator** | Wie Viewer — zusätzlich Prozesse starten und abbrechen |
| **Editor** | Vollzugriff: Prozesse, Parameter, Runbooks und Tutorials bearbeiten |

## Beispielprozess: Servicegrad-Ermittlung

Beim ersten Start legt die App den realen Prozess **Servicegrad-Ermittlung** an. Er dokumentiert die tägliche Servicegrad-Berechnung für die Standorte LC1, LC3, LC6, LC8 und LC9 auf Basis von SAP-Lieferdaten — mit Power Automate Desktop, Excel-VBA-Makros und Outlook-Versand.

Ausführliche technische Dokumentation liegt unter [`docs/Servicegrad/`](docs/Servicegrad/).

## Entwicklung

### Voraussetzungen

- Node.js (LTS empfohlen)
- npm

### App starten

```bash
npm install
npm run start
```

### Weitere Skripte

| Befehl | Beschreibung |
| --- | --- |
| `npm run start` | App im Entwicklungsmodus starten |
| `npm run package` | App paketieren |
| `npm run make` | Installer erstellen (Windows, macOS, Linux) |
| `npm run check` | Linting und Formatierung prüfen (Ultracite/Biome) |
| `npm run fix` | Automatische Korrekturen anwenden |
| `npm run test` | Unit-Tests (Vitest) |
| `npm run test:e2e` | End-to-End-Tests (Playwright) |

### Datenhaltung

Prozessdaten, Läufe und Einstellungen werden in einer lokalen **SQLite-Datenbank** gespeichert (`jozi-control-center.db` im Electron-UserData-Verzeichnis).

## Technologie

Die App basiert auf [Electron](https://www.electronjs.org) mit [React](https://react.dev), [Vite](https://vitejs.dev), [TanStack Router](https://tanstack.com/router) und [Shadcn UI](https://ui.shadcn.com). Die Kommunikation zwischen Renderer und Main-Prozess läuft über [oRPC](https://orpc.unnoq.com). Typisierung und Validierung mit TypeScript und Zod.

## Lizenz

MIT — siehe [LICENSE](LICENSE).
