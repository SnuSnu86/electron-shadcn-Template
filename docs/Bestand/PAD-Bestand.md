# PAD-Prozess

## Main

```
DateTime.GetCurrentDateTime.Local DateTimeFormat: DateTime.DateTimeFormat.DateAndTime CurrentDateTime=> CurrentDateTime
Text.ConvertDateTimeToText.FromCustomDateTime DateTime: CurrentDateTime CustomFormat: $'''dd.MM.yy_hh.mm.ss''' Result=> FormattedDateTime
SAP.SapLogin.SapSSOLogInOptionTerminate Description: $'''10: PS4 - Production S/4 HANA''' Client: $'''009''' Username: $'''5100LSS1''' Language: $'''DE''' SapInstance=> SapInstance CurrentSapLoginTerminated=> CurrentSapLoginTerminated
CALL Ludwigsburg
CALL Hannover
CALL Illingen
CALL Polen
SAP.CloseSapConnection SapInstance: SapInstance CloseSapLogonOnLastConnection: True
```

## Hannover

```
DateTime.GetCurrentDateTime.Local DateTimeFormat: DateTime.DateTimeFormat.DateAndTime CurrentDateTime=> CurrentDateTime
Text.ConvertDateTimeToText.FromCustomDateTime DateTime: CurrentDateTime CustomFormat: $'''dd.MM.yy_hh.mm.ss''' Result=> FormattedDateTime
SAP.SapLogin.SapSSOLogInOptionTerminate Description: $'''10: PS4 - Production S/4 HANA''' Client: $'''009''' Username: $'''5100LSS1''' Language: $'''DE''' SapInstance=> SapInstance CurrentSapLoginTerminated=> CurrentSapLoginTerminated
CALL Ludwigsburg
CALL Hannover
CALL Illingen
CALL Polen
SAP.CloseSapConnection SapInstance: SapInstance CloseSapLogonOnLastConnection: True

```

## Illingen

```
WAIT 2
Scripting.RunVBScript.RunVBScript VBScriptCode: $'''If Not IsObject(application) Then
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
session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"lx03\"
session.findById(\"wnd[0]\").sendVKey 0
session.findById(\"wnd[0]/usr/chkPMITB\").selected = true
session.findById(\"wnd[0]/usr/ctxtS1_LGNUM\").text = \"51B\"
session.findById(\"wnd[0]/usr/ctxtS1_LGTYP-LOW\").text = \"001\"
session.findById(\"wnd[0]/usr/chkPMITB\").setFocus
session.findById(\"wnd[0]/tbar[1]/btn[8]\").press
session.findById(\"wnd[0]/tbar[1]/btn[33]\").press
session.findById(\"wnd[1]/usr/lbl[1,4]\").setFocus
session.findById(\"wnd[1]/usr/lbl[1,4]\").caretPosition = 8
session.findById(\"wnd[1]\").sendVKey 2
session.findById(\"wnd[0]/mbar/menu[0]/menu[1]/menu[1]\").select
session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = \"51B_001_Bestand-%FormattedDateTime%\"
session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 3
session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\OneDrive - Lapp\\Database\\51B-Bestand\\001\"
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 28
session.findById(\"wnd[1]/tbar[0]/btn[0]\").press

''' ScriptOutput=> VBScriptOutput240
WAIT 1
Scripting.RunVBScript.RunVBScript VBScriptCode: $'''If Not IsObject(application) Then
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
session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"/nlx03\"
session.findById(\"wnd[0]\").sendVKey 0
session.findById(\"wnd[0]/usr/chkPMITB\").selected = true
session.findById(\"wnd[0]/usr/ctxtS1_LGNUM\").text = \"51B\"
session.findById(\"wnd[0]/usr/ctxtS1_LGTYP-LOW\").text = \"101\"
session.findById(\"wnd[0]/usr/chkPMITB\").setFocus
session.findById(\"wnd[0]/tbar[1]/btn[8]\").press
session.findById(\"wnd[0]/tbar[1]/btn[33]\").press
session.findById(\"wnd[1]/usr/lbl[1,4]\").setFocus
session.findById(\"wnd[1]/usr/lbl[1,4]\").caretPosition = 8
session.findById(\"wnd[1]\").sendVKey 2
session.findById(\"wnd[0]/mbar/menu[0]/menu[1]/menu[1]\").select
session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = \"51B_101_Bestand-%FormattedDateTime%\"
session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 3
session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\OneDrive - Lapp\\Database\\51B-Bestand\\101\"
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 28
session.findById(\"wnd[1]/tbar[0]/btn[0]\").press

''' ScriptOutput=> VBScriptOutput
WAIT 1
Scripting.RunVBScript.RunVBScript VBScriptCode: $'''If Not IsObject(application) Then
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
session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"/nlx03\"
session.findById(\"wnd[0]\").sendVKey 0
session.findById(\"wnd[0]/usr/chkPMITB\").selected = true
session.findById(\"wnd[0]/usr/ctxtS1_LGNUM\").text = \"51B\"
session.findById(\"wnd[0]/usr/ctxtS1_LGTYP-LOW\").text = \"201\"
session.findById(\"wnd[0]/usr/ctxtS1_LGTYP-HIGH\").setFocus
session.findById(\"wnd[0]/usr/ctxtS1_LGTYP-HIGH\").caretPosition = 3
session.findById(\"wnd[0]/usr/chkPMITB\").setFocus
session.findById(\"wnd[0]/tbar[1]/btn[8]\").press
session.findById(\"wnd[0]/tbar[1]/btn[33]\").press
session.findById(\"wnd[1]/usr/lbl[14,4]\").setFocus
session.findById(\"wnd[1]/usr/lbl[14,4]\").caretPosition = 5
session.findById(\"wnd[1]\").sendVKey 2
session.findById(\"wnd[0]/usr/lbl[16,11]\").setFocus
session.findById(\"wnd[0]/usr/lbl[16,11]\").caretPosition = 0
session.findById(\"wnd[0]\").sendVKey 16
session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = \"51B_201_Bestand_%FormattedDateTime%\"
session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 11
session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\OneDrive - Lapp\\Database\\51B-Bestand\\201\"
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 28
session.findById(\"wnd[1]/tbar[0]/btn[0]\").press
session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
''' ScriptOutput=> VBScriptOutput
WAIT 1
Scripting.RunVBScript.RunVBScript VBScriptCode: $'''If Not IsObject(application) Then
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
session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"/nlx03\"
session.findById(\"wnd[0]\").sendVKey 0
session.findById(\"wnd[0]/usr/chkPMITB\").selected = true
session.findById(\"wnd[0]/usr/ctxtS1_LGNUM\").text = \"51B\"
session.findById(\"wnd[0]/usr/ctxtS1_LGTYP-LOW\").text = \"301\"
session.findById(\"wnd[0]/usr/ctxtS1_LGTYP-HIGH\").setFocus
session.findById(\"wnd[0]/usr/ctxtS1_LGTYP-HIGH\").caretPosition = 3
session.findById(\"wnd[0]/usr/chkPMITB\").setFocus
session.findById(\"wnd[0]/tbar[1]/btn[8]\").press
session.findById(\"wnd[0]/tbar[1]/btn[33]\").press
session.findById(\"wnd[1]/usr/lbl[14,4]\").setFocus
session.findById(\"wnd[1]/usr/lbl[14,4]\").caretPosition = 5
session.findById(\"wnd[1]\").sendVKey 2
session.findById(\"wnd[0]/usr/lbl[16,11]\").setFocus
session.findById(\"wnd[0]/usr/lbl[16,11]\").caretPosition = 0
session.findById(\"wnd[0]\").sendVKey 16
session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = \"51B_301_Bestand_%FormattedDateTime%\"
session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 11
session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\OneDrive - Lapp\\Database\\51B-Bestand\\301\"
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 28
session.findById(\"wnd[1]/tbar[0]/btn[0]\").press
session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
''' ScriptOutput=> VBScriptOutput
WAIT 1
Scripting.RunVBScript.RunVBScript VBScriptCode: $'''If Not IsObject(application) Then
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
session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"/nlx03\"
session.findById(\"wnd[0]\").sendVKey 0
session.findById(\"wnd[0]/usr/chkPMITB\").selected = true
session.findById(\"wnd[0]/usr/ctxtS1_LGNUM\").text = \"51B\"
session.findById(\"wnd[0]/usr/ctxtS1_LGTYP-LOW\").text = \"701\"
session.findById(\"wnd[0]/usr/ctxtS1_LGTYP-HIGH\").setFocus
session.findById(\"wnd[0]/usr/ctxtS1_LGTYP-HIGH\").caretPosition = 3
session.findById(\"wnd[0]/usr/chkPMITB\").setFocus
session.findById(\"wnd[0]/tbar[1]/btn[8]\").press
session.findById(\"wnd[0]/tbar[1]/btn[33]\").press
session.findById(\"wnd[1]/usr/lbl[14,4]\").setFocus
session.findById(\"wnd[1]/usr/lbl[14,4]\").caretPosition = 5
session.findById(\"wnd[1]\").sendVKey 2
session.findById(\"wnd[0]/usr/lbl[16,11]\").setFocus
session.findById(\"wnd[0]/usr/lbl[16,11]\").caretPosition = 0
session.findById(\"wnd[0]\").sendVKey 16
session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = \"51B_701_Bestand_%FormattedDateTime%\"
session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 11
session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\OneDrive - Lapp\\Database\\51B-Bestand\\701\"
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 28
session.findById(\"wnd[1]/tbar[0]/btn[0]\").press
session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
''' ScriptOutput=> VBScriptOutput
WAIT 5
@@copilotGeneratedAction: 'False'
Scripting.RunPowershellScript.RunScript Script: $'''get-process -name \"Excel\" | stop-process''' ScriptOutput=> CloseSAPExcel
```

## Polen

```
WAIT 2
Scripting.RunVBScript.RunVBScript VBScriptCode: $'''If Not IsObject(application) Then
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
session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"lx03\"
session.findById(\"wnd[0]\").sendVKey 0
session.findById(\"wnd[0]/usr/chkPMITB\").selected = true
session.findById(\"wnd[0]/usr/ctxtS1_LGNUM\").text = \"590\"
session.findById(\"wnd[0]/usr/ctxtS1_LGTYP-LOW\").text = \"001\"
session.findById(\"wnd[0]/usr/chkPMITB\").setFocus
session.findById(\"wnd[0]/tbar[1]/btn[8]\").press
session.findById(\"wnd[0]/tbar[1]/btn[33]\").press
session.findById(\"wnd[1]/usr/lbl[1,4]\").setFocus
session.findById(\"wnd[1]/usr/lbl[1,4]\").caretPosition = 8
session.findById(\"wnd[1]\").sendVKey 2
session.findById(\"wnd[0]/mbar/menu[0]/menu[1]/menu[1]\").select
session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = \"590_001_Bestand-%FormattedDateTime%\"
session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 3
session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\OneDrive - Lapp\\Database\\590-Bestand\\001\"
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 28
session.findById(\"wnd[1]/tbar[0]/btn[0]\").press

''' ScriptOutput=> VBScriptOutput240
WAIT 1
Scripting.RunVBScript.RunVBScript VBScriptCode: $'''If Not IsObject(application) Then
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
session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"/nlx03\"
session.findById(\"wnd[0]\").sendVKey 0
session.findById(\"wnd[0]/usr/chkPMITB\").selected = true
session.findById(\"wnd[0]/usr/ctxtS1_LGNUM\").text = \"590\"
session.findById(\"wnd[0]/usr/ctxtS1_LGTYP-LOW\").text = \"002\"
session.findById(\"wnd[0]/usr/chkPMITB\").setFocus
session.findById(\"wnd[0]/tbar[1]/btn[8]\").press
session.findById(\"wnd[0]/tbar[1]/btn[33]\").press
session.findById(\"wnd[1]/usr/lbl[1,4]\").setFocus
session.findById(\"wnd[1]/usr/lbl[1,4]\").caretPosition = 8
session.findById(\"wnd[1]\").sendVKey 2
session.findById(\"wnd[0]/mbar/menu[0]/menu[1]/menu[1]\").select
session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = \"590_002_Bestand-%FormattedDateTime%\"
session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 3
session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\OneDrive - Lapp\\Database\\590-Bestand\\002\"
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 28
session.findById(\"wnd[1]/tbar[0]/btn[0]\").press

''' ScriptOutput=> VBScriptOutput
WAIT 1
Scripting.RunVBScript.RunVBScript VBScriptCode: $'''If Not IsObject(application) Then
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
session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"/nlx03\"
session.findById(\"wnd[0]\").sendVKey 0
session.findById(\"wnd[0]/usr/chkPMITB\").selected = true
session.findById(\"wnd[0]/usr/ctxtS1_LGNUM\").text = \"590\"
session.findById(\"wnd[0]/usr/ctxtS1_LGTYP-LOW\").text = \"201\"
session.findById(\"wnd[0]/usr/ctxtS1_LGTYP-HIGH\").setFocus
session.findById(\"wnd[0]/usr/ctxtS1_LGTYP-HIGH\").caretPosition = 3
session.findById(\"wnd[0]/usr/chkPMITB\").setFocus
session.findById(\"wnd[0]/tbar[1]/btn[8]\").press
session.findById(\"wnd[0]/tbar[1]/btn[33]\").press
session.findById(\"wnd[1]/usr/lbl[14,4]\").setFocus
session.findById(\"wnd[1]/usr/lbl[14,4]\").caretPosition = 5
session.findById(\"wnd[1]\").sendVKey 2
session.findById(\"wnd[0]/usr/lbl[16,11]\").setFocus
session.findById(\"wnd[0]/usr/lbl[16,11]\").caretPosition = 0
session.findById(\"wnd[0]\").sendVKey 16
session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = \"590_201_Bestand_%FormattedDateTime%\"
session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 11
session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\OneDrive - Lapp\\Database\\590-Bestand\\201\"
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 28
session.findById(\"wnd[1]/tbar[0]/btn[0]\").press
session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
''' ScriptOutput=> VBScriptOutput
WAIT 1
Scripting.RunVBScript.RunVBScript VBScriptCode: $'''If Not IsObject(application) Then
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
session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"/nlx03\"
session.findById(\"wnd[0]\").sendVKey 0
session.findById(\"wnd[0]/usr/chkPMITB\").selected = true
session.findById(\"wnd[0]/usr/ctxtS1_LGNUM\").text = \"560\"
session.findById(\"wnd[0]/usr/ctxtS1_LGTYP-LOW\").text = \"101\"
session.findById(\"wnd[0]/usr/ctxtS1_LGTYP-HIGH\").setFocus
session.findById(\"wnd[0]/usr/ctxtS1_LGTYP-HIGH\").caretPosition = 3
session.findById(\"wnd[0]/usr/chkPMITB\").setFocus
session.findById(\"wnd[0]/tbar[1]/btn[8]\").press
session.findById(\"wnd[0]/tbar[1]/btn[33]\").press
session.findById(\"wnd[1]/usr/lbl[14,4]\").setFocus
session.findById(\"wnd[1]/usr/lbl[14,4]\").caretPosition = 5
session.findById(\"wnd[1]\").sendVKey 2
session.findById(\"wnd[0]/usr/lbl[16,11]\").setFocus
session.findById(\"wnd[0]/usr/lbl[16,11]\").caretPosition = 0
session.findById(\"wnd[0]\").sendVKey 16
session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = \"590_101_Bestand_%FormattedDateTime%\"
session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 11
session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\OneDrive - Lapp\\Database\\590-Bestand\\101\"
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 28
session.findById(\"wnd[1]/tbar[0]/btn[0]\").press
session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
''' ScriptOutput=> VBScriptOutput
WAIT 1
Scripting.RunVBScript.RunVBScript VBScriptCode: $'''If Not IsObject(application) Then
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
session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"/nlx03\"
session.findById(\"wnd[0]\").sendVKey 0
session.findById(\"wnd[0]/usr/chkPMITB\").selected = true
session.findById(\"wnd[0]/usr/ctxtS1_LGNUM\").text = \"590\"
session.findById(\"wnd[0]/usr/ctxtS1_LGTYP-LOW\").text = \"301\"
session.findById(\"wnd[0]/usr/ctxtS1_LGTYP-HIGH\").setFocus
session.findById(\"wnd[0]/usr/ctxtS1_LGTYP-HIGH\").caretPosition = 3
session.findById(\"wnd[0]/usr/chkPMITB\").setFocus
session.findById(\"wnd[0]/tbar[1]/btn[8]\").press
session.findById(\"wnd[0]/tbar[1]/btn[33]\").press
session.findById(\"wnd[1]/usr/lbl[14,4]\").setFocus
session.findById(\"wnd[1]/usr/lbl[14,4]\").caretPosition = 5
session.findById(\"wnd[1]\").sendVKey 2
session.findById(\"wnd[0]/usr/lbl[16,11]\").setFocus
session.findById(\"wnd[0]/usr/lbl[16,11]\").caretPosition = 0
session.findById(\"wnd[0]\").sendVKey 16
session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = \"590_301_Bestand_%FormattedDateTime%\"
session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 11
session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\OneDrive - Lapp\\Database\\590-Bestand\\301\"
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 28
session.findById(\"wnd[1]/tbar[0]/btn[0]\").press
session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
''' ScriptOutput=> VBScriptOutput
WAIT 5
@@copilotGeneratedAction: 'False'
Scripting.RunPowershellScript.RunScript Script: $'''get-process -name \"Excel\" | stop-process''' ScriptOutput=> CloseSAPExcel
```

# Ludwigsburg

```
WAIT 2
Scripting.RunVBScript.RunVBScript VBScriptCode: $'''If Not IsObject(application) Then
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
session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"lx03\"
session.findById(\"wnd[0]\").sendVKey 0
session.findById(\"wnd[0]/usr/chkPMITB\").selected = true
session.findById(\"wnd[0]/usr/ctxtS1_LGNUM\").text = \"512\"
session.findById(\"wnd[0]/usr/ctxtS1_LGTYP-LOW\").text = \"240\"
session.findById(\"wnd[0]/usr/chkPMITB\").setFocus
session.findById(\"wnd[0]/tbar[1]/btn[8]\").press
session.findById(\"wnd[0]/tbar[1]/btn[33]\").press
session.findById(\"wnd[1]/usr/lbl[1,4]\").setFocus
session.findById(\"wnd[1]/usr/lbl[1,4]\").caretPosition = 8
session.findById(\"wnd[1]\").sendVKey 2
session.findById(\"wnd[0]/mbar/menu[0]/menu[1]/menu[1]\").select
session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = \"512_240_Bestand-%FormattedDateTime%\"
session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 3
session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\OneDrive - Lapp\\Database\\512-Bestand\\240\"
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 28
session.findById(\"wnd[1]/tbar[0]/btn[0]\").press

''' ScriptOutput=> VBScriptOutput240
WAIT 1
Scripting.RunVBScript.RunVBScript VBScriptCode: $'''If Not IsObject(application) Then
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
session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"/nlx03\"
session.findById(\"wnd[0]\").sendVKey 0
session.findById(\"wnd[0]/usr/chkPMITB\").selected = true
session.findById(\"wnd[0]/usr/ctxtS1_LGNUM\").text = \"512\"
session.findById(\"wnd[0]/usr/ctxtS1_LGTYP-LOW\").text = \"200\"
session.findById(\"wnd[0]/usr/chkPMITB\").setFocus
session.findById(\"wnd[0]/tbar[1]/btn[8]\").press
session.findById(\"wnd[0]/tbar[1]/btn[33]\").press
session.findById(\"wnd[1]/usr/lbl[1,4]\").setFocus
session.findById(\"wnd[1]/usr/lbl[1,4]\").caretPosition = 8
session.findById(\"wnd[1]\").sendVKey 2
session.findById(\"wnd[0]/mbar/menu[0]/menu[1]/menu[1]\").select
session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = \"512_200_Bestand-%FormattedDateTime%\"
session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 3
session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\OneDrive - Lapp\\Database\\512-Bestand\\200\"
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 28
session.findById(\"wnd[1]/tbar[0]/btn[0]\").press

''' ScriptOutput=> VBScriptOutput
WAIT 1
Scripting.RunVBScript.RunVBScript VBScriptCode: $'''If Not IsObject(application) Then
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
session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"/nlx03\"
session.findById(\"wnd[0]\").sendVKey 0
session.findById(\"wnd[0]/usr/chkPMITB\").selected = true
session.findById(\"wnd[0]/usr/ctxtS1_LGNUM\").text = \"512\"
session.findById(\"wnd[0]/usr/ctxtS1_LGTYP-LOW\").text = \"241\"
session.findById(\"wnd[0]/usr/ctxtS1_LGTYP-HIGH\").text = \"999\"
session.findById(\"wnd[0]/usr/ctxtS1_LGTYP-HIGH\").setFocus
session.findById(\"wnd[0]/usr/ctxtS1_LGTYP-HIGH\").caretPosition = 3
session.findById(\"wnd[0]/usr/chkPMITB\").setFocus
session.findById(\"wnd[0]/tbar[1]/btn[8]\").press
session.findById(\"wnd[0]/tbar[1]/btn[33]\").press
session.findById(\"wnd[1]/usr/lbl[14,4]\").setFocus
session.findById(\"wnd[1]/usr/lbl[14,4]\").caretPosition = 5
session.findById(\"wnd[1]\").sendVKey 2
session.findById(\"wnd[0]/usr/lbl[16,11]\").setFocus
session.findById(\"wnd[0]/usr/lbl[16,11]\").caretPosition = 0
session.findById(\"wnd[0]\").sendVKey 16
session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = \"512_Rest_Bestand_%FormattedDateTime%\"
session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 11
session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\OneDrive - Lapp\\Database\\512-Bestand\\Rest\"
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 28
session.findById(\"wnd[1]/tbar[0]/btn[0]\").press
session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
session.findById(\"wnd[0]/tbar[0]/btn[15]\").press
''' ScriptOutput=> VBScriptOutput
WAIT 5
@@copilotGeneratedAction: 'False'
Scripting.RunPowershellScript.RunScript Script: $'''get-process -name \"Excel\" | stop-process''' ScriptOutput=> CloseSAPExcel
```
