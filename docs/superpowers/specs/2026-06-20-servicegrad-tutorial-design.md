# Servicegrad-Tutorial: lokaler Nachbau

## Ziel

Das mitgelieferte Tutorial erklärt eindeutig den Nachbau des bestehenden
Servicegrad-Prozesses auf einem eigenen Rechner. Es ist keine Vorlage für einen
beliebigen neuen Automatisierungsprozess.

## Inhalt des Tutorials

Das Tutorial beginnt mit lokalen Voraussetzungen: benötigte Software
(SAP GUI, Excel mit VBA, Outlook und Power Automate Desktop), verfügbare
Zugänge sowie die aktivierte SAP-GUI-Scripting-Unterstützung. Konkrete
Firmen- oder RPA-Rechner-Berechtigungen werden nicht als Voraussetzung
vorgegeben.

Die Nutzenden wählen einen eigenen Arbeitsordner und eigene Speicherorte für
Exportdatei, Hauptarbeitsmappe, Kennzahlen-Datei und VBScript. Ein verpflichtender
Schritt fordert dazu auf, diese Speicherorte danach konsistent in PAD, VBScript
und VBA-Makros einzutragen. Die fachlichen Inhalte bleiben fest: SAP-Export,
Servicegrad-Berechnung für die vorhandenen Standorte, Fortschreibung der
Kennzahlen und Versand der Ergebnis-E-Mail.

Die bisherigen allgemeinen Schritte "Automatisierungsziel festlegen",
"eigener Prozess" und "eigene Zielbereiche" entfallen oder werden durch
Servicegrad-spezifische Anweisungen ersetzt.

## Speicherung und Aktualisierung

`servicegrad.ts` bleibt die versionierte Quellbeschreibung des ausgelieferten
Standard-Tutorials. `tutorials` und `tutorial_steps` in SQLite bleiben der
Speicher für die Anzeige und manuelle Bearbeitung in der App.

Der Seeder erhält eine Inhaltsversion und einen Fingerabdruck des zuletzt
ausgelieferten Standard-Tutorials. Beim Start gilt:

- Ohne Tutorial wird die aktuelle Standardversion angelegt.
- Bei einem unveränderten Standard-Tutorial wird auf die aktuelle Version
  aktualisiert.
- Bei einer manuellen Änderung bleiben Titel, Beschreibung und Schritte
  unverändert; die App überschreibt sie nicht.

Für Bestandsdaten ohne Fingerabdruck wird das bisherige Seed-Tutorial als
aktualisierbar erkannt, solange sein Titel dem bisherigen oder aktuellen
Standardtitel entspricht. Davon abweichende Tutorials gelten als manuell
angepasst.

## Tests

Unit-Tests prüfen den neuen fachlichen Inhalt und vermeiden Begriffe, die einen
allgemeinen oder fremden Prozess suggerieren. Zusätzliche Seeder-Tests prüfen
das Anlegen, das Aktualisieren eines unveränderten Standards und den Erhalt
eines manuell geänderten Tutorials.
