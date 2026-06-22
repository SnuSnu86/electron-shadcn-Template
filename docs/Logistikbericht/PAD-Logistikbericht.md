# PAD-Prozess

## Main

```
DateTime.GetCurrentDateTime.Local DateTimeFormat: DateTime.DateTimeFormat.DateOnly CurrentDateTime=> CurrentDateTime
SET Wochentag TO CurrentDateTime.DayOfWeek
SET Montag TO $'''Monday'''
IF Wochentag = Montag THEN
    DateTime.Add DateTime: CurrentDateTime TimeToAdd: -3 TimeUnit: DateTime.TimeUnit.Days ResultedDate=> GoToFriday
    Text.ConvertDateTimeToText.FromDateTime DateTime: GoToFriday StandardFormat: Text.WellKnownDateTimeFormat.ShortDate Result=> FormattedGoToFriday
    CALL Friday
ELSE IF Wochentag <> Montag THEN
    DateTime.Add DateTime: CurrentDateTime TimeToAdd: -1 TimeUnit: DateTime.TimeUnit.Days ResultedDate=> GoToYesterday
    Text.ConvertDateTimeToText.FromDateTime DateTime: GoToYesterday StandardFormat: Text.WellKnownDateTimeFormat.ShortDate Result=> FormattedGoToYesterday
    CALL Weekday
END
```

## Weekday

```
WAIT 1
Excel.LaunchExcel.LaunchAndOpenUnderExistingProcess Path: $'''C:\\Users\\5100LSS1\\OneDrive - Lapp\\Desktop\\RPA\\Controlling\\Koordination.xlsm''' Visible: True ReadOnly: False UseMachineLocale: False Instance=> ExcelInstance
WAIT (System.WaitForProcess.ProcessToStop ProcessName: ExcelInstance)
Excel.RunMacro Instance: ExcelInstance Macro: $'''UpdateShopfloorData'''
WAIT 1
Excel.RunMacro Instance: ExcelInstance Macro: $'''SendEmail'''
Excel.CloseExcel.Close Instance: ExcelInstance
```

## Friday

```
WAIT 1
Excel.LaunchExcel.LaunchAndOpenUnderExistingProcess Path: $'''C:\\Users\\5100LSS1\\OneDrive - Lapp\\Desktop\\RPA\\Controlling\\Koordination.xlsm''' Visible: True ReadOnly: False UseMachineLocale: False Instance=> ExcelInstance
WAIT (System.WaitForProcess.ProcessToStop ProcessName: ExcelInstance)
Excel.RunMacro Instance: ExcelInstance Macro: $'''UpdateShopfloorData'''
WAIT 1
Excel.RunMacro Instance: ExcelInstance Macro: $'''SendEmail'''
Excel.CloseExcel.Close Instance: ExcelInstance
```

## SAP Yesterday

```
Scripting.RunVBScript.RunVBScript VBScriptCode: $'''\' =============================================================
\' 1. EINMALIGER VERBINDUNGSAUFBAU ZU SAP
\' =============================================================
If Not IsObject(application) Then
   Set SapGuiAuto  = GetObject(\"SAPGUI\")
   Set application = SapGuiAuto.GetScriptingEngine
End If
If Not IsObject(connection) Then
   Set connection = application.Children(0)
End If
If Not IsObject(session) Then
   Set session    = connection.Children(0)
End If
If IsObject(WScript) Then
   WScript.ConnectObject session,     \"on\"
   WScript.ConnectObject application, \"on\"
End If
session.findById(\"wnd[0]\").maximize

\' =============================================================
\' 2. HILFSFUNKTION: PRÜFEN OB \"KEINE DATEN\" IN STATUSLEISTE
\' =============================================================
Function NoDataInStatusBar()
    Dim sbarText
    On Error Resume Next
    sbarText = session.findById(\"wnd[0]/sbar\").Text
    On Error GoTo 0
    If InStr(1, sbarText, \"Es sind keine Daten vorhanden\", vbTextCompare) > 0 Then
        NoDataInStatusBar = True
    Else
        NoDataInStatusBar = False
    End If
End Function

\' =============================================================
\' 3. PARAMETER FÜR DURCHLÄUFE 510
\' =============================================================
Dim runs(2)
\' runs(i) = Array(LGNUM, BDATU, WERKS, LGTYP, DYN001, FILEPREFIX)

runs(0) = Array(\"510\", \"%FormattedGoToYesterday%\", \"5100\", \"902\", \"101\", \"510_WE_\")
runs(1) = Array(\"510\", \"%FormattedGoToYesterday%\", \"5100\", \"957\", \"\",    \"510_ABL_\")
runs(2) = Array(\"510\", \"%FormattedGoToYesterday%\", \"5100\", \"916\", \"601\", \"510_WA_\")

Dim i
For i = 0 To UBound(runs)

    \' =============================================================
    \' START TRANSAKTION (ruft LX10 immer neu auf)
    \' =============================================================
    session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"/nLX10\"
    session.findById(\"wnd[0]\").sendVKey 0
    session.findById(\"wnd[0]/usr/ctxtT1_LGNUM\").caretPosition = 0
    session.findById(\"wnd[0]\").sendVKey 2

    session.findById(\"wnd[0]/usr/ctxtT1_LGNUM\").text   = runs(i)(0)
    session.findById(\"wnd[0]/usr/ctxtBDATU-LOW\").text  = runs(i)(1)
    session.findById(\"wnd[0]/usr/ctxtWERKS-LOW\").text  = runs(i)(2)
    session.findById(\"wnd[0]/usr/ctxtLGTYP\").text      = runs(i)(3)
    session.findById(\"wnd[0]/usr/ctxtLGTYP\").setFocus
    session.findById(\"wnd[0]/usr/ctxtLGTYP\").caretPosition = 3
    session.findById(\"wnd[0]\").sendVKey 0

    session.findById(\"wnd[0]/tbar[1]/btn[16]\").press
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").expandNode \"          1\"
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").selectNode \"          4\"
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").topNode = \"          1\"
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").doubleClickNode \"          4\"

    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/ctxt%%%%DYN001-LOW\").text = runs(i)(4)
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/ctxt%%%%DYN001-LOW\").setFocus
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/ctxt%%%%DYN001-LOW\").caretPosition = 3
    session.findById(\"wnd[0]\").sendVKey 0

    \' =============================================================
    \' AUSFÜHREN
    \' =============================================================
    session.findById(\"wnd[0]/tbar[1]/btn[8]\").press

    \' =============================================================
    \' PRÜFEN: KEINE DATEN?
    \' =============================================================
    If NoDataInStatusBar() Then
        \' ============================================================
        \' KEINE DATEN: Wir sind noch auf dem Selektionsbildschirm!
        \' Nichts tun - nächster Durchlauf startet mit /nLX10 neu
        \' ============================================================
        WScript.Sleep 1000
        \' Schleife geht automatisch zum nächsten i
        
    Else
        \' =============================================================
        \' DATEN VORHANDEN: EXPORT WIE BISHER
        \' =============================================================
        session.findById(\"wnd[0]/mbar/menu[0]/menu[1]/menu[1]\").select
        session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = runs(i)(5) & runs(i)(1)
        session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 17
        session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
        session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\Documents\\LX10\"
        session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
        session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 13
        session.findById(\"wnd[1]/tbar[0]/btn[0]\").press

        \' Zurück aus der Ergebnisliste
        session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
        session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
        WScript.Sleep 1000
    End If

Next

\' =============================================================
\' ENDE
\' =============================================================''' ScriptOutput=> SAPProzess510 ScriptError=> ScriptError
Scripting.RunPowershellScript.RunScript Script: $'''get-process -name \"Excel\" | stop-process''' ScriptOutput=> CloseSAP510Excel
WAIT 1
Scripting.RunVBScript.RunVBScript VBScriptCode: $'''\' =============================================================
\' 1. EINMALIGER VERBINDUNGSAUFBAU ZU SAP
\' =============================================================
If Not IsObject(application) Then
   Set SapGuiAuto  = GetObject(\"SAPGUI\")
   Set application = SapGuiAuto.GetScriptingEngine
End If
If Not IsObject(connection) Then
   Set connection = application.Children(0)
End If
If Not IsObject(session) Then
   Set session    = connection.Children(0)
End If
If IsObject(WScript) Then
   WScript.ConnectObject session,     \"on\"
   WScript.ConnectObject application, \"on\"
End If
session.findById(\"wnd[0]\").maximize

\' =============================================================
\' 2. HILFSFUNKTION: PRÜFEN OB \"KEINE DATEN\" IN STATUSLEISTE
\' =============================================================
Function NoDataInStatusBar()
    Dim sbarText
    On Error Resume Next
    sbarText = session.findById(\"wnd[0]/sbar\").Text
    On Error GoTo 0
    If InStr(1, sbarText, \"Es sind keine Daten vorhanden\", vbTextCompare) > 0 Then
        NoDataInStatusBar = True
    Else
        NoDataInStatusBar = False
    End If
End Function

\' =============================================================
\' 3. PARAMETER FÜR DURCHLÄUFE
\' =============================================================
Dim runs(2)
\' runs(i) = Array(LGNUM, BDATU, WERKS, LGTYP, DYN001, FILEPREFIX)

runs(0) = Array(\"511\", \"%FormattedGoToYesterday%\", \"5110\", \"902\", \"101\", \"511_WE_\")
runs(1) = Array(\"511\", \"%FormattedGoToYesterday%\", \"5110\", \"957\", \"\",    \"511_ABL_\")
runs(2) = Array(\"511\", \"%FormattedGoToYesterday%\", \"5110\", \"916\", \"601\", \"511_WA_\")

Dim i
For i = 0 To UBound(runs)

    \' =============================================================
    \' START TRANSAKTION (ruft LX10 immer neu auf)
    \' =============================================================
    session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"/nLX10\"
    session.findById(\"wnd[0]\").sendVKey 0
    session.findById(\"wnd[0]/usr/ctxtT1_LGNUM\").caretPosition = 0
    session.findById(\"wnd[0]\").sendVKey 2

    session.findById(\"wnd[0]/usr/ctxtT1_LGNUM\").text   = runs(i)(0)
    session.findById(\"wnd[0]/usr/ctxtBDATU-LOW\").text  = runs(i)(1)
    session.findById(\"wnd[0]/usr/ctxtWERKS-LOW\").text  = runs(i)(2)
    session.findById(\"wnd[0]/usr/ctxtLGTYP\").text      = runs(i)(3)
    session.findById(\"wnd[0]/usr/ctxtLGTYP\").setFocus
    session.findById(\"wnd[0]/usr/ctxtLGTYP\").caretPosition = 3
    session.findById(\"wnd[0]\").sendVKey 0

    session.findById(\"wnd[0]/tbar[1]/btn[16]\").press
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").expandNode \"          1\"
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").selectNode \"          4\"
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").topNode = \"          1\"
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").doubleClickNode \"          4\"

    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/ctxt%%%%DYN001-LOW\").text = runs(i)(4)
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/ctxt%%%%DYN001-LOW\").setFocus
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/ctxt%%%%DYN001-LOW\").caretPosition = 3
    session.findById(\"wnd[0]\").sendVKey 0

    \' =============================================================
    \' AUSFÜHREN
    \' =============================================================
    session.findById(\"wnd[0]/tbar[1]/btn[8]\").press

    \' =============================================================
    \' PRÜFEN: KEINE DATEN?
    \' =============================================================
    If NoDataInStatusBar() Then
        \' ============================================================
        \' KEINE DATEN: Wir sind noch auf dem Selektionsbildschirm!
        \' Nichts tun - nächster Durchlauf startet mit /nLX10 neu
        \' ============================================================
        WScript.Sleep 500
        \' Schleife geht automatisch zum nächsten i
        
    Else
        \' =============================================================
        \' DATEN VORHANDEN: EXPORT WIE BISHER
        \' =============================================================
        session.findById(\"wnd[0]/mbar/menu[0]/menu[1]/menu[1]\").select
        session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = runs(i)(5) & runs(i)(1)
        session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 17
        session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
        session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\Documents\\LX10\"
        session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
        session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 13
        session.findById(\"wnd[1]/tbar[0]/btn[0]\").press

        \' Zurück aus der Ergebnisliste
        session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
        session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
        WScript.Sleep 1000
    End If

Next

\' =============================================================
\' ENDE
\' =============================================================''' ScriptOutput=> SAPProzess511
Scripting.RunPowershellScript.RunScript Script: $'''get-process -name \"Excel\" | stop-process''' ScriptOutput=> CloseSAP511Excel
WAIT 1
Scripting.RunVBScript.RunVBScript VBScriptCode: $'''\' =============================================================
\' 1. EINMALIGER VERBINDUNGSAUFBAU ZU SAP
\' =============================================================
If Not IsObject(application) Then
   Set SapGuiAuto  = GetObject(\"SAPGUI\")
   Set application = SapGuiAuto.GetScriptingEngine
End If
If Not IsObject(connection) Then
   Set connection = application.Children(0)
End If
If Not IsObject(session) Then
   Set session    = connection.Children(0)
End If
If IsObject(WScript) Then
   WScript.ConnectObject session,     \"on\"
   WScript.ConnectObject application, \"on\"
End If
session.findById(\"wnd[0]\").maximize

\' =============================================================
\' 2. HILFSFUNKTION: PRÜFEN OB \"KEINE DATEN\" IN STATUSLEISTE
\' =============================================================
Function NoDataInStatusBar()
    Dim sbarText
    On Error Resume Next
    sbarText = session.findById(\"wnd[0]/sbar\").Text
    On Error GoTo 0
    If InStr(1, sbarText, \"Es sind keine Daten vorhanden\", vbTextCompare) > 0 Then
        NoDataInStatusBar = True
    Else
        NoDataInStatusBar = False
    End If
End Function

\' =============================================================
\' 3. PARAMETER FÜR DURCHLÄUFE 512
\' =============================================================
Dim runs(2)
\' runs(i) = Array(LGNUM, BDATU, WERKS, LGTYP, DYN001, FILEPREFIX)

runs(0) = Array(\"512\", \"%FormattedGoToYesterday%\", \"5100\", \"902\", \"101\", \"512_WE_\")
runs(1) = Array(\"512\", \"%FormattedGoToYesterday%\", \"5100\", \"957\", \"\",    \"512_ABL_\")
runs(2) = Array(\"512\", \"%FormattedGoToYesterday%\", \"5100\", \"916\", \"601\", \"512_WA_\")

Dim i
For i = 0 To UBound(runs)

    \' =============================================================
    \' START TRANSAKTION (ruft LX10 immer neu auf)
    \' =============================================================
    session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"/nLX10\"
    session.findById(\"wnd[0]\").sendVKey 0
    session.findById(\"wnd[0]/usr/ctxtT1_LGNUM\").caretPosition = 0
    session.findById(\"wnd[0]\").sendVKey 2

    session.findById(\"wnd[0]/usr/ctxtT1_LGNUM\").text   = runs(i)(0)
    session.findById(\"wnd[0]/usr/ctxtBDATU-LOW\").text  = runs(i)(1)
    session.findById(\"wnd[0]/usr/ctxtWERKS-LOW\").text  = runs(i)(2)
    session.findById(\"wnd[0]/usr/ctxtLGTYP\").text      = runs(i)(3)
    session.findById(\"wnd[0]/usr/ctxtLGTYP\").setFocus
    session.findById(\"wnd[0]/usr/ctxtLGTYP\").caretPosition = 3
    session.findById(\"wnd[0]\").sendVKey 0

    session.findById(\"wnd[0]/tbar[1]/btn[16]\").press
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").expandNode \"          1\"
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").selectNode \"          4\"
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").topNode = \"          1\"
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").doubleClickNode \"          4\"

    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/ctxt%%%%DYN001-LOW\").text = runs(i)(4)
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/ctxt%%%%DYN001-LOW\").setFocus
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/ctxt%%%%DYN001-LOW\").caretPosition = 3
    session.findById(\"wnd[0]\").sendVKey 0

    \' =============================================================
    \' AUSFÜHREN
    \' =============================================================
    session.findById(\"wnd[0]/tbar[1]/btn[8]\").press

    \' =============================================================
    \' PRÜFEN: KEINE DATEN?
    \' =============================================================
    If NoDataInStatusBar() Then
        \' ============================================================
        \' KEINE DATEN: Wir sind noch auf dem Selektionsbildschirm!
        \' Nichts tun - nächster Durchlauf startet mit /nLX10 neu
        \' ============================================================
        WScript.Sleep 1000
        \' Schleife geht automatisch zum nächsten i
        
    Else
        \' =============================================================
        \' DATEN VORHANDEN: EXPORT WIE BISHER
        \' =============================================================
        session.findById(\"wnd[0]/mbar/menu[0]/menu[1]/menu[1]\").select
        session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = runs(i)(5) & runs(i)(1)
        session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 17
        session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
        session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\Documents\\LX10\"
        session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
        session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 13
        session.findById(\"wnd[1]/tbar[0]/btn[0]\").press

        \' Zurück aus der Ergebnisliste
        session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
        session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
        WScript.Sleep 1000
    End If

Next

\' =============================================================
\' ENDE
\' =============================================================''' ScriptOutput=> SAPProzess512
Scripting.RunPowershellScript.RunScript Script: $'''get-process -name \"Excel\" | stop-process''' ScriptOutput=> CloseSAP512Excel
WAIT 1
Scripting.RunVBScript.RunVBScript VBScriptCode: $'''\' =============================================================
\' 1. EINMALIGER VERBINDUNGSAUFBAU ZU SAP
\' =============================================================
If Not IsObject(application) Then
   Set SapGuiAuto  = GetObject(\"SAPGUI\")
   Set application = SapGuiAuto.GetScriptingEngine
End If
If Not IsObject(connection) Then
   Set connection = application.Children(0)
End If
If Not IsObject(session) Then
   Set session    = connection.Children(0)
End If
If IsObject(WScript) Then
   WScript.ConnectObject session,     \"on\"
   WScript.ConnectObject application, \"on\"
End If
session.findById(\"wnd[0]\").maximize

\' =============================================================
\' 2. HILFSFUNKTION: PRÜFEN OB \"KEINE DATEN\" IN STATUSLEISTE
\' =============================================================
Function NoDataInStatusBar()
    Dim sbarText
    On Error Resume Next
    sbarText = session.findById(\"wnd[0]/sbar\").Text
    On Error GoTo 0
    If InStr(1, sbarText, \"Es sind keine Daten vorhanden\", vbTextCompare) > 0 Then
        NoDataInStatusBar = True
    Else
        NoDataInStatusBar = False
    End If
End Function

\' =============================================================
\' 3. PARAMETER FÜR DURCHLÄUFE 510
\' =============================================================
Dim runs(2)
\' runs(i) = Array(LGNUM, BDATU, WERKS, LGTYP, DYN001, FILEPREFIX)

runs(0) = Array(\"51B\", \"%FormattedGoToYesterday%\", \"5100\", \"902\", \"101\", \"51B_WE_\")
runs(1) = Array(\"51B\", \"%FormattedGoToYesterday%\", \"5100\", \"957\", \"\",    \"51B_ABL_\")
runs(2) = Array(\"51B\", \"%FormattedGoToYesterday%\", \"5100\", \"916\", \"601\", \"51B_WA_\")

Dim i
For i = 0 To UBound(runs)

    \' =============================================================
    \' START TRANSAKTION (ruft LX10 immer neu auf)
    \' =============================================================
    session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"/nLX10\"
    session.findById(\"wnd[0]\").sendVKey 0
    session.findById(\"wnd[0]/usr/ctxtT1_LGNUM\").caretPosition = 0
    session.findById(\"wnd[0]\").sendVKey 2

    session.findById(\"wnd[0]/usr/ctxtT1_LGNUM\").text   = runs(i)(0)
    session.findById(\"wnd[0]/usr/ctxtBDATU-LOW\").text  = runs(i)(1)
    session.findById(\"wnd[0]/usr/ctxtWERKS-LOW\").text  = runs(i)(2)
    session.findById(\"wnd[0]/usr/ctxtLGTYP\").text      = runs(i)(3)
    session.findById(\"wnd[0]/usr/ctxtLGTYP\").setFocus
    session.findById(\"wnd[0]/usr/ctxtLGTYP\").caretPosition = 3
    session.findById(\"wnd[0]\").sendVKey 0

    session.findById(\"wnd[0]/tbar[1]/btn[16]\").press
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").expandNode \"          1\"
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").selectNode \"          4\"
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").topNode = \"          1\"
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").doubleClickNode \"          4\"

    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/ctxt%%%%DYN001-LOW\").text = runs(i)(4)
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/ctxt%%%%DYN001-LOW\").setFocus
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/ctxt%%%%DYN001-LOW\").caretPosition = 3
    session.findById(\"wnd[0]\").sendVKey 0

    \' =============================================================
    \' AUSFÜHREN
    \' =============================================================
    session.findById(\"wnd[0]/tbar[1]/btn[8]\").press

    \' =============================================================
    \' PRÜFEN: KEINE DATEN?
    \' =============================================================
    If NoDataInStatusBar() Then
        \' ============================================================
        \' KEINE DATEN: Wir sind noch auf dem Selektionsbildschirm!
        \' Nichts tun - nächster Durchlauf startet mit /nLX10 neu
        \' ============================================================
        WScript.Sleep 1000
        \' Schleife geht automatisch zum nächsten i
        
    Else
        \' =============================================================
        \' DATEN VORHANDEN: EXPORT WIE BISHER
        \' =============================================================
        session.findById(\"wnd[0]/mbar/menu[0]/menu[1]/menu[1]\").select
        session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = runs(i)(5) & runs(i)(1)
        session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 17
        session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
        session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\Documents\\LX10\"
        session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
        session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 13
        session.findById(\"wnd[1]/tbar[0]/btn[0]\").press

        \' Zurück aus der Ergebnisliste
        session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
        session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
        WScript.Sleep 1000
    End If

Next

\' =============================================================
\' ENDE
\' =============================================================''' ScriptOutput=> SAPProzess51B
Scripting.RunPowershellScript.RunScript Script: $'''get-process -name \"Excel\" | stop-process''' ScriptOutput=> CloseSAP51BExcel
WAIT 1
Scripting.RunVBScript.RunVBScript VBScriptCode: $'''\' =============================================================
\' 1. EINMALIGER VERBINDUNGSAUFBAU ZU SAP
\' =============================================================
If Not IsObject(application) Then
   Set SapGuiAuto  = GetObject(\"SAPGUI\")
   Set application = SapGuiAuto.GetScriptingEngine
End If
If Not IsObject(connection) Then
   Set connection = application.Children(0)
End If
If Not IsObject(session) Then
   Set session    = connection.Children(0)
End If
If IsObject(WScript) Then
   WScript.ConnectObject session,     \"on\"
   WScript.ConnectObject application, \"on\"
End If
session.findById(\"wnd[0]\").maximize

\' =============================================================
\' 2. HILFSFUNKTION: PRÜFEN OB \"KEINE DATEN\" IN STATUSLEISTE
\' =============================================================
Function NoDataInStatusBar()
    Dim sbarText
    On Error Resume Next
    sbarText = session.findById(\"wnd[0]/sbar\").Text
    On Error GoTo 0
    If InStr(1, sbarText, \"Es sind keine Daten vorhanden\", vbTextCompare) > 0 Then
        NoDataInStatusBar = True
    Else
        NoDataInStatusBar = False
    End If
End Function

\' =============================================================
\' 3. PARAMETER FÜR DURCHLÄUFE 590
\' =============================================================
Dim runs(2)
\' runs(i) = Array(LGNUM, BDATU, WERKS, LGTYP, DYN001, FILEPREFIX)

runs(0) = Array(\"590\", \"%FormattedGoToYesterday%\", \"5900\", \"902\", \"101\", \"590_WE_\")
runs(1) = Array(\"590\", \"%FormattedGoToYesterday%\", \"5900\", \"957\", \"\",    \"590_ABL_\")
runs(2) = Array(\"590\", \"%FormattedGoToYesterday%\", \"5900\", \"916\", \"601\", \"590_WA_\")

Dim i
For i = 0 To UBound(runs)

    \' =============================================================
    \' START TRANSAKTION (ruft LX10 immer neu auf)
    \' =============================================================
    session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"/nLX10\"
    session.findById(\"wnd[0]\").sendVKey 0
    session.findById(\"wnd[0]/usr/ctxtT1_LGNUM\").caretPosition = 0
    session.findById(\"wnd[0]\").sendVKey 2

    session.findById(\"wnd[0]/usr/ctxtT1_LGNUM\").text   = runs(i)(0)
    session.findById(\"wnd[0]/usr/ctxtBDATU-LOW\").text  = runs(i)(1)
    session.findById(\"wnd[0]/usr/ctxtWERKS-LOW\").text  = runs(i)(2)
    session.findById(\"wnd[0]/usr/ctxtLGTYP\").text      = runs(i)(3)
    session.findById(\"wnd[0]/usr/ctxtLGTYP\").setFocus
    session.findById(\"wnd[0]/usr/ctxtLGTYP\").caretPosition = 3
    session.findById(\"wnd[0]\").sendVKey 0

    session.findById(\"wnd[0]/tbar[1]/btn[16]\").press
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").expandNode \"          1\"
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").selectNode \"          4\"
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").topNode = \"          1\"
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").doubleClickNode \"          4\"

    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/ctxt%%%%DYN001-LOW\").text = runs(i)(4)
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/ctxt%%%%DYN001-LOW\").setFocus
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/ctxt%%%%DYN001-LOW\").caretPosition = 3
    session.findById(\"wnd[0]\").sendVKey 0

    \' =============================================================
    \' AUSFÜHREN
    \' =============================================================
    session.findById(\"wnd[0]/tbar[1]/btn[8]\").press

    \' =============================================================
    \' PRÜFEN: KEINE DATEN?
    \' =============================================================
    If NoDataInStatusBar() Then
        \' ============================================================
        \' KEINE DATEN: Wir sind noch auf dem Selektionsbildschirm!
        \' Nichts tun - nächster Durchlauf startet mit /nLX10 neu
        \' ============================================================
        WScript.Sleep 1000
        \' Schleife geht automatisch zum nächsten i
        
    Else
        \' =============================================================
        \' DATEN VORHANDEN: EXPORT WIE BISHER
        \' =============================================================
        session.findById(\"wnd[0]/mbar/menu[0]/menu[1]/menu[1]\").select
        session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = runs(i)(5) & runs(i)(1)
        session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 17
        session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
        session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\Documents\\LX10\"
        session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
        session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 13
        session.findById(\"wnd[1]/tbar[0]/btn[0]\").press

        \' Zurück aus der Ergebnisliste
        session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
        session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
        WScript.Sleep 1000
    End If

Next

\' =============================================================
\' ENDE
\' =============================================================''' ScriptOutput=> SAPProzess590
Scripting.RunPowershellScript.RunScript Script: $'''get-process -name \"Excel\" | stop-process''' ScriptOutput=> CloseSAP590Excel
WAIT 1
```

## SAP Friday

```
Scripting.RunVBScript.RunVBScript VBScriptCode: $'''\' =============================================================
\' 1. EINMALIGER VERBINDUNGSAUFBAU ZU SAP
\' =============================================================
If Not IsObject(application) Then
   Set SapGuiAuto  = GetObject(\"SAPGUI\")
   Set application = SapGuiAuto.GetScriptingEngine
End If
If Not IsObject(connection) Then
   Set connection = application.Children(0)
End If
If Not IsObject(session) Then
   Set session    = connection.Children(0)
End If
If IsObject(WScript) Then
   WScript.ConnectObject session,     \"on\"
   WScript.ConnectObject application, \"on\"
End If
session.findById(\"wnd[0]\").maximize

\' =============================================================
\' 2. HILFSFUNKTION: PRÜFEN OB \"KEINE DATEN\" IN STATUSLEISTE
\' =============================================================
Function NoDataInStatusBar()
    Dim sbarText
    On Error Resume Next
    sbarText = session.findById(\"wnd[0]/sbar\").Text
    On Error GoTo 0
    If InStr(1, sbarText, \"Es sind keine Daten vorhanden\", vbTextCompare) > 0 Then
        NoDataInStatusBar = True
    Else
        NoDataInStatusBar = False
    End If
End Function

\' =============================================================
\' 3. PARAMETER FÜR DURCHLÄUFE 510
\' =============================================================
Dim runs(2)
\' runs(i) = Array(LGNUM, BDATU, WERKS, LGTYP, DYN001, FILEPREFIX)

runs(0) = Array(\"510\", \"%FormattedGoToYesterday%\", \"5100\", \"902\", \"101\", \"510_WE_\")
runs(1) = Array(\"510\", \"%FormattedGoToYesterday%\", \"5100\", \"957\", \"\",    \"510_ABL_\")
runs(2) = Array(\"510\", \"%FormattedGoToYesterday%\", \"5100\", \"916\", \"601\", \"510_WA_\")

Dim i
For i = 0 To UBound(runs)

    \' =============================================================
    \' START TRANSAKTION (ruft LX10 immer neu auf)
    \' =============================================================
    session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"/nLX10\"
    session.findById(\"wnd[0]\").sendVKey 0
    session.findById(\"wnd[0]/usr/ctxtT1_LGNUM\").caretPosition = 0
    session.findById(\"wnd[0]\").sendVKey 2

    session.findById(\"wnd[0]/usr/ctxtT1_LGNUM\").text   = runs(i)(0)
    session.findById(\"wnd[0]/usr/ctxtBDATU-LOW\").text  = runs(i)(1)
    session.findById(\"wnd[0]/usr/ctxtWERKS-LOW\").text  = runs(i)(2)
    session.findById(\"wnd[0]/usr/ctxtLGTYP\").text      = runs(i)(3)
    session.findById(\"wnd[0]/usr/ctxtLGTYP\").setFocus
    session.findById(\"wnd[0]/usr/ctxtLGTYP\").caretPosition = 3
    session.findById(\"wnd[0]\").sendVKey 0

    session.findById(\"wnd[0]/tbar[1]/btn[16]\").press
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").expandNode \"          1\"
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").selectNode \"          4\"
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").topNode = \"          1\"
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").doubleClickNode \"          4\"

    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/ctxt%%%%DYN001-LOW\").text = runs(i)(4)
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/ctxt%%%%DYN001-LOW\").setFocus
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/ctxt%%%%DYN001-LOW\").caretPosition = 3
    session.findById(\"wnd[0]\").sendVKey 0

    \' =============================================================
    \' AUSFÜHREN
    \' =============================================================
    session.findById(\"wnd[0]/tbar[1]/btn[8]\").press

    \' =============================================================
    \' PRÜFEN: KEINE DATEN?
    \' =============================================================
    If NoDataInStatusBar() Then
        \' ============================================================
        \' KEINE DATEN: Wir sind noch auf dem Selektionsbildschirm!
        \' Nichts tun - nächster Durchlauf startet mit /nLX10 neu
        \' ============================================================
        WScript.Sleep 1000
        \' Schleife geht automatisch zum nächsten i
        
    Else
        \' =============================================================
        \' DATEN VORHANDEN: EXPORT WIE BISHER
        \' =============================================================
        session.findById(\"wnd[0]/mbar/menu[0]/menu[1]/menu[1]\").select
        session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = runs(i)(5) & runs(i)(1)
        session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 17
        session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
        session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\Documents\\LX10\"
        session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
        session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 13
        session.findById(\"wnd[1]/tbar[0]/btn[0]\").press

        \' Zurück aus der Ergebnisliste
        session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
        session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
        WScript.Sleep 1000
    End If

Next

\' =============================================================
\' ENDE
\' =============================================================''' ScriptOutput=> SAPProzess510 ScriptError=> ScriptError
Scripting.RunPowershellScript.RunScript Script: $'''get-process -name \"Excel\" | stop-process''' ScriptOutput=> CloseSAP510Excel
WAIT 1
Scripting.RunVBScript.RunVBScript VBScriptCode: $'''\' =============================================================
\' 1. EINMALIGER VERBINDUNGSAUFBAU ZU SAP
\' =============================================================
If Not IsObject(application) Then
   Set SapGuiAuto  = GetObject(\"SAPGUI\")
   Set application = SapGuiAuto.GetScriptingEngine
End If
If Not IsObject(connection) Then
   Set connection = application.Children(0)
End If
If Not IsObject(session) Then
   Set session    = connection.Children(0)
End If
If IsObject(WScript) Then
   WScript.ConnectObject session,     \"on\"
   WScript.ConnectObject application, \"on\"
End If
session.findById(\"wnd[0]\").maximize

\' =============================================================
\' 2. HILFSFUNKTION: PRÜFEN OB \"KEINE DATEN\" IN STATUSLEISTE
\' =============================================================
Function NoDataInStatusBar()
    Dim sbarText
    On Error Resume Next
    sbarText = session.findById(\"wnd[0]/sbar\").Text
    On Error GoTo 0
    If InStr(1, sbarText, \"Es sind keine Daten vorhanden\", vbTextCompare) > 0 Then
        NoDataInStatusBar = True
    Else
        NoDataInStatusBar = False
    End If
End Function

\' =============================================================
\' 3. PARAMETER FÜR DURCHLÄUFE
\' =============================================================
Dim runs(2)
\' runs(i) = Array(LGNUM, BDATU, WERKS, LGTYP, DYN001, FILEPREFIX)

runs(0) = Array(\"511\", \"%FormattedGoToYesterday%\", \"5110\", \"902\", \"101\", \"511_WE_\")
runs(1) = Array(\"511\", \"%FormattedGoToYesterday%\", \"5110\", \"957\", \"\",    \"511_ABL_\")
runs(2) = Array(\"511\", \"%FormattedGoToYesterday%\", \"5110\", \"916\", \"601\", \"511_WA_\")

Dim i
For i = 0 To UBound(runs)

    \' =============================================================
    \' START TRANSAKTION (ruft LX10 immer neu auf)
    \' =============================================================
    session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"/nLX10\"
    session.findById(\"wnd[0]\").sendVKey 0
    session.findById(\"wnd[0]/usr/ctxtT1_LGNUM\").caretPosition = 0
    session.findById(\"wnd[0]\").sendVKey 2

    session.findById(\"wnd[0]/usr/ctxtT1_LGNUM\").text   = runs(i)(0)
    session.findById(\"wnd[0]/usr/ctxtBDATU-LOW\").text  = runs(i)(1)
    session.findById(\"wnd[0]/usr/ctxtWERKS-LOW\").text  = runs(i)(2)
    session.findById(\"wnd[0]/usr/ctxtLGTYP\").text      = runs(i)(3)
    session.findById(\"wnd[0]/usr/ctxtLGTYP\").setFocus
    session.findById(\"wnd[0]/usr/ctxtLGTYP\").caretPosition = 3
    session.findById(\"wnd[0]\").sendVKey 0

    session.findById(\"wnd[0]/tbar[1]/btn[16]\").press
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").expandNode \"          1\"
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").selectNode \"          4\"
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").topNode = \"          1\"
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").doubleClickNode \"          4\"

    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/ctxt%%%%DYN001-LOW\").text = runs(i)(4)
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/ctxt%%%%DYN001-LOW\").setFocus
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/ctxt%%%%DYN001-LOW\").caretPosition = 3
    session.findById(\"wnd[0]\").sendVKey 0

    \' =============================================================
    \' AUSFÜHREN
    \' =============================================================
    session.findById(\"wnd[0]/tbar[1]/btn[8]\").press

    \' =============================================================
    \' PRÜFEN: KEINE DATEN?
    \' =============================================================
    If NoDataInStatusBar() Then
        \' ============================================================
        \' KEINE DATEN: Wir sind noch auf dem Selektionsbildschirm!
        \' Nichts tun - nächster Durchlauf startet mit /nLX10 neu
        \' ============================================================
        WScript.Sleep 500
        \' Schleife geht automatisch zum nächsten i
        
    Else
        \' =============================================================
        \' DATEN VORHANDEN: EXPORT WIE BISHER
        \' =============================================================
        session.findById(\"wnd[0]/mbar/menu[0]/menu[1]/menu[1]\").select
        session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = runs(i)(5) & runs(i)(1)
        session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 17
        session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
        session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\Documents\\LX10\"
        session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
        session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 13
        session.findById(\"wnd[1]/tbar[0]/btn[0]\").press

        \' Zurück aus der Ergebnisliste
        session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
        session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
        WScript.Sleep 1000
    End If

Next

\' =============================================================
\' ENDE
\' =============================================================''' ScriptOutput=> SAPProzess511
Scripting.RunPowershellScript.RunScript Script: $'''get-process -name \"Excel\" | stop-process''' ScriptOutput=> CloseSAP511Excel
WAIT 1
Scripting.RunVBScript.RunVBScript VBScriptCode: $'''\' =============================================================
\' 1. EINMALIGER VERBINDUNGSAUFBAU ZU SAP
\' =============================================================
If Not IsObject(application) Then
   Set SapGuiAuto  = GetObject(\"SAPGUI\")
   Set application = SapGuiAuto.GetScriptingEngine
End If
If Not IsObject(connection) Then
   Set connection = application.Children(0)
End If
If Not IsObject(session) Then
   Set session    = connection.Children(0)
End If
If IsObject(WScript) Then
   WScript.ConnectObject session,     \"on\"
   WScript.ConnectObject application, \"on\"
End If
session.findById(\"wnd[0]\").maximize

\' =============================================================
\' 2. HILFSFUNKTION: PRÜFEN OB \"KEINE DATEN\" IN STATUSLEISTE
\' =============================================================
Function NoDataInStatusBar()
    Dim sbarText
    On Error Resume Next
    sbarText = session.findById(\"wnd[0]/sbar\").Text
    On Error GoTo 0
    If InStr(1, sbarText, \"Es sind keine Daten vorhanden\", vbTextCompare) > 0 Then
        NoDataInStatusBar = True
    Else
        NoDataInStatusBar = False
    End If
End Function

\' =============================================================
\' 3. PARAMETER FÜR DURCHLÄUFE 512
\' =============================================================
Dim runs(2)
\' runs(i) = Array(LGNUM, BDATU, WERKS, LGTYP, DYN001, FILEPREFIX)

runs(0) = Array(\"512\", \"%FormattedGoToYesterday%\", \"5100\", \"902\", \"101\", \"512_WE_\")
runs(1) = Array(\"512\", \"%FormattedGoToYesterday%\", \"5100\", \"957\", \"\",    \"512_ABL_\")
runs(2) = Array(\"512\", \"%FormattedGoToYesterday%\", \"5100\", \"916\", \"601\", \"512_WA_\")

Dim i
For i = 0 To UBound(runs)

    \' =============================================================
    \' START TRANSAKTION (ruft LX10 immer neu auf)
    \' =============================================================
    session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"/nLX10\"
    session.findById(\"wnd[0]\").sendVKey 0
    session.findById(\"wnd[0]/usr/ctxtT1_LGNUM\").caretPosition = 0
    session.findById(\"wnd[0]\").sendVKey 2

    session.findById(\"wnd[0]/usr/ctxtT1_LGNUM\").text   = runs(i)(0)
    session.findById(\"wnd[0]/usr/ctxtBDATU-LOW\").text  = runs(i)(1)
    session.findById(\"wnd[0]/usr/ctxtWERKS-LOW\").text  = runs(i)(2)
    session.findById(\"wnd[0]/usr/ctxtLGTYP\").text      = runs(i)(3)
    session.findById(\"wnd[0]/usr/ctxtLGTYP\").setFocus
    session.findById(\"wnd[0]/usr/ctxtLGTYP\").caretPosition = 3
    session.findById(\"wnd[0]\").sendVKey 0

    session.findById(\"wnd[0]/tbar[1]/btn[16]\").press
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").expandNode \"          1\"
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").selectNode \"          4\"
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").topNode = \"          1\"
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").doubleClickNode \"          4\"

    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/ctxt%%%%DYN001-LOW\").text = runs(i)(4)
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/ctxt%%%%DYN001-LOW\").setFocus
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/ctxt%%%%DYN001-LOW\").caretPosition = 3
    session.findById(\"wnd[0]\").sendVKey 0

    \' =============================================================
    \' AUSFÜHREN
    \' =============================================================
    session.findById(\"wnd[0]/tbar[1]/btn[8]\").press

    \' =============================================================
    \' PRÜFEN: KEINE DATEN?
    \' =============================================================
    If NoDataInStatusBar() Then
        \' ============================================================
        \' KEINE DATEN: Wir sind noch auf dem Selektionsbildschirm!
        \' Nichts tun - nächster Durchlauf startet mit /nLX10 neu
        \' ============================================================
        WScript.Sleep 1000
        \' Schleife geht automatisch zum nächsten i
        
    Else
        \' =============================================================
        \' DATEN VORHANDEN: EXPORT WIE BISHER
        \' =============================================================
        session.findById(\"wnd[0]/mbar/menu[0]/menu[1]/menu[1]\").select
        session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = runs(i)(5) & runs(i)(1)
        session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 17
        session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
        session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\Documents\\LX10\"
        session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
        session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 13
        session.findById(\"wnd[1]/tbar[0]/btn[0]\").press

        \' Zurück aus der Ergebnisliste
        session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
        session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
        WScript.Sleep 1000
    End If

Next

\' =============================================================
\' ENDE
\' =============================================================''' ScriptOutput=> SAPProzess512
Scripting.RunPowershellScript.RunScript Script: $'''get-process -name \"Excel\" | stop-process''' ScriptOutput=> CloseSAP512Excel
WAIT 1
Scripting.RunVBScript.RunVBScript VBScriptCode: $'''\' =============================================================
\' 1. EINMALIGER VERBINDUNGSAUFBAU ZU SAP
\' =============================================================
If Not IsObject(application) Then
   Set SapGuiAuto  = GetObject(\"SAPGUI\")
   Set application = SapGuiAuto.GetScriptingEngine
End If
If Not IsObject(connection) Then
   Set connection = application.Children(0)
End If
If Not IsObject(session) Then
   Set session    = connection.Children(0)
End If
If IsObject(WScript) Then
   WScript.ConnectObject session,     \"on\"
   WScript.ConnectObject application, \"on\"
End If
session.findById(\"wnd[0]\").maximize

\' =============================================================
\' 2. HILFSFUNKTION: PRÜFEN OB \"KEINE DATEN\" IN STATUSLEISTE
\' =============================================================
Function NoDataInStatusBar()
    Dim sbarText
    On Error Resume Next
    sbarText = session.findById(\"wnd[0]/sbar\").Text
    On Error GoTo 0
    If InStr(1, sbarText, \"Es sind keine Daten vorhanden\", vbTextCompare) > 0 Then
        NoDataInStatusBar = True
    Else
        NoDataInStatusBar = False
    End If
End Function

\' =============================================================
\' 3. PARAMETER FÜR DURCHLÄUFE 510
\' =============================================================
Dim runs(2)
\' runs(i) = Array(LGNUM, BDATU, WERKS, LGTYP, DYN001, FILEPREFIX)

runs(0) = Array(\"51B\", \"%FormattedGoToYesterday%\", \"5100\", \"902\", \"101\", \"51B_WE_\")
runs(1) = Array(\"51B\", \"%FormattedGoToYesterday%\", \"5100\", \"957\", \"\",    \"51B_ABL_\")
runs(2) = Array(\"51B\", \"%FormattedGoToYesterday%\", \"5100\", \"916\", \"601\", \"51B_WA_\")

Dim i
For i = 0 To UBound(runs)

    \' =============================================================
    \' START TRANSAKTION (ruft LX10 immer neu auf)
    \' =============================================================
    session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"/nLX10\"
    session.findById(\"wnd[0]\").sendVKey 0
    session.findById(\"wnd[0]/usr/ctxtT1_LGNUM\").caretPosition = 0
    session.findById(\"wnd[0]\").sendVKey 2

    session.findById(\"wnd[0]/usr/ctxtT1_LGNUM\").text   = runs(i)(0)
    session.findById(\"wnd[0]/usr/ctxtBDATU-LOW\").text  = runs(i)(1)
    session.findById(\"wnd[0]/usr/ctxtWERKS-LOW\").text  = runs(i)(2)
    session.findById(\"wnd[0]/usr/ctxtLGTYP\").text      = runs(i)(3)
    session.findById(\"wnd[0]/usr/ctxtLGTYP\").setFocus
    session.findById(\"wnd[0]/usr/ctxtLGTYP\").caretPosition = 3
    session.findById(\"wnd[0]\").sendVKey 0

    session.findById(\"wnd[0]/tbar[1]/btn[16]\").press
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").expandNode \"          1\"
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").selectNode \"          4\"
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").topNode = \"          1\"
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").doubleClickNode \"          4\"

    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/ctxt%%%%DYN001-LOW\").text = runs(i)(4)
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/ctxt%%%%DYN001-LOW\").setFocus
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/ctxt%%%%DYN001-LOW\").caretPosition = 3
    session.findById(\"wnd[0]\").sendVKey 0

    \' =============================================================
    \' AUSFÜHREN
    \' =============================================================
    session.findById(\"wnd[0]/tbar[1]/btn[8]\").press

    \' =============================================================
    \' PRÜFEN: KEINE DATEN?
    \' =============================================================
    If NoDataInStatusBar() Then
        \' ============================================================
        \' KEINE DATEN: Wir sind noch auf dem Selektionsbildschirm!
        \' Nichts tun - nächster Durchlauf startet mit /nLX10 neu
        \' ============================================================
        WScript.Sleep 1000
        \' Schleife geht automatisch zum nächsten i
        
    Else
        \' =============================================================
        \' DATEN VORHANDEN: EXPORT WIE BISHER
        \' =============================================================
        session.findById(\"wnd[0]/mbar/menu[0]/menu[1]/menu[1]\").select
        session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = runs(i)(5) & runs(i)(1)
        session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 17
        session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
        session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\Documents\\LX10\"
        session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
        session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 13
        session.findById(\"wnd[1]/tbar[0]/btn[0]\").press

        \' Zurück aus der Ergebnisliste
        session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
        session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
        WScript.Sleep 1000
    End If

Next

\' =============================================================
\' ENDE
\' =============================================================''' ScriptOutput=> SAPProzess51B
Scripting.RunPowershellScript.RunScript Script: $'''get-process -name \"Excel\" | stop-process''' ScriptOutput=> CloseSAP51BExcel
WAIT 1
Scripting.RunVBScript.RunVBScript VBScriptCode: $'''\' =============================================================
\' 1. EINMALIGER VERBINDUNGSAUFBAU ZU SAP
\' =============================================================
If Not IsObject(application) Then
   Set SapGuiAuto  = GetObject(\"SAPGUI\")
   Set application = SapGuiAuto.GetScriptingEngine
End If
If Not IsObject(connection) Then
   Set connection = application.Children(0)
End If
If Not IsObject(session) Then
   Set session    = connection.Children(0)
End If
If IsObject(WScript) Then
   WScript.ConnectObject session,     \"on\"
   WScript.ConnectObject application, \"on\"
End If
session.findById(\"wnd[0]\").maximize

\' =============================================================
\' 2. HILFSFUNKTION: PRÜFEN OB \"KEINE DATEN\" IN STATUSLEISTE
\' =============================================================
Function NoDataInStatusBar()
    Dim sbarText
    On Error Resume Next
    sbarText = session.findById(\"wnd[0]/sbar\").Text
    On Error GoTo 0
    If InStr(1, sbarText, \"Es sind keine Daten vorhanden\", vbTextCompare) > 0 Then
        NoDataInStatusBar = True
    Else
        NoDataInStatusBar = False
    End If
End Function

\' =============================================================
\' 3. PARAMETER FÜR DURCHLÄUFE 590
\' =============================================================
Dim runs(2)
\' runs(i) = Array(LGNUM, BDATU, WERKS, LGTYP, DYN001, FILEPREFIX)

runs(0) = Array(\"590\", \"%FormattedGoToYesterday%\", \"5900\", \"902\", \"101\", \"590_WE_\")
runs(1) = Array(\"590\", \"%FormattedGoToYesterday%\", \"5900\", \"957\", \"\",    \"590_ABL_\")
runs(2) = Array(\"590\", \"%FormattedGoToYesterday%\", \"5900\", \"916\", \"601\", \"590_WA_\")

Dim i
For i = 0 To UBound(runs)

    \' =============================================================
    \' START TRANSAKTION (ruft LX10 immer neu auf)
    \' =============================================================
    session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"/nLX10\"
    session.findById(\"wnd[0]\").sendVKey 0
    session.findById(\"wnd[0]/usr/ctxtT1_LGNUM\").caretPosition = 0
    session.findById(\"wnd[0]\").sendVKey 2

    session.findById(\"wnd[0]/usr/ctxtT1_LGNUM\").text   = runs(i)(0)
    session.findById(\"wnd[0]/usr/ctxtBDATU-LOW\").text  = runs(i)(1)
    session.findById(\"wnd[0]/usr/ctxtWERKS-LOW\").text  = runs(i)(2)
    session.findById(\"wnd[0]/usr/ctxtLGTYP\").text      = runs(i)(3)
    session.findById(\"wnd[0]/usr/ctxtLGTYP\").setFocus
    session.findById(\"wnd[0]/usr/ctxtLGTYP\").caretPosition = 3
    session.findById(\"wnd[0]\").sendVKey 0

    session.findById(\"wnd[0]/tbar[1]/btn[16]\").press
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").expandNode \"          1\"
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").selectNode \"          4\"
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").topNode = \"          1\"
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell\").doubleClickNode \"          4\"

    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/ctxt%%%%DYN001-LOW\").text = runs(i)(4)
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/ctxt%%%%DYN001-LOW\").setFocus
    session.findById(\"wnd[0]/usr/ssub%%_SUBSCREEN_%%_SUB%%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/ctxt%%%%DYN001-LOW\").caretPosition = 3
    session.findById(\"wnd[0]\").sendVKey 0

    \' =============================================================
    \' AUSFÜHREN
    \' =============================================================
    session.findById(\"wnd[0]/tbar[1]/btn[8]\").press

    \' =============================================================
    \' PRÜFEN: KEINE DATEN?
    \' =============================================================
    If NoDataInStatusBar() Then
        \' ============================================================
        \' KEINE DATEN: Wir sind noch auf dem Selektionsbildschirm!
        \' Nichts tun - nächster Durchlauf startet mit /nLX10 neu
        \' ============================================================
        WScript.Sleep 1000
        \' Schleife geht automatisch zum nächsten i
        
    Else
        \' =============================================================
        \' DATEN VORHANDEN: EXPORT WIE BISHER
        \' =============================================================
        session.findById(\"wnd[0]/mbar/menu[0]/menu[1]/menu[1]\").select
        session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = runs(i)(5) & runs(i)(1)
        session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 17
        session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
        session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\Documents\\LX10\"
        session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
        session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 13
        session.findById(\"wnd[1]/tbar[0]/btn[0]\").press

        \' Zurück aus der Ergebnisliste
        session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
        session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
        WScript.Sleep 1000
    End If

Next

\' =============================================================
\' ENDE
\' =============================================================''' ScriptOutput=> SAPProzess590
Scripting.RunPowershellScript.RunScript Script: $'''get-process -name \"Excel\" | stop-process''' ScriptOutput=> CloseSAP590Excel
WAIT 1
```