# PAD-Prozess

## Main

```
CALL Get_DateTime_Variable
CALL SAP_Process
CALL Data_Preperation
```

## Get_DateTime_Variable

```
DateTime.GetCurrentDateTime.Local DateTimeFormat: DateTime.DateTimeFormat.DateOnly CurrentDateTime=> CurrentDateTime
Text.ConvertDateTimeToText.FromCustomDateTime DateTime: CurrentDateTime CustomFormat: $'''ddMMyyy''' Result=> IDNumber
SET Wochentag TO CurrentDateTime.DayOfWeek
SET Montag TO $'''Monday'''
IF Wochentag = Montag THEN
    DateTime.Add DateTime: CurrentDateTime TimeToAdd: -3 TimeUnit: DateTime.TimeUnit.Days ResultedDate=> GoToFriday
    Text.ConvertDateTimeToText.FromDateTime DateTime: GoToFriday StandardFormat: Text.WellKnownDateTimeFormat.ShortDate Result=> FormattedGoToFriday
    Text.ConvertDateTimeToText.FromCustomDateTime DateTime: GoToFriday CustomFormat: $'''dd.MM.yyyy''' Result=> Datetime
ELSE IF Wochentag <> Montag THEN
    DateTime.Add DateTime: CurrentDateTime TimeToAdd: -1 TimeUnit: DateTime.TimeUnit.Days ResultedDate=> GoToYesterday
    Text.ConvertDateTimeToText.FromDateTime DateTime: GoToYesterday StandardFormat: Text.WellKnownDateTimeFormat.ShortDate Result=> FormattedGoToYesterday
    Text.ConvertDateTimeToText.FromCustomDateTime DateTime: GoToYesterday CustomFormat: $'''dd.MM.yyyy''' Result=> Datetime
END
```

## SAP_Prozess

```
SAP.SapLogin.SapSSOLogInOptionTerminate Description: $'''10: PS4 - Production S/4 HANA''' Client: $'''009''' Username: $'''5100LSS1''' Language: $'''DE''' SapInstance=> SapInstance CurrentSapLoginTerminated=> CurrentSapLoginTerminated
WAIT 5
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
    If InStr(1, sbarText, \"keine\", vbTextCompare) > 0 Then
        NoDataInStatusBar = True
    ElseIf InStr(1, sbarText, \"no data\", vbTextCompare) > 0 Then
        NoDataInStatusBar = True
    ElseIf InStr(1, sbarText, \"nicht gefunden\", vbTextCompare) > 0 Then
        NoDataInStatusBar = True
    Else
        NoDataInStatusBar = False
    End If
End Function

\' ========================================================================
\' DISPATCH 601
\' ========================================================================
session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"/n/LSGIT/WM_LL_TO\"
session.findById(\"wnd[0]\").sendVKey 0
session.findById(\"wnd[0]/usr/ctxtP_LGNUM\").text = \"51B\"
session.findById(\"wnd[0]/usr/ctxtS_BWLVS-LOW\").text = \"601\"
session.findById(\"wnd[0]/usr/ctxtS_KQUIT-LOW\").text = \"x\"
session.findById(\"wnd[0]/usr/ctxtS_QDATU-LOW\").text = \"%Datetime%\"
session.findById(\"wnd[0]/usr/ctxtS_PQUIT-LOW\").text = \"x\"
session.findById(\"wnd[0]/usr/ctxtS_NLTYP-LOW\").text = \"916\"
session.findById(\"wnd[0]/usr/ctxtS_NLTYP-LOW\").setFocus
session.findById(\"wnd[0]/usr/ctxtS_NLTYP-LOW\").caretPosition = 3
session.findById(\"wnd[0]/tbar[1]/btn[8]\").press

If Not NoDataInStatusBar() Then
    session.findById(\"wnd[0]/shellcont/shellcont/shell/shellcont[0]/shell\").currentCellColumn = \"MATNR\"
    session.findById(\"wnd[0]/shellcont/shellcont/shell/shellcont[0]/shell\").contextMenu
    session.findById(\"wnd[0]/shellcont/shellcont/shell/shellcont[0]/shell\").selectContextMenuItem \"&XXL\"
    session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = \"51B_Tonnage_%Datetime%\"
    session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 12
    session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
    session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\Documents\\Illingen\"
    session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
    session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 36
    session.findById(\"wnd[1]/tbar[0]/btn[0]\").press
End If
WScript.Sleep 1000

\' ========================================================================
\' INCOMMING GOODS TO STOCK 101
\' ========================================================================
session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"/n/LSGIT/WM_LL_TO\"
session.findById(\"wnd[0]\").sendVKey 0
session.findById(\"wnd[0]/usr/ctxtP_LGNUM\").text = \"51B\"
session.findById(\"wnd[0]/usr/ctxtS_BWLVS-LOW\").text = \"101\"
session.findById(\"wnd[0]/usr/ctxtS_KQUIT-LOW\").text = \"x\"
session.findById(\"wnd[0]/usr/ctxtS_QDATU-LOW\").text = \"%Datetime%\"
session.findById(\"wnd[0]/usr/ctxtS_PQUIT-LOW\").text = \"x\"
session.findById(\"wnd[0]/usr/ctxtS_NLTYP-LOW\").setFocus
session.findById(\"wnd[0]/usr/ctxtS_NLTYP-LOW\").caretPosition = 3
session.findById(\"wnd[0]/tbar[1]/btn[8]\").press

If Not NoDataInStatusBar() Then
    session.findById(\"wnd[0]/shellcont/shellcont/shell/shellcont[0]/shell\").currentCellColumn = \"MATNR\"
    session.findById(\"wnd[0]/shellcont/shellcont/shell/shellcont[0]/shell\").contextMenu
    session.findById(\"wnd[0]/shellcont/shellcont/shell/shellcont[0]/shell\").selectContextMenuItem \"&XXL\"
    session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = \"51B_WE_%Datetime%\"
    session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 12
    session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
    session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\Documents\\Illingen\"
    session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
    session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 36
    session.findById(\"wnd[1]/tbar[0]/btn[0]\").press
End If
WScript.Sleep 1000

\' ========================================================================
\' STOCK TO CUT
\' ========================================================================
session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"/n/LSGIT/WM_LL_TO\"
session.findById(\"wnd[0]\").sendVKey 0
session.findById(\"wnd[0]/usr/ctxtP_LGNUM\").text = \"51B\"
session.findById(\"wnd[0]/usr/ctxtS_BWLVS-LOW\").text = \"994\"
session.findById(\"wnd[0]/usr/ctxtS_KQUIT-LOW\").text = \"x\"
session.findById(\"wnd[0]/usr/ctxtS_QDATU-LOW\").text = \"%Datetime%\"
session.findById(\"wnd[0]/usr/ctxtS_PQUIT-LOW\").text = \"x\"
session.findById(\"wnd[0]/usr/ctxtS_NLTYP-LOW\").setFocus
session.findById(\"wnd[0]/usr/ctxtS_NLTYP-LOW\").caretPosition = 3
session.findById(\"wnd[0]/tbar[1]/btn[8]\").press

If Not NoDataInStatusBar() Then
    session.findById(\"wnd[0]/shellcont/shellcont/shell/shellcont[0]/shell\").currentCellColumn = \"MATNR\"
    session.findById(\"wnd[0]/shellcont/shellcont/shell/shellcont[0]/shell\").contextMenu
    session.findById(\"wnd[0]/shellcont/shellcont/shell/shellcont[0]/shell\").selectContextMenuItem \"&XXL\"
    session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = \"51B_StockCut_%Datetime%\"
    session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 12
    session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
    session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\Documents\\Illingen\"
    session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
    session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 36
    session.findById(\"wnd[1]/tbar[0]/btn[0]\").press
End If
WScript.Sleep 1000

\' ========================================================================
\' CUT TO STOCK
\' ========================================================================
session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"/n/LSGIT/WM_LL_TO\"
session.findById(\"wnd[0]\").sendVKey 0
session.findById(\"wnd[0]/usr/ctxtP_LGNUM\").text = \"51B\"
session.findById(\"wnd[0]/usr/ctxtS_BWLVS-LOW\").text = \"995\"
session.findById(\"wnd[0]/usr/ctxtS_KQUIT-LOW\").text = \"x\"
session.findById(\"wnd[0]/usr/ctxtS_QDATU-LOW\").text = \"%Datetime%\"
session.findById(\"wnd[0]/usr/ctxtS_PQUIT-LOW\").text = \"x\"
session.findById(\"wnd[0]/usr/ctxtS_NLTYP-LOW\").setFocus
session.findById(\"wnd[0]/usr/ctxtS_NLTYP-LOW\").caretPosition = 3
session.findById(\"wnd[0]/tbar[1]/btn[8]\").press

If Not NoDataInStatusBar() Then
    session.findById(\"wnd[0]/shellcont/shellcont/shell/shellcont[0]/shell\").currentCellColumn = \"MATNR\"
    session.findById(\"wnd[0]/shellcont/shellcont/shell/shellcont[0]/shell\").contextMenu
    session.findById(\"wnd[0]/shellcont/shellcont/shell/shellcont[0]/shell\").selectContextMenuItem \"&XXL\"
    session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = \"51B_StockCut_%Datetime%\"
    session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 12
    session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
    session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\Documents\\Illingen\"
    session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
    session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 36
    session.findById(\"wnd[1]/tbar[0]/btn[0]\").press
End If
WScript.Sleep 1000

\' ========================================================================
\' CUTS 909
\' ========================================================================
session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"/n/LSGIT/WM_LL_TO\"
session.findById(\"wnd[0]\").sendVKey 0
session.findById(\"wnd[0]/usr/ctxtP_LGNUM\").text = \"51B\"
session.findById(\"wnd[0]/usr/ctxtS_BWLVS-LOW\").text = \"909\"
session.findById(\"wnd[0]/usr/ctxtS_KQUIT-LOW\").text = \"x\"
session.findById(\"wnd[0]/usr/ctxtS_WERKS-LOW\").text = \"5100\"
session.findById(\"wnd[0]/usr/ctxtS_LGORT-LOW\").text = \"1090\"
session.findById(\"wnd[0]/usr/ctxtS_QDATU-LOW\").text = \"%Datetime%\"
session.findById(\"wnd[0]/usr/ctxtS_PQUIT-LOW\").text = \"x\"
session.findById(\"wnd[0]/usr/ctxtP_VAR\").text = \"CUT_LC8_ANZ\"
session.findById(\"wnd[0]/usr/ctxtP_VAR\").setFocus
session.findById(\"wnd[0]/usr/ctxtP_VAR\").caretPosition = 11
session.findById(\"wnd[0]/tbar[1]/btn[8]\").press

If Not NoDataInStatusBar() Then
    session.findById(\"wnd[0]/shellcont/shellcont/shell/shellcont[0]/shell\").pressToolbarButton \"TOOLBAR1\"
    session.findById(\"wnd[0]/shellcont/shellcont/shell/shellcont[0]/shell\").pressToolbarContextButton \"&MB_VARIANT\"
    session.findById(\"wnd[0]/shellcont/shellcont/shell/shellcont[0]/shell\").selectContextMenuItem \"&LOAD\"
    session.findById(\"wnd[1]/usr/subSUB_CONFIGURATION:SAPLSALV_CUL_LAYOUT_CHOOSE:0500/cntlD500_CONTAINER/shellcont/shell\").clickCurrentCell
    session.findById(\"wnd[0]/shellcont/shellcont/shell/shellcont[0]/shell\").currentCellColumn = \"CHARG\"
    session.findById(\"wnd[0]/shellcont/shellcont/shell/shellcont[0]/shell\").contextMenu
    session.findById(\"wnd[0]/shellcont/shellcont/shell/shellcont[0]/shell\").selectContextMenuItem \"&XXL\"
    session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = \"51B_CutAnz_%Datetime%\"
    session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 8
    session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
    session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\Documents\\Illingen\"
    session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
    session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 36
    session.findById(\"wnd[1]/tbar[0]/btn[0]\").press
End If
WScript.Sleep 1000

\' ========================================================================
\' SCRAP 951
\' ========================================================================
session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"/n/LSGIT/WM_LL_TO\"
session.findById(\"wnd[0]\").sendVKey 0
session.findById(\"wnd[0]/usr/ctxtP_LGNUM\").text = \"51B\"
session.findById(\"wnd[0]/usr/ctxtS_BWLVS-LOW\").text = \"951\"
session.findById(\"wnd[0]/usr/ctxtS_KQUIT-LOW\").text = \"x\"
session.findById(\"wnd[0]/usr/ctxtS_QDATU-LOW\").text = \"%Datetime%\"
session.findById(\"wnd[0]/usr/ctxtS_PQUIT-LOW\").text = \"x\"
session.findById(\"wnd[0]/usr/ctxtS_NLTYP-LOW\").setFocus
session.findById(\"wnd[0]/usr/ctxtS_NLTYP-LOW\").caretPosition = 3
session.findById(\"wnd[0]/tbar[1]/btn[8]\").press

If Not NoDataInStatusBar() Then
    session.findById(\"wnd[0]/shellcont/shellcont/shell/shellcont[0]/shell\").currentCellColumn = \"MATNR\"
    session.findById(\"wnd[0]/shellcont/shellcont/shell/shellcont[0]/shell\").contextMenu
    session.findById(\"wnd[0]/shellcont/shellcont/shell/shellcont[0]/shell\").selectContextMenuItem \"&XXL\"
    session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = \"51B_Scrap_%Datetime%\"
    session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 12
    session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
    session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\Documents\\Illingen\"
    session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
    session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 36
    session.findById(\"wnd[1]/tbar[0]/btn[0]\").press
End If
WScript.Sleep 1000

\' ========================================================================
\' SCRAP MA 551
\' ========================================================================
session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"/n/LSGIT/WM_LL_TO\"
session.findById(\"wnd[0]\").sendVKey 0
session.findById(\"wnd[0]/usr/ctxtP_LGNUM\").text = \"51B\"
session.findById(\"wnd[0]/usr/ctxtS_BWLVS-LOW\").text = \"551\"
session.findById(\"wnd[0]/usr/ctxtS_KQUIT-LOW\").text = \"x\"
session.findById(\"wnd[0]/usr/ctxtS_QDATU-LOW\").text = \"%Datetime%\"
session.findById(\"wnd[0]/usr/ctxtS_PQUIT-LOW\").text = \"x\"
session.findById(\"wnd[0]/usr/ctxtS_NLTYP-LOW\").setFocus
session.findById(\"wnd[0]/usr/ctxtS_NLTYP-LOW\").caretPosition = 3
session.findById(\"wnd[0]/tbar[1]/btn[8]\").press

If Not NoDataInStatusBar() Then
    session.findById(\"wnd[0]/shellcont/shellcont/shell/shellcont[0]/shell\").currentCellColumn = \"MATNR\"
    session.findById(\"wnd[0]/shellcont/shellcont/shell/shellcont[0]/shell\").contextMenu
    session.findById(\"wnd[0]/shellcont/shellcont/shell/shellcont[0]/shell\").selectContextMenuItem \"&XXL\"
    session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = \"51B_ScrapMA_%Datetime%\"
    session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 12
    session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
    session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\Documents\\Illingen\"
    session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
    session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 36
    session.findById(\"wnd[1]/tbar[0]/btn[0]\").press
End If
WScript.Sleep 1000

\' ========================================================================
\' CUT TO LC6
\' ========================================================================
session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"/n/LSGIT/WM_LL_TO\"
session.findById(\"wnd[0]\").sendVKey 0
session.findById(\"wnd[0]/usr/ctxtP_LGNUM\").text = \"51B\"
session.findById(\"wnd[0]/usr/ctxtS_BWLVS-LOW\").text = \"311\"
session.findById(\"wnd[0]/usr/ctxtS_KQUIT-LOW\").text = \"x\"
session.findById(\"wnd[0]/usr/ctxtS_QDATU-LOW\").text = \"%Datetime%\"
session.findById(\"wnd[0]/usr/ctxtS_PQUIT-LOW\").text = \"x\"
session.findById(\"wnd[0]/usr/ctxtS_NLTYP-LOW\").setFocus
session.findById(\"wnd[0]/usr/ctxtS_NLTYP-LOW\").caretPosition = 3
session.findById(\"wnd[0]/tbar[1]/btn[8]\").press

If Not NoDataInStatusBar() Then
    session.findById(\"wnd[0]/shellcont/shellcont/shell/shellcont[0]/shell\").currentCellColumn = \"MATNR\"
    session.findById(\"wnd[0]/shellcont/shellcont/shell/shellcont[0]/shell\").contextMenu
    session.findById(\"wnd[0]/shellcont/shellcont/shell/shellcont[0]/shell\").selectContextMenuItem \"&XXL\"
    session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = \"51B_CutLC6_%Datetime%\"
    session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 12
    session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
    session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\Documents\\Illingen\"
    session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
    session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 36
    session.findById(\"wnd[1]/tbar[0]/btn[0]\").press
End If
WScript.Sleep 1000

\' ========================================================================
\' ENDE
\' ========================================================================''' ScriptOutput=> SAPProzess
WAIT 6
@@copilotGeneratedAction: 'False'
Scripting.RunPowershellScript.RunScript Script: $'''get-process -name \"Excel\" | stop-process''' ScriptOutput=> CloseSAPExcel
WAIT 2
SAP.CloseSapConnection SapInstance: SapInstance CloseSapLogonOnLastConnection: True
```

## Data_Preperation

```
Excel.LaunchExcel.LaunchAndOpenUnderExistingProcess Path: $'''C:\\Users\\5100LSS1\\OneDrive - Lapp\\Desktop\\RPA\\Illingen\\Illingen_Data.xlsm''' Visible: True ReadOnly: False UseMachineLocale: False Instance=> illErmittlung
WAIT 3
Excel.RunMacro Instance: illErmittlung Macro: $'''DetermineTonage'''
WAIT 1
Excel.RunMacro Instance: illErmittlung Macro: $'''collectLET'''
WAIT 1
Excel.RunMacro Instance: illErmittlung Macro: $'''DetermineIncomming'''
WAIT 1
Excel.RunMacro Instance: illErmittlung Macro: $'''DetermineStockDispatch'''
WAIT 1
Excel.RunMacro Instance: illErmittlung Macro: $'''DetermineCutToPick'''
WAIT 1
Excel.RunMacro Instance: illErmittlung Macro: $'''DetermineStockToCut'''
WAIT 1
Excel.RunMacro Instance: illErmittlung Macro: $'''DetermineCutToStock'''
WAIT 1
Excel.RunMacro Instance: illErmittlung Macro: $'''DetermineCutToLC6'''
WAIT 1
Excel.RunMacro Instance: illErmittlung Macro: $'''CountCutsIllingen'''
WAIT 1
Excel.RunMacro Instance: illErmittlung Macro: $'''ScrapDatenVerarbeiten'''
WAIT 1
Excel.RunMacro Instance: illErmittlung Macro: $'''ScrapManDatenVerarbeiten'''
WAIT 1
Excel.RunMacro Instance: illErmittlung Macro: $'''SendEmail'''
WAIT 2
Excel.CloseExcel.CloseAndSave Instance: illErmittlung
```
