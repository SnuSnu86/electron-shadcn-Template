# Excel Makros für Rückstandsliste

## DatenkopierenSAP

```vba
Sub DatenkopierenSAP()
    Dim wbQuelle As Workbook
    Dim wbZiel As Workbook
    Dim wsQuelle As Worksheet
    Dim wsZiel As Worksheet
    Dim current_week As String
    Dim wb As Workbook
    Dim dateiName As String
    
    dateiName = "EXPORT.XLSX"  ' Ersetzen Sie "IhrDateiName.xlsx" durch den Namen Ihrer Datei
        
        On Error Resume Next
        Set wb = Workbooks(dateiName)
        On Error GoTo 0
        
        If Not wb Is Nothing Then
            wb.Close SaveChanges:=False
            'MsgBox "Die Datei " & dateiName & " wurde erfolgreich geschlossen."
        Else
            'MsgBox "Die Datei " & dateiName & " ist nicht geöffnet."
        End If
    
    'Öffne die Quelldatei
    Set wbQuelle = Workbooks.Open("C:\TEMP\EXPORT.XLSX")
    
    'Wähle das Arbeitsblatt in der Quelldatei aus
    Set wsQuelle = wbQuelle.Worksheets("Sheet1")
    
    'wbName = "Mappe1.xlsx"
    'Öffne die Ziel-Datei
    'Set wbZiel = Workbooks(wbName)
    Set wbZiel = ThisWorkbook
    
    'Wähle das Arbeitsblatt in der Ziel-Datei aus
    Set wsZiel = wbZiel.Worksheets("Tabelle1")
    
    'Kopiere den Zellbereich aus der Quelldatei und füge ihn in die Ziel-Datei ein
    wsQuelle.Range("A1:AN15000").Copy Destination:=wsZiel.Range("A1")
    
    'Schließe und lösche die Quelldatei
    wbQuelle.Close SaveChanges:=False
    Kill "C:\TEMP\EXPORT.XLSX"

End Sub
```

# Spaltenbreite_Anpassen

```vba
Sub Spaltenbreite_Anpassen()
'
' Anpassung der Spaltenbreite in der Rückstandsliste
'

'
    Range("A1:AN58").Select
    Selection.Columns.AutoFit
    Selection.Rows.AutoFit
    Range("J1").Select
    ActiveCell.FormulaR1C1 = "Kommentar"
    Range("A1:AN1").Select
    With Selection.Interior
        .Pattern = xlSolid
        .PatternColorIndex = xlAutomatic
        .Color = 49407
        .TintAndShade = 0
        .PatternTintAndShade = 0
    End With
    Cells.Select
    Selection.AutoFilter
    Columns("J:J").Select
    Selection.Insert Shift:=xlToRight
    Selection.ClearFormats
    Columns("K:K").ColumnWidth = 35
    Range("K:K").Select
    
    With Selection.Validation
        .Delete
        .Add Type:=xlValidateList, AlertStyle:=xlValidAlertStop, Operator:= _
        xlBetween, Formula1:="=Tabelle2!A:A"
        .IgnoreBlank = True
        .InCellDropdown = True
        .InputTitle = ""
        .ErrorTitle = ""
        .InputMessage = ""
        .ErrorMessage = ""
        .ShowInput = True
        .ShowError = False
    End With
    
End Sub
```

## RSl_create1_1_vom_Geschäft

```vba
Sub RSl_create1_1_vom_Geschäft()

Application.ScreenUpdating = False
    
    'Dim ws As Worksheet
    'For Each ws In wbZiel.Worksheets
    
    Sheets.Add After:=Sheets(Sheets.Count)
    Sheets.Add After:=Sheets(Sheets.Count)
    Sheets.Add After:=Sheets(Sheets.Count)
    Sheets.Add After:=Sheets(Sheets.Count)


    Dim i As Long, suchColLdat As Long, suchColLtime As Long, suchColVB As Long, suchColLagnum As Long   'date auf long geändert


    Dim Today As Date
    
    Today = Date - 1
    Today = Format(Date, "dd.mm.yyyy")
            
    Dim strSearchLdat As Date
    Dim strSearchLtime As Date
        
    'Dim srcWks As Worksheet


    Dim strSearchVB As Byte
    Dim strSearchLagnum_510 As Long
    Dim strSearchLagnum_511 As Long
    Dim strSearchLagnum_512 As Long
    Dim strSearchLagnum_513 As Long
    Dim strSearchLagnum_514 As Long
    Dim strSearchLagnum_515 As Long
    Dim strSearchLagnum_590 As Long
    
    Dim srcWks  As Worksheet
    Dim tarWks_1 As Worksheet
    Dim tarWks_2 As Worksheet
    Dim tarWks_3 As Worksheet
    Dim tarWks_4 As Worksheet
    Dim tarWks_5 As Worksheet
    Dim tarWks_6 As Worksheet 'worksheet LC9
    'Tabellennamen anpassen
    'srcWks wo gesucht werden soll
    Set srcWks = Worksheets("Tabelle1")
    
   ' tarWksLC1 wo hinkopiert werden soll
    
    '8 = Spalte 8
    suchColVB = 8
    suchColLagnum = 40
    'strSearch = was gesucht werden soll

    suchColLdat = 3
    suchColLtime = 4
    
    strSearchLdat = Today
    strSearchLtime = "03:00:00"
    
    'if left(cstr(time),2) = 03
    

    suchColVB = 8
    suchColLagnum = 40

    strSearchVB = "02"
    strSearchLagnum_510 = "510"
    strSearchLagnum_511 = "511"
    strSearchLagnum_512 = "512"
    strSearchLagnum_513 = "513"
    strSearchLagnum_514 = "514"
    strSearchLagnum_515 = "515"
    strSearchLagnum_590 = "590"

    'Start prozedur

        Sheets("Tabelle2").Name = "510"

        Sheets("Tabelle3").Name = "511"
        

        Sheets("Tabelle4").Name = "512"
        

        'Sheets("Tabelle5").Select
        Sheets("Tabelle5").Name = "SDCH"
        


        Sheets("Tabelle6").Name = "KIAA"
        
        Sheets("Tabelle7").Name = "590"
    
    Sheets("Tabelle1").Select
    
    Set tarWks_1 = Worksheets("510")
    Set tarWks_2 = Worksheets("511")
    Set tarWks_3 = Worksheets("512")
    Set tarWks_4 = Worksheets("SDCH")
    Set tarWks_5 = Worksheets("KIAA")
    Set tarWks_6 = Worksheets("590")
    
Sheets("Tabelle1").Select
    Range("A1").Select
    Range(Selection, Selection.End(xlToRight)).Select
    Selection.Copy
    
    Sheets("510").Select
    Range("A1").Select
    ActiveSheet.Paste

    Sheets("511").Select
    Range("A1").Select
    ActiveSheet.Paste

    Sheets("512").Select
    Range("A1").Select
    ActiveSheet.Paste


    Sheets("KIAA").Select
    Range("A1").Select
    ActiveSheet.Paste

    Sheets("SDCH").Select
    Range("A1").Select
    ActiveSheet.Paste
    
    Sheets("590").Select
    Range("A1").Select
    ActiveSheet.Paste
   
    Sheets("Tabelle1").Select
    Range("A1").Select

'Tabelle zeilenweise durchsuchen
    With srcWks
        For i = 1 To .Cells(Rows.Count, suchColLagnum).End(xlUp).Row

           If .Cells(i, suchColVB) = "" Then
           Exit For
           End If
        'LC1
            If .Cells(i, suchColLagnum).Text = strSearchLagnum_510 And .Cells(i, suchColVB).Text <> strSearchVB And .Cells(i, suchColLdat).Text < strSearchLdat _
            Or .Cells(i, suchColLagnum).Text = strSearchLagnum_513 And .Cells(i, suchColVB).Text <> strSearchVB And .Cells(i, suchColLdat).Text < strSearchLdat _
            Or .Cells(i, suchColLagnum).Text = "" And .Cells(i, suchColVB).Text <> strSearchVB Then

              Rows(i).Copy Destination:=tarWks_1.Cells(tarWks_1.Cells(Rows.Count, 1).End(xlUp).Row + 1, 1)


            End If
        'LC3
            If .Cells(i, suchColLagnum).Text = strSearchLagnum_511 And .Cells(i, suchColVB).Text <> strSearchVB And .Cells(i, suchColLdat).Text < strSearchLdat _
            Or .Cells(i, suchColLagnum).Text = strSearchLagnum_511 And .Cells(i, suchColVB).Text <> strSearchVB And .Cells(i, suchColLdat).Text = strSearchLdat And .Cells(i, suchColLtime).Text <= strSearchLtime Then
              Rows(i).Copy Destination:=tarWks_2.Cells(tarWks_2.Cells(Rows.Count, 1).End(xlUp).Row + 1, 1)

            End If


        'LC6
            If .Cells(i, suchColLagnum).Text = strSearchLagnum_512 And .Cells(i, suchColVB).Text <> strSearchVB And .Cells(i, suchColLdat).Text < strSearchLdat Then
              Rows(i).Copy Destination:=tarWks_3.Cells(tarWks_3.Cells(Rows.Count, 1).End(xlUp).Row + 1, 1)

            End If

        'SDCH suchen
            If .Cells(i, suchColLagnum).Text = strSearchLagnum_514 And .Cells(i, suchColVB).Text <> strSearchVB And .Cells(i, suchColLdat).Text < strSearchLdat _
            Or .Cells(i, suchColLagnum).Text = strSearchLagnum_515 And .Cells(i, suchColVB).Text <> strSearchVB And .Cells(i, suchColLdat).Text < strSearchLdat Then

              Rows(i).Copy Destination:=tarWks_4.Cells(tarWks_4.Cells(Rows.Count, 1).End(xlUp).Row + 1, 1)

        
            
            End If
            
     'LC9
     
            If .Cells(i, suchColLagnum).Text = strSearchLagnum_590 And .Cells(i, suchColVB).Text <> strSearchVB And .Cells(i, suchColLdat).Text < strSearchLdat Then
            
              Rows(i).Copy Destination:=tarWks_6.Cells(tarWks_6.Cells(Rows.Count, 1).End(xlUp).Row + 1, 1)

            End If
            
            
            'KIAA

            If .Cells(i, suchColVB).Value = strSearchVB And .Cells(i, suchColLdat).Text < strSearchLdat Then

              Rows(i).Copy Destination:=tarWks_5.Cells(tarWks_5.Cells(Rows.Count, 1).End(xlUp).Row + 1, 1)

            End If
            
            
        
         


   Next i
'
    End With
    
    Sheets("Tabelle1").Select
'
 'alle RSLs auf den verschiedenen Pfaden speichern
' LC1 und Schwaka

    Sheets("510").Copy
    ChDir _
        "C:\Users\jozi1\OneDrive - Lapp\Desktop\Projekte\RPA\Rückstandsliste\GJ 2324\LC1"
        '"G:\UIL-CL-Zentral\04 Statistiken & Auswertungen\01 Statistiken\Rückstandsliste und Reporting\GJ 2223\LC1"
    ActiveWorkbook.SaveAs FileName:= _
        "C:\Users\jozi1\OneDrive - Lapp\Desktop\Projekte\RPA\Rückstandsliste\GJ 2324\LC1\" & CStr(Format(Date, "yyyy-mm-dd")) & " TAKI1 Rückstandsliste LC1.xlsx" _
        , FileFormat:=xlOpenXMLWorkbook, CreateBackup:=False
        '"G:\UIL-CL-Zentral\04 Statistiken & Auswertungen\01 Statistiken\Rückstandsliste und Reporting\GJ 2223\LC1\" & CStr(Format(Date, "yyyy-mm-dd")) & " TAKI1 Rückstandsliste LC1.xlsx" _
        , FileFormat:=xlOpenXMLWorkbook, CreateBackup:=False

    Sheets.Add
    Sheets("Tabelle2").Select

        Range("A1").Value = "Abschluss auf Abruf"
        Range("A2").Value = "Ausfall SAP/ITM/Citrix"
        Range("A3").Value = "Ausfall Technik"
        Range("A4").Value = "Betrifft anderes LC"
        Range("A5").Value = "Eingriff durch Vertrieb"
        Range("A5").Value = "Falsche Chargenzuordnung"
        Range("A6").Value = "Falsche Terminierung"
        Range("A7").Value = "Fehlerhafte WE-Buchung"
        Range("A8").Value = "Kabelschaden"
        Range("A9").Value = "Kommi- und Schneidtermin erreicht, Ladetermin verpasst"
        Range("A10").Value = "Kommitermin verpasst"
        Range("A11").Value = "Kunde hat storniert"
        Range("A12").Value = "Lieferschein nicht gelöscht, keine Rücklagerung möglich"
        Range("A13").Value = "Marketingartikel in Kommissionierung"
        Range("A14").Value = "Materialstammdaten fehlerhaft"
        Range("A15").Value = "Schneidtermin verpasst"
        Range("A16").Value = "TA/SA/LF storniert wegen Bestandsdifferenzen"
        Range("A17").Value = "TA-Generierung zu spät"
        Range("A18").Value = "Ware in Q-Sperre"
        Range("A19").Value = "Ware physisch nicht auffindbar"
        Range("A20").Value = "Ware unerfasst versendet"
        Range("A21").Value = "Ware noch nicht eingelagert"
        Range("A22").Value = "Zu spät eingelagert"
        Range("A23").Value = "In Klärung"

Sheets("Tabelle2").Select
ActiveWindow.SelectedSheets.Visible = False

    Sheets("510").Select
    Range("J2").Select
    Range(Selection, Selection.End(xlDown)).Select
    With Selection.Validation
        .Delete
        .Add Type:=xlValidateList, AlertStyle:=xlValidAlertStop, Operator:= _
        xlBetween, Formula1:="=Tabelle2!A:A"
        .IgnoreBlank = True
        .InCellDropdown = True
        .InputTitle = ""
        .ErrorTitle = ""
        .InputMessage = ""
        .ErrorMessage = ""
        .ShowInput = True
        .ShowError = False
    End With
        Range("A1:AN58").Select
    Selection.Columns.AutoFit
    Selection.Rows.AutoFit
    Range("J1").Select
    ActiveCell.FormulaR1C1 = "Kommentar"
    Range("A1:AN1").Select
    With Selection.Interior
        .Pattern = xlSolid
        .PatternColorIndex = xlAutomatic
        .Color = 49407
        .TintAndShade = 0
        .PatternTintAndShade = 0
    End With
    Range("A1").Select


  Workbooks("" & CStr(Format(Date, "yyyy-mm-dd")) & " TAKI1 Rückstandsliste LC1.xlsx").Close SaveChanges:=True


 ' LC3
    Sheets("511").Copy
    ChDir _
        "C:\Users\jozi1\OneDrive - Lapp\Desktop\Projekte\RPA\Rückstandsliste\GJ 2324\LC3"
        '"G:\UIL-CL-Zentral\04 Statistiken & Auswertungen\01 Statistiken\Rückstandsliste und Reporting\GJ 2223\LC3"
    ActiveWorkbook.SaveAs FileName:= _
        "C:\Users\jozi1\OneDrive - Lapp\Desktop\Projekte\RPA\Rückstandsliste\GJ 2324\LC3\" & CStr(Format(Date, "yyyy-mm-dd")) & " TAKI1 Rückstandsliste LC3.xlsx" _
        , FileFormat:=xlOpenXMLWorkbook, CreateBackup:=False
        '"G:\UIL-CL-Zentral\04 Statistiken & Auswertungen\01 Statistiken\Rückstandsliste und Reporting\GJ 2223\LC3\" & CStr(Format(Date, "yyyy-mm-dd")) & " TAKI1 Rückstandsliste LC3.xlsx" _
        , FileFormat:=xlOpenXMLWorkbook, CreateBackup:=False

        Sheets.Add
        Sheets("Tabelle2").Select

        Range("A1").Value = "Abschluss auf Abruf"
        Range("A2").Value = "Ausfall SAP/ITM/Citrix"
        Range("A3").Value = "Ausfall Technik"
        Range("A4").Value = "Betrifft anderes LC"
        Range("A5").Value = "Eingriff durch Vertrieb"
        Range("A6").Value = "Falsche Terminierung"
        Range("A7").Value = "Fehlerhafte WE-Buchung"
        Range("A8").Value = "Kabelschaden"
        Range("A9").Value = "KIAA Stuttgart, TA noch nicht quittiert"
        Range("A10").Value = "Kommi- und Schneidtermin erreicht, Ladetermin verpasst"
        Range("A11").Value = "Kommitermin verpasst"
        Range("A12").Value = "Ladeplatz LKW voll, bleibt stehen"
        Range("A13").Value = "Lieferschein nicht gelöscht, keine Rücklagerung möglich"
        Range("A14").Value = "Marketingartikel in Kommissionierung"
        Range("A15").Value = "Materialstammdaten fehlerhaft"
        Range("A16").Value = "Rückstand Großtrommelmaschine"
        Range("A17").Value = "Schneidtermin verpasst"
        Range("A18").Value = "TA/SA/LF storniert wegen Bestandsdifferenzen"
        Range("A19").Value = "TA-Generierung zu spät"
        Range("A20").Value = "Ware in Q-Sperre"
        Range("A21").Value = "Ware physisch nicht auffindbar"
        Range("A22").Value = "Ware unerfasst versendet"
        Range("A23").Value = "Zu spät eingelagert"
        Range("A24").Value = "In Klärung"
        Range("A25").Value = "Trommelfixierung"
        Range("A26").Value = "Warenausgangsprüfung"
        Range("A27").Value = "Falsches Material "
        Range("A28").Value = "Mengendifferenz"
       

Sheets("Tabelle2").Select
ActiveWindow.SelectedSheets.Visible = False

 Sheets("511").Select
    Range("J2").Select
    Range(Selection, Selection.End(xlDown)).Select
    With Selection.Validation
        .Delete
        .Add Type:=xlValidateList, AlertStyle:=xlValidAlertStop, Operator:= _
        xlBetween, Formula1:="=Tabelle2!A:A"
        .IgnoreBlank = True
        .InCellDropdown = True
        .InputTitle = ""
        .ErrorTitle = ""
        .InputMessage = ""
        .ErrorMessage = ""
        .ShowInput = True
        .ShowError = False
    End With
    Range("A1:AN58").Select
    Selection.Columns.AutoFit
    Selection.Rows.AutoFit
    Range("J1").Select
    ActiveCell.FormulaR1C1 = "Kommentar"
    Range("A1:AN1").Select
    With Selection.Interior
        .Pattern = xlSolid
        .PatternColorIndex = xlAutomatic
        .Color = 49407
        .TintAndShade = 0
        .PatternTintAndShade = 0
    End With
    Range("A1").Select

  Workbooks("" & CStr(Format(Date, "yyyy-mm-dd")) & " TAKI1 Rückstandsliste LC3.xlsx").Close SaveChanges:=True


  'LC6
   Sheets("512").Copy
    ChDir _
        "C:\Users\jozi1\OneDrive - Lapp\Desktop\Projekte\RPA\Rückstandsliste\GJ 2324\LC6"
        '"G:\UIL-CL-Zentral\04 Statistiken & Auswertungen\01 Statistiken\Rückstandsliste und Reporting\GJ 2223\LC6"
    ActiveWorkbook.SaveAs FileName:= _
        "C:\Users\jozi1\OneDrive - Lapp\Desktop\Projekte\RPA\Rückstandsliste\GJ 2324\LC6\" & CStr(Format(Date, "yyyy-mm-dd")) & " TAKI1 Rückstandsliste LC6.xlsx" _
        , FileFormat:=xlOpenXMLWorkbook, CreateBackup:=False
        '"G:\UIL-CL-Zentral\04 Statistiken & Auswertungen\01 Statistiken\Rückstandsliste und Reporting\GJ 2223\LC6\" & CStr(Format(Date, "yyyy-mm-dd")) & " TAKI1 Rückstandsliste LC6.xlsx" _
        , FileFormat:=xlOpenXMLWorkbook, CreateBackup:=False

 Sheets.Add
 Sheets("Tabelle2").Select

            Range("A1").Value = "Abschluss auf Abruf"
            Range("A2").Value = "Ausfall SAP/ITM/Citrix"
            Range("A3").Value = "Ausfall Technik"
            Range("A4").Value = "Betrifft anderes LC"
            Range("A5").Value = "Eingriff durch Vertrieb"
            Range("A6").Value = "Falsche Chargenzuordnung"
            Range("A7").Value = "Falsche Terminierung"
            Range("A8").Value = "Fehlerhafte WE-Buchung"
            Range("A9").Value = "Kabelschaden"
            Range("A10").Value = "Kommi- und Schneidtermin erreicht, Ladetermin verpasst"
            Range("A11").Value = "Kommitermin verpasst"
            Range("A12").Value = "Kunde hat storniert"
            Range("A13").Value = "Lieferschein nicht gelöscht, keine Rücklagerung möglich"
            Range("A14").Value = "Marketingartikel in Kommissionierung"
            Range("A15").Value = "Materialstammdaten fehlerhaft"
            Range("A16").Value = "Schneidtermin verpasst"
            Range("A17").Value = "TA/SA/LF storniert wegen Bestandsdifferenzen"
            Range("A18").Value = "TA-Generierung zu spät"
            Range("A19").Value = "Ware in Q-Sperre"
            Range("A20").Value = "Ware physisch nicht auffindbar"
            Range("A21").Value = "Ware unerfasst versendet"
            Range("A22").Value = "Ware noch nicht eingelagert"
            Range("A23").Value = "Zu spät eingelagert"
            Range("A24").Value = "In Klärung"
Sheets("Tabelle2").Select
ActiveWindow.SelectedSheets.Visible = False


 Sheets("512").Select
    Range("J2").Select
    Range(Selection, Selection.End(xlDown)).Select
    With Selection.Validation
        .Delete
        .Add Type:=xlValidateList, AlertStyle:=xlValidAlertStop, Operator:= _
        xlBetween, Formula1:="=Tabelle2!A:A"
        .IgnoreBlank = True
        .InCellDropdown = True
        .InputTitle = ""
        .ErrorTitle = ""
        .InputMessage = ""
        .ErrorMessage = ""
        .ShowInput = True
        .ShowError = False
    End With
    Range("A1:AN58").Select
    Selection.Columns.AutoFit
    Selection.Rows.AutoFit
    Range("J1").Select
    ActiveCell.FormulaR1C1 = "Kommentar"
    Range("A1:AN1").Select
    With Selection.Interior
        .Pattern = xlSolid
        .PatternColorIndex = xlAutomatic
        .Color = 49407
        .TintAndShade = 0
        .PatternTintAndShade = 0
    End With
    Range("A1").Select
  Workbooks("" & CStr(Format(Date, "yyyy-mm-dd")) & " TAKI1 Rückstandsliste LC6.xlsx").Close SaveChanges:=True

  'KIAA

   Sheets("KIAA").Copy
    ChDir _
        "C:\Users\jozi1\OneDrive - Lapp\Desktop\Projekte\RPA\Rückstandsliste\GJ 2324\KIAA"
        '"G:\UIL-CL-Zentral\04 Statistiken & Auswertungen\01 Statistiken\Rückstandsliste und Reporting\GJ 2223\KIAA"
    ActiveWorkbook.SaveAs FileName:= _
        "C:\Users\jozi1\OneDrive - Lapp\Desktop\Projekte\RPA\Rückstandsliste\GJ 2324\KIAA\" & CStr(Format(Date, "yyyy-mm-dd")) & " TAKI1 Rückstandsliste KIAA.xlsx" _
        , FileFormat:=xlOpenXMLWorkbook, CreateBackup:=False

        '"G:\UIL-CL-Zentral\04 Statistiken & Auswertungen\01 Statistiken\Rückstandsliste und Reporting\GJ 2223\KIAA\" & CStr(Format(Date, "yyyy-mm-dd")) & " TAKI1 Rückstandsliste KIAA.xlsx" _
        , FileFormat:=xlOpenXMLWorkbook, CreateBackup:=False

        Sheets.Add
        Sheets("Tabelle2").Select

        Range("A1").Value = "Abschluss auf Abruf"
        Range("A2").Value = "Ausfall SAP/ITM/Citrix"
        Range("A3").Value = "Ausfall Technik"
        Range("A4").Value = "Betrifft anderes LC"
        Range("A5").Value = "Eingriff durch Vertrieb"
        Range("A6").Value = "Falsche Chargenzuordnung"
        Range("A7").Value = "Falsche Terminierung"
        Range("A8").Value = "Fehlerhafte WE-Buchung"
        Range("A9").Value = "Kabelschaden"
        Range("A10").Value = "Kommi- und Schneidtermin erreicht, Ladetermin verpasst"
        Range("A11").Value = "Kommitermin verpasst"
        Range("A12").Value = "Kunde hat storniert"
        Range("A13").Value = "Lieferschein nicht gelöscht, keine Rücklagerung möglich"
        Range("A14").Value = "Marketingartikel in Kommissionierung"
        Range("A15").Value = "Materialstammdaten fehlerhaft"
        Range("A16").Value = "Schneidtermin verpasst"
        Range("A17").Value = "TA/SA/LF storniert wegen Bestandsdifferenzen"
        Range("A18").Value = "TA-Generierung zu spät"
        Range("A19").Value = "Ware in Q-Sperre"
        Range("A20").Value = "Ware physisch nicht auffindbar"
        Range("A21").Value = "Ware unerfasst versendet"
        Range("A22").Value = "Ware noch nicht eingelagert"
        Range("A23").Value = "Zu spät eingelagert"
        Range("A24").Value = "In Klärung"
        Range("A25").Value = "Completion on Demand"
        Range("A26").Value = "System Failure: SAP / Citrix"
        Range("A27").Value = "Equipment Breakdown "
        Range("A28").Value = "Applies to Another LC"
        Range("A29").Value = "Sales Intervention"
        Range("A30").Value = "Incorrect Batch Assignment"
        Range("A31").Value = "Incorrect Scheduling"
        Range("A32").Value = "Incorrect Goods Received Booking"
        Range("A33").Value = "Cable Damage"
        Range("A34").Value = "Picking and Cutting Deadline Reached, Loading Deadline Missed"
        Range("A35").Value = "Picking Deadline Missed"
        Range("A36").Value = "Client has Cancelled"
        Range("A37").Value = "Delivery Note Not Deleted, No Return Storage Possible"
        Range("A38").Value = "Marketing Goods in Picking Phase"
        Range("A39").Value = "Incorrect Material Master Data"
        Range("A40").Value = "Cutting Deadline Missed"
        Range("A41").Value = "TA/SA/LF Cancelled: Difference in Inventory"
        Range("A42").Value = "TA Generated Too Late"
        Range("A43").Value = "Goods Blocked in Q "
        Range("A44").Value = "Goods Physically Not Found"
        Range("A45").Value = "Goods Shipped Undocumented"
        Range("A46").Value = "Goods Not Yet in Storage"
        Range("A47").Value = "Too Late in Storage"
        Range("A48").Value = "In Clarification"

Sheets("Tabelle2").Select
ActiveWindow.SelectedSheets.Visible = False


 Sheets("KIAA").Select
    Range("J2").Select
    Range(Selection, Selection.End(xlDown)).Select
    With Selection.Validation
        .Delete
        .Add Type:=xlValidateList, AlertStyle:=xlValidAlertStop, Operator:= _
        xlBetween, Formula1:="=Tabelle2!A:A"
        .IgnoreBlank = True
        .InCellDropdown = True
        .InputTitle = ""
        .ErrorTitle = ""
        .InputMessage = ""
        .ErrorMessage = ""
        .ShowInput = True
        .ShowError = False
    End With
    Range("A1:AN58").Select
    Selection.Columns.AutoFit
    Selection.Rows.AutoFit
    Range("J1").Select
    ActiveCell.FormulaR1C1 = "Kommentar"
    Range("A1:AN1").Select
    With Selection.Interior
        .Pattern = xlSolid
        .PatternColorIndex = xlAutomatic
        .Color = 49407
        .TintAndShade = 0
        .PatternTintAndShade = 0
    End With
    Range("A1").Select

  Workbooks("" & CStr(Format(Date, "yyyy-mm-dd")) & " TAKI1 Rückstandsliste KIAA.xlsx").Close SaveChanges:=True


  'Satteldorf Crailsheim

    'Sheets("SDCH").Copy
    'ChDir _
     '   "G:\UIL-CL-Zentral\04 Statistiken & Auswertungen\01 Statistiken\Rückstandsliste und Reporting\GJ 1920\SDCH"
    'ActiveWorkbook.SaveAs Filename:= _
     '   "G:\UIL-CL-Zentral\04 Statistiken & Auswertungen\01 Statistiken\Rückstandsliste und Reporting\GJ 1920\SDCH\" & CStr(Format(Date, "yyyy-mm-dd")) & " TAKI1 Rückstandsliste SDCH.xlsx" _
      '  , FileFormat:=xlOpenXMLWorkbook, CreateBackup:=False

   'Sheets.Add
    'Sheets("Tabelle2").Select

     '   Range("A1").Value = "Abschluss auf Abruf"
      '  Range("A2").Value = "Ausfall SAP/ITM/Citrix"
       ' Range("A3").Value = "Ausfall Technik"
        'Range("A4").Value = "Betrifft anderes LC"
        'Range("A5").Value = "Eingriff durch Vertrieb"
        'Range("A5").Value = "Falsche Chargenzuordnung"
        'Range("A6").Value = "Falsche Terminierung"
        'Range("A7").Value = "Fehlerhafte WE-Buchung"
        'Range("A8").Value = "Kabelschaden"
        'Range("A9").Value = "Kommi- und Schneidtermin erreicht, Ladetermin verpasst"
        'Range("A10").Value = "Kommitermin verpasst"
        'Range("A11").Value = "Kunde hat storniert"
        'Range("A12").Value = "Lieferschein nicht gelöscht, keine Rücklagerung möglich"
        'Range("A13").Value = "Marketingartikel in Kommissionierung"
        'Range("A14").Value = "Materialstammdaten fehlerhaft"
        'Range("A15").Value = "Schneidtermin verpasst"
        'Range("A16").Value = "TA/SA/LF storniert wegen Bestandsdifferenzen"
        'Range("A17").Value = "TA-Generierung zu spät"
        'Range("A18").Value = "Ware in Q-Sperre"
        'Range("A19").Value = "Ware physisch nicht auffindbar"
        'Range("A20").Value = "Ware unerfasst versendet"
        'Range("A21").Value = "Ware noch nicht eingelagert"
        'Range("A22").Value = "Zu spät eingelagert"
        'Range("A23").Value = "In Klärung"

'Sheets("Tabelle2").Select
'ActiveWindow.SelectedSheets.Visible = False

    'Sheets("SDCH").Select
    'Range("J2").Select
    'Range(Selection, Selection.End(xlDown)).Select
    'With Selection.Validation
        '.Delete
        '.Add Type:=xlValidateList, AlertStyle:=xlValidAlertStop, Operator:= _
        'xlBetween, Formula1:="=Tabelle2!A:A"
        '.IgnoreBlank = True
        '.InCellDropdown = True
        '.InputTitle = ""
        '.ErrorTitle = ""
        '.InputMessage = ""
        '.ErrorMessage = ""
        '.ShowInput = True
        '.ShowError = False
    'End With
        'Range("A1:AO58").Select
    'Selection.Columns.AutoFit
    'Selection.Rows.AutoFit
    'Range("J1").Select
    'ActiveCell.FormulaR1C1 = "Kommentar"
    'Range("A1:AO1").Select
    'With Selection.Interior
        '.Pattern = xlSolid
        '.PatternColorIndex = xlAutomatic
        '.Color = 49407
        '.TintAndShade = 0
        '.PatternTintAndShade = 0
    'End With
    'Range("A1").Select

  'Workbooks("" & CStr(Format(Date, "yyyy-mm-dd")) & " TAKI1 Rückstandsliste SDCH.xlsx").Close SaveChanges:=True
  
 'LC9
    Sheets("590").Copy
    ChDir _
        "C:\Users\jozi1\OneDrive - Lapp\Desktop\Projekte\RPA\Rückstandsliste\GJ 2324\LC9"
        '"G:\UIL-CL-Zentral\04 Statistiken & Auswertungen\01 Statistiken\Rückstandsliste und Reporting\GJ 2223\LC9"
    ActiveWorkbook.SaveAs FileName:= _
        "C:\Users\jozi1\OneDrive - Lapp\Desktop\Projekte\RPA\Rückstandsliste\GJ 2324\LC9\" & CStr(Format(Date, "yyyy-mm-dd")) & " TAKI1 Rückstandsliste LC9.xlsx" _
        , FileFormat:=xlOpenXMLWorkbook, CreateBackup:=False
        
        '"G:\UIL-CL-Zentral\04 Statistiken & Auswertungen\01 Statistiken\Rückstandsliste und Reporting\GJ 2223\LC9\" & CStr(Format(Date, "yyyy-mm-dd")) & " TAKI1 Rückstandsliste LC9.xlsx" _
        , FileFormat:=xlOpenXMLWorkbook, CreateBackup:=False
        
              
        
        Sheets.Add
        Sheets("Tabelle2").Select

        Range("A1").Value = "Completion on Demand"
        Range("A2").Value = "System Failure: SAP / Citrix"
        Range("A3").Value = "Equipment Breakdown "
        Range("A4").Value = "Applies to Another LC"
        Range("A5").Value = "Sales Intervention"
        Range("A5").Value = "Incorrect Batch Assignment"
        Range("A6").Value = "Incorrect Scheduling"
        Range("A7").Value = "Incorrect Goods Received Booking"
        Range("A8").Value = "Cable Damage"
        Range("A9").Value = "Picking and Cutting Deadline Reached, Loading Deadline Missed"
        Range("A10").Value = "Picking Deadline Missed"
        Range("A11").Value = "Client has Cancelled"
        Range("A12").Value = "Delivery Note Not Deleted, No Return Storage Possible"
        Range("A13").Value = "Marketing Goods in Picking Phase"
        Range("A14").Value = "Incorrect Material Master Data"
        Range("A15").Value = "Cutting Deadline Missed"
        Range("A16").Value = "TA/SA/LF Cancelled: Difference in Inventory"
        Range("A17").Value = "TA Generated Too Late"
        Range("A18").Value = "Goods Blocked in Q "
        Range("A19").Value = "Goods Physically Not Found"
        Range("A20").Value = "Goods Shipped Undocumented"
        Range("A21").Value = "Goods Not Yet in Storage"
        Range("A22").Value = "Too Late in Storage"
        Range("A23").Value = "In Clarification"
        Range("A24").Value = "Truck not comming"
        Range("A25").Value = "Drum damage"
        Range("A26").Value = "Abschluss auf Abruf"
        Range("A27").Value = "Ausfall SAP/ITM/Citrix"
        Range("A28").Value = "Ausfall Technik"
        Range("A29").Value = "Betrifft anderes LC"
        Range("A30").Value = "Eingriff durch Vertrieb"
        Range("A31").Value = "Falsche Chargenzuordnung"
        Range("A32").Value = "Falsche Terminierung"
        Range("A33").Value = "Fehlerhafte WE-Buchung"
        Range("A34").Value = "Kabelschaden"
        Range("A35").Value = "Kommi- und Schneidtermin erreicht, Ladetermin verpasst"
        Range("A36").Value = "Kommitermin verpasst"
        Range("A37").Value = "Kunde hat storniert"
        Range("A38").Value = "Lieferschein nicht gelöscht, keine Rücklagerung möglich"
        Range("A39").Value = "Marketingartikel in Kommissionierung"
        Range("A40").Value = "Materialstammdaten fehlerhaft"
        Range("A41").Value = "Schneidtermin verpasst"
        Range("A42").Value = "TA/SA/LF storniert wegen Bestandsdifferenzen"
        Range("A43").Value = "TA-Generierung zu spät"
        Range("A44").Value = "Ware in Q-Sperre"
        Range("A45").Value = "Ware physisch nicht auffindbar"
        Range("A46").Value = "Ware unerfasst versendet"
        Range("A47").Value = "Ware noch nicht eingelagert"
        Range("A48").Value = "Zu spät eingelagert"
        Range("A49").Value = "In Klärung"
        


Sheets("Tabelle2").Select
ActiveWindow.SelectedSheets.Visible = False

 Sheets("590").Select
    Range("J2").Select
    Range(Selection, Selection.End(xlDown)).Select
    With Selection.Validation
        .Delete
        .Add Type:=xlValidateList, AlertStyle:=xlValidAlertStop, Operator:= _
        xlBetween, Formula1:="=Tabelle2!A:A"
        .IgnoreBlank = True
        .InCellDropdown = True
        .InputTitle = ""
        .ErrorTitle = ""
        .InputMessage = ""
        .ErrorMessage = ""
        .ShowInput = True
        .ShowError = False
    End With
    Range("A1:AN58").Select
    Selection.Columns.AutoFit
    Selection.Rows.AutoFit
    Range("J1").Select
    ActiveCell.FormulaR1C1 = "Kommentar"
    Range("A1:AN1").Select
    With Selection.Interior
        .Pattern = xlSolid
        .PatternColorIndex = xlAutomatic
        .Color = 49407
        .TintAndShade = 0
        .PatternTintAndShade = 0
    End With
    Range("A1").Select

  Workbooks("" & CStr(Format(Date, "yyyy-mm-dd")) & " TAKI1 Rückstandsliste LC9.xlsx").Close SaveChanges:=True
    'Next ws

Application.ScreenUpdating = True


End Sub
```

## ÜbertrageKommentareLC6

```vba
Sub ÜbertrageKommentareLC6()

    ' Variablen für die Dateinamen und Pfade
    Dim aktuellesDatum As String
    Dim aktuellerDateiname As String
    Dim aktuellesWorkbook As Workbook
    Dim aktuellesSheet As Worksheet
    Dim gestrigesDatum As String
    Dim gestrigerDateiname As String
    Dim gestrigesWorkbook As Workbook
    Dim gestrigesSheet As Worksheet
    Dim pfad As String
    
    Dim datum As Date

    datum = Date
    
    ' Pfad zu den Dateien (anpassen)
    pfad = "C:\Users\jozi1\OneDrive - Lapp\Desktop\Projekte\RPA\Rückstandsliste\GJ 2324\LC6\"

    ' Heutiges und gestriges Datum
    aktuellesDatum = Format(Date, "yyyy-mm-dd")
    
    ' Prüfen, ob aktueller Tag Montag ist
    If Weekday(aktuellesDatum, vbMonday) = 1 Then
        ' Wenn Montag, dann 3 Tage zurück
        gestrigesDatum = Format(datum - 3, "yyyy-mm-dd")
    Else
        ' Ansonsten 1 Tag zurück
        gestrigesDatum = Format(datum - 1, "yyyy-mm-dd")
    End If

    'gestrigesDatum = Format(Date - 1, "yyyy-mm-dd")
    
    ' Dateinamen basierend auf den Datumsformaten
    aktuellerDateiname = aktuellesDatum & " TAKI1 Rückstandsliste LC6.xlsx"
    gestrigerDateiname = gestrigesDatum & " TAKI1 Rückstandsliste LC6.xlsx"
    
    ' Versuche, das aktuelle Workbook zu öffnen
    On Error Resume Next
    Set aktuellesWorkbook = Workbooks.Open(pfad & aktuellerDateiname)
    On Error GoTo 0
    
    ' Prüfen, ob das aktuelle Workbook erfolgreich geöffnet wurde
    If aktuellesWorkbook Is Nothing Then
        MsgBox "Die aktuelle Datei wurde nicht gefunden!", vbExclamation
        Exit Sub
    End If
    
    Set aktuellesSheet = aktuellesWorkbook.Sheets("512") ' Anpassen, falls das relevante Blatt nicht das erste ist
    
    ' Versuche, das gestrige Workbook zu öffnen
    On Error Resume Next
    Set gestrigesWorkbook = Workbooks.Open(pfad & gestrigerDateiname)
    On Error GoTo 0
    
    ' Prüfen, ob das gestrige Workbook erfolgreich geöffnet wurde
    'If gestrigesWorkbook Is Nothing Then
        'MsgBox "Die Datei vom Vortag wurde nicht gefunden!", vbExclamation
        'aktuellesWorkbook.Close False
        'Exit Sub
    'End If
    
    Set gestrigesSheet = gestrigesWorkbook.Sheets("512") ' Anpassen, falls das relevante Blatt nicht das erste ist
    
    ' Zellen vergleichen und Kommentare übertragen
    Dim i As Long
    Dim j As Long
    Dim kommentar As String
    
    i = 2 ' Startzeile für das aktuelle Workbook
    
    Do While aktuellesSheet.Cells(i, 9).Value <> ""
        ' Suche nach einer Übereinstimmung in der gestrigen Datei
        j = 2 ' Startzeile für das gestrige Workbook
        Do While gestrigesSheet.Cells(j, 9).Value <> ""
            If aktuellesSheet.Cells(i, 9).Value = gestrigesSheet.Cells(j, 9).Value Then
                ' Kommentar aus der gestrigen Datei holen
                kommentar = gestrigesSheet.Cells(j, 10).Value
                ' Kommentar in der heutigen Datei setzen
                aktuellesSheet.Cells(i, 10).Value = kommentar
                Exit Do
            End If
            j = j + 1
        Loop
        i = i + 1
    Loop
    
    ' Schließe das gestrige Workbook ohne zu speichern
    gestrigesWorkbook.Close False
    
    ' Speichere das aktuelle Workbook
    aktuellesWorkbook.Save
    
    ' Schließe das aktuelle Workbook
    aktuellesWorkbook.Close
    
    'MsgBox "Kommentare wurden übertragen!", vbInformation

End Sub
```

## ÜbertrageKommentareLC1

```vba
Sub ÜbertrageKommentareLC1()

    ' Variablen für die Dateinamen und Pfade
    Dim aktuellesDatum As String
    Dim aktuellerDateiname As String
    Dim aktuellesWorkbook As Workbook
    Dim aktuellesSheet As Worksheet
    Dim gestrigesDatum As String
    Dim gestrigerDateiname As String
    Dim gestrigesWorkbook As Workbook
    Dim gestrigesSheet As Worksheet
    Dim pfad As String
    Dim datum As Date

    datum = Date
    
    ' Pfad zu den Dateien (anpassen)
    pfad = "C:\Users\jozi1\OneDrive - Lapp\Desktop\Projekte\RPA\Rückstandsliste\GJ 2324\LC1\"

    ' Heutiges und gestriges Datum
    aktuellesDatum = Format(Date, "yyyy-mm-dd")
    
    ' Prüfen, ob aktueller Tag Montag ist
    If Weekday(aktuellesDatum, vbMonday) = 1 Then
        ' Wenn Montag, dann 3 Tage zurück
        gestrigesDatum = Format(datum - 3, "yyyy-mm-dd")
    Else
        ' Ansonsten 1 Tag zurück
        gestrigesDatum = Format(datum - 1, "yyyy-mm-dd")
    End If

    
    ' Dateinamen basierend auf den Datumsformaten
    aktuellerDateiname = aktuellesDatum & " TAKI1 Rückstandsliste LC1.xlsx"
    gestrigerDateiname = gestrigesDatum & " TAKI1 Rückstandsliste LC1.xlsx"
    
    ' Versuche, das aktuelle Workbook zu öffnen
    On Error Resume Next
    Set aktuellesWorkbook = Workbooks.Open(pfad & aktuellerDateiname)
    On Error GoTo 0
    
    ' Prüfen, ob das aktuelle Workbook erfolgreich geöffnet wurde
    If aktuellesWorkbook Is Nothing Then
        MsgBox "Die aktuelle Datei wurde nicht gefunden!", vbExclamation
        Exit Sub
    End If
    
    Set aktuellesSheet = aktuellesWorkbook.Sheets("510") ' Anpassen, falls das relevante Blatt nicht das erste ist
    
    ' Versuche, das gestrige Workbook zu öffnen
    On Error Resume Next
    Set gestrigesWorkbook = Workbooks.Open(pfad & gestrigerDateiname)
    On Error GoTo 0
    
    ' Prüfen, ob das gestrige Workbook erfolgreich geöffnet wurde
    'If gestrigesWorkbook Is Nothing Then
        'MsgBox "Die Datei vom Vortag wurde nicht gefunden!", vbExclamation
        'aktuellesWorkbook.Close False
        'Exit Sub
    'End If
    
    Set gestrigesSheet = gestrigesWorkbook.Sheets("510") ' Anpassen, falls das relevante Blatt nicht das erste ist
    
    ' Zellen vergleichen und Kommentare übertragen
    Dim i As Long
    Dim j As Long
    Dim kommentar As String
    
    i = 2 ' Startzeile für das aktuelle Workbook
    
    Do While aktuellesSheet.Cells(i, 9).Value <> ""
        ' Suche nach einer Übereinstimmung in der gestrigen Datei
        j = 2 ' Startzeile für das gestrige Workbook
        Do While gestrigesSheet.Cells(j, 9).Value <> ""
            If aktuellesSheet.Cells(i, 9).Value = gestrigesSheet.Cells(j, 9).Value Then
                ' Kommentar aus der gestrigen Datei holen
                kommentar = gestrigesSheet.Cells(j, 10).Value
                ' Kommentar in der heutigen Datei setzen
                aktuellesSheet.Cells(i, 10).Value = kommentar
                Exit Do
            End If
            j = j + 1
        Loop
        i = i + 1
    Loop
    
    ' Schließe das gestrige Workbook ohne zu speichern
    gestrigesWorkbook.Close False
    
    ' Speichere das aktuelle Workbook
    aktuellesWorkbook.Save
    
    ' Schließe das aktuelle Workbook
    aktuellesWorkbook.Close
    
    'MsgBox "Kommentare wurden übertragen!", vbInformation

End Sub
```

## ÜbertrageKommentareLC3

```vba
Sub ÜbertrageKommentareLC3()

    ' Variablen für die Dateinamen und Pfade
    Dim aktuellesDatum As String
    Dim aktuellerDateiname As String
    Dim aktuellesWorkbook As Workbook
    Dim aktuellesSheet As Worksheet
    Dim gestrigesDatum As String
    Dim gestrigerDateiname As String
    Dim gestrigesWorkbook As Workbook
    Dim gestrigesSheet As Worksheet
    Dim pfad As String
    Dim datum As Date

    datum = Date
    
    ' Pfad zu den Dateien (anpassen)
    pfad = "C:\Users\jozi1\OneDrive - Lapp\Desktop\Projekte\RPA\Rückstandsliste\GJ 2324\LC3\"

     ' Heutiges und gestriges Datum
    aktuellesDatum = Format(Date, "yyyy-mm-dd")
    
    ' Prüfen, ob aktueller Tag Montag ist
    If Weekday(aktuellesDatum, vbMonday) = 1 Then
        ' Wenn Montag, dann 3 Tage zurück
        gestrigesDatum = Format(datum - 3, "yyyy-mm-dd")
    Else
        ' Ansonsten 1 Tag zurück
        gestrigesDatum = Format(datum - 1, "yyyy-mm-dd")
    End If
    
    ' Dateinamen basierend auf den Datumsformaten
    aktuellerDateiname = aktuellesDatum & " TAKI1 Rückstandsliste LC3.xlsx"
    gestrigerDateiname = gestrigesDatum & " TAKI1 Rückstandsliste LC3.xlsx"
    
    ' Versuche, das aktuelle Workbook zu öffnen
    On Error Resume Next
    Set aktuellesWorkbook = Workbooks.Open(pfad & aktuellerDateiname)
    On Error GoTo 0
    
    ' Prüfen, ob das aktuelle Workbook erfolgreich geöffnet wurde
    If aktuellesWorkbook Is Nothing Then
        MsgBox "Die aktuelle Datei wurde nicht gefunden!", vbExclamation
        Exit Sub
    End If
    
    Set aktuellesSheet = aktuellesWorkbook.Sheets("511") ' Anpassen, falls das relevante Blatt nicht das erste ist
    
    ' Versuche, das gestrige Workbook zu öffnen
    On Error Resume Next
    Set gestrigesWorkbook = Workbooks.Open(pfad & gestrigerDateiname)
    On Error GoTo 0
    
    ' Prüfen, ob das gestrige Workbook erfolgreich geöffnet wurde
    'If gestrigesWorkbook Is Nothing Then
        'MsgBox "Die Datei vom Vortag wurde nicht gefunden!", vbExclamation
        'aktuellesWorkbook.Close False
        'Exit Sub
    'End If
    
    Set gestrigesSheet = gestrigesWorkbook.Sheets("511") ' Anpassen, falls das relevante Blatt nicht das erste ist
    
    ' Zellen vergleichen und Kommentare übertragen
    Dim i As Long
    Dim j As Long
    Dim kommentar As String
    
    i = 2 ' Startzeile für das aktuelle Workbook
    
    Do While aktuellesSheet.Cells(i, 9).Value <> ""
        ' Suche nach einer Übereinstimmung in der gestrigen Datei
        j = 2 ' Startzeile für das gestrige Workbook
        Do While gestrigesSheet.Cells(j, 9).Value <> ""
            If aktuellesSheet.Cells(i, 9).Value = gestrigesSheet.Cells(j, 9).Value Then
                ' Kommentar aus der gestrigen Datei holen
                kommentar = gestrigesSheet.Cells(j, 10).Value
                ' Kommentar in der heutigen Datei setzen
                aktuellesSheet.Cells(i, 10).Value = kommentar
                Exit Do
            End If
            j = j + 1
        Loop
        i = i + 1
    Loop
    
    ' Schließe das gestrige Workbook ohne zu speichern
    gestrigesWorkbook.Close False
    
    ' Speichere das aktuelle Workbook
    aktuellesWorkbook.Save
    
    ' Schließe das aktuelle Workbook
    aktuellesWorkbook.Close
    
    'MsgBox "Kommentare wurden übertragen!", vbInformation

End Sub
```

## ÜbertrageKommentareLC9

```vba
Sub ÜbertrageKommentareLC9()

    ' Variablen für die Dateinamen und Pfade
    Dim aktuellesDatum As String
    Dim aktuellerDateiname As String
    Dim aktuellesWorkbook As Workbook
    Dim aktuellesSheet As Worksheet
    Dim gestrigesDatum As String
    Dim gestrigerDateiname As String
    Dim gestrigesWorkbook As Workbook
    Dim gestrigesSheet As Worksheet
    Dim pfad As String
    Dim datum As Date

    datum = Date
    
    ' Pfad zu den Dateien (anpassen)
    pfad = "C:\Users\jozi1\OneDrive - Lapp\Desktop\Projekte\RPA\Rückstandsliste\GJ 2324\LC9\"

     ' Heutiges und gestriges Datum
    aktuellesDatum = Format(Date, "yyyy-mm-dd")
    
    ' Prüfen, ob aktueller Tag Montag ist
    If Weekday(aktuellesDatum, vbMonday) = 1 Then
        ' Wenn Montag, dann 3 Tage zurück
        gestrigesDatum = Format(datum - 3, "yyyy-mm-dd")
    Else
        ' Ansonsten 1 Tag zurück
        gestrigesDatum = Format(datum - 1, "yyyy-mm-dd")
    End If
    
    ' Dateinamen basierend auf den Datumsformaten
    aktuellerDateiname = aktuellesDatum & " TAKI1 Rückstandsliste LC9.xlsx"
    gestrigerDateiname = gestrigesDatum & " TAKI1 Rückstandsliste LC9.xlsx"
    
    ' Versuche, das aktuelle Workbook zu öffnen
    On Error Resume Next
    Set aktuellesWorkbook = Workbooks.Open(pfad & aktuellerDateiname)
    On Error GoTo 0
    
    ' Prüfen, ob das aktuelle Workbook erfolgreich geöffnet wurde
    If aktuellesWorkbook Is Nothing Then
        MsgBox "Die aktuelle Datei wurde nicht gefunden!", vbExclamation
        Exit Sub
    End If
    
    Set aktuellesSheet = aktuellesWorkbook.Sheets("590") ' Anpassen, falls das relevante Blatt nicht das erste ist
    
    ' Versuche, das gestrige Workbook zu öffnen
    On Error Resume Next
    Set gestrigesWorkbook = Workbooks.Open(pfad & gestrigerDateiname)
    On Error GoTo 0
    
    ' Prüfen, ob das gestrige Workbook erfolgreich geöffnet wurde
    'If gestrigesWorkbook Is Nothing Then
        'MsgBox "Die Datei vom Vortag wurde nicht gefunden!", vbExclamation
        'aktuellesWorkbook.Close False
        'Exit Sub
    'End If
    
    Set gestrigesSheet = gestrigesWorkbook.Sheets("590") ' Anpassen, falls das relevante Blatt nicht das erste ist
    
    ' Zellen vergleichen und Kommentare übertragen
    Dim i As Long
    Dim j As Long
    Dim kommentar As String
    
    i = 2 ' Startzeile für das aktuelle Workbook
    
    Do While aktuellesSheet.Cells(i, 9).Value <> ""
        ' Suche nach einer Übereinstimmung in der gestrigen Datei
        j = 2 ' Startzeile für das gestrige Workbook
        Do While gestrigesSheet.Cells(j, 9).Value <> ""
            If aktuellesSheet.Cells(i, 9).Value = gestrigesSheet.Cells(j, 9).Value Then
                ' Kommentar aus der gestrigen Datei holen
                kommentar = gestrigesSheet.Cells(j, 10).Value
                ' Kommentar in der heutigen Datei setzen
                aktuellesSheet.Cells(i, 10).Value = kommentar
                Exit Do
            End If
            j = j + 1
        Loop
        i = i + 1
    Loop
    
    ' Schließe das gestrige Workbook ohne zu speichern
    gestrigesWorkbook.Close False
    
    ' Speichere das aktuelle Workbook
    aktuellesWorkbook.Save
    
    ' Schließe das aktuelle Workbook
    aktuellesWorkbook.Close
    
    'MsgBox "Kommentare wurden übertragen!", vbInformation

End Sub
```

## ÜbertrageKommentareKIAA

```vba
Sub ÜbertrageKommentareKIAA()

    ' Variablen für die Dateinamen und Pfade
    Dim aktuellesDatum As String
    Dim aktuellerDateiname As String
    Dim aktuellesWorkbook As Workbook
    Dim aktuellesSheet As Worksheet
    Dim gestrigesDatum As String
    Dim gestrigerDateiname As String
    Dim gestrigesWorkbook As Workbook
    Dim gestrigesSheet As Worksheet
    Dim pfad As String
    Dim datum As Date

    datum = Date
    
    ' Pfad zu den Dateien (anpassen)
    pfad = "C:\Users\jozi1\OneDrive - Lapp\Desktop\Projekte\RPA\Rückstandsliste\GJ 2324\KIAA\"

     ' Heutiges und gestriges Datum
    aktuellesDatum = Format(Date, "yyyy-mm-dd")
    
    ' Prüfen, ob aktueller Tag Montag ist
    If Weekday(aktuellesDatum, vbMonday) = 1 Then
        ' Wenn Montag, dann 3 Tage zurück
        gestrigesDatum = Format(datum - 3, "yyyy-mm-dd")
    Else
        ' Ansonsten 1 Tag zurück
        gestrigesDatum = Format(datum - 1, "yyyy-mm-dd")
    End If
    
    ' Dateinamen basierend auf den Datumsformaten
    aktuellerDateiname = aktuellesDatum & " TAKI1 Rückstandsliste KIAA.xlsx"
    gestrigerDateiname = gestrigesDatum & " TAKI1 Rückstandsliste KIAA.xlsx"
    
    ' Versuche, das aktuelle Workbook zu öffnen
    On Error Resume Next
    Set aktuellesWorkbook = Workbooks.Open(pfad & aktuellerDateiname)
    On Error GoTo 0
    
    ' Prüfen, ob das aktuelle Workbook erfolgreich geöffnet wurde
    If aktuellesWorkbook Is Nothing Then
        MsgBox "Die aktuelle Datei wurde nicht gefunden!", vbExclamation
        Exit Sub
    End If
    
    Set aktuellesSheet = aktuellesWorkbook.Sheets("KIAA") ' Anpassen, falls das relevante Blatt nicht das erste ist
    
    ' Versuche, das gestrige Workbook zu öffnen
    On Error Resume Next
    Set gestrigesWorkbook = Workbooks.Open(pfad & gestrigerDateiname)
    On Error GoTo 0
    
    ' Prüfen, ob das gestrige Workbook erfolgreich geöffnet wurde
    'If gestrigesWorkbook Is Nothing Then
        'MsgBox "Die Datei vom Vortag wurde nicht gefunden!", vbExclamation
        'aktuellesWorkbook.Close False
        'Exit Sub
    'End If
    
    Set gestrigesSheet = gestrigesWorkbook.Sheets("KIAA") ' Anpassen, falls das relevante Blatt nicht das erste ist
    
    ' Zellen vergleichen und Kommentare übertragen
    Dim i As Long
    Dim j As Long
    Dim kommentar As String
    
    i = 2 ' Startzeile für das aktuelle Workbook
    
    Do While aktuellesSheet.Cells(i, 9).Value <> ""
        ' Suche nach einer Übereinstimmung in der gestrigen Datei
        j = 2 ' Startzeile für das gestrige Workbook
        Do While gestrigesSheet.Cells(j, 9).Value <> ""
            If aktuellesSheet.Cells(i, 9).Value = gestrigesSheet.Cells(j, 9).Value Then
                ' Kommentar aus der gestrigen Datei holen
                kommentar = gestrigesSheet.Cells(j, 10).Value
                ' Kommentar in der heutigen Datei setzen
                aktuellesSheet.Cells(i, 10).Value = kommentar
                Exit Do
            End If
            j = j + 1
        Loop
        i = i + 1
    Loop
    
    ' Schließe das gestrige Workbook ohne zu speichern
    gestrigesWorkbook.Close False
    
    ' Speichere das aktuelle Workbook
    aktuellesWorkbook.Save
    
    ' Schließe das aktuelle Workbook
    aktuellesWorkbook.Close
    
    'MsgBox "Kommentare wurden übertragen!", vbInformation

End Sub
```

## ÜbertrageKommentareAllInOne

```vba
Sub ÜbertrageKommentareAllInOne()
    Call ÜbertrageKommentareLC1
    Call ÜbertrageKommentareLC3
    Call ÜbertrageKommentareLC6
    Call ÜbertrageKommentareLC9
    Call ÜbertrageKommentareKIAA
End Sub

Sub DeleteRowsInMultipleDirectories()
    Dim FolderPaths(1 To 5) As String
    Dim FileName As String
    Dim wb As Workbook
    Dim ws As Worksheet
    Dim i As Long
    Dim DateString As String
    Dim j As Integer
    
    ' Set the folder paths where the files are stored
    FolderPaths(1) = "C:\Pfad\Zu\Verzeichnis1\" ' Ändern Sie diesen Pfad entsprechend
    FolderPaths(2) = "C:\Pfad\Zu\Verzeichnis2\"
    FolderPaths(3) = "C:\Pfad\Zu\Verzeichnis3\"
    FolderPaths(4) = "C:\Pfad\Zu\Verzeichnis4\"
    FolderPaths(5) = "C:\Pfad\Zu\Verzeichnis5\"
    
    ' Get the current date in the format YYYY-MM-DD
    DateString = Format(Date, "YYYY-MM-DD")
    
    ' Loop through each folder path
    For j = 1 To 5
        ' Create the file name pattern
        FileName = Dir(FolderPaths(j) & DateString & " Rückstandsliste LC6*.xls*")
        
        ' Loop through all matching files in the current directory
        Do While FileName <> ""
            ' Open the workbook
            Set wb = Workbooks.Open(FolderPaths(j) & FileName)
            
            ' Set the worksheet (assuming the relevant sheet is the first sheet)
            Set ws = wb.Sheets(1)
            
            ' Deactivate screen updating and automatic calculation to improve performance
            Application.ScreenUpdating = False
            Application.Calculation = xlCalculationManual
            
            ' Check the rows from bottom to top
            For i = 200 To 2 Step -1
                If IsEmpty(ws.Cells(i, 15)) Then ' Column O is the 15th column
                    ws.Rows(i).Delete
                End If
            Next i
            
            ' Save and close the workbook
            wb.Close SaveChanges:=True
            
            ' Get the next file name
            FileName = Dir
        Loop
    Next j
    
    ' Reactivate screen updating and automatic calculation
    Application.ScreenUpdating = True
    Application.Calculation = xlCalculationAutomatic
    
    ' Inform the user that the task is complete
    MsgBox "Die Bearbeitung der Dateien ist abgeschlossen."
End Sub
```

## CreateEmailWithLinks

```vba
Sub CreateEmailWithLinks()
    Dim olApp As Object
    Dim olMail As Object
    Dim folderPathKIAA As String
    Dim folderPathLC1 As String
    Dim folderPathLC3 As String
    Dim folderPathLC6 As String
    Dim folderPathLC9 As String
    Dim currentDate As String
    Dim filePattern As String
    Dim bodyText As String
    Dim fso As Object
    Dim folderKIAA As Object
    Dim folderLC1 As Object
    Dim folderLC3 As Object
    Dim folderLC6 As Object
    Dim folderLC9 As Object
    Dim file As Object
    
    ' Set Outlook application and create a new mail item
    Set olApp = CreateObject("Outlook.Application")
    Set olMail = olApp.CreateItem(0) ' 0 represents olMailItem
    
    ' Set the folder path where the files are stored
    folderPathKIAA = "C:\Users\jozi1\OneDrive - Lapp\Desktop\Projekte\RPA\Rückstandsliste\GJ 2324\KIAA\" ' Replace with your actual folder path
    folderPathLC1 = "C:\Users\jozi1\OneDrive - Lapp\Desktop\Projekte\RPA\Rückstandsliste\GJ 2324\LC1\" ' Replace with your actual folder path
    folderPathLC3 = "C:\Users\jozi1\OneDrive - Lapp\Desktop\Projekte\RPA\Rückstandsliste\GJ 2324\LC3\" ' Replace with your actual folder path
    folderPathLC6 = "C:\Users\jozi1\OneDrive - Lapp\Desktop\Projekte\RPA\Rückstandsliste\GJ 2324\LC6\" ' Replace with your actual folder path
    folderPathLC9 = "C:\Users\jozi1\OneDrive - Lapp\Desktop\Projekte\RPA\Rückstandsliste\GJ 2324\LC9\" ' Replace with your actual folder path
    
    ' Get the current date in YYYY-MM-DD format
    currentDate = Format(Date, "yyyy-mm-dd")
    
    ' Set the file pattern to match the date
    filePattern = "*" & currentDate & "*.xlsx" ' Assuming the files are .xlsx, adjust as needed
    
    ' Initialize the body text
    bodyText = "<p>Hallo,</p>" & _
               "<p>anbei die heutige Rückstandsliste, bitte bearbeiten:</p>" & _
               "<p>"
    
    ' Create a FileSystemObject to access the directory
    Set fso = CreateObject("Scripting.FileSystemObject")
    Set folderKIAA = fso.GetFolder(folderPathKIAA)
    Set folderLC1 = fso.GetFolder(folderPathLC1)
    Set folderLC3 = fso.GetFolder(folderPathLC3)
    Set folderLC6 = fso.GetFolder(folderPathLC6)
    Set folderLC9 = fso.GetFolder(folderPathLC9)
    
    ' Loop through the files in each directory
    For Each folder In Array(folderKIAA, folderLC1, folderLC3, folderLC6, folderLC9)
        For Each file In folder.Files
            If file.Name Like filePattern Then
                ' Add hyperlink text for each matching file
                bodyText = bodyText & "<p><a href=""file:///" & file.Path & """>" & file.Path & "</a></p>"
            End If
        Next file
    Next folder
    
    bodyText = bodyText & "</p>"
    
    ' Set the email properties
    With olMail
        .Subject = "Rückstandsliste"
        .BodyFormat = 2 ' 2 represents olFormatHTML
        .HTMLBody = bodyText
        .To = "Johann.Zimmer@lapp.com" ' Replace with the actual recipient
        .send ' Use .Send to send the email directly
    End With
    
    ' Clean up
    Set olMail = Nothing
    Set olApp = Nothing
    Set fso = Nothing
    Set folderKIAA = Nothing
    Set folderLC1 = Nothing
    Set folderLC3 = Nothing
    Set folderLC6 = Nothing
    Set folderLC9 = Nothing
End Sub


