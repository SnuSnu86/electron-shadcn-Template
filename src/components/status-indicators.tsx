import {
  AppWindowIcon,
  CloudIcon,
  FileSpreadsheetIcon,
  TerminalIcon,
} from "lucide-react";
import type { ActionType, ProcessStatus, RunStatus } from "@/shared/domain";
import {
  ACTION_TYPE_LABELS,
  PROCESS_STATUS_LABELS,
  RUN_STATUS_LABELS,
} from "@/shared/domain";
import { cn } from "@/utils/tailwind";

export function RunStatusBadge({
  status,
  className,
}: {
  status: RunStatus;
  className?: string;
}) {
  const styles: Record<RunStatus, string> = {
    pending: "bg-muted text-muted-foreground border-border",
    running: "bg-info/15 text-info border-info/30",
    success: "bg-success/15 text-success border-success/30",
    failed: "bg-destructive/15 text-destructive border-destructive/30",
    canceled: "bg-warning/15 text-warning border-warning/30",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-medium text-[0.6875rem]",
        styles[status],
        className
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full bg-current",
          status === "running" && "animate-pulse-dot"
        )}
      />
      {RUN_STATUS_LABELS[status]}
    </span>
  );
}

export function ProcessStatusBadge({ status }: { status: ProcessStatus }) {
  const styles: Record<ProcessStatus, string> = {
    active: "bg-success/15 text-success border-success/30",
    maintenance: "bg-warning/15 text-warning border-warning/30",
    deprecated: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-medium text-[0.6875rem]",
        styles[status]
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {PROCESS_STATUS_LABELS[status]}
    </span>
  );
}

const ACTION_ICONS: Record<ActionType, typeof TerminalIcon> = {
  shell: TerminalIcon,
  pad: AppWindowIcon,
  cloudflow: CloudIcon,
  file: FileSpreadsheetIcon,
};

export function ActionTypeBadge({ type }: { type: ActionType }) {
  const Icon = ACTION_ICONS[type];
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground text-xs">
      <Icon className="size-3.5" />
      {ACTION_TYPE_LABELS[type]}
    </span>
  );
}

export function ActionTypeIcon({
  type,
  className,
}: {
  type: ActionType;
  className?: string;
}) {
  const Icon = ACTION_ICONS[type];
  return <Icon className={cn("size-4", className)} />;
}
