# SAP VBScripts

## SAP /LSGIT/VS_DLV_CHECK

```vbs
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
```