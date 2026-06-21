# PAD-Flow: Datumsaktion und Bedingungsfarbe

## Ziel

Der Flow-Renderer soll `DateTime.GetCurrentDateTime.Local` als verständliche PAD-Aktion darstellen und `END` als Teil derselben Bedingungsgruppe wie `IF` und `ELSE IF` kennzeichnen.

## Umsetzung

- `parse-pad-code.ts` erhält den Aktionstyp `get-current-datetime`.
- Die Parserregel erkennt `DateTime.GetCurrentDateTime.Local`, extrahiert Format und Ergebnisvariable und erzeugt die Beschriftung „Aktuelles Datum und Uhrzeit abrufen“.
- Der Renderer ordnet dem neuen Typ ein Uhr-Symbol und die bestehende Cyan-Farbgebung für Datumsaktionen zu.
- Der Aktionstyp `end` verwendet dieselbe Bernstein-Farbklasse wie `if-condition` und `else-if-condition`.

## Tests

- Ein Parser-Test prüft Typ, Beschriftung und Details der neuen PAD-Zeile.
- Ein UI-Test prüft, dass die `END`-Karte die Bernstein-Farbklasse erhält.
