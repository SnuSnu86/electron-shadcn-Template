import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronLeftIcon,
  FileDownIcon,
  FileTextIcon,
  GraduationCapIcon,
  MoreVerticalIcon,
  PlayIcon,
  StarIcon,
  UserIcon,
  WrenchIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
  ActionTypeBadge,
  ProcessStatusBadge,
} from "@/components/status-indicators";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfigTab } from "@/features/process-detail/config-tab";
import { OverviewTab } from "@/features/process-detail/overview-tab";
import { RunbookTab } from "@/features/process-detail/runbook-tab";
import { RunsTab } from "@/features/process-detail/runs-tab";
import { StartRunDialog } from "@/features/process-detail/start-run-dialog";
import { TechnicalDetailsTab } from "@/features/process-detail/technical-details-tab";
import { TutorialTab } from "@/features/tutorial/tutorial-tab";
import { ipc } from "@/ipc/manager";
import {
  useInvalidateProcessData,
  useProcess,
  useTutorial,
} from "@/lib/queries";
import { FREQUENCY_LABELS } from "@/shared/domain";

const searchSchema = z.object({
  tab: z
    .enum([
      "uebersicht",
      "runbook",
      "technische-details",
      "konfiguration",
      "runs",
      "tutorial",
    ])
    .optional(),
  run: z.number().optional(),
});

function ProcessDetailPage() {
  const { processId } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const id = Number(processId);

  const { data: process, isLoading } = useProcess(id);
  const { data: tutorial } = useTutorial(id);
  const invalidate = useInvalidateProcessData();

  const [startOpen, setStartOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);

  if (isLoading) {
    return (
      <p className="py-20 text-center text-muted-foreground text-sm">
        Lade Prozess …
      </p>
    );
  }

  if (!process) {
    return (
      <div className="flex flex-col items-center gap-3 py-20">
        <p className="text-muted-foreground text-sm">Prozess nicht gefunden.</p>
        <Button asChild variant="outline">
          <Link to="/prozesse">Zurück zum Katalog</Link>
        </Button>
      </div>
    );
  }

  const tab = search.tab ?? "uebersicht";

  const setTab = (value: string) =>
    navigate({
      search: (prev) => ({
        ...prev,
        tab: value === "uebersicht" ? undefined : (value as never),
      }),
      replace: true,
    });

  const toggleFavorite = async () => {
    await ipc.client.catalog.toggleFavorite({ id });
    invalidate(id);
  };

  const exportMarkdown = async () => {
    const file = await ipc.client.workspace.exportProcessMarkdown({
      processId: id,
    });
    if (file) {
      toast.success("Dokumentation als Markdown exportiert", {
        description: file,
      });
    }
  };

  const exportPdf = async () => {
    const file = await ipc.client.workspace.exportProcessPdf({
      processId: id,
    });
    if (file) {
      toast.success("Dokumentation als PDF exportiert", {
        description: file,
      });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Brotkrumen + Kopfbereich */}
      <div className="animate-fade-up">
        <Link
          className="inline-flex items-center gap-1 text-muted-foreground text-xs transition-colors hover:text-foreground"
          to="/prozesse"
        >
          <ChevronLeftIcon className="size-3.5" />
          Prozesskatalog
        </Link>

        <div className="mt-2 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <h1 className="truncate font-display font-semibold text-2xl tracking-tight">
                {process.name}
              </h1>
              <button
                className="shrink-0"
                onClick={toggleFavorite}
                title="Favorit umschalten"
                type="button"
              >
                <StarIcon
                  className={
                    process.favorite
                      ? "size-4.5 fill-warning text-warning"
                      : "size-4.5 text-muted-foreground/40 transition-colors hover:text-warning"
                  }
                />
              </button>
            </div>
            <p className="mt-1 max-w-2xl text-muted-foreground text-sm">
              {process.descriptionShort}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <ProcessStatusBadge status={process.status} />
              <span className="text-muted-foreground text-xs">
                {FREQUENCY_LABELS[process.frequency]}
              </span>
              <ActionTypeBadge type={process.action.type} />
              <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                <UserIcon className="size-3" />
                {process.businessOwner}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                <WrenchIcon className="size-3" />
                {process.technicalOwner}
              </span>
            </div>
            {(process.systems.length > 0 || process.tags.length > 0) && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {process.systems.map((system) => (
                  <Badge key={system} variant="secondary">
                    {system}
                  </Badge>
                ))}
                {process.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {tutorial && tutorial.steps.length > 0 && (
              <Button
                onClick={() => {
                  setTab("tutorial");
                  setWizardOpen(true);
                }}
                variant="outline"
              >
                <GraduationCapIcon data-icon="inline-start" />
                Tutorial
              </Button>
            )}
            <Button
              className="glow-primary"
              disabled={process.status === "deprecated"}
              onClick={() => setStartOpen(true)}
              size="lg"
              title={
                process.status === "maintenance"
                  ? "Achtung: Prozess ist in Wartung!"
                  : undefined
              }
            >
              <PlayIcon data-icon="inline-start" />
              Prozess starten
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon-lg" variant="outline">
                  <MoreVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuItem
                  className="whitespace-nowrap"
                  onClick={exportMarkdown}
                >
                  <FileTextIcon />
                  Download Doku als Markdown
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="whitespace-nowrap"
                  onClick={exportPdf}
                >
                  <FileDownIcon />
                  Download Doku als PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {process.status === "maintenance" && (
        <div className="animate-fade-up rounded-lg border border-warning/30 bg-warning/10 px-4 py-2.5 text-sm text-warning">
          Dieser Prozess ist derzeit <strong>in Wartung</strong>. Vor dem Start
          den Hinweis in den technischen Besonderheiten beachten.
        </div>
      )}

      <Tabs
        className="animate-fade-up"
        onValueChange={setTab}
        style={{ animationDelay: "80ms" }}
        value={tab}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="uebersicht">Übersicht</TabsTrigger>
          <TabsTrigger value="runbook">Runbook</TabsTrigger>
          <TabsTrigger value="technische-details">
            Technische Details
          </TabsTrigger>
          <TabsTrigger value="konfiguration">Konfiguration</TabsTrigger>
          <TabsTrigger value="runs">Runs & Logs</TabsTrigger>
          <TabsTrigger value="tutorial">
            Tutorial
            {tutorial && tutorial.steps.length > 0 && (
              <span className="ml-1 rounded-full bg-primary/15 px-1.5 text-[0.625rem] text-primary">
                {tutorial.steps.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="uebersicht">
          <OverviewTab process={process} />
        </TabsContent>
        <TabsContent value="runbook">
          <RunbookTab process={process} />
        </TabsContent>
        <TabsContent value="technische-details">
          <TechnicalDetailsTab process={process} />
        </TabsContent>
        <TabsContent value="konfiguration">
          <ConfigTab process={process} />
        </TabsContent>
        <TabsContent value="runs">
          <RunsTab
            onSelectRun={(runId) =>
              navigate({
                search: (prev) => ({ ...prev, run: runId ?? undefined }),
                replace: true,
              })
            }
            process={process}
            selectedRunId={search.run ?? null}
          />
        </TabsContent>
        <TabsContent value="tutorial">
          <TutorialTab
            onWizardOpenChange={setWizardOpen}
            process={process}
            wizardOpen={wizardOpen}
          />
        </TabsContent>
      </Tabs>

      <StartRunDialog
        onOpenChange={setStartOpen}
        onStarted={(runId) =>
          navigate({
            search: () => ({ tab: "runs" as const, run: runId }),
            replace: true,
          })
        }
        open={startOpen}
        process={process}
      />
    </div>
  );
}

export const Route = createFileRoute("/prozesse/$processId")({
  component: ProcessDetailPage,
  validateSearch: searchSchema,
});
