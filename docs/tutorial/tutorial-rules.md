# Regeln für Prozess-Tutorials

## 1. Ziel und Geltungsbereich

Jeder Prozess in der App erhält einen eigenen Tutorial-Bereich. Das Tutorial muss eine Person ohne Kenntnis des Prozesses dazu befähigen, den jeweiligen Prozess auf ihrem eigenen Rechner vollständig nachzubauen, zu testen, zu betreiben und später an andere Personen zu übergeben.

Die Anleitung beschreibt den tatsächlich umgesetzten Prozess. Sie darf keine Annahmen voraussetzen, die nur den ursprünglichen Erstellenden bekannt sind. Allgemeine Hinweise wie „Flow einrichten“ oder „Makro hinzufügen“ reichen nicht aus: Jede notwendige Handlung wird konkret beschrieben.

Keine produktiven Zugangsdaten, persönlichen Kennwörter, Tokens oder vertraulichen Inhalte in das Tutorial schreiben. Stattdessen eindeutig markieren, welche Werte die nachbauende Person lokal eintragen oder beim zuständigen Team anfordern muss.

## 2. Verbindliche Gruppen und Reihenfolge

Jedes Tutorial gliedert seine Schritte in fachlich klare Gruppen. Die Gruppen werden in dieser Reihenfolge angelegt; nicht relevante Gruppen dürfen nur entfallen, wenn das Tutorial den Grund dafür nennt.

1. **Überblick**
   - Zweck, Eingabe, Verarbeitung und Ergebnis des Prozesses in verständlicher Reihenfolge erklären.
   - Auslöser, Häufigkeit, beteiligte Systeme und verantwortliche Rollen nennen.
   - Bei mehreren Komponenten eine Prozessübersicht oder ein Ablaufdiagramm ergänzen.

2. **Vorbereitung**
   - Programme, Zugänge, Lizenzen und Berechtigungen prüfen.
   - Systemspezifische Vorbereitungen vorziehen, zum Beispiel SAP GUI Scripting, Transaktionsberechtigung, Makrofreigabe oder Netzwerkzugriff.
   - Lokalen Arbeits- und Exportordner mit Dateinamensschema anlegen. Der Schritt nennt den späteren Verwendungsort des Pfads.

3. **`<Komponente>: Files & Codes`**
   - Für jede Komponente mit Dateien oder ausführbarem Code eine eigene Gruppe verwenden, zum Beispiel **Excel: Files & Codes**, **Python: Files & Codes** oder **Datenbank: Files & Codes**.
   - Zuerst die Hauptdatei oder Vorlage anlegen, danach die dazugehörigen Makros, Skripte, Module oder Konfigurationsdateien in ihrer technischen Ausführungsreihenfolge einfügen.
   - Jede Datei beschreibt Zweck, Dateityp, Speicherort, Blattnamen beziehungsweise Struktur sowie die PAD-Aktion oder den Subflow, die sie später verwenden.
   - Code darf vor dem PAD-Flow erklärt werden, wenn er eine Voraussetzung für dessen Aktionen ist. Der Schritt muss dann die spätere Aktion eindeutig nennen.

4. **Power Automate Desktop Flow**
   - Den Desktop-Flow, Main-Flow und alle Subflows anlegen.
   - Die Gruppe erklärt die Funktion jedes Subflows und die Reihenfolge, in der Main sie aufruft.
   - Die Namen im Tutorial müssen den tatsächlichen PAD-Subflow-Namen entsprechen; abweichende Anzeigenamen sind ausdrücklich zuzuordnen.

5. **`PAD-Flow: <Subflowname>`**
   - Jeder relevante Subflow erhält danach eine eigene Gruppe, zum Beispiel **PAD-Flow: Get DateTime**, **PAD-Flow: Get SAP Data** oder **PAD-Flow: Berechnung und E-Mail-Versand**.
   - Der Schritt enthält den vollständigen PAD-RAW-Code oder genaue Import- beziehungsweise Einfügeanweisungen.
   - Er erklärt Eingabevariablen, verwendete Dateien, anzupassende Werte, erzeugte Ergebnisse und die Verbindung zu vorher eingerichteten Dateien oder Codes.
   - Wenn ein Subflow Varianten enthält, etwa „Vortag“ und „letzter Freitag“, werden beide Varianten mit Auslösebedingung und Verwendung beschrieben.

6. **Power Automate Cloud**
   - Scheduler, Zeitzone, Startaktion für den Desktop-Flow, Machine Group und Ausführungskonto einrichten.
   - Unattended-Ausführung, Konflikte mit manuellen Starts und die Prüfung mit gesperrtem Rechner dokumentieren.

7. **Testlauf**
   - Ersttest mit sicheren Daten und ausschließlich eigener Testadresse beziehungsweise freigegebenem Testverteiler.
   - End-to-End-Test mit erwarteten Zwischen- und Endergebnissen.
   - Typische Fehlerfälle, Diagnose, sicherer Wiederanlauf und Logs dokumentieren.

8. **Dokumentation**
   - Prozessdaten, Dateien, Parameter, Flow, Scheduler, Runbook und Fehlerbehandlung in der App ergänzen.
   - Lokale Besonderheiten, Zuständigkeiten und die Übergabe an eine zweite Person dokumentieren.

## 3. Verbindliches Format jedes Schritts

Jeder einzelne Tutorial-Schritt muss diese Informationen enthalten:

- **Titel:** beschreibt genau eine Aufgabe und beginnt möglichst mit einer Handlung, zum Beispiel „Exportordner anlegen“ oder „Makro `Datenimport` einfügen“.
- **Ziel:** erklärt, warum dieser Schritt erforderlich ist und welches Teilproblem er löst.
- **Voraussetzungen:** nennt Dateien, Zugänge, vorherige Schritte oder Programme, die bereits vorhanden sein müssen.
- **Konkrete Durchführung:** enthält nummerierte Klicks, Eingaben, Befehle oder Code-Einfügeschritte. Menüpfade, Dialognamen und relevante Feldnamen werden ausgeschrieben.
- **Bezug zum Prozess:** nennt bei Dateien und Code die spätere PAD-Aktion oder den Subflow, die beziehungsweise der sie verwendet. Bei einem PAD-Schritt nennt er umgekehrt alle vorher einzurichtenden Dateien, Codes und Variablen.
- **Dateien und Werte:** nennt Pfade, Dateinamen, Blattnamen, Variablen und Konfigurationswerte. Änderbare Werte sind als Platzhalter wie `<DEIN_EXPORTORDNER>` oder `<TEST_EMAIL>` gekennzeichnet und erklärt.
- **Code oder Skript:** enthält den vollständigen, kopierbaren Abschnitt oder eine eindeutige Referenz auf die versionierte Quelldatei und den Abschnittsnamen.
- **Prüfergebnis:** beschreibt, woran die Person direkt erkennt, dass der Schritt erfolgreich war.
- **Fehlerhinweis:** nennt mindestens die wahrscheinlichste Fehlerursache und eine konkrete Prüfung oder Lösung, sobald der Schritt externe Systeme, Dateien oder Berechtigungen verwendet.

Ein Schritt darf nicht mehrere große, unabhängige Aufgaben vermischen. Falls ein Ergebnis erst nach mehreren Teilaktionen prüfbar ist, wird der Ablauf in mehrere Schritte aufgeteilt.

## 4. Formatierungsregeln für die Tutorial-UI

Tutorialtexte verwenden die unterstützte Markdown-ähnliche Syntax gezielt. Formatierung dient der Orientierung; sie darf nicht nur Dekoration sein.

### 4.1 Schlüsselwörter und Bedienhandlungen

- Wichtige Begriffe, Aktionen, Dialoge und Ergebnisse mit `**Fettdruck**` hervorheben. Dazu gehören zum Beispiel **Power Automate Desktop**, **Main**, **Excel starten**, **Einfügen > Modul**, **To** oder **Skriptunterstützung aktivieren**.
- Fettmarkierung nur für Begriffe verwenden, auf die die Person achten oder klicken muss. Keine ganzen Sätze und keine mehrfach verschachtelten Hervorhebungen formatieren.
- Technische, exakt zu übernehmende Werte mit Inline-Code markieren: `` `Get_DateTime_Variable` ``, `` `SG-<Datum>.xlsx` ``, `` `Tabelle2!B12:Q19` ``, Pfade, Transaktionen, Variablen, Makronamen und einzelne Codezeilen.
- Inline-Code und Fettmarkierung nicht ineinander verschachteln. Für einen Namen entweder `Code` oder **Hervorhebung** auswählen: Code für den exakten Wert, Fett für eine UI- oder Bedienhandlung.

### 4.2 Bilder als kontextbezogene Hinweise

- Bilder ausschließlich als Inline-Bildhinweis in dieser Form einbinden: `[[Anzeigetext|images/<Bereich>/<Datei>.png]]`.
- Der Anzeigetext beschreibt die sichtbare Handlung oder das Bedienelement, zum Beispiel `[[Optionen|images/SAP/SAP-optionen.png]]` oder `[[Neuen Flow|images/Servicegrad/NeuFlow.png]]`.
- Der Pfad ist relativ zum Projektordner `images/`, verwendet Schrägstriche und verweist auf eine vorhandene PNG-, JPG-, JPEG-, GIF- oder WebP-Datei.
- Bilder stehen direkt an der Textstelle, an der die Person die Ansicht benötigt. Sie werden in der UI als anklickbarer Hinweis mit Bildvorschau angezeigt; der erklärende Text muss trotzdem ohne Bild verständlich bleiben.

### 4.3 Überschriften, Absätze und Listen

- Innerhalb einer Schrittbeschreibung dürfen Zwischenüberschriften mit `## Titel` verwendet werden. Sie strukturieren längere Erklärungen oder trennen etwa „Konfiguration“ und „Prüfung“.
- Zwischen eigenständigen Gedanken immer eine Leerzeile setzen. Die UI zeigt sie als getrennte Absätze an.
- Für mehrere gleichartige Aktionen eine reine Aufzählung verwenden: Jede Zeile beginnt mit `- `, zum Beispiel für Subflows, SAP-Einstellungen oder Prüfpunkte.
- Eine Listen-Gruppe darf nur Listeneinträge enthalten. Erklärende Fließtexte stehen davor oder danach in einem eigenen Absatz.

### 4.4 Codeblöcke, Kopieren und Flow/RAW-Ansicht

- Vollständigen, kopierbaren Code immer als eigenen Block mit drei Backticks schreiben. Vor dem Block erklären, wo er eingefügt wird; nach dem Block das erwartete Ergebnis nennen.
- VBA und allgemeiner Quellcode verwenden einen Sprachbezeichner und erscheinen als kopierbarer Codeblock, zum Beispiel ` ```vba `.
- Power-Automate-Desktop-Code erhält den Bezeichner `pad`; VBScript den Bezeichner `vbs`. Die UI zeigt diese Blöcke als interaktive Ansicht mit den Tabs **Flow** und **RAW** sowie einer Kopierfunktion an.
- In einem PAD- oder VBS-Block steht nur importierbarer RAW-Code – keine Erläuterungen, Platzhalterbeschreibungen oder Markdown-Listen. Anpassungshinweise gehören unmittelbar vor den Block.
- Jeder Codeblock enthält genau einen zusammenhängenden Einfügeabschnitt. Sehr lange Inhalte dürfen aus der versionierten Quelldatei eingebunden werden, müssen aber im Tutorial vollständig kopierbar bleiben.

### 4.5 Verweise und Schrittbeziehungen

- Verweise auf andere Tutorialschritte werden als **Schritt NN** formatiert und nennen zusätzlich das Artefakt oder Ergebnis, zum Beispiel **Schritt 05: Exportordner**.
- Bei Dateien, Makros und Flows immer den Anzeigenamen fett und den exakten technischen Namen als Inline-Code angeben, wenn beide voneinander abweichen, zum Beispiel **Datumsermittlung** – `Get_DateTime_Variable`.
- Die Beschreibung eines PAD-Subflows nennt die von ihm verwendete Datei, den Makro- oder Skriptnamen sowie die vorherige Gruppe, in der diese Abhängigkeit eingerichtet wurde.

## 5. Regeln für Dateien, Pfade und Konfiguration

- Produktive, personen- oder standortgebundene Pfade dürfen niemals ungeprüft übernommen werden. Das Tutorial weist bei jedem betroffenen Code- oder Konfigurationsblock ausdrücklich darauf hin, welche Pfade lokal ersetzt werden müssen.
- Alle Komponenten verwenden dieselben festgelegten Werte. Wenn ein Exportordner in einem Skript definiert ist, müssen Automatisierung, Makro und Dokumentation denselben Ordner verwenden.
- Dynamische Namen und Datenformate sind vollständig zu erklären, zum Beispiel `Export-<Datum>.xlsx`, das erwartete Datumsformat und die Regel für Wochenenden oder Feiertage.
- Netzwerkpfade, Laufwerksbuchstaben, lokale Benutzerordner und zentrale Dateien werden mit Zweck, Zugriffsanforderung und einer lokalen Testalternative dokumentiert.
- Schreibende Schritte müssen benennen, welche Dateien oder Tabellen geändert werden, wie bestehende Daten geschützt werden und ob eine Sicherung erforderlich ist.
- Jede Konfiguration erhält eine Liste der anpassbaren Werte mit Bedeutung, Beispielwert, zulässigem Format und Verwendungsort.

## 6. Regeln für Code, Makros und Skripte

- Ausführbarer Code muss vollständig, formatiert und direkt kopierbar sein. Platzhalter im Code werden unmittelbar vor oder nach dem Block erklärt.
- Bei umfangreichem oder zentral gepflegtem Code wird keine unklare Kurzfassung gepflegt. Das Tutorial verweist stattdessen auf die versionierte Quelldatei, den eindeutigen Abschnitt und die Version beziehungsweise den Stand.
- Für jeden Codeblock wird erklärt, wo er eingefügt wird: Datei, Modul, Tabellenblatt, IDE, Flow oder Aktion. Beispiel: „Excel öffnen → `Alt + F11` → **Einfügen > Modul** → Code einfügen → als `.xlsm` speichern“.
- Abhängigkeiten zwischen Codeblöcken müssen sichtbar sein, etwa Hilfsmodule, Bibliotheken, Blattnamen, Umgebungsvariablen oder die erforderliche Makro-Reihenfolge.
- Jede Automatisierung beschreibt ihren Einstiegspunkt sowie die Reihenfolge der Subflows, Skripte oder Makros.
- Die Reihenfolge der Dateien und Makros innerhalb einer **Files & Codes**-Gruppe entspricht ihrer technischen Abhängigkeit beziehungsweise der späteren Ausführungsreihenfolge. Wird ein Makro mehrfach oder bedingt ausgeführt, muss dies im Tutorial sichtbar sein.
- Kommentare im Beispielcode dürfen die Anpassung erleichtern, aber keine vertraulichen Werte enthalten.

## 7. Regeln für Automatisierung und externe Systeme

- Für externe Systeme werden Anmeldung, benötigte Berechtigung, verwendete Transaktion beziehungsweise API, Eingabewerte, Exportformat und erwartetes Ergebnis beschrieben.
- Bei aufgezeichneten Automatisierungen muss erklärt werden, wie die Aufnahme erstellt, bereinigt, parametrisiert und stabil getestet wird.
- Für Power-Automate-Desktop- oder vergleichbare Flows werden Flowname, Subflows, Variablen, Aktionen, Fehlerbehandlung und Import- oder Einfügeweg dokumentiert.
- Für zeitgesteuerte Prozesse sind Scheduler, Zeitzone, Ausführungsfenster, Ausführungskonto, unbeaufsichtigte Ausführung und Konflikte mit manuellen Starts zu beschreiben.
- Jeder externe Aufruf benötigt eine erkennbare Erfolgskontrolle, etwa eine erzeugte Exportdatei, einen Rückgabewert, einen Logeintrag oder eine validierte Tabelle.

## 8. Test, Fehlerbehandlung und Betrieb

- Der erste Test darf keine produktiven Empfänger, Verteiler oder Datenbestände verändern. E-Mails gehen zunächst ausschließlich an eine eigene Testadresse oder einen freigegebenen Testverteiler.
- Das Tutorial definiert Testeingaben, erwartete Dateien, erwartete Tabellenwerte, erwartete E-Mail-Inhalte und sichtbare Erfolgsmeldungen.
- Ein End-to-End-Test prüft alle Stationen: Eingabe beziehungsweise Export, Verarbeitung, gespeicherte Ergebnisse, Übertragung und Benachrichtigung.
- Typische Fehlerfälle werden prozessbezogen dokumentiert, mindestens fehlende Berechtigung, nicht erreichbarer Pfad, fehlende oder gesperrte Datei, ungültige Eingabedaten und Fehler im externen System.
- Für jeden Fehlerfall enthält die Anleitung Erkennungsmerkmal, Ursache, Prüfung, Lösung und sicheren Wiederanlauf. Ein Wiederanlauf darf keine Daten doppelt übertragen oder E-Mails doppelt versenden.
- Speicherort und Inhalt von Logs, Runbooks oder Statusmeldungen werden genannt, falls der Prozess solche Informationen erzeugt.

## 9. Sicherheit und Datenschutz

- Kennwörter, Tokens, private E-Mail-Adressen, interne Serverdetails und sensible Geschäftsdaten gehören nicht in den Tutorialtext oder Beispielcode.
- Platzhalter und sichere Bezugswege verwenden, zum Beispiel „Zugang über das RPA-Team anfordern“ statt eines Kontos oder Passworts.
- Empfängerlisten, produktive Datenquellen und schreibende Zielsysteme sind vor dem Test klar als produktiv zu kennzeichnen.
- Das Tutorial beschreibt, welche Daten lokal gespeichert werden, wie lange sie benötigt werden und wie temporäre oder vertrauliche Dateien nach dem Test behandelt werden.

## 10. Abschluss- und Übergabecheckliste

Ein Tutorial ist erst vollständig, wenn alle folgenden Punkte mit **Ja** beantwortet werden können:

- [ ] Eine neue Person versteht Zweck, Auslöser, Systeme und Ergebnis des Prozesses.
- [ ] Alle Voraussetzungen können ohne Vorwissen geprüft und eingerichtet werden.
- [ ] Jede benötigte Datei, jeder Ordner und jeder konfigurierbare Wert ist beschrieben.
- [ ] Alle Skripte, Makros und Flow-Schritte sind vollständig verfügbar und an der richtigen Stelle einfügbar.
- [ ] Schlüsselwörter, Bedienhandlungen, technische Werte, Bilder, Listen und Codeblöcke verwenden die festgelegte Formatierung.
- [ ] PAD- und VBS-Blöcke erscheinen als Flow/RAW-Ansicht; VBA und anderer Code bleiben vollständig kopierbar.
- [ ] Jeder Bildhinweis verweist auf eine vorhandene Datei unter `images/` und ist auch ohne Vorschau verständlich.
- [ ] Die Gruppen folgen dem Standard: Überblick, Vorbereitung, Files & Codes, PAD-Flow, einzelne PAD-Subflows, Cloud, Testlauf und Dokumentation.
- [ ] Jede Datei, jedes Skript und jedes Makro nennt eindeutig die PAD-Aktion oder den Subflow, die beziehungsweise der es später verwendet.
- [ ] Lokale Pfade, Konten, E-Mail-Adressen und andere anpassbare Werte sind eindeutig als solche markiert.
- [ ] Die Ausführungsreihenfolge und Abhängigkeiten zwischen Komponenten sind klar.
- [ ] Ein sicherer Testlauf mit dokumentierten Soll-Ergebnissen ist möglich.
- [ ] Fehlerfälle, Logs, Wiederanlauf und Zuständigkeiten sind beschrieben.
- [ ] Eine zweite Person kann den Prozess ausschließlich anhand des Tutorials nachbauen und betreiben.

Wer ein neues Prozess-Tutorial erstellt oder wesentlich ändert, führt diese Checkliste vor der Veröffentlichung durch und ergänzt fehlende Informationen direkt im Tutorial.
