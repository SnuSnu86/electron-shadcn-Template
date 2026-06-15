import { useQueryClient } from "@tanstack/react-query";
import {
  AlertOctagonIcon,
  DownloadIcon,
  SquareIcon,
  UserIcon,
} from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { RunStatusBadge } from "@/components/status-indicators";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  queryKeys,
  useCancelRun,
  useRun,
  useRunLogs,
  useRunsByProcess,
} from "@/lib/queries";
import type { ProcessDetail } from "@/shared/domain";
import { formatDateTime, formatDuration } from "@/utils/format";
import { cn } from "@/utils/tailwind";
import { RunLogView } from "./run-log-view";

function RunDetailPanel({
  process,
  runId,
}: {
  process: ProcessDetail;
  runId: number;
}) {
  const queryClient = useQueryClient();
  const { data: run } = useRun(runId, true);
  const isLive = run?.status === "running" || run?.status === "pending";
  const { data: logs } = useRunLogs(runId, isLive);
  const cancelRun = useCancelRun();

  // Nach Abschluss eines Live-Runs Listen aktualisieren
  useEffect(() => {
    if (run && !isLive) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.runsByProcess(process.id),
      });
      queryClient.invalidateQueries({ queryKey: ["processes"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    }
  }, [run, isLive, process.id, queryClient]);

  if (!run) {
    return null;
  }

  const exportLogs = () => {
    const text = (logs ?? [])
      .map(
        (l) =>
          `${l.timestamp}\t${l.level.toUpperCase()}\t[${l.source}]\t${l.message}`
      )
      .join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `run-${run.id}-log.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Log exportiert");
  };

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="flex flex-wrap items-center gap-3 border-border/60 border-b bg-muted/30 px-4 py-3">
        <span className="font-display font-semibold text-sm">
          Run #{run.id}
        </span>
        <RunStatusBadge status={run.status} />
        <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <UserIcon className="size-3" />
          {run.executedBy}
        </span>
        <span className="text-muted-foreground text-xs">
          {formatDateTime(run.startedAt)}
        </span>
        <span className="font-mono text-muted-foreground text-xs">
          {formatDuration(run.durationMs)}
        </span>
        <div className="ml-auto flex gap-2">
          {isLive && (
            <Button
              onClick={async () => {
                const ok = await cancelRun.mutateAsync(run.id);
                if (ok) {
                  toast.warning("Lauf wird abgebrochen …");
                } else {
                  toast.info(
                    "Lauf kann nicht abgebrochen werden (kein aktiver Kindprozess)."
                  );
                }
              }}
              size="sm"
              variant="destructive"
            >
              <SquareIcon data-icon="inline-start" />
              Abbrechen
            </Button>
          )}
          <Button onClick={exportLogs} size="sm" variant="outline">
            <DownloadIcon data-icon="inline-start" />
            Log exportieren
          </Button>
        </div>
      </div>

      {Object.keys(run.parameters).length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-border/60 border-b px-4 py-2.5">
          {Object.entries(run.parameters).map(([key, value]) => (
            <code
              className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.6875rem] text-muted-foreground"
              key={key}
            >
              {key}={value || '""'}
            </code>
          ))}
        </div>
      )}

      <CardContent className="p-3">
        <RunLogView
          className="max-h-96 min-h-40"
          live={isLive}
          logs={logs ?? []}
        />
      </CardContent>

      {run.status === "failed" && process.runbook.errors.length > 0 && (
        <div className="border-border/60 border-t bg-destructive/5 px-4 py-3">
          <p className="mb-2 flex items-center gap-2 font-medium text-destructive text-xs">
            <AlertOctagonIcon className="size-3.5" />
            Empfohlene Schritte aus dem Runbook
            {run.errorSummary && (
              <span className="font-normal text-muted-foreground">
                — Fehler: {run.errorSummary}
              </span>
            )}
          </p>
          <ul className="flex flex-col gap-2">
            {process.runbook.errors.map((error) => (
              <li className="text-xs leading-relaxed" key={error.problem}>
                <span className="font-medium">{error.problem}:</span>{" "}
                <span className="text-muted-foreground">{error.solution}</span>
                {error.escalation && (
                  <span className="text-muted-foreground">
                    {" "}
                    (Eskalation: {error.escalation})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

export function RunsTab({
  process,
  selectedRunId,
  onSelectRun,
}: {
  process: ProcessDetail;
  selectedRunId: number | null;
  onSelectRun: (runId: number | null) => void;
}) {
  const { data: runs } = useRunsByProcess(process.id);

  return (
    <div className="flex animate-fade-in flex-col gap-4">
      {selectedRunId && (
        <RunDetailPanel process={process} runId={selectedRunId} />
      )}

      <Card className="gap-0 py-0">
        <div className="border-border/60 border-b px-4 py-3">
          <h3 className="font-display font-semibold text-sm">Run-Historie</h3>
        </div>
        <CardContent className="p-0">
          {(runs ?? []).length === 0 && (
            <p className="px-4 py-10 text-center text-muted-foreground text-sm">
              Dieser Prozess wurde noch nie ausgeführt.
            </p>
          )}
          <ul className="divide-y divide-border/60">
            {runs?.map((run) => (
              <li key={run.id}>
                <button
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-accent/50",
                    selectedRunId === run.id && "bg-primary/8"
                  )}
                  onClick={() =>
                    onSelectRun(selectedRunId === run.id ? null : run.id)
                  }
                  type="button"
                >
                  <span className="w-14 font-mono text-[0.6875rem] text-muted-foreground">
                    #{run.id}
                  </span>
                  <RunStatusBadge status={run.status} />
                  <span className="flex-1 truncate text-muted-foreground text-xs">
                    {run.errorSummary ?? ""}
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                    <UserIcon className="size-3" />
                    {run.executedBy}
                  </span>
                  <span className="font-mono text-[0.6875rem] text-muted-foreground">
                    {formatDuration(run.durationMs)}
                  </span>
                  <span className="w-32 text-right text-[0.6875rem] text-muted-foreground">
                    {formatDateTime(run.startedAt)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
