import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ActivityIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  LayersIcon,
} from "lucide-react";
import { AnimatedNumber } from "@/components/animated-number";
import { RunStatusBadge } from "@/components/status-indicators";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboard } from "@/lib/queries";
import { formatDuration, formatRelative } from "@/utils/format";
import { cn } from "@/utils/tailwind";

function StatCard({
  label,
  value,
  suffix,
  hint,
  icon: Icon,
  tone = "default",
  delay = 0,
}: {
  label: string;
  value: number | null;
  suffix?: string;
  hint?: string;
  icon: typeof ActivityIcon;
  tone?: "default" | "success" | "destructive" | "info";
  delay?: number;
}) {
  const toneClasses = {
    default: "text-primary bg-primary/12",
    success: "text-success bg-success/12",
    destructive: "text-destructive bg-destructive/12",
    info: "text-info bg-info/12",
  };
  return (
    <Card
      className="animate-fade-up overflow-hidden py-0"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="flex items-start justify-between p-4">
        <div>
          <p className="font-medium text-[0.6875rem] text-muted-foreground uppercase tracking-widest">
            {label}
          </p>
          <p className="mt-1.5 font-semibold text-3xl tracking-tight">
            {value === null ? (
              <span className="text-muted-foreground">—</span>
            ) : (
              <AnimatedNumber suffix={suffix} value={value} />
            )}
          </p>
          {hint && (
            <p className="mt-1 text-[0.6875rem] text-muted-foreground">
              {hint}
            </p>
          )}
        </div>
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-lg",
            toneClasses[tone]
          )}
        >
          <Icon className="size-4.5" />
        </span>
      </CardContent>
    </Card>
  );
}

function DashboardPage() {
  const { data: stats } = useDashboard();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      <div className="animate-fade-up">
        <p className="font-medium text-[0.6875rem] text-primary uppercase tracking-[0.2em]">
          {new Date().toLocaleDateString("de-DE", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <h1 className="mt-1 font-display font-semibold text-3xl tracking-tight">
          Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Alle Automationen auf einen Blick — Status und Läufe.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        <StatCard
          delay={40}
          hint={`davon ${stats?.activeProcesses ?? 0} aktiv`}
          icon={LayersIcon}
          label="Prozesse"
          value={stats?.totalProcesses ?? null}
        />
        <StatCard
          delay={80}
          hint={`${stats?.totalRuns ?? 0} Läufe insgesamt`}
          icon={ActivityIcon}
          label="Läufe (30 Tage)"
          tone="info"
          value={stats?.runsLast30Days ?? null}
        />
        <StatCard
          delay={120}
          hint={
            stats?.failedLast30Days
              ? `${stats.failedLast30Days} fehlgeschlagen`
              : "keine Fehler"
          }
          icon={CheckCircle2Icon}
          label="Erfolgsquote (30 Tage)"
          suffix="%"
          tone={
            (stats?.successRate30Days ?? 100) >= 90 ? "success" : "destructive"
          }
          value={stats?.successRate30Days ?? null}
        />
      </div>

      <div className="grid gap-4">
        <Card
          className="animate-fade-up gap-0 py-0"
          style={{ animationDelay: "200ms" }}
        >
          <div className="flex items-center justify-between border-border/60 border-b px-4 py-3">
            <h2 className="font-display font-semibold text-sm">Letzte Läufe</h2>
            <Link
              className="inline-flex items-center gap-1 text-muted-foreground text-xs transition-colors hover:text-primary"
              to="/prozesse"
            >
              Alle Prozesse <ArrowRightIcon className="size-3" />
            </Link>
          </div>
          <CardContent className="p-0">
            {stats?.recentRuns.length === 0 && (
              <p className="px-4 py-8 text-center text-muted-foreground text-sm">
                Noch keine Läufe vorhanden.
              </p>
            )}
            <ul className="divide-y divide-border/60">
              {stats?.recentRuns.map((run, i) => (
                <li
                  className="animate-fade-up"
                  key={run.id}
                  style={{ animationDelay: `${240 + i * 30}ms` }}
                >
                  <button
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-accent/50"
                    onClick={() =>
                      navigate({
                        to: "/prozesse/$processId",
                        params: { processId: String(run.processId) },
                        search: { tab: "runs", run: run.id },
                      })
                    }
                    type="button"
                  >
                    <RunStatusBadge status={run.status} />
                    <span className="min-w-0 flex-1 truncate font-medium text-[0.8125rem]">
                      {run.processName}
                    </span>
                    <span className="font-mono text-[0.6875rem] text-muted-foreground">
                      {formatDuration(run.durationMs)}
                    </span>
                    <span className="w-24 text-right text-[0.6875rem] text-muted-foreground">
                      {formatRelative(run.startedAt)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: DashboardPage,
});
