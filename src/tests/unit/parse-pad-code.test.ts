import { describe, expect, it } from "vitest";
import { parsePadCode } from "@/features/tutorial/parse-pad-code";

describe("parsePadCode", () => {
  it("should parse the current date and time action", () => {
    const code =
      "DateTime.GetCurrentDateTime.Local DateTimeFormat: DateTime.DateTimeFormat.DateOnly CurrentDateTime=> CurrentDateTime";

    const actions = parsePadCode(code);

    expect(actions).toHaveLength(1);
    expect(actions[0]).toMatchObject({
      details: "DateOnly → CurrentDateTime",
      label: "Aktuelles Datum und Uhrzeit abrufen",
      type: "get-current-datetime",
    });
  });

  it("should parse text conversion actions", () => {
    const code =
      "Text.ConvertDateTimeToText.FromDateTime DateTime: CurrentDateTime StandardFormat: Text.WellKnownDateTimeFormat.ShortDate Result=> Today";
    const actions = parsePadCode(code);

    expect(actions).toHaveLength(1);
    expect(actions[0].type).toBe("text-convert");
    expect(actions[0].label).toBe("Datetime in Text konvertieren");
    expect(actions[0].details).toContain("ShortDate");
    expect(actions[0].details).toContain("Today");
  });

  it("should parse SET variable actions", () => {
    const code = "SET Wochentag TO CurrentDateTime.DayOfWeek";
    const actions = parsePadCode(code);

    expect(actions).toHaveLength(1);
    expect(actions[0].type).toBe("set-variable");
    expect(actions[0].label).toBe("Variable festlegen");
    expect(actions[0].details).toBe("Wochentag = CurrentDateTime.DayOfWeek");
  });

  it("should parse IF conditions with proper indentation", () => {
    const code = `IF Wochentag = Montag THEN
    SET Result TO 'Friday'
END`;
    const actions = parsePadCode(code);

    expect(actions).toHaveLength(3);
    expect(actions[0].type).toBe("if-condition");
    expect(actions[0].indentLevel).toBe(0);
    expect(actions[1].type).toBe("set-variable");
    expect(actions[1].indentLevel).toBe(1);
    expect(actions[2].type).toBe("end");
    expect(actions[2].indentLevel).toBe(0);
  });

  it("should parse DateTime.Add actions", () => {
    const code =
      "DateTime.Add DateTime: CurrentDateTime TimeToAdd: -3 TimeUnit: DateTime.TimeUnit.Days ResultedDate=> GoToFriday";
    const actions = parsePadCode(code);

    expect(actions).toHaveLength(1);
    expect(actions[0].type).toBe("datetime-add");
    expect(actions[0].label).toBe("Zu Datetime hinzufügen");
    expect(actions[0].details).toBe("-3 Days → GoToFriday");
  });

  it("should parse CALL subflow actions", () => {
    const code = "CALL SAP_Process_BackToFriday";
    const actions = parsePadCode(code);

    expect(actions).toHaveLength(1);
    expect(actions[0].type).toBe("call-subflow");
    expect(actions[0].label).toBe("Subflow ausführen");
    expect(actions[0].details).toBe("SAP_Process_BackToFriday");
  });

  it("should parse SAP login actions", () => {
    const code = `SAP.SapLogin.SapSSOLogInOptionTerminate Description: $'''10: PS4 - Production S/4 HANA''' Client: $'''009''' Username: $'''5100LSS1''' Language: $'''DE''' SapInstance=> SapInstance`;
    const actions = parsePadCode(code);

    expect(actions).toHaveLength(1);
    expect(actions[0].type).toBe("sap-login");
    expect(actions[0].label).toBe("SAP-Anmeldung");
    expect(actions[0].details).toContain("PS4");
    expect(actions[0].details).toContain("009");
    expect(actions[0].details).toContain("5100LSS1");
  });

  it("should parse WAIT actions", () => {
    const code = "WAIT 10";
    const actions = parsePadCode(code);

    expect(actions).toHaveLength(1);
    expect(actions[0].type).toBe("wait");
    expect(actions[0].label).toBe("Warten");
    expect(actions[0].details).toBe("10 Sekunden");
  });

  it("should parse Excel actions", () => {
    const code = `Excel.LaunchExcel.LaunchAndOpenUnderExistingProcess Path: $'''C:\\Test\\file.xlsm''' Visible: True ReadOnly: False Instance=> SGermittlung
Excel.RunMacro Instance: SGermittlung Macro: $'''NeueBelegnummer'''
Excel.CloseExcel.Close Instance: SGermittlung`;

    const actions = parsePadCode(code);

    expect(actions).toHaveLength(3);
    expect(actions[0].type).toBe("excel-launch");
    expect(actions[0].label).toBe("Excel öffnen");
    expect(actions[1].type).toBe("excel-macro");
    expect(actions[1].details).toBe("NeueBelegnummer");
    expect(actions[2].type).toBe("excel-close");
  });

  it("should parse VBScript execution", () => {
    const code = `Scripting.RunVBScript.RunVBScript VBScriptCode: $'''session.findById("wnd[0]").maximize''' ScriptOutput=> SAPProzess`;
    const actions = parsePadCode(code);

    expect(actions).toHaveLength(1);
    expect(actions[0].type).toBe("run-vbscript");
    expect(actions[0].label).toBe("VBScript ausführen");
    expect(actions[0].details).toContain("SAPProzess");
  });

  it("should parse PowerShell execution", () => {
    const code = `Scripting.RunPowershellScript.RunScript Script: $'''get-process -name "Excel" | stop-process''' ScriptOutput=> CloseSAPExcel`;
    const actions = parsePadCode(code);

    expect(actions).toHaveLength(1);
    expect(actions[0].type).toBe("run-powershell");
    expect(actions[0].label).toBe("PowerShell ausführen");
  });

  it("should parse SAP_Process_BackToFriday subflow with multiline VBScript", () => {
    const code = `SAP.SapLogin.SapSSOLogInOptionTerminate Description: $'''10: PS4 - Production S/4 HANA''' Client: $'''009''' Username: $'''5100LSS1''' Language: $'''DE''' SapInstance=> SapInstance CurrentSapLoginTerminated=> CurrentSapLoginTerminated
WAIT 10
Scripting.RunVBScript.RunVBScript VBScriptCode: $'''If Not IsObject(application) Then
   Set SapGuiAuto  = GetObject(\\"SAPGUI\\")
   Set application = SapGuiAuto.GetScriptingEngine
End If
session.findById(\\"wnd[0]/tbar[0]/okcd\\").text = \\"/n/LSGIT/VS_DLV_CHECK\\"
session.findById(\\"wnd[1]/usr/ctxtDY_PATH\\").text = \\"C:\\\\Users\\\\5100LSS1\\\\Documents\\\\SG\\"''' ScriptOutput=> SAPProzess
WAIT 6
@@copilotGeneratedAction: 'False'
Scripting.RunPowershellScript.RunScript Script: $'''get-process -name \\"Excel\\" | stop-process''' ScriptOutput=> CloseSAPExcel
SAP.CloseSapConnection SapInstance: SapInstance CloseSapLogonOnLastConnection: True`;

    const actions = parsePadCode(code);

    expect(actions).toHaveLength(6);
    expect(actions.map((action) => action.type)).toEqual([
      "sap-login",
      "wait",
      "run-vbscript",
      "wait",
      "run-powershell",
      "sap-close",
    ]);
    expect(actions[2].details).toBe(
      "Transaktion /LSGIT/VS_DLV_CHECK → SAPProzess"
    );
    expect(actions[5].details).toBe("Logon schließen: Ja");
  });

  it("should parse complex Get_DateTime_Variable subflow", () => {
    const code = `Text.ConvertDateTimeToText.FromDateTime DateTime: CurrentDateTime StandardFormat: Text.WellKnownDateTimeFormat.ShortDate Result=> Today
SET Wochentag TO CurrentDateTime.DayOfWeek
SET Montag TO $'''Monday'''
IF Wochentag = Montag THEN
    DateTime.Add DateTime: CurrentDateTime TimeToAdd: -3 TimeUnit: DateTime.TimeUnit.Days ResultedDate=> GoToFriday
    Text.ConvertDateTimeToText.FromDateTime DateTime: GoToFriday StandardFormat: Text.WellKnownDateTimeFormat.ShortDate Result=> FormattedGoToFriday
    CALL SAP_Process_BackToFriday
ELSE IF Wochentag <> Montag THEN
    DateTime.Add DateTime: CurrentDateTime TimeToAdd: -1 TimeUnit: DateTime.TimeUnit.Days ResultedDate=> GoToYesterday
    Text.ConvertDateTimeToText.FromDateTime DateTime: GoToYesterday StandardFormat: Text.WellKnownDateTimeFormat.ShortDate Result=> FormattedGoToYesterday
END
CALL SAP_Pocess_BackToYesterday`;

    const actions = parsePadCode(code);

    expect(actions.length).toBeGreaterThan(10);
    expect(actions[0].type).toBe("text-convert");
    expect(actions[3].type).toBe("if-condition");
    expect(actions[3].indentLevel).toBe(0);
    expect(actions[4].indentLevel).toBe(1);
    expect(actions[7].type).toBe("else-if-condition");
    expect(actions[10].type).toBe("end");
  });
});
