import {
  CheckIcon,
  ClockIcon,
  CodeIcon,
  CopyIcon,
  DatabaseIcon,
  FileSpreadsheetIcon,
  GitBranchIcon,
  type LucideIcon,
  PlayIcon,
  SettingsIcon,
  WorkflowIcon,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/utils/tailwind";
import {
  type PadAction,
  type PadActionType,
  parsePadCode,
} from "./parse-pad-code";

const ACTION_ICONS: Record<PadActionType, LucideIcon> = {
  "call-subflow": PlayIcon,
  "datetime-add": ClockIcon,
  "else-if-condition": GitBranchIcon,
  end: GitBranchIcon,
  "excel-close": FileSpreadsheetIcon,
  "excel-launch": FileSpreadsheetIcon,
  "excel-macro": FileSpreadsheetIcon,
  "get-current-datetime": ClockIcon,
  "if-condition": GitBranchIcon,
  "run-powershell": CodeIcon,
  "run-vbscript": CodeIcon,
  "sap-close": DatabaseIcon,
  "sap-login": DatabaseIcon,
  "set-variable": SettingsIcon,
  "text-convert": SettingsIcon,
  unknown: SettingsIcon,
  wait: ClockIcon,
};

const ACTION_COLORS: Record<PadActionType, string> = {
  "call-subflow":
    "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300",
  "datetime-add":
    "bg-cyan-500/10 border-cyan-500/30 text-cyan-700 dark:text-cyan-300",
  "else-if-condition":
    "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300",
  end: "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300",
  "excel-close":
    "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300",
  "excel-launch":
    "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300",
  "excel-macro":
    "bg-teal-500/10 border-teal-500/30 text-teal-700 dark:text-teal-300",
  "get-current-datetime":
    "bg-cyan-500/10 border-cyan-500/30 text-cyan-700 dark:text-cyan-300",
  "if-condition":
    "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300",
  "run-powershell":
    "bg-blue-600/10 border-blue-600/30 text-blue-800 dark:text-blue-200",
  "run-vbscript":
    "bg-indigo-500/10 border-indigo-500/30 text-indigo-700 dark:text-indigo-300",
  "sap-close":
    "bg-orange-500/10 border-orange-500/30 text-orange-700 dark:text-orange-300",
  "sap-login":
    "bg-orange-500/10 border-orange-500/30 text-orange-700 dark:text-orange-300",
  "set-variable":
    "bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300",
  "text-convert":
    "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300",
  unknown: "bg-gray-500/10 border-gray-500/30 text-gray-700 dark:text-gray-300",
  wait: "bg-slate-500/10 border-slate-500/30 text-slate-700 dark:text-slate-300",
};

export function TutorialPadFlow({ code }: { code: string }) {
  const [activeView, setActiveView] = useState<"flow" | "raw">("flow");
  const actions = parsePadCode(code);

  return (
    <div className="space-y-3">
      <Tabs
        onValueChange={(v) => setActiveView(v as "flow" | "raw")}
        value={activeView}
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger className="gap-2" value="flow">
            <WorkflowIcon className="h-4 w-4" />
            Flow
          </TabsTrigger>
          <TabsTrigger className="gap-2" value="raw">
            <CodeIcon className="h-4 w-4" />
            RAW
          </TabsTrigger>
        </TabsList>

        <TabsContent className="mt-4" value="flow">
          <FlowView actions={actions} />
        </TabsContent>

        <TabsContent className="mt-4" value="raw">
          <RawView code={code} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FlowView({ actions }: { actions: PadAction[] }) {
  return (
    <div className="space-y-2 rounded-lg border border-border/70 bg-muted/30 p-4">
      {actions.map((action, index) => (
        <FlowActionBlock action={action} key={`${action.type}-${index}`} />
      ))}
    </div>
  );
}

function FlowActionBlock({ action }: { action: PadAction }) {
  const Icon = ACTION_ICONS[action.type];
  const colorClass = ACTION_COLORS[action.type];
  const isConditional =
    action.type.includes("condition") || action.type === "end";

  return (
    <div
      className={cn("flex items-start gap-3 transition-colors", {
        "ml-8": action.indentLevel > 0,
      })}
    >
      <div
        className={cn(
          "flex min-w-0 flex-1 items-center gap-3 rounded-lg border px-4 py-3",
          colorClass
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="font-medium">{action.label}</div>
          {action.details && (
            <div className="mt-1 font-mono text-xs opacity-80">
              {action.details}
            </div>
          )}
        </div>
        {isConditional && (
          <Badge
            className="shrink-0 border-current/30 text-xs"
            variant="outline"
          >
            {action.type === "end" ? "Ende" : "Verzweigung"}
          </Badge>
        )}
      </div>
    </div>
  );
}

function RawView({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <Button
        aria-label={copied ? "Code kopiert" : "Code kopieren"}
        className="absolute top-2 right-2 z-10 bg-background/80 shadow-sm backdrop-blur-sm"
        onClick={copyCode}
        size="icon"
        title={copied ? "Code kopiert" : "Code kopieren"}
        variant="outline"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
      <pre className="max-h-120 overflow-auto rounded-lg border border-border/70 bg-muted/65 p-4 pr-12 font-mono text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
