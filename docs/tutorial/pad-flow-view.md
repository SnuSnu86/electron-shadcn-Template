# PAD Flow View

## Überblick

Die PAD Flow View-Komponente bietet eine interaktive Darstellung von Power Automate Desktop (PAD) Code in Tutorial-Texten. Sie ermöglicht es Benutzern, zwischen einer visuellen Flow-Ansicht und dem rohen Code zu wechseln.

## Features

### Zwei Ansichtsmodi

1. **Flow-Ansicht** (Standard)
   - Visuelle Darstellung der PAD-Aktionen als farbcodierte Blöcke
   - Einrückungen für bedingte Verzweigungen
   - Icons für verschiedene Aktionstypen
   - Kurzbeschreibung jeder Aktion mit relevanten Details

2. **RAW-Ansicht**
   - Original PAD-Code
   - Syntax-Highlighting
   - Copy-to-Clipboard-Funktion

### Unterstützte PAD-Aktionen

Die Komponente erkennt und visualisiert folgende PAD-Aktionstypen:

- **Text-Konvertierung**: `Text.ConvertDateTimeToText`
- **Variablen**: `SET`
- **Kontrollstrukturen**: `IF`, `ELSE IF`, `END`
- **Datum/Zeit**: `DateTime.Add`
- **Subflows**: `CALL`
- **SAP**: `SAP.SapLogin`, `SAP.CloseSapConnection`, `Scripting.RunVBScript`
- **Verzögerung**: `WAIT`
- **Scripts**: `Scripting.RunVBScript`, `Scripting.RunPowershellScript`
- **Excel**: `Excel.LaunchExcel`, `Excel.RunMacro`, `Excel.CloseExcel`

## Verwendung

### Automatische Erkennung

Die `TutorialRichText`-Komponente erkennt automatisch PAD-Code in Markdown-Codeblöcken:

````markdown
```pad
SET Wochentag TO CurrentDateTime.DayOfWeek
IF Wochentag = Montag THEN
    CALL SAP_Process_BackToFriday
END
```
````

oder

````markdown
```vbs
Scripting.RunVBScript.RunVBScript VBScriptCode: $'''...''' ScriptOutput=> SAPProzess
```
````

### Heuristische Erkennung

Codeblöcke ohne explizites `pad`- oder `vbs`-Tag werden automatisch als PAD-Code erkannt, wenn sie folgende Muster enthalten:

- `SET`, `IF`, `ELSE`, `END`, `WAIT`, `CALL`
- PAD-Namespaces: `Text.`, `DateTime.`, `Excel.`, `SAP.`, `Scripting.`
- PAD-typische Syntax: `=>`

## Architektur

### Komponenten

1. **`parse-pad-code.ts`**
   - Parser für PAD-Code
   - Extrahiert strukturierte Aktionen aus rohem Code
   - Erkennt Aktionstypen, Parameter und Einrückungen

2. **`tutorial-pad-flow.tsx`**
   - React-Komponente für die Darstellung
   - Tabs für Ansichtswechsel
   - Flow-Blöcke mit Icons und Farben
   - Copy-Button für RAW-Code

3. **`tutorial-rich-text.tsx`**
   - Integration in Tutorial-System
   - Automatische Erkennung von PAD-Codeblöcken
   - Rendering der entsprechenden Komponente

### Datenfluss

```
Markdown-Code
    ↓
TutorialRichText (Erkennung)
    ↓
TutorialPadFlow (Darstellung)
    ↓
parsePadCode (Parsing)
    ↓
PadAction[] (strukturiert)
    ↓
FlowView / RawView (Rendering)
```

## Farbcodierung

Jeder Aktionstyp hat eine eindeutige Farbe:

- **Variablen & Text**: Blau/Lila
- **Datum/Zeit**: Cyan
- **Verzweigungen**: Bernstein
- **Subflows**: Grün
- **SAP**: Orange
- **Excel**: Smaragd/Türkis
- **Scripts**: Indigo/Dunkelblau
- **Wartezeit**: Grau

## Erweiterung

### Neue Aktionstypen hinzufügen

1. **Type erweitern** in `parse-pad-code.ts`:
   ```typescript
   export type PadActionType =
     | "existing-type"
     | "new-action-type";
   ```

2. **Parser-Funktion erstellen**:
   ```typescript
   function parseNewAction(trimmed: string, context: ParseContext): boolean {
     if (!trimmed.startsWith("NewAction.")) {
       return false;
     }
     // ... Parsing-Logik
     context.actions.push({
       type: "new-action-type",
       label: "Neue Aktion",
       details: "Details hier",
       indentLevel: context.indentLevel,
       rawCode: trimmed,
     });
     return true;
   }
   ```

3. **In `parseLine` aufrufen**:
   ```typescript
   if (parseNewAction(trimmed, context)) {
     return;
   }
   ```

4. **Icon und Farbe definieren** in `tutorial-pad-flow.tsx`:
   ```typescript
   const ACTION_ICONS: Record<PadActionType, LucideIcon> = {
     ...
     "new-action-type": NewIcon,
   };

   const ACTION_COLORS: Record<PadActionType, string> = {
     ...
     "new-action-type": "bg-color-500/10 border-color-500/30 ...",
   };
   ```

5. **Test hinzufügen** in `parse-pad-code.test.ts`

## Testing

```bash
npm test -- src/tests/unit/parse-pad-code.test.ts
```

Die Tests decken alle unterstützten Aktionstypen ab, inkl. komplexer Szenarien mit Verzweigungen und Einrückungen.
