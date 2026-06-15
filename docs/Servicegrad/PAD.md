# PAD-Prozess

## Get_DateTime_Variable

```
Text.ConvertDateTimeToText.FromDateTime DateTime: CurrentDateTime StandardFormat: Text.WellKnownDateTimeFormat.ShortDate Result=> Today
SET Wochentag TO CurrentDateTime.DayOfWeek
SET Montag TO $'''Monday'''
IF Wochentag = Montag THEN
    DateTime.Add DateTime: CurrentDateTime TimeToAdd: -3 TimeUnit: DateTime.TimeUnit.Days ResultedDate=> GoToFriday
    Text.ConvertDateTimeToText.FromDateTime DateTime: GoToFriday StandardFormat: Text.WellKnownDateTimeFormat.ShortDate Result=> FormattedGoToFriday
    Text.ConvertDateTimeToText.FromCustomDateTime DateTime: GoToFriday CustomFormat: $'''yyyy-MM-dd''' Result=> SGDatetime
    CALL SAP_Process_BackToFriday
ELSE IF Wochentag <> Montag THEN
    DateTime.Add DateTime: CurrentDateTime TimeToAdd: -1 TimeUnit: DateTime.TimeUnit.Days ResultedDate=> GoToYesterday
    Text.ConvertDateTimeToText.FromDateTime DateTime: GoToYesterday StandardFormat: Text.WellKnownDateTimeFormat.ShortDate Result=> FormattedGoToYesterday
    Text.ConvertDateTimeToText.FromCustomDateTime DateTime: GoToYesterday CustomFormat: $'''yyyy-MM-dd''' Result=> SGDatetime
END
CALL SAP_Pocess_BackToYesterday
```

## SAP_Process

```
SAP.SapLogin.SapSSOLogInOptionTerminate Description: $'''10: PS4 - Production S/4 HANA''' Client: $'''009''' Username: $'''5100LSS1''' Language: $'''DE''' SapInstance=> SapInstance CurrentSapLoginTerminated=> CurrentSapLoginTerminated
WAIT 10
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
session.findById(\"wnd[0]/tbar[0]/okcd\").text = \"/n/LSGIT/VS_DLV_CHECK\"
session.findById(\"wnd[0]\").sendVKey 0
session.findById(\"wnd[0]/usr/ctxtS_LDDAT-LOW\").text = \"%FormattedGoToFriday%\"
session.findById(\"wnd[0]/usr/ctxtS_VBELN-LOW\").text = \"*\"
session.findById(\"wnd[0]/usr/ctxtP_LAYOUT\").text = \"UIL_SLM\"
session.findById(\"wnd[0]/usr/ctxtP_LAYOUT\").setFocus
session.findById(\"wnd[0]/usr/ctxtP_LAYOUT\").caretPosition = 8
session.findById(\"wnd[0]/tbar[1]/btn[8]\").press
session.findById(\"wnd[0]/usr/shell\").pressToolbarContextButton \"&MB_EXPORT\"
session.findById(\"wnd[0]/usr/shell\").selectContextMenuItem \"&XXL\"
session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").text = \"SG-%FormattedGoToFriday%\"
session.findById(\"wnd[1]/usr/ssubSUB_CONFIGURATION:SAPLSALV_GUI_CUL_EXPORT_AS:0512/txtGS_EXPORT-FILE_NAME\").caretPosition = 3
session.findById(\"wnd[1]/tbar[0]/btn[20]\").press
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").text = \"C:\\Users\\5100LSS1\\Documents\\SG\"
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").setFocus
session.findById(\"wnd[1]/usr/ctxtDY_PATH\").caretPosition = 30
session.findById(\"wnd[1]/tbar[0]/btn[0]\").press''' ScriptOutput=> SAPProzess
WAIT 6
@@copilotGeneratedAction: 'False'
Scripting.RunPowershellScript.RunScript Script: $'''get-process -name \"Excel\" | stop-process''' ScriptOutput=> CloseSAPExcel
SAP.CloseSapConnection SapInstance: SapInstance CloseSapLogonOnLastConnection: True
```

## Data_Preperation

```
Excel.LaunchExcel.LaunchAndOpenUnderExistingProcess Path: $'''\\\\DFS1\\Group\\UIL-CL-Zentral\\04 Statistiken & Auswertungen\\01 Statistiken\\Servicegrad LO\\Geschaeftsjahr 2526\\Servicegrad LSS Bot\\Servicegradermittlung.xlsm''' Visible: True ReadOnly: False UseMachineLocale: False Instance=> SGermittlung
WAIT 3
Excel.RunMacro Instance: SGermittlung Macro: $'''NeueBelegnummer'''
WAIT 1
Excel.RunMacro Instance: SGermittlung Macro: $'''DatenkopierenSAP'''
WAIT 1
Excel.RunMacro Instance: SGermittlung Macro: $'''SGrechner'''
WAIT 1
Excel.RunMacro Instance: SGermittlung Macro: $'''DatenUebertragung'''
WAIT 1
Excel.RunMacro Instance: SGermittlung Macro: $'''Email'''
WAIT 1
Excel.CloseExcel.Close Instance: SGermittlung

# [ControlRepository][PowerAutomateDesktop]

{
  "ControlRepositorySymbols": [],
  "ImageRepositorySymbol": {
    "Repository": "{\r\n  \"Folders\": [],\r\n  \"Images\": [],\r\n  \"Version\": 1\r\n}",
    "ImportMetadata": {},
    "Name": "imgrepo"
  },
  "ConnectionReferences": [
    {
      "ConnectorId": "/providers/Microsoft.PowerApps/apis/shared_postgresql",
      "DisplayName": "Cr07bcf_shared_postgresql_381bb101",
      "InternalId": "86637ec4-08c3-472e-b580-3a25ad77ab77",
      "IsDisabled": true,
      "LogicalName": "Cr07bcf_shared_postgresql_381bb101bff64f93a126f3ba71595b3a",
      "IsEmbedded": false,
      "ConnectionName": "b75fcd6471ef4565bbafae482ccc6753",
      "ConnectionDisplayName": "leitstand_dashboard 10.100.249.220:5432"
    }
  ]
}
```