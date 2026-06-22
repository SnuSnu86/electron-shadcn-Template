import { useEffect, useRef } from "react";
import type { RunLogEntry } from "@/shared/domain";
import { formatTime } from "@/utils/format";
import { cn } from "@/utils/tailwind";

const LEVEL_STYLES = {
  info: "text-zinc-200",
  warn: "text-warning",
  error: "text-destructive",
} as const;

const SOURCE_LABELS = {
  app: "APP",
  script: "SKRIPT",
  external: "EXTERN",
} as const;

const SOURCE_STYLES = {
  info: "text-zinc-400/70",
  warn: "text-warning",
  error: "text-destructive",
} as const;

export function RunLogView({
  logs,
  live = false,
  className,
}: {
  logs: RunLogEntry[];
  live?: boolean;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);

  const logCount = logs.length;
  useEffect(() => {
    const el = containerRef.current;
    if (el && live && logCount > 0 && stickToBottom.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [logCount, live]);

  return (
    <div
      className={cn(
        "overflow-y-auto rounded-lg border border-border/60 bg-[oklch(0.12_0.012_252)] p-3 font-mono text-[0.75rem] leading-relaxed dark:bg-[oklch(0.12_0.012_252)]",
        className
      )}
      onScroll={(e) => {
        const el = e.currentTarget;
        stickToBottom.current =
          el.scrollHeight - el.scrollTop - el.clientHeight < 40;
      }}
      ref={containerRef}
    >
      {logs.length === 0 && (
        <p className="py-6 text-center text-muted-foreground">
          {live ? "Warte auf Log-Einträge …" : "Keine Log-Einträge."}
        </p>
      )}
      {logs.map((log) => (
        <div
          className={cn("flex gap-2 py-px", live && "animate-log-line")}
          key={log.id}
        >
          <span className="shrink-0 text-zinc-400">
            {formatTime(log.timestamp)}
          </span>
          <span
            className={cn(
              "w-12 shrink-0 text-[0.625rem] uppercase leading-[1.7]",
              SOURCE_STYLES[log.level]
            )}
          >
            {SOURCE_LABELS[log.source]}
          </span>
          <span className={cn("break-all", LEVEL_STYLES[log.level])}>
            {log.message}
          </span>
        </div>
      ))}
      {live && (
        <div className="mt-1 flex items-center gap-2 text-info">
          <span className="size-1.5 animate-pulse-dot rounded-full bg-info" />
          <span className="text-[0.6875rem]">Lauf aktiv …</span>
        </div>
      )}
    </div>
  );
}
