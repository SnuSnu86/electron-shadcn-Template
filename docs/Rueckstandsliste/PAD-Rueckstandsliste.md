# PAD-Prozess

## Main

```
CALL 'SAP Login'
CALL 'SAP Scripting'
CALL 'Create RL'
```

## SAP Login

```
SAP.SapLogin.SapSSOLogInOptionTerminate Description: $'''10: PS4 - Production S/4 HANA''' Client: $'''009''' Username: $'''5100LSS1''' Language: $'''DE''' SapInstance=> SapInstance CurrentSapLoginTerminated=> CurrentSapLoginTerminated
```

## SAP Scripting

```
DateTime.GetCurrentDateTime.Local DateTimeFormat: DateTime.DateTimeFormat.DateAndTime CurrentDateTime=> CurrentDateTime
Text.ConvertDateTimeToText.FromDateTime DateTime: CurrentDateTime StandardFormat: Text.WellKnownDateTimeFormat.ShortDate Result=> FormattedDateTime
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
session.findById(\"wnd[0]/usr/cntlIMAGE_CONTAINER/shellcont/shell/shellcont[0]/shell\").doubleClickNode \"F00007\"
session.findById(\"wnd[0]/tbar[1]/btn[17]\").press
session.findById(\"wnd[1]/usr/txtENAME-LOW\").text = \"\"
session.findById(\"wnd[1]/usr/txtENAME-LOW\").setFocus
session.findById(\"wnd[1]/usr/txtENAME-LOW\").caretPosition = 0
session.findById(\"wnd[1]/tbar[0]/btn[8]\").press
session.findById(\"wnd[1]/usr/cntlALV_CONTAINER_1/shellcont/shell\").setCurrentCell 22,\"TEXT\"
session.findById(\"wnd[1]/usr/cntlALV_CONTAINER_1/shellcont/shell\").firstVisibleRow = 7
session.findById(\"wnd[1]/usr/cntlALV_CONTAINER_1/shellcont/shell\").selectedRows = \"22\"
session.findById(\"wnd[1]/usr/cntlALV_CONTAINER_1/shellcont/shell\").doubleClickCurrentCell
session.findById(\"wnd[0]/usr/ctxtS_LDDAT-LOW\").text = \"%FormattedDateTime%\"
session.findById(\"wnd[0]/usr/ctxtS_LDDAT-LOW\").setFocus
session.findById(\"wnd[0]/usr/ctxtS_LDDAT-LOW\").caretPosition = 10
session.findById(\"wnd[0]\").sendVKey 0
session.findById(\"wnd[0]/tbar[1]/btn[8]\").press
session.findById(\"wnd[0]/tbar[1]/btn[33]\").press
session.findById(\"wnd[1]/usr/subSUB_CONFIGURATION:SAPLSALV_CUL_LAYOUT_CHOOSE:0500/cntlD500_CONTAINER/shellcont/shell\").setCurrentCell 4,\"TEXT\"
session.findById(\"wnd[1]/usr/subSUB_CONFIGURATION:SAPLSALV_CUL_LAYOUT_CHOOSE:0500/cntlD500_CONTAINER/shellcont/shell\").selectedRows = \"4\"
session.findById(\"wnd[1]/usr/subSUB_CONFIGURATION:SAPLSALV_CUL_LAYOUT_CHOOSE:0500/cntlD500_CONTAINER/shellcont/shell\").clickCurrentCell
session.findById(\"wnd[0]/mbar/menu[0]/menu[3]/menu[1]\").select
session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = \"rsl-%FormattedDateTime%\"
session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 4
session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\Documents\\Rueckstandsliste\"
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 12
session.findById(\"wnd[1]/tbar[0]/btn[0]\").press
session.findById(\"wnd[1]/tbar[0]/btn[0]\").press''' ScriptOutput=> VBScriptOutput
WAIT 5
@@copilotGeneratedAction: 'False'
Scripting.RunPowershellScript.RunScript Script: $'''get-process -name \"Excel\" | stop-process''' ScriptOutput=> CloseSAPExcel
WAIT 1
SAP.CloseSapConnection SapInstance: SapInstance CloseSapLogonOnLastConnection: True
```

## Create RL

```
Excel.LaunchExcel.LaunchAndOpenUnderExistingProcess Path: $'''C:\\Users\\5100LSS1\\OneDrive - Lapp\\Desktop\\RPA\\Rückstandsliste\\Rückstandsliste Rechner.xlsm''' Visible: True ReadOnly: False Instance=> ExcelInstanceRLRechner
Excel.RunMacro Instance: ExcelInstanceRLRechner Macro: $'''DatenkopierenSAP'''
WAIT 1
Excel.RunMacro Instance: ExcelInstanceRLRechner Macro: $'''RSl_create1_1_vom_Geschäft'''
WAIT 5
Excel.RunMacro Instance: ExcelInstanceRLRechner Macro: $'''ÜbertrageKommentareAllInOne'''
WAIT 3
Excel.RunMacro Instance: ExcelInstanceRLRechner Macro: $'''CreateEmailWithLinks'''
WAIT 1
Excel.CloseExcel.Close Instance: ExcelInstanceRLRechner
```