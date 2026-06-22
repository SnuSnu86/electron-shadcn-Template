/**
 * Typen für PAD-Flow-Aktionen
 */
export type PadActionType =
  | "call-subflow"
  | "datetime-add"
  | "else-if-condition"
  | "end"
  | "excel-close"
  | "excel-launch"
  | "excel-macro"
  | "get-current-datetime"
  | "if-condition"
  | "run-powershell"
  | "run-vbscript"
  | "sap-close"
  | "sap-login"
  | "set-variable"
  | "text-convert"
  | "unknown"
  | "wait";

export interface PadAction {
  details?: string;
  indentLevel: number;
  label: string;
  rawCode: string;
  type: PadActionType;
}

// Regex patterns at top level for performance
const REGEX_CUSTOM_FORMAT = /CustomFormat:\s*\$'''([^']+)'''/;
const REGEX_DATETIME_FORMAT =
  /DateTimeFormat:\s*DateTime\.DateTimeFormat\.(\w+)/;
const REGEX_ELSE_IF_CONDITION = /ELSE IF\s+(.+?)\s+THEN/;
const REGEX_IF_CONDITION = /IF\s+(.+?)\s+THEN/;
const REGEX_MACRO = /Macro:\s*\$'''([^']+)'''/;
const REGEX_PATH = /Path:\s*\$'''([^']+)'''/;
const REGEX_RESULT = /Result=>\s*(\w+)/;
const REGEX_RESULTED_DATE = /ResultedDate=>\s*(\w+)/;
const REGEX_CURRENT_DATETIME = /CurrentDateTime=>\s*(\w+)/;
const REGEX_SAP_CLIENT = /Client:\s*\$'''(\d+)'''/;
const REGEX_SAP_DESCRIPTION = /Description:\s*\$'''([^']+)'''/;
const REGEX_SAP_USERNAME = /Username:\s*\$'''([^']+)'''/;
const REGEX_SCRIPT = /Script:\s*\$'''([^']+)'''/;
const REGEX_SCRIPT_OUTPUT = /ScriptOutput=>\s*(\w+)/;
const REGEX_SET_VARIABLE = /SET\s+(\w+)\s+TO\s+(.+)/;
const REGEX_STANDARD_FORMAT =
  /StandardFormat:\s*Text\.WellKnownDateTimeFormat\.(\w+)/;
const REGEX_TIME_TO_ADD = /TimeToAdd:\s*(-?\d+)/;
const REGEX_TIME_UNIT = /TimeUnit:\s*DateTime\.TimeUnit\.(\w+)/;

type ParseContext = {
  actions: PadAction[];
  indentLevel: number;
};

/**
 * Parst PAD-Code und extrahiert strukturierte Aktionen
 */
export function parsePadCode(code: string): PadAction[] {
  const lines = normalizePadLines(code);
  const context: ParseContext = { actions: [], indentLevel: 0 };

  for (const line of lines) {
    parseLine(line, context);
  }

  return context.actions;
}

function normalizePadLines(code: string): string[] {
  const rawLines = code.split(/\r?\n/);
  const normalized: string[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    let line = rawLines[i].trim();
    if (!line || line.startsWith("@@")) {
      continue;
    }

    while (hasUnclosedPadString(line) && i + 1 < rawLines.length) {
      i++;
      line += `\n${rawLines[i].trim()}`;
    }

    normalized.push(line);
  }

  return normalized;
}

function hasUnclosedPadString(line: string): boolean {
  let searchFrom = 0;

  while (searchFrom < line.length) {
    const openIndex = line.indexOf("$'''", searchFrom);
    if (openIndex === -1) {
      return false;
    }

    const closeIndex = line.indexOf("'''", openIndex + 4);
    if (closeIndex === -1) {
      return true;
    }

    searchFrom = closeIndex + 3;
  }

  return false;
}

function parseLine(trimmed: string, context: ParseContext): void {
  // Try parsing different action types in order
  if (parseCurrentDateTime(trimmed, context)) {
    return;
  }
  if (parseTextConversion(trimmed, context)) {
    return;
  }
  if (parseSetVariable(trimmed, context)) {
    return;
  }
  if (parseIfCondition(trimmed, context)) {
    return;
  }
  if (parseElseIfCondition(trimmed, context)) {
    return;
  }
  if (parseEnd(trimmed, context)) {
    return;
  }
  if (parseDateTimeAdd(trimmed, context)) {
    return;
  }
  if (parseCallSubflow(trimmed, context)) {
    return;
  }
  if (parseSapLogin(trimmed, context)) {
    return;
  }
  if (parseWait(trimmed, context)) {
    return;
  }
  if (parseVbScript(trimmed, context)) {
    return;
  }
  if (parsePowerShell(trimmed, context)) {
    return;
  }
  if (parseSapClose(trimmed, context)) {
    return;
  }
  if (parseExcelLaunch(trimmed, context)) {
    return;
  }
  if (parseExcelMacro(trimmed, context)) {
    return;
  }
  if (parseExcelClose(trimmed, context)) {
    return;
  }

  // Fallback: unknown action
  context.actions.push({
    details: trimmed.length > 60 ? `${trimmed.slice(0, 57)}...` : trimmed,
    indentLevel: context.indentLevel,
    label: "Aktion",
    rawCode: trimmed,
    type: "unknown",
  });
}

function parseCurrentDateTime(trimmed: string, context: ParseContext): boolean {
  if (!trimmed.startsWith("DateTime.GetCurrentDateTime.Local")) {
    return false;
  }

  const format = trimmed.match(REGEX_DATETIME_FORMAT)?.[1] || "?";
  const result = trimmed.match(REGEX_CURRENT_DATETIME)?.[1] || "?";

  context.actions.push({
    details: `${format} → ${result}`,
    indentLevel: context.indentLevel,
    label: "Aktuelles Datum und Uhrzeit abrufen",
    rawCode: trimmed,
    type: "get-current-datetime",
  });
  return true;
}

function parseTextConversion(trimmed: string, context: ParseContext): boolean {
  if (!trimmed.startsWith("Text.ConvertDateTimeToText")) {
    return false;
  }

  const formatMatch = trimmed.match(REGEX_STANDARD_FORMAT);
  const customMatch = trimmed.match(REGEX_CUSTOM_FORMAT);
  const resultMatch = trimmed.match(REGEX_RESULT);

  const details = customMatch
    ? `Format: ${customMatch[1]} → ${resultMatch?.[1] || "?"}`
    : `Format: ${formatMatch?.[1] || "?"} → ${resultMatch?.[1] || "?"}`;

  context.actions.push({
    details,
    indentLevel: context.indentLevel,
    label: "Datetime in Text konvertieren",
    rawCode: trimmed,
    type: "text-convert",
  });
  return true;
}

function parseSetVariable(trimmed: string, context: ParseContext): boolean {
  if (!trimmed.startsWith("SET ")) {
    return false;
  }

  const match = trimmed.match(REGEX_SET_VARIABLE);
  if (!match) {
    return false;
  }

  context.actions.push({
    details: `${match[1]} = ${match[2].replace(/\$'''/g, "'")}`,
    indentLevel: context.indentLevel,
    label: "Variable festlegen",
    rawCode: trimmed,
    type: "set-variable",
  });
  return true;
}

function parseIfCondition(trimmed: string, context: ParseContext): boolean {
  if (!trimmed.startsWith("IF ")) {
    return false;
  }

  const condition = trimmed.match(REGEX_IF_CONDITION)?.[1];
  context.actions.push({
    details: condition || trimmed,
    indentLevel: context.indentLevel,
    label: "If-Bedingung (WENN = WAHR, DANN)",
    rawCode: trimmed,
    type: "if-condition",
  });
  context.indentLevel++;
  return true;
}

function parseElseIfCondition(trimmed: string, context: ParseContext): boolean {
  if (!trimmed.startsWith("ELSE IF ")) {
    return false;
  }

  context.indentLevel--;
  const condition = trimmed.match(REGEX_ELSE_IF_CONDITION)?.[1];
  context.actions.push({
    details: condition || trimmed,
    indentLevel: context.indentLevel,
    label: "Else If-Bedingung (SONST WENN = WAHR, DANN)",
    rawCode: trimmed,
    type: "else-if-condition",
  });
  context.indentLevel++;
  return true;
}

function parseEnd(trimmed: string, context: ParseContext): boolean {
  if (trimmed !== "END") {
    return false;
  }

  context.indentLevel = Math.max(0, context.indentLevel - 1);
  context.actions.push({
    indentLevel: context.indentLevel,
    label: "Ende Bedingung",
    rawCode: trimmed,
    type: "end",
  });
  return true;
}

function parseDateTimeAdd(trimmed: string, context: ParseContext): boolean {
  if (!trimmed.startsWith("DateTime.Add")) {
    return false;
  }

  const timeMatch = trimmed.match(REGEX_TIME_TO_ADD);
  const unitMatch = trimmed.match(REGEX_TIME_UNIT);
  const resultMatch = trimmed.match(REGEX_RESULTED_DATE);

  context.actions.push({
    details: `${timeMatch?.[1] || "?"} ${unitMatch?.[1] || "?"} → ${resultMatch?.[1] || "?"}`,
    indentLevel: context.indentLevel,
    label: "Zu Datetime hinzufügen",
    rawCode: trimmed,
    type: "datetime-add",
  });
  return true;
}

function parseCallSubflow(trimmed: string, context: ParseContext): boolean {
  if (!trimmed.startsWith("CALL ")) {
    return false;
  }

  const subflowName = trimmed.replace("CALL ", "");
  context.actions.push({
    details: subflowName,
    indentLevel: context.indentLevel,
    label: "Subflow ausführen",
    rawCode: trimmed,
    type: "call-subflow",
  });
  return true;
}

function parseSapLogin(trimmed: string, context: ParseContext): boolean {
  if (!trimmed.startsWith("SAP.SapLogin")) {
    return false;
  }

  const systemMatch = trimmed.match(REGEX_SAP_DESCRIPTION);
  const clientMatch = trimmed.match(REGEX_SAP_CLIENT);
  const userMatch = trimmed.match(REGEX_SAP_USERNAME);

  context.actions.push({
    details: `${systemMatch?.[1] || "?"} | Mandant ${clientMatch?.[1] || "?"} | User ${userMatch?.[1] || "?"}`,
    indentLevel: context.indentLevel,
    label: "SAP-Anmeldung",
    rawCode: trimmed,
    type: "sap-login",
  });
  return true;
}

function parseWait(trimmed: string, context: ParseContext): boolean {
  if (!trimmed.startsWith("WAIT ")) {
    return false;
  }

  const seconds = trimmed.replace("WAIT ", "");
  context.actions.push({
    details: `${seconds} Sekunden`,
    indentLevel: context.indentLevel,
    label: "Warten",
    rawCode: trimmed,
    type: "wait",
  });
  return true;
}

function parseVbScript(trimmed: string, context: ParseContext): boolean {
  if (!trimmed.startsWith("Scripting.RunVBScript")) {
    return false;
  }

  const outputMatch = trimmed.match(REGEX_SCRIPT_OUTPUT);
  const transactionMatch = trimmed.match(/\/n\/[^\s\\"]+/);

  let details = "SAP GUI Skripting";
  if (transactionMatch && outputMatch) {
    details = `Transaktion ${transactionMatch[0].replace(/^\/n/, "")} → ${outputMatch[1]}`;
  } else if (transactionMatch) {
    details = `Transaktion ${transactionMatch[0].replace(/^\/n/, "")}`;
  } else if (outputMatch) {
    details = `Ausgabe → ${outputMatch[1]}`;
  }

  context.actions.push({
    details,
    indentLevel: context.indentLevel,
    label: "VBScript ausführen",
    rawCode: trimmed,
    type: "run-vbscript",
  });
  return true;
}

function parsePowerShell(trimmed: string, context: ParseContext): boolean {
  if (!trimmed.startsWith("Scripting.RunPowershellScript")) {
    return false;
  }

  const scriptMatch = trimmed.match(REGEX_SCRIPT);
  const outputMatch = trimmed.match(REGEX_SCRIPT_OUTPUT);
  context.actions.push({
    details: scriptMatch?.[1] || outputMatch?.[1] || "Script",
    indentLevel: context.indentLevel,
    label: "PowerShell ausführen",
    rawCode: trimmed,
    type: "run-powershell",
  });
  return true;
}

function parseSapClose(trimmed: string, context: ParseContext): boolean {
  if (!trimmed.startsWith("SAP.CloseSapConnection")) {
    return false;
  }

  const closeLogonMatch = trimmed.match(
    /CloseSapLogonOnLastConnection:\s*(True|False)/
  );

  context.actions.push({
    details: closeLogonMatch
      ? `Logon schließen: ${closeLogonMatch[1] === "True" ? "Ja" : "Nein"}`
      : undefined,
    indentLevel: context.indentLevel,
    label: "SAP-Verbindung schließen",
    rawCode: trimmed,
    type: "sap-close",
  });
  return true;
}

function parseExcelLaunch(trimmed: string, context: ParseContext): boolean {
  if (!trimmed.startsWith("Excel.LaunchExcel")) {
    return false;
  }

  const pathMatch = trimmed.match(REGEX_PATH);
  context.actions.push({
    details: pathMatch?.[1] || "XLSM-Datei",
    indentLevel: context.indentLevel,
    label: "Excel öffnen",
    rawCode: trimmed,
    type: "excel-launch",
  });
  return true;
}

function parseExcelMacro(trimmed: string, context: ParseContext): boolean {
  if (!trimmed.startsWith("Excel.RunMacro")) {
    return false;
  }

  const macroMatch = trimmed.match(REGEX_MACRO);
  context.actions.push({
    details: macroMatch?.[1] || "?",
    indentLevel: context.indentLevel,
    label: "Excel-Makro ausführen",
    rawCode: trimmed,
    type: "excel-macro",
  });
  return true;
}

function parseExcelClose(trimmed: string, context: ParseContext): boolean {
  if (!trimmed.startsWith("Excel.CloseExcel")) {
    return false;
  }

  context.actions.push({
    indentLevel: context.indentLevel,
    label: "Excel schließen",
    rawCode: trimmed,
    type: "excel-close",
  });
  return true;
}
