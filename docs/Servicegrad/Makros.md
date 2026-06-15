# Excel Makros für Servicegrad

## SGrechner

```vba
Sub SGrechner()
    Dim rng As Range
    Dim cell As Range
    Dim dict As Object
    Dim uniqueCount As Long
' Makro1 Makro
    'Makroausfürung im Hintergrund - ANFANG
    Application.ScreenUpdating = False
    
    'Auswertung der Grunddaten
    Range("R5").Select
    ActiveCell.FormulaR1C1 = _
    "=IF(RC[-1]="""","""",IF(ISBLANK(RC[-7]),""Nicht Erreicht"",IF(RC[-11]=RC[-7],IF(RC[-10]>RC[-6],""Erreicht"",""Nicht Erreicht""),IF(RC[-11]>RC[-7],""Erreicht"",""Nicht Erreicht""))))"
        
        Range("R5").Select
        Selection.AutoFill Destination:=Range("R5:R20000"), Type:=xlFillDefault
            
            Range("R5:R20000").Select
            ActiveWindow.SmallScroll Down:=12
            
    'Erstellung Servicegrad
    Sheets("Tabelle2").Select
    
    'Erstellung der Tabelle
    Range("B12").Select
    ActiveCell.FormulaR1C1 = "KalJahr/Monat"
    
    Range("C12").Select
    ActiveCell.FormulaR1C1 = "Lagernummer"
    
        Range("E12").Select
        ActiveCell.FormulaR1C1 = "Kalendertag"
        
            Range("F12").Select
            ActiveCell.FormulaR1C1 = "Servicegrad"
            
                Range("G12").Select
                ActiveCell.FormulaR1C1 = "Anz." & Chr(10) & "Lieferungsunterpositionen"
                            
                    Range("H12").Select
                    ActiveCell.FormulaR1C1 = "Anz." & Chr(10) & "Lieferunterpositionen erreicht"
                                            
                        Range("I12").Select
                        ActiveCell.FormulaR1C1 = "Anz." & Chr(10) & "Lieferunterpositionen nicht erreicht"
                        
                            Range("J12").Select
                            ActiveCell.FormulaR1C1 = "Anz." & Chr(10) & "Lieferungen"
                            
                                Range("B20").Select
                                ActiveCell.FormulaR1C1 = "Sobald der Zielwert von 98,5% unterschritten wird, müssen entsprechende Maßnahmen abgeleitet werden."
                        
                            Range("B12:J12,B13:E18").Select
                            With Selection
                                .HorizontalAlignment = xlLeft
                            End With
                            
                                Range("F13:F18").Select
                                With Selection
                                    .HorizontalAlignment = xlCenter
                                End With
                            
                                    Range("G13:J18").Select
                                    With Selection
                                        .HorizontalAlignment = xlRight
                                    End With
                            
                                        Range("B12:J12").Select
                                        With Selection.Interior
                                            .Pattern = xlSolid
                                            .PatternColorIndex = xlAutomatic
                                            .Color = RGB(190, 190, 190)   ' Hier können Sie die RGB-Werte einstellen
                                            .TintAndShade = 0
                                            .PatternTintAndShade = 0
                                            End With
                            
                                            Range("B18:J18").Select
                                            With Selection.Interior
                                                .Pattern = xlSolid
                                                .PatternColorIndex = xlAutomatic
                                                .Color = RGB(255, 140, 0)   ' Hier können Sie die RGB-Werte einstellen
                                                .TintAndShade = 0
                                                .PatternTintAndShade = 0
                                            End With
                                            
                                            Range("B13:E17").Select
                                                With Selection.Interior
                                                .Pattern = xlSolid
                                                .PatternColorIndex = xlAutomatic
                                                .Color = RGB(190, 190, 190)   ' Hier können Sie die RGB-Werte einstellen
                                                .TintAndShade = 0
                                                .PatternTintAndShade = 0
                                                End With

    'Erstellung Rahmen
    Range("B12:J18").Select
    Selection.Borders(xlDiagonalDown).LineStyle = xlNone
    Selection.Borders(xlDiagonalUp).LineStyle = xlNone
    With Selection.Borders(xlEdgeLeft)
        .LineStyle = xlContinuous
        .ColorIndex = xlAutomatic
        .TintAndShade = 0
        .Weight = xlThin
    End With
    With Selection.Borders(xlEdgeTop)
        .LineStyle = xlContinuous
        .ColorIndex = xlAutomatic
        .TintAndShade = 0
        .Weight = xlThin
    End With
    With Selection.Borders(xlEdgeBottom)
        .LineStyle = xlContinuous
        .ColorIndex = xlAutomatic
        .TintAndShade = 0
        .Weight = xlThin
    End With
    With Selection.Borders(xlEdgeRight)
        .LineStyle = xlContinuous
        .ColorIndex = xlAutomatic
        .TintAndShade = 0
        .Weight = xlThin
    End With
    With Selection.Borders(xlInsideVertical)
        .LineStyle = xlContinuous
        .ColorIndex = xlAutomatic
        .TintAndShade = 0
        .Weight = xlThin
    End With
    With Selection.Borders(xlInsideHorizontal)
        .LineStyle = xlContinuous
        .ColorIndex = xlAutomatic
        .TintAndShade = 0
        .Weight = xlThin
    End With

    'Servicegradberechnung LC1
    ' Erstellen Sie ein Dictionary-Objekt
    Set dict = CreateObject("Scripting.Dictionary")

    ' Definieren Sie den Bereich
    Set rng = ThisWorkbook.Sheets("Tabelle1").Range("C5:C20000")

    ' Gehe durch jede Zelle im Bereich
    For Each cell In rng
        ' Prüfen Sie die Bedingungen in den Spalten B und C
        If cell.Offset(0, -2).Value = 5100 And (cell.Offset(0, -1).Value = 1000 Or cell.Offset(0, -1).Value = 1001) Then
            ' Prüfen Sie, ob die Zelle bereits im Dictionary vorhanden ist
            If Not dict.Exists(cell.Value) Then
                ' Wenn nicht, fügen Sie sie zum Dictionary hinzu und erhöhen Sie den Zähler für die einzigartigen Werte
                dict.Add cell.Value, cell.Value
                uniqueCount = uniqueCount + 1
            End If
        End If
    Next cell

    ' Schreiben Sie das Ergebnis in die Zelle J13 von Tabelle4
    ThisWorkbook.Sheets("Tabelle4").Range("J13").Value = uniqueCount
    
    
    Range("B13").Select
    ActiveCell.FormulaR1C1 = "=RC[3]"
    Selection.NumberFormat = "[$-407]mmm/ yy;@"
        Range("C13").Select
        ActiveCell.FormulaR1C1 = "510"
            Range("D13").Select
            ActiveCell.FormulaR1C1 = "WM Stuttgart LC1"
                Range("E13").Select
                ActiveCell.FormulaR1C1 = "=Tabelle1!R[-11]C[-2]"
                    Range("F13").Select
                    ActiveCell.FormulaR1C1 = "=RC[2]/RC[1]"
                    Selection.NumberFormat = "0.00%"
                        Range("G13").Select
                        ActiveCell.FormulaR1C1 = "=SUM(RC[1],RC[2])"
                            Range("H13").Select
                            ActiveCell.FormulaR1C1 = _
                            "=SUM(COUNTIFS(Tabelle1!R5C1:R20000C1,""5100"",Tabelle1!R5C2:R20000C2,""1000"",Tabelle1!R5C18:R20000C18,""Erreicht""),(COUNTIFS(Tabelle1!R5C1:R20000C1,""5100"",Tabelle1!R5C2:R20000C2,""2002"",Tabelle1!R5C18:R20000C18,""Erreicht"")),(COUNTIFS(Tabelle1!R5C1:R20000C1,""5100"",Tabelle1!R5C2:R20000C2,""1001"",Tabelle1!R5C18:R20000C18,""Erreicht"")))"
                                Range("I13").Select
                                ActiveCell.FormulaR1C1 = _
                                "=SUM(COUNTIFS(Tabelle1!R5C1:R20000C1,""5100"",Tabelle1!R5C2:R20000C2,""1000"",Tabelle1!R5C18:R20000C18,""Nicht Erreicht""),(COUNTIFS(Tabelle1!R5C1:R20000C1,""5100"",Tabelle1!R5C2:R20000C2,""2002"",Tabelle1!R5C18:R20000C18,""Nicht Erreicht"")),(COUNTIFS(Tabelle1!R5C1:R20000C1,""5100"",Tabelle1!R5C2:R20000C2,""1001"",Tabelle1!R5C18:R20000C18,""Nicht Erreicht"")))"
                                               
    'Servicegradberechnung LC6
    ' Zurücksetzen des Zählers und des Dictionaries
    uniqueCount = 0
    Set dict = CreateObject("Scripting.Dictionary")

    ' Gehe durch jede Zelle im Bereich erneut
    For Each cell In rng
        ' Prüfen Sie die Bedingungen in den Spalten B und C
        If cell.Offset(0, -2).Value = 5100 And cell.Offset(0, -1).Value = 1010 Then
            ' Prüfen Sie, ob die Zelle bereits im Dictionary vorhanden ist
            If Not dict.Exists(cell.Value) Then
                ' Wenn nicht, fügen Sie sie zum Dictionary hinzu und erhöhen Sie den Zähler für die einzigartigen Werte
                dict.Add cell.Value, cell.Value
                uniqueCount = uniqueCount + 1
            End If
        End If
    Next cell

    ' Schreiben Sie das Ergebnis in die Zelle J14 von Tabelle4
    ThisWorkbook.Sheets("Tabelle2").Range("J14").Value = uniqueCount
    
    
    Range("B14").Select
    ActiveCell.FormulaR1C1 = "=R[-1]C[3]"
    Selection.NumberFormat = "[$-407]mmm/ yy;@"
        Range("C14").Select
        ActiveCell.FormulaR1C1 = "512"
            Range("D14").Select
            ActiveCell.FormulaR1C1 = "WM Ludwigsburg LC6"
                Range("E14").Select
                ActiveCell.FormulaR1C1 = "=R[-1]C"
                    Range("F14").Select
                    ActiveCell.FormulaR1C1 = "=RC[2]/RC[1]"
                    Selection.NumberFormat = "0.00%"
                        Range("G14").Select
                        ActiveCell.FormulaR1C1 = "=SUM(RC[1],RC[2])"
                            Range("H14").Select
                            ActiveCell.FormulaR1C1 = _
                            "=SUM(COUNTIFS(Tabelle1!R5C1:R20000C1,""5100"",Tabelle1!R5C2:R20000C2,""1010"",Tabelle1!R5C18:R20000C18,""Erreicht""),(COUNTIFS(Tabelle1!R5C1:R20000C1,""5100"",Tabelle1!R5C2:R20000C2,""2010"",Tabelle1!R5C18:R20000C18,""Erreicht"")))"
                                Range("I14").Select
                                ActiveCell.FormulaR1C1 = _
                                "=SUM(COUNTIFS(Tabelle1!R5C1:R20000C1,""5100"",Tabelle1!R5C2:R20000C2,""1010"",Tabelle1!R5C18:R20000C18,""Nicht Erreicht""),(COUNTIFS(Tabelle1!R5C1:R20000C1,""5100"",Tabelle1!R5C2:R20000C2,""2010"",Tabelle1!R5C18:R20000C18,""Nicht Erreicht"")))"
    
    'Servicegradberechnung LC3
    ' Zurücksetzen des Zählers und des Dictionaries
    uniqueCount = 0
    Set dict = CreateObject("Scripting.Dictionary")

    ' Gehe durch jede Zelle im Bereich erneut
    For Each cell In rng
        ' Prüfen Sie die Bedingungen in den Spalten B und C
        If cell.Offset(0, -2).Value = 5110 And cell.Offset(0, -1).Value = 1000 Then
            ' Prüfen Sie, ob die Zelle bereits im Dictionary vorhanden ist
            If Not dict.Exists(cell.Value) Then
                ' Wenn nicht, fügen Sie sie zum Dictionary hinzu und erhöhen Sie den Zähler für die einzigartigen Werte
                dict.Add cell.Value, cell.Value
                uniqueCount = uniqueCount + 1
            End If
        End If
    Next cell

    ' Schreiben Sie das Ergebnis in die Zelle J15 von Tabelle2
    ThisWorkbook.Sheets("Tabelle2").Range("J15").Value = uniqueCount
    
    Range("B15").Select
    ActiveCell.FormulaR1C1 = "=R[-2]C[3]"
    Selection.NumberFormat = "[$-407]mmm/ yy;@"
        Range("C15").Select
        ActiveCell.FormulaR1C1 = "511"
                Range("D15").Select
                ActiveCell.FormulaR1C1 = "WM Hannover LC3"
                    Range("E15").Select
                    ActiveCell.FormulaR1C1 = "=R[-2]C"
                        Range("F15").Select
                        ActiveCell.FormulaR1C1 = "=RC[2]/RC[1]"
                        Selection.NumberFormat = "0.00%"
                            Range("G15").Select
                            ActiveCell.FormulaR1C1 = "=SUM(RC[1],RC[2])"
                                Range("H15").Select
                                ActiveCell.FormulaR1C1 = _
                                "=COUNTIFS(Tabelle1!R5C1:R20000C1,""5110"",Tabelle1!R5C2:R20000C2,""1000"",Tabelle1!R5C18:R20000C18,""Erreicht"")"
                                    Range("I15").Select
                                    ActiveCell.FormulaR1C1 = _
                                    "=COUNTIFS(Tabelle1!R5C1:R20000C1,""5110"",Tabelle1!R5C2:R20000C2,""1000"",Tabelle1!R5C18:R20000C18,""Nicht Erreicht"")"
                                    
    'Servicegradberechnung LC9
    ' Zurücksetzen des Zählers und des Dictionaries
    uniqueCount = 0
    Set dict = CreateObject("Scripting.Dictionary")

    ' Gehe durch jede Zelle im Bereich erneut
    For Each cell In rng
        ' Prüfen Sie die Bedingungen in den Spalten B und C
        If cell.Offset(0, -2).Value = 5900 And cell.Offset(0, -1).Value = 1000 Then
            ' Prüfen Sie, ob die Zelle bereits im Dictionary vorhanden ist
            If Not dict.Exists(cell.Value) Then
                ' Wenn nicht, fügen Sie sie zum Dictionary hinzu und erhöhen Sie den Zähler für die einzigartigen Werte
                dict.Add cell.Value, cell.Value
                uniqueCount = uniqueCount + 1
            End If
        End If
    Next cell

    ' Schreiben Sie das Ergebnis in die Zelle J16 von Tabelle2
    ThisWorkbook.Sheets("Tabelle2").Range("J16").Value = uniqueCount

    Range("B16").Select
    ActiveCell.FormulaR1C1 = "=R[-3]C[3]"
    Selection.NumberFormat = "[$-407]mmm/ yy;@"
        Range("C16").Select
        ActiveCell.FormulaR1C1 = "590"
            Range("D16").Select
            ActiveCell.FormulaR1C1 = "WM Polen LC9"
                Range("E16").Select
                ActiveCell.FormulaR1C1 = "=R[-3]C"
                    Range("F16").Select
                    ActiveCell.FormulaR1C1 = "=RC[2]/RC[1]"
                    Selection.NumberFormat = "0.00%"
                        Range("G16").Select
                        ActiveCell.FormulaR1C1 = "=SUM(RC[1],RC[2])"
                            Range("H16").Select
                            ActiveCell.FormulaR1C1 = _
                            "=COUNTIFS(Tabelle1!R5C1:R20000C1,""5900"",Tabelle1!R5C2:R20000C2,""1000"",Tabelle1!R5C18:R20000C18,""Erreicht"")"
                                Range("I16").Select
                                ActiveCell.FormulaR1C1 = _
                                "=COUNTIFS(Tabelle1!R5C1:R20000C1,""5900"",Tabelle1!R5C2:R20000C2,""1000"",Tabelle1!R5C18:R20000C18,""Nicht Erreicht"")"
                                
    ' Erstellen Sie ein Dictionary-Objekt
    uniqueCount = 0
    Set dict = CreateObject("Scripting.Dictionary")

    ' Definieren Sie den Bereich
    Set rng = ThisWorkbook.Sheets("Tabelle1").Range("C5:C20000")

    ' Gehe durch jede Zelle im Bereich
    For Each cell In rng
        ' Prüfen Sie die Bedingungen in den Spalten B und C
        If cell.Offset(0, -2).Value = 5100 And cell.Offset(0, -1).Value = 1090 Then
            ' Prüfen Sie, ob die Zelle bereits im Dictionary vorhanden ist
            If Not dict.Exists(cell.Value) Then
                ' Wenn nicht, fügen Sie sie zum Dictionary hinzu und erhöhen Sie den Zähler für die einzigartigen Werte
                dict.Add cell.Value, cell.Value
                uniqueCount = uniqueCount + 1
            End If
        End If
    Next cell

    ' Schreiben Sie das Ergebnis in die Zelle J13 von Tabelle2
    ThisWorkbook.Sheets("Tabelle2").Range("J17").Value = uniqueCount
    
    
    Range("B17").Select
    ActiveCell.FormulaR1C1 = "=R[-3]C[3]"
    Selection.NumberFormat = "[$-407]mmm/ yy;@"
        Range("C17").Select
        ActiveCell.FormulaR1C1 = "51B"
            Range("D17").Select
            ActiveCell.FormulaR1C1 = "WM Illingen LC8"
                Range("E17").Select
                ActiveCell.FormulaR1C1 = "=R[-3]C"
                    Range("F17").Select
                    ActiveCell.FormulaR1C1 = "=RC[2]/RC[1]"
                    Selection.NumberFormat = "0.00%"
                        Range("G17").Select
                        ActiveCell.FormulaR1C1 = "=SUM(RC[1],RC[2])"
                            Range("H17").Select
                            ActiveCell.FormulaR1C1 = _
                            "=COUNTIFS(Tabelle1!R5C1:R20000C1,""5100"",Tabelle1!R5C2:R20000C2,""1090"",Tabelle1!R5C18:R20000C18,""Erreicht"")"
                                Range("I17").Select
                                ActiveCell.FormulaR1C1 = _
                                "=COUNTIFS(Tabelle1!R5C1:R20000C1,""5100"",Tabelle1!R5C2:R20000C2,""1090"",Tabelle1!R5C18:R20000C18,""Nicht Erreicht"")"
                                
    'Servicegradberechnrung Gesamt
    Range("B18").Select
    ActiveCell.FormulaR1C1 = "Gesamtergebnis"
        Range("F18").Select
        ActiveCell.FormulaR1C1 = "=RC[2]/RC[1]"
        Selection.NumberFormat = "0.00%"
            Range("G18").Select
            ActiveCell.FormulaR1C1 = "=SUM(R[-6]C:R[-1]C)"
                Range("H18").Select
                ActiveCell.FormulaR1C1 = "=SUM(R[-6]C:R[-1]C)"
                    Range("I18").Select
                    ActiveCell.FormulaR1C1 = "=SUM(R[-6]C:R[-1]C)"
                        Range("J18").Select
                        ActiveCell.FormulaR1C1 = "=SUM(R[-6]C:R[-1]C)"
                        
    'automatisches Anpassen der Splatenbreite und Höhe
    Columns("G:G").ColumnWidth = 33.71
    Columns("H:H").ColumnWidth = 33.71
    Columns("I:I").ColumnWidth = 33.71
    Columns("J:J").ColumnWidth = 27.43
    Range("B12:F18").Select
    Selection.Columns.AutoFit
    Selection.Rows.AutoFit

    'Makroausfürung im Hintergrund - ENDE
    Application.ScreenUpdating = True
End Sub
```

## NeueBelegnummer

```vba
Sub NeueBelegnummer()

    Dim RichtigeDatum As Date
    Dim OrdnerPfad As String
    Dim DateiName As String
    Dim VollPfad As String

    Dim wb As Workbook
    Dim wbMakro As Workbook
    Dim ws As Worksheet
    Dim wsErgebnis As Worksheet

    Dim LetzteZeile As Long
    Dim LetzteZeileJ As Long
    Dim LetzteZeileS As Long
    Dim i As Long

    Dim WertT As Variant
    Dim ZeitAnteil As Double
    Dim Teile() As String

    Dim AnzahlJ As Long
    Dim AnzahlS As Long
    
    ' Variablen für sicheres Kopieren
    Dim wertQuelle As Variant
    Dim wertZiel As Variant
    Dim zielIstLeer As Boolean

    On Error GoTo Fehlerbehandlung

    Set wbMakro = ThisWorkbook

    Application.ScreenUpdating = False
    Application.DisplayAlerts = False
    Application.EnableEvents = False
    Application.AskToUpdateLinks = False

    ' 1. RichtigeDatum bestimmen
    Select Case Weekday(Date, vbMonday)
        Case 1
            RichtigeDatum = Date - 3
        Case 2 To 6
            RichtigeDatum = Date - 1
        Case 7
            RichtigeDatum = Date - 2
    End Select

    ' 2. Dateipfad zusammensetzen
    DateiName = "SG-" & Format(RichtigeDatum, "dd.mm.yyyy") & ".xlsx"
    
    ' Erster Versuch: Lokaler Pfad
    OrdnerPfad = "C:\Users\5100LSS1\Documents\SG\"
    VollPfad = OrdnerPfad & DateiName

    ' Falls lokal nicht gefunden, Netzwerkpfad versuchen
    If Dir(VollPfad) = "" Then
        OrdnerPfad = "\\DFS1\Group\UIL-CL-Zentral\04 Statistiken & Auswertungen\01 Statistiken\Servicegrad LO\Geschaeftsjahr 2526\Servicegrad LSS Bot\Data\"
        VollPfad = OrdnerPfad & DateiName
        
        ' Falls auch im Netzwerkpfad nicht gefunden -> still beenden
        If Dir(VollPfad) = "" Then GoTo SauberBeenden
    End If

    ' Datei öffnen
    Set wb = Workbooks.Open(VollPfad)
    Set ws = wb.Worksheets("Data")

    ' Ergebnisblatt in Makro-Datei setzen
    Set wsErgebnis = wbMakro.Worksheets("Tabelle3")

    ' Letzte relevante Zeile bestimmen
    LetzteZeile = Application.WorksheetFunction.Max( _
        ws.Cells(ws.Rows.Count, "S").End(xlUp).Row, _
        ws.Cells(ws.Rows.Count, "T").End(xlUp).Row, _
        ws.Cells(ws.Rows.Count, "U").End(xlUp).Row, _
        ws.Cells(ws.Rows.Count, "J").End(xlUp).Row, _
        ws.Cells(ws.Rows.Count, "K").End(xlUp).Row, _
        ws.Cells(ws.Rows.Count, "L").End(xlUp).Row)

    ' 3. Vorher Anzahl befüllter Zellen in J und S zählen
    LetzteZeileJ = ws.Cells(ws.Rows.Count, "J").End(xlUp).Row
    LetzteZeileS = ws.Cells(ws.Rows.Count, "S").End(xlUp).Row

    AnzahlJ = 0
    AnzahlS = 0

    ' Zähle Spalte J (ignoriert Leerzeichen, leere Strings und Fehler)
    If LetzteZeileJ >= 2 Then
        For i = 2 To LetzteZeileJ
            If Not isError(ws.Cells(i, "J").Value2) Then
                If Trim(CStr(ws.Cells(i, "J").Value2)) <> "" Then
                    AnzahlJ = AnzahlJ + 1
                End If
            End If
        Next i
    End If

    ' Zähle Spalte S (ignoriert Leerzeichen, leere Strings und Fehler)
    If LetzteZeileS >= 2 Then
        For i = 2 To LetzteZeileS
            If Not isError(ws.Cells(i, "S").Value2) Then
                If Trim(CStr(ws.Cells(i, "S").Value2)) <> "" Then
                    AnzahlS = AnzahlS + 1
                End If
            End If
        Next i
    End If

    wsErgebnis.Range("A1").Value = "Anzahl Transporte aus alter buchung = " & AnzahlJ
    wsErgebnis.Range("B1").Value = "Anzahl Transporte aus neuer buchung = " & AnzahlS

    ' 4a. Spalte T in Datum und Uhrzeit trennen
    For i = 2 To LetzteZeile
        WertT = ws.Cells(i, "T").Value
        
        ' Nur prüfen, wenn es kein Excel-Fehler (#WERT! etc.) ist
        If Not isError(WertT) Then
            If Trim(CStr(WertT)) <> "" Then
                If IsDate(WertT) Then
                    ws.Cells(i, "T").Value = Int(CDate(WertT))
                    
                    ZeitAnteil = CDate(WertT) - Int(CDate(WertT))
                    If ZeitAnteil > 0 Then
                        ws.Cells(i, "U").Value = ZeitAnteil
                    Else
                        ws.Cells(i, "U").Value = ""
                    End If
                    
                ElseIf InStr(Trim(CStr(WertT)), " ") > 0 Then
                    Teile = Split(Trim(CStr(WertT)), " ")
                    If UBound(Teile) >= 1 Then
                        ws.Cells(i, "T").Value = Teile(0)
                        ws.Cells(i, "U").Value = Teile(1)
                    End If
                End If
            End If
        End If
    Next i

    ' Formatierung Quell-/Zwischenspalten
    ws.Range("T2:T" & LetzteZeile).NumberFormat = "dd.mm.yyyy"
    ws.Range("U2:U" & LetzteZeile).NumberFormat = "hh:mm:ss"

    ' 4b. ECHTES Verschieben von S/T/U nach J/K/L
    For i = 2 To LetzteZeile

        ' --- S nach J ---
        wertQuelle = ws.Cells(i, "S").Value2
        wertZiel = ws.Cells(i, "J").Value2
        If Not isError(wertQuelle) And Not isError(wertZiel) Then
            If Trim(CStr(wertQuelle)) <> "" And Trim(CStr(wertZiel)) = "" Then
                ws.Cells(i, "J").Value = ws.Cells(i, "S").Value
                ws.Cells(i, "S").ClearContents
            End If
        End If

        ' --- T nach K ---
        wertQuelle = ws.Cells(i, "T").Value2
        wertZiel = ws.Cells(i, "K").Value2
        If Not isError(wertQuelle) And Not isError(wertZiel) Then
            If Trim(CStr(wertQuelle)) <> "" And Trim(CStr(wertZiel)) = "" Then
                ws.Cells(i, "K").Value = ws.Cells(i, "T").Value
                ws.Cells(i, "T").ClearContents
            End If
        End If

        ' --- U nach L ---
        wertQuelle = ws.Cells(i, "U").Value2
        wertZiel = ws.Cells(i, "L").Value2
        If Not isError(wertQuelle) And Not isError(wertZiel) Then
            
            ' NEUE LOGIK: Prüfen ob L "leer" ist (wirklich leer ODER "00:00:00" = 0)
            zielIstLeer = False
            If Trim(CStr(wertZiel)) = "" Then
                zielIstLeer = True
            ElseIf IsNumeric(wertZiel) Then
                If CDbl(wertZiel) = 0 Then
                    zielIstLeer = True
                End If
            End If
            
            ' Wenn U nicht leer ist und L als leer gilt (oder 00:00:00 hat), dann verschieben!
            If Trim(CStr(wertQuelle)) <> "" And zielIstLeer = True Then
                ws.Cells(i, "L").Value = ws.Cells(i, "U").Value
                ws.Cells(i, "U").ClearContents
            End If
            
        End If

    Next i

    ' Formatierung Zielspalten
    ws.Range("K2:K" & LetzteZeile).NumberFormat = "dd.mm.yyyy"
    ws.Range("L2:L" & LetzteZeile).NumberFormat = "hh:mm:ss"

    ' 5. Speichern und schließen
    wb.Save
    wb.Close saveChanges:=False

SauberBeenden:
    On Error Resume Next
    Application.ScreenUpdating = True
    Application.DisplayAlerts = True
    Application.EnableEvents = True
    Application.AskToUpdateLinks = True
    On Error GoTo 0
    Exit Sub

Fehlerbehandlung:
    On Error Resume Next
    If Not wb Is Nothing Then
        wb.Close saveChanges:=False
    End If
    Resume SauberBeenden

End Sub
```

## DatenkopierenSAP

```vba
Sub DatenkopierenSAP()
    Dim wbQuelle As Workbook
    Dim wbZiel As Workbook
    Dim wsQuelle As Worksheet
    Dim wsZiel As Worksheet
    Dim current_week As String
    Dim wb As Workbook
    Dim DateiName As String
    Dim currentDay As Date
    Dim currentDayMinusBusinessDay As Date
    Dim OrdnerPfad As String
    Dim VollPfad As String
    
    'Setzen der aktuellen Datum- und Zeitinformationen
    currentDay = Date
    
    ' Ermitteln des vorherigen Werktages
    If Weekday(currentDay) = 2 Then 'Wenn es Montag ist
        currentDayMinusBusinessDay = currentDay - 3 ' Gehe zurück zum Freitag
    ElseIf Weekday(currentDay) = 1 Then 'Wenn es Sonntag ist
        currentDayMinusBusinessDay = currentDay - 2 ' Gehe zurück zum Freitag
    Else 'Wenn es irgendein anderer Wochentag ist
        currentDayMinusBusinessDay = currentDay - 1 ' Gehe einen Tag zurück
    End If
    
    ' Dateiname mit aktuellem Datum
    DateiName = "SG-" & Format(currentDayMinusBusinessDay, "dd.mm.yyyy") & ".xlsx"
    
    ' Erster Versuch: Lokaler Pfad
    OrdnerPfad = "C:\Users\5100LSS1\Documents\SG\"
    VollPfad = OrdnerPfad & DateiName
    
    ' Falls lokal nicht gefunden, Netzwerkpfad versuchen
    If Dir(VollPfad) = "" Then
        OrdnerPfad = "\\DFS1\Group\UIL-CL-Zentral\04 Statistiken & Auswertungen\01 Statistiken\Servicegrad LO\Geschaeftsjahr 2526\Servicegrad LSS Bot\Data\"
        VollPfad = OrdnerPfad & DateiName
        
        ' Falls die Datei an beiden Orten nicht existiert, Makro beenden
        If Dir(VollPfad) = "" Then
            MsgBox "Die Datei " & DateiName & " wurde weder lokal noch im Netzwerk gefunden.", vbExclamation, "Datei nicht gefunden"
            Exit Sub
        End If
    End If
    
    'Öffne die Quelldatei
    Set wbQuelle = Workbooks.Open(VollPfad)
    
    'Wähle das Arbeitsblatt in der Quelldatei aus
    Set wsQuelle = wbQuelle.Worksheets("Data")
    
    ' Aktuelle Kalenderwoche ermitteln
    'current_week = Format(Date, "ww")
    
    'Öffne die Ziel-Datei
    Set wbZiel = ThisWorkbook
    
    'Wähle das Arbeitsblatt in der Ziel-Datei aus
    Set wsZiel = wbZiel.Worksheets("Tabelle1")
    
    'Kopiere den Zellbereich aus der Quelldatei und füge ihn in die Ziel-Datei ein
    wsQuelle.Range("A2:Q20000").Copy Destination:=wsZiel.Range("A5")
    
    
    'Wandle den Zellbereich B24:B1000 in ein Zahlenformat um
    'wsZiel.Range("B24:B1000").NumberFormat = "0.00"
    
    'Schließe und lösche die Quelldatei
    wbQuelle.Close saveChanges:=False
    
End Sub
```

## DatenUebertragung

```vba
Sub DatenUebertragung()
    ' Performance-Optimierung
    Application.ScreenUpdating = False
    Application.Calculation = xlCalculationManual
    Application.EnableEvents = False
    Application.DisplayAlerts = False
    
    On Error GoTo ErrorHandler
    
    ' Log-Start - EXPLIZITER AUFRUF
    mdDatenUebertragungLogging.LogInfo "=== Datenübertragung gestartet ==="
    
    ' Variablen
    Dim sourceWb As Workbook, targetWb As Workbook
    Dim sourceWs As Worksheet, targetWs As Worksheet
    Dim ws2 As Worksheet, ws4 As Worksheet
    Dim targetRow As Long
    Dim targetFilePath As String
    Dim targetSheetName As String
    Dim previousBusinessDay As Date
    Dim chartName As String
    
    ' Konstanten für bessere Wartbarkeit
    Const SOURCE_SHEET_NAME As String = "Tabelle2"
    Const CHART_SHEET_NAME As String = "Tabelle4"
    
    ' Initialisierung
    Set sourceWb = ThisWorkbook
    mdDatenUebertragungLogging.LogInfo "Quell-Arbeitsmappe: " & sourceWb.Name
    
    ' Validierung: Quell-Worksheets existieren
    If Not WorksheetExists(sourceWb, SOURCE_SHEET_NAME) Then
        mdDatenUebertragungLogging.LogError "Quellblatt '" & SOURCE_SHEET_NAME & _
                            "' nicht gefunden!"
        Exit Sub
    End If
    
    Set sourceWs = sourceWb.Worksheets(SOURCE_SHEET_NAME)
    Set ws2 = sourceWs
    mdDatenUebertragungLogging.LogInfo "Quellblatt gefunden: " & SOURCE_SHEET_NAME
    
    If Not WorksheetExists(sourceWb, CHART_SHEET_NAME) Then
        mdDatenUebertragungLogging.LogError "Chartblatt '" & CHART_SHEET_NAME & _
                            "' nicht gefunden!"
        Exit Sub
    End If
    Set ws4 = sourceWb.Worksheets(CHART_SHEET_NAME)
    mdDatenUebertragungLogging.LogInfo "Chartblatt gefunden: " & CHART_SHEET_NAME
    
    ' Datum-Berechnungen
    previousBusinessDay = GetPreviousBusinessDay(Date)
    targetSheetName = Format(Date, "mmm yy")
    chartName = "Diagramm " & Format(Date, "mmm")
    mdDatenUebertragungLogging.LogInfo "Verarbeitungsdatum: " & _
                       Format(previousBusinessDay, "dd.mm.yyyy")
    
    ' Zieldatei-Pfad
    targetFilePath = "\\adsgroup\Group\UIL-CL-Zentral\04 Statistiken & " & _
                     "Auswertungen\01 Statistiken\Servicegrad LO\" & _
                     "Geschaeftsjahr 2526\Servicegrad LSS Bot\" & _
                     "Servicegrad Kennzahlen.xlsx"
    
    ' Zieldatei öffnen mit Validierung
    If Not FileExists(targetFilePath) Then
        mdDatenUebertragungLogging.LogError "Zieldatei nicht gefunden: " & targetFilePath
        Exit Sub
    End If
    
    mdDatenUebertragungLogging.LogInfo "Öffne Zieldatei..."
    Set targetWb = Workbooks.Open(targetFilePath, ReadOnly:=False)
    
    ' Validierung: Ziel-Worksheet existiert
    If Not WorksheetExists(targetWb, targetSheetName) Then
        mdDatenUebertragungLogging.LogError "Zielblatt '" & targetSheetName & _
                            "' nicht gefunden!"
        targetWb.Close saveChanges:=False
        Exit Sub
    End If
    
    Set targetWs = targetWb.Worksheets(targetSheetName)
    mdDatenUebertragungLogging.LogInfo "Zielblatt gefunden: " & targetSheetName
    
    ' Zielzeile finden
    targetRow = FindDateRow(targetWs, previousBusinessDay)
    
    If targetRow = 0 Then
        mdDatenUebertragungLogging.LogError "Datum " & _
                            Format(previousBusinessDay, "dd.mm.yyyy") & _
                            " nicht in Spalte B gefunden!"
        targetWb.Close saveChanges:=False
        Exit Sub
    End If
    
    mdDatenUebertragungLogging.LogInfo "Zielzeile gefunden: " & targetRow
    
    ' Daten übertragen
    mdDatenUebertragungLogging.LogInfo "Übertrage Daten..."
    CopyValues sourceWs.Range("G13:H13"), targetWs.Range("C" & targetRow)
    CopyValues sourceWs.Range("G14:H14"), targetWs.Range("G" & targetRow)
    CopyValues sourceWs.Range("G15:H15"), targetWs.Range("K" & targetRow)
    CopyValues sourceWs.Range("G16:H16"), targetWs.Range("S" & targetRow)
    CopyValues sourceWs.Range("G17:H17"), targetWs.Range("O" & targetRow)
    mdDatenUebertragungLogging.LogInfo "Daten erfolgreich übertragen (5 Bereiche)"
    
    ' Clipboard leeren
    Application.CutCopyMode = False
    
    ' Diagramm kopieren
    If ChartExists(targetWs, chartName) Then
        mdDatenUebertragungLogging.LogInfo "Kopiere Diagramm: " & chartName
        CopyChartToSheet targetWs, chartName, ws2, "B22", 1000, 350
        CopyChartToSheet targetWs, chartName, ws4, "B30", 1000, 350
        mdDatenUebertragungLogging.LogInfo "Diagramm in beide Sheets kopiert"
    Else
        mdDatenUebertragungLogging.LogWarning "Diagramm '" & chartName & "' nicht gefunden!"
    End If
    
    ' Zieldatei speichern und schließen
    mdDatenUebertragungLogging.LogInfo "Speichere und schließe Zieldatei..."
    targetWb.Close saveChanges:=True
    
    ' Erfolgs-Log
    mdDatenUebertragungLogging.LogSuccess "Datenübertragung abgeschlossen: " & _
                          Format(previousBusinessDay, "dd.mm.yyyy") & _
                          " in Zeile " & targetRow
    mdDatenUebertragungLogging.LogInfo "=== Datenübertragung beendet ==="
    
CleanUp:
    ' Ressourcen freigeben
    Set sourceWs = Nothing
    Set targetWs = Nothing
    Set sourceWb = Nothing
    Set targetWb = Nothing
    Set ws2 = Nothing
    Set ws4 = Nothing
    
    ' Einstellungen zurücksetzen
    Application.ScreenUpdating = True
    Application.Calculation = xlCalculationAutomatic
    Application.EnableEvents = True
    Application.DisplayAlerts = True
    Exit Sub
    
ErrorHandler:
    mdDatenUebertragungLogging.LogError "KRITISCHER FEHLER - " & Err.Number & ": " & _
                        Err.Description
    If Erl <> 0 Then
        mdDatenUebertragungLogging.LogError "Fehler in Zeile: " & Erl
    End If
    If Not targetWb Is Nothing Then
        On Error Resume Next
        targetWb.Close saveChanges:=False
        mdDatenUebertragungLogging.LogInfo "Zieldatei ohne Speichern geschlossen"
        On Error GoTo 0
    End If
    Resume CleanUp
End Sub

' === Hilfsfunktionen ===

Private Function GetPreviousBusinessDay(ByVal currentDate As Date) As Date
    Select Case Weekday(currentDate)
        Case vbMonday
            GetPreviousBusinessDay = currentDate - 3
        Case vbSunday
            GetPreviousBusinessDay = currentDate - 2
        Case Else
            GetPreviousBusinessDay = currentDate - 1
    End Select
End Function

Private Function FindDateRow(ws As Worksheet, searchDate As Date) As Long
    Dim i As Long
    Dim lastRow As Long
    
    lastRow = ws.Cells(ws.Rows.Count, "B").End(xlUp).Row
    
    For i = 1 To lastRow
        If ws.Cells(i, "B").Value = searchDate Then
            FindDateRow = i
            Exit Function
        End If
    Next i
    
    FindDateRow = 0
End Function

Private Sub CopyValues(sourceRange As Range, targetRange As Range)
    targetRange.Resize(sourceRange.Rows.Count, _
                       sourceRange.Columns.Count).Value = sourceRange.Value
End Sub

Private Sub CopyChartToSheet( _
    sourceWs As Worksheet, _
    chartName As String, _
    targetWs As Worksheet, _
    topLeftCell As String, _
    chartWidth As Long, _
    chartHeight As Long)
    
    sourceWs.ChartObjects(chartName).Copy
    targetWs.Paste
    
    With targetWs.Shapes(targetWs.Shapes.Count)
        .Top = targetWs.Range(topLeftCell).Top
        .Left = targetWs.Range(topLeftCell).Left
        .Width = chartWidth
        .Height = chartHeight
    End With
End Sub

Private Function WorksheetExists( _
    wb As Workbook, _
    sheetName As String) As Boolean
    
    Dim ws As Worksheet
    On Error Resume Next
    Set ws = wb.Worksheets(sheetName)
    WorksheetExists = Not ws Is Nothing
    On Error GoTo 0
End Function

Private Function ChartExists( _
    ws As Worksheet, _
    chartName As String) As Boolean
    
    Dim co As ChartObject
    On Error Resume Next
    Set co = ws.ChartObjects(chartName)
    ChartExists = Not co Is Nothing
    On Error GoTo 0
End Function

Private Function FileExists(filePath As String) As Boolean
    FileExists = (Dir(filePath) <> "")
End Function
```

## EMail

```vba
Sub Email()
    Dim olApp As Object
    Dim olMail As Object
    Dim ExcelRange1 As Range
    Dim ExcelRange2 As Range
    Dim wdDoc As Object
    
    Set ExcelRange1 = ThisWorkbook.Sheets("Tabelle2").Range("B12:Q19")
    Set ExcelRange2 = ThisWorkbook.Sheets("Tabelle2").Range("B22:Q45")
    
    On Error Resume Next
    Set olApp = GetObject(, "Outlook.Application")
    If olApp Is Nothing Then
        Set olApp = CreateObject("Outlook.Application")
    End If
    On Error GoTo 0
    
    Set olMail = olApp.CreateItem(0)
    ' Fügen Sie die kopierten Bereiche in die E-Mail ein
    With olMail
        '.To = "johann.zimmer@lapp.com"
        .To = "Sevda.Balli@lapp.com;Michael.Seddig@lapp.com;Constantin.Mojzes@lapp.com;Andreas.Gesse@lapp.com;Wojciech.Bzdula@lapp.com; Zeljko.Maric@lapp.com; Reinhold.Schwarz@lapp.com; Savvas.Kalaitsoglou@lapp.com; Patrick.Wulf@lapp.com; Christian.Buenaventura@lapp.com; Ralf.Schumacher@lapp.com; Konstantin.Schaefer@lapp.com; Achim.Schmidberger@lapp.com;Sugan.Sathiyaseelan@lapp.com;Przemyslaw.Tarka@lapp.com; Pawel.Swiderski@lapp.com; Gerd.Michler@lapp.com; Damian.Wiesenmaier@lapp.com; Bartosz.Plociennik@lapp.com; affiliated.de.uil_dl@lapp.com; Georg.Berin@lapp.com; Nikolai.Klaus@lapp.com;Andrej.Wagner@lapp.com; Yaser.Abdi@lapp.com; Alexander.Brandt@lapp.com; cs.export.de.uil@lapp.com; bmprojects.de.uil@lapp.com; ltm.de.uil_dl@lapp.com; schichtleiter.kommission.de.uil_dl@lapp.com; wareneingang.lc6.de.uil_dl@lapp.com; Maurizio.Segreto@lapp.com; Yara.Schultheiss@lapp.com; Jana.Ensslin@lapp.com; Marvin.Epple@lapp.com;lo-service.lc3.de.uil@lapp.com"
        .CC = "logistic.systems.de.uil_dl@lapp.com;Tobias.Frank@lapp.com;Jens.Bunk@lapp.com;Eleni.Katsamaki@lapp.com;Josef.Ly@lapp.com;Andreas.Buerkle@lapp.com; Rainer.Kreuzer@lapp.com; Daniel.Krauss@lapp.com; Alessandro.Iacona@lapp.com; Michaela.Ruecker@lapp.com;Inder.Sarpal@lapp.com;Oliver.de.Bell@lapp.com;Schivan.Mueller@lapp.com;Mahmut.Ekici@lapp.com;Michael.Schuele@lapp.com;lo-service.lc6.de.uil@lapp.com;Michael.Ahrendt@lapp.com;Denis.Wagenknecht@lapp.com;cs.orderhandling.de.uil_dl@lapp.com;Marc.Bartling@lapp.com;Mate.Filipovic@lapp.com;Bernd.Konieczny@lapp.com;Kevin.Bernhard@lapp.com;Kathrin.Fuchs@lapp.com;Frank.Tomszak@lapp.com;Christian.Conradt@lapp.com;Ahmet.Kalkan@lapp.com;Artur.Fritz@lapp.com;lo-service.lc1.de.uil@lapp.com;kiaa.de.uil@lapp.com;Raffaele.Ricucci@lapp.com;Patryk.Sopyla@lapp.com;Stefan.Hamberger@lapp.com;Andreas.Voulkidis@lapp.com;Lena.Rau@lapp.com;Christoph.Weidle@lapp.com;Benoji.Benedict-Sathiyaseelan@lapp.com;Ralph.Spring@lapp.com;Halil.Sahin@lapp.com; artiom.parvan@lapp.com; " & _
                "wolfgang.schomaker@lapp.com;rober.guelo@lapp.com;Suat.Aslani@lapp.com;Fatmir.Selimi@lapp.com; Marco.Mauz@lapp.com; chris.eisenhardt@lapp.com; Tobias.Wallburg@lapp.com; markus.daiss@lapp.com; Sergej.Erohin@lapp.com; markus.daiss@lapp.com; Ioannis.Nousdilis@lapp.com; Nikolai.Klaus@lapp.com; Stefan.Messmer@lapp.com; Eleni.Katsamaki@lapp.com; Timo.Koechel@lapp.com; benjamin.beuttner@lapp.com"
        .Subject = "Servicegrad"
        .BodyFormat = 2 ' 2 = olFormatHTML
        .Display ' Öffnet das E-Mail-Fenster
        
        Application.Wait Now + TimeValue("00:00:01")
        Set wdDoc = .GetInspector.WordEditor
        
        ' Ersten Bereich normal einfügen
        ExcelRange1.Copy
        wdDoc.Windows(1).Selection.Paste
        
        wdDoc.Windows(1).Selection.TypeParagraph
        
        ' Zweiten Bereich als Bild kopieren und einfügen
        ExcelRange2.CopyPicture Appearance:=xlScreen, Format:=xlPicture
        wdDoc.Windows(1).Selection.Paste
        
        .Send
    End With
    
    Set wdDoc = Nothing
    Set olMail = Nothing
    Set olApp = Nothing
    Application.CutCopyMode = False
End Sub
```