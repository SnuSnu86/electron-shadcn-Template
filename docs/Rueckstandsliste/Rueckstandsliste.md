Prozessdokumentation:

**Rueckstandsliste**

ℹ️ **Hinweis zur Dokumentation:**

Diese Dokumentation beschreibt den automatisierten Prozess zur Erstellung und Verteilung der täglichen Rückstandslisten.

Die Rückstandsliste basiert auf einem SAP-Export, der über Power Automate Desktop erzeugt wird. Die weitere Aufbereitung erfolgt in Excel über VBA-Makros in der Datei **Rückstandsliste Rechner.xlsm**.

Die Detailquellen zu dieser Dokumentation sind:

- [MakrosRSL.md](MakrosRSL.md): VBA-Makros der Datei **Rückstandsliste Rechner.xlsm**
- [PAD-Rueckstandsliste.md](PAD-Rueckstandsliste.md): Power Automate Desktop Flow für die Rückstandsliste

# 1. Überblick

Der automatisierte Prozess erstellt täglich Rückstandslisten für mehrere Logistikbereiche. Dazu werden offene bzw. rückständige SAP-Daten exportiert, in Excel eingelesen, nach Lager- bzw. Prozessbereichen getrennt und als einzelne Excel-Dateien gespeichert.

Im Anschluss werden Kommentare aus den jeweiligen Vortagsdateien übernommen und eine E-Mail mit Links zu den erzeugten Rückstandslisten versendet.

**Verantwortliche Systeme:**

- Power Automate Desktop (Prozesssteuerung)
- SAP S/4 HANA / SAP GUI Scripting (Datenquelle und Export)
- Microsoft Excel mit VBA-Makros (Aufbereitung, Dateierzeugung, Kommentarübernahme)
- Microsoft Outlook (E-Mail-Versand)

# 2. Prozessarchitektur

Der Flow besteht aus drei Subflows, die nacheinander ausgeführt werden:

Main  
├── SAP Login  
├── SAP Scripting  
└── Create RL  
&nbsp;&nbsp;&nbsp;&nbsp;├── DatenkopierenSAP  
&nbsp;&nbsp;&nbsp;&nbsp;├── RSl_create1_1_vom_Geschäft  
&nbsp;&nbsp;&nbsp;&nbsp;├── ÜbertrageKommentareAllInOne  
&nbsp;&nbsp;&nbsp;&nbsp;└── CreateEmailWithLinks

# 3. Subflow-Beschreibungen

## 3.1 Subflow: Main

**Zweck:**

Einstiegspunkt des Power Automate Desktop Prozesses.

**Ablauf:**

1. Ruft **SAP Login** auf
2. Ruft **SAP Scripting** auf
3. Ruft **Create RL** auf

## 3.2 Subflow: SAP Login

**Zweck:**

Öffnet die SAP-Verbindung für den Prozess.

**Ablauf:**

- Anmeldung per SAP SSO
- System: **10: PS4 - Production S/4 HANA**
- Mandant: **009**
- Benutzer: **5100LSS1**
- Sprache: **DE**

## 3.3 Subflow: SAP Scripting

**Zweck:**

Führt den SAP-Bericht aus und exportiert die Rückstandsdaten als Excel-Datei.

**Ablauf:**

- Aktuelles Datum wird ermittelt und als Kurzdatum formatiert
- SAP GUI Scripting verbindet sich mit der offenen SAP-Session
- Favorit bzw. Bericht wird über den SAP-Baum geöffnet
- Variante/Layout wird ausgewählt
- Selektionsdatum wird in Feld `S_LDDAT-LOW` eingetragen
- Bericht wird ausgeführt
- ALV-Layout wird ausgewählt
- Export wird als Excel-Datei gestartet
- Exportpfad wird gesetzt auf:

```text
C:\Users\5100LSS1\Documents\Rueckstandsliste
```

- Nach dem Export werden Excel-Prozesse beendet
- SAP-Verbindung wird geschlossen

**Exportname im PAD Flow:**

```text
rsl-<Datum>
```

**Wichtiger Hinweis:**

Das Makro `DatenkopierenSAP` erwartet aktuell die Datei:

```text
C:\TEMP\EXPORT.XLSX
```

Der PAD-Exportpfad und der im Makro verwendete Importpfad müssen deshalb in der produktiven Umgebung zueinander passen. Wenn SAP den Export nicht automatisch als `EXPORT.XLSX` unter `C:\TEMP` bereitstellt, muss einer der beiden Pfade angepasst werden.

## 3.4 Subflow: Create RL

**Zweck:**

Öffnet die Excel-Datei **Rückstandsliste Rechner.xlsm** und führt die VBA-Makros zur Erstellung, Kommentierung und Verteilung der Rückstandslisten aus.

**Excel-Datei:**

```text
C:\Users\5100LSS1\OneDrive - Lapp\Desktop\RPA\Rückstandsliste\Rückstandsliste Rechner.xlsm
```

**Ablauf:**

1. Excel-Datei öffnen
2. Makro `DatenkopierenSAP` ausführen
3. Makro `RSl_create1_1_vom_Geschäft` ausführen
4. Makro `ÜbertrageKommentareAllInOne` ausführen
5. Makro `CreateEmailWithLinks` ausführen
6. Excel-Datei schließen

# 4. Excel-Makros

## 4.1 Makro: DatenkopierenSAP

**Zweck:**

Importiert den SAP-Export in die Arbeitsmappe **Rückstandsliste Rechner.xlsm**.

**Ablauf:**

- Prüft, ob `EXPORT.XLSX` bereits geöffnet ist
- Schließt die Datei ohne Speichern, falls sie offen ist
- Öffnet:

```text
C:\TEMP\EXPORT.XLSX
```

- Verwendet das Arbeitsblatt `Sheet1`
- Kopiert den Bereich `A1:AN15000`
- Fügt die Daten in `Tabelle1!A1` der aktuellen Arbeitsmappe ein
- Schließt die Exportdatei
- Löscht die Exportdatei aus `C:\TEMP`

## 4.2 Makro: RSl_create1_1_vom_Geschäft

**Zweck:**

Erzeugt aus den SAP-Daten separate Rückstandslisten pro Bereich und speichert diese als Tagesdateien.

**Quellblatt:**

```text
Tabelle1
```

**Erzeugte Arbeitsblätter:**

| Arbeitsblatt | Bereich |
| ------------ | ------- |
| `510`        | LC1 |
| `511`        | LC3 |
| `512`        | LC6 |
| `SDCH`       | SDCH |
| `KIAA`       | KIAA |
| `590`        | LC9 |

**Relevante SAP-Spalten im Makro:**

| Variable | Spalte | Bedeutung |
| -------- | ------ | --------- |
| `suchColLdat` | 3 | Liefer-/Ladedatum |
| `suchColLtime` | 4 | Liefer-/Ladezeit |
| `suchColVB` | 8 | Vertriebsbereich / Kennzeichen |
| `suchColLagnum` | 40 | Lagernummer |

**Filterlogik:**

| Zielbereich | Bedingung |
| ----------- | --------- |
| LC1 / `510` | Lagernummer `510` oder `513`, VB ungleich `02`, Datum kleiner heute; zusätzlich Zeilen ohne Lagernummer und VB ungleich `02` |
| LC3 / `511` | Lagernummer `511`, VB ungleich `02`, Datum kleiner heute; zusätzlich heutige Einträge bis `03:00:00` |
| LC6 / `512` | Lagernummer `512`, VB ungleich `02`, Datum kleiner heute |
| SDCH | Lagernummer `514` oder `515`, VB ungleich `02`, Datum kleiner heute |
| LC9 / `590` | Lagernummer `590`, VB ungleich `02`, Datum kleiner heute |
| KIAA | VB gleich `02`, Datum kleiner heute |

**Besonderheit LC3:**

LC3 übernimmt zusätzlich Rückstände vom aktuellen Tag, wenn die Uhrzeit kleiner oder gleich `03:00:00` ist.

**Dateinamen:**

Die erzeugten Dateien werden mit aktuellem Tagesdatum gespeichert:

```text
yyyy-mm-dd TAKI1 Rückstandsliste <Bereich>.xlsx
```

Beispiele:

```text
2026-06-27 TAKI1 Rückstandsliste LC1.xlsx
2026-06-27 TAKI1 Rückstandsliste LC3.xlsx
2026-06-27 TAKI1 Rückstandsliste LC6.xlsx
2026-06-27 TAKI1 Rückstandsliste LC9.xlsx
2026-06-27 TAKI1 Rückstandsliste KIAA.xlsx
```

**Aktuell verwendete lokale Speicherpfade im Makro:**

```text
C:\Users\jozi1\OneDrive - Lapp\Desktop\Projekte\RPA\Rückstandsliste\GJ 2324\LC1
C:\Users\jozi1\OneDrive - Lapp\Desktop\Projekte\RPA\Rückstandsliste\GJ 2324\LC3
C:\Users\jozi1\OneDrive - Lapp\Desktop\Projekte\RPA\Rückstandsliste\GJ 2324\LC6
C:\Users\jozi1\OneDrive - Lapp\Desktop\Projekte\RPA\Rückstandsliste\GJ 2324\LC9
C:\Users\jozi1\OneDrive - Lapp\Desktop\Projekte\RPA\Rückstandsliste\GJ 2324\KIAA
```

**Im Code als Netzwerkziel auskommentiert:**

```text
G:\UIL-CL-Zentral\04 Statistiken & Auswertungen\01 Statistiken\Rückstandsliste und Reporting\GJ 2223\<Bereich>
```

## 4.3 Formatierung und Kommentarliste

Beim Erstellen der einzelnen Bereichsdateien wird je Datei eine versteckte Hilfstabelle angelegt. Diese enthält eine Liste zulässiger Kommentargründe.

Die Hauptliste erhält:

- Spalte `J` als Kommentarspalte
- Datenvalidierung mit Dropdown aus der versteckten Hilfstabelle
- Autofit für Spalten und Zeilen
- Farbige Kopfzeile
- Autofilter

**Typische Kommentarwerte:**

- Abschluss auf Abruf
- Ausfall SAP/ITM/Citrix
- Ausfall Technik
- Betrifft anderes LC
- Eingriff durch Vertrieb
- Falsche Terminierung
- Fehlerhafte WE-Buchung
- Kommitermin verpasst
- Schneidtermin verpasst
- TA-Generierung zu spät
- Ware in Q-Sperre
- Ware physisch nicht auffindbar
- Zu spät eingelagert
- In Klärung

Die Kommentarliste ist je Bereich teilweise unterschiedlich. LC3 enthält z. B. zusätzliche Gründe wie `Trommelfixierung`, `Warenausgangsprüfung`, `Falsches Material` und `Mengendifferenz`.

## 4.4 Makros: ÜbertrageKommentareLC1 / LC3 / LC6 / LC9 / KIAA

**Zweck:**

Übernimmt vorhandene Kommentare aus der jeweiligen Vortagsdatei in die neu erzeugte Tagesdatei.

**Ablauf je Bereich:**

- Aktuelles Datum wird als `yyyy-mm-dd` formatiert
- Vortagsdatum wird berechnet:
  - Montag: aktuelles Datum minus 3 Tage
  - Dienstag bis Sonntag: aktuelles Datum minus 1 Tag
- Aktuelle Datei wird geöffnet
- Vortagsdatei wird geöffnet
- Zeilen werden über Spalte `I` verglichen
- Bei Übereinstimmung wird der Kommentar aus Spalte `J` der Vortagsdatei in Spalte `J` der aktuellen Datei übernommen
- Vortagsdatei wird ohne Speichern geschlossen
- Aktuelle Datei wird gespeichert und geschlossen

**Vergleichsschlüssel:**

```text
Spalte I
```

**Kommentarspalte:**

```text
Spalte J
```

## 4.5 Makro: ÜbertrageKommentareAllInOne

**Zweck:**

Führt die Kommentarübernahme für alle relevanten Bereiche gesammelt aus.

**Aufgerufene Makros:**

- `ÜbertrageKommentareLC1`
- `ÜbertrageKommentareLC3`
- `ÜbertrageKommentareLC6`
- `ÜbertrageKommentareLC9`
- `ÜbertrageKommentareKIAA`

## 4.6 Makro: CreateEmailWithLinks

**Zweck:**

Erstellt und versendet eine Outlook-E-Mail mit Links zu den erzeugten Rückstandslisten.

**Ablauf:**

- Outlook wird gestartet bzw. verwendet
- Ordner für KIAA, LC1, LC3, LC6 und LC9 werden durchsucht
- Es werden Dateien gesucht, deren Name das aktuelle Datum enthält
- Für jede gefundene Datei wird ein Hyperlink in den E-Mail-Body geschrieben
- E-Mail wird direkt versendet

**Betreff:**

```text
Rückstandsliste
```

**Aktueller Empfänger im Makro:**

```text
Johann.Zimmer@lapp.com
```

**E-Mail-Text:**

```text
Hallo,

anbei die heutige Rückstandsliste, bitte bearbeiten:
```

# 5. Gesamtprozess-Flussdiagramm

[Power Automate startet]  
│  
▼  
[SAP Login]  
→ SAP PS4 Production S/4 HANA öffnen  
→ Mandant 009, Benutzer 5100LSS1  
│  
▼  
[SAP Scripting]  
→ Aktuelles Datum ermitteln  
→ SAP-Bericht/Favorit öffnen  
→ Selektionsdatum eintragen  
→ Bericht ausführen  
→ Layout auswählen  
→ Excel-Export erzeugen  
→ Export nach `C:\Users\5100LSS1\Documents\Rueckstandsliste` speichern  
→ Excel-Prozesse beenden  
→ SAP schließen  
│  
▼  
[Create RL]  
→ `Rückstandsliste Rechner.xlsm` öffnen  
│  
├─► `DatenkopierenSAP`  
│   → SAP-Export öffnen  
│   → Daten nach `Tabelle1` kopieren  
│  
├─► `RSl_create1_1_vom_Geschäft`  
│   → Daten nach LC1, LC3, LC6, LC9, KIAA und SDCH filtern  
│   → Tagesdateien je Bereich erzeugen  
│   → Kommentarspalte und Dropdownlisten einrichten  
│  
├─► `ÜbertrageKommentareAllInOne`  
│   → Kommentare aus Vortagsdateien übernehmen  
│  
└─► `CreateEmailWithLinks`  
    → Outlook-Mail mit Links auf Tagesdateien erstellen  
    → E-Mail versenden  
│  
▼  
[Excel schließen]  
[Prozess beendet]

# 6. Abhängigkeiten & Voraussetzungen

| Komponente | Anforderung |
| ---------- | ----------- |
| SAP GUI Scripting | Muss aktiviert sein |
| SAP-Benutzer | Benutzer `5100LSS1` benötigt Zugriff auf den verwendeten SAP-Bericht |
| SAP-System | PS4 Production S/4 HANA, Mandant 009 |
| Lokaler Exportpfad PAD | `C:\Users\5100LSS1\Documents\Rueckstandsliste` muss erreichbar sein |
| Lokaler Importpfad Makro | `C:\TEMP\EXPORT.XLSX` muss zum tatsächlichen SAP-Export passen |
| Excel-Datei | `Rückstandsliste Rechner.xlsm` muss am im PAD Flow definierten Pfad vorhanden sein |
| Ausgabeordner | Bereichsordner für LC1, LC3, LC6, LC9 und KIAA müssen vorhanden sein |
| Outlook | Muss installiert und mit einem sendefähigen Profil eingerichtet sein |
| Dateizugriff | Benutzer benötigt Schreibrechte auf Export-, Arbeits- und Zielordner |

# 7. Hinweise

| # | Thema | Beschreibung |
| - | ----- | ------------ |
| 1 | Pfadabweichung PAD/Makro | PAD exportiert nach `C:\Users\5100LSS1\Documents\Rueckstandsliste`, das Makro liest aber `C:\TEMP\EXPORT.XLSX`. Diese Pfade müssen produktiv abgestimmt sein. |
| 2 | Benutzergebundene Pfade | Mehrere Makros enthalten lokale Pfade unter `C:\Users\jozi1\...`; der PAD Flow öffnet dagegen eine Datei unter `C:\Users\5100LSS1\...`. Für den Bot-Betrieb sollten die Pfade vereinheitlicht werden. |
| 3 | Geschäftsjahr | Die Ausgabepfade zeigen aktuell auf `GJ 2324`. Bei Geschäftsjahreswechsel müssen die Pfade angepasst werden. |
| 4 | Netzwerkpfade | Im Makro sind frühere `G:\UIL-CL-Zentral\...` Pfade auskommentiert. Falls die produktive Ablage auf Netzlaufwerken erfolgen soll, müssen diese Pfade aktiviert bzw. aktualisiert werden. |
| 5 | Feiertagslogik | Die Kommentarübernahme berücksichtigt nur Montag als Sonderfall. Feiertage werden nicht gesondert behandelt. |
| 6 | Fehlerbehandlung | Einige Makros nutzen `On Error Resume Next`. Dadurch können fehlende Dateien oder Ordner teilweise erst später auffallen. |
| 7 | Direkter Mailversand | `CreateEmailWithLinks` verwendet `.Send`; die E-Mail wird ohne manuelle Prüfung direkt versendet. |
| 8 | SDCH | SDCH wird im Erzeugungsmakro gefiltert, ist aber nicht in der Kommentarübernahme und nicht im E-Mail-Linkversand enthalten. |

# 8. Involvierte Dateien & Pfade

| Datei / Pfad | Typ | Zweck |
| ------------ | --- | ----- |
| `C:\Users\5100LSS1\Documents\Rueckstandsliste` | Lokal | PAD SAP-Exportziel |
| `C:\TEMP\EXPORT.XLSX` | Lokal | Vom Makro erwartete SAP-Exportdatei |
| `C:\Users\5100LSS1\OneDrive - Lapp\Desktop\RPA\Rückstandsliste\Rückstandsliste Rechner.xlsm` | Lokal/OneDrive | Hauptdatei für Makroausführung |
| `C:\Users\jozi1\OneDrive - Lapp\Desktop\Projekte\RPA\Rückstandsliste\GJ 2324\LC1` | Lokal/OneDrive | Ablage Rückstandsliste LC1 |
| `C:\Users\jozi1\OneDrive - Lapp\Desktop\Projekte\RPA\Rückstandsliste\GJ 2324\LC3` | Lokal/OneDrive | Ablage Rückstandsliste LC3 |
| `C:\Users\jozi1\OneDrive - Lapp\Desktop\Projekte\RPA\Rückstandsliste\GJ 2324\LC6` | Lokal/OneDrive | Ablage Rückstandsliste LC6 |
| `C:\Users\jozi1\OneDrive - Lapp\Desktop\Projekte\RPA\Rückstandsliste\GJ 2324\LC9` | Lokal/OneDrive | Ablage Rückstandsliste LC9 |
| `C:\Users\jozi1\OneDrive - Lapp\Desktop\Projekte\RPA\Rückstandsliste\GJ 2324\KIAA` | Lokal/OneDrive | Ablage Rückstandsliste KIAA |
| `G:\UIL-CL-Zentral\04 Statistiken & Auswertungen\01 Statistiken\Rückstandsliste und Reporting\...` | Netzwerk | Historisch bzw. alternativ vorgesehene Ablage |

# 9. Power Automate Flow Raw

Der vollständige Raw-Code des Power Automate Desktop Flows ist in [PAD-Rueckstandsliste.md](PAD-Rueckstandsliste.md) dokumentiert.

**Subflows:**

- `Main`
- `SAP Login`
- `SAP Scripting`
- `Create RL`

**Makro-Reihenfolge im Subflow `Create RL`:**

```text
DatenkopierenSAP
RSl_create1_1_vom_Geschäft
ÜbertrageKommentareAllInOne
CreateEmailWithLinks
```

# 10. VBA-Makroquellen

Die vollständigen VBA-Makros sind in [MakrosRSL.md](MakrosRSL.md) dokumentiert.

**Wesentliche Makros:**

- `DatenkopierenSAP`
- `Spaltenbreite_Anpassen`
- `RSl_create1_1_vom_Geschäft`
- `ÜbertrageKommentareLC1`
- `ÜbertrageKommentareLC3`
- `ÜbertrageKommentareLC6`
- `ÜbertrageKommentareLC9`
- `ÜbertrageKommentareKIAA`
- `ÜbertrageKommentareAllInOne`
- `CreateEmailWithLinks`
