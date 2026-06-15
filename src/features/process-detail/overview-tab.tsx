import {
  ExternalLinkIcon,
  FileIcon,
  GitBranchIcon,
  LightbulbIcon,
  ServerIcon,
  WorkflowIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ipc } from "@/ipc/manager";
import type { ProcessDetail } from "@/shared/domain";
import { FlowDiagramView } from "./flow-diagram";

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: typeof ServerIcon;
  children: React.ReactNode;
}) {
  return (
    <CardTitle className="flex items-center gap-2 font-display text-sm">
      <Icon className="size-4 text-primary" />
      {children}
    </CardTitle>
  );
}

export function OverviewTab({ process }: { process: ProcessDetail }) {
  return (
    <div className="grid animate-fade-in gap-4 lg:grid-cols-5">
      <div className="flex flex-col gap-4 lg:col-span-3">
        {process.descriptionLong && (
          <Card className="gap-3">
            <CardHeader>
              <SectionTitle icon={LightbulbIcon}>Beschreibung</SectionTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed">
              {process.descriptionLong}
            </CardContent>
          </Card>
        )}

        <Card className="gap-3">
          <CardHeader>
            <SectionTitle icon={GitBranchIcon}>Business-Sicht</SectionTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            <div>
              <p className="mb-1 font-medium text-[0.6875rem] text-muted-foreground uppercase tracking-widest">
                Ist-Prozess (manuell)
              </p>
              <p className="leading-relaxed">
                {process.business.istProcess || "—"}
              </p>
            </div>
            <div>
              <p className="mb-1 font-medium text-[0.6875rem] text-muted-foreground uppercase tracking-widest">
                Soll-Prozess (automatisiert)
              </p>
              <p className="leading-relaxed">
                {process.business.sollProcess || "—"}
              </p>
            </div>
            <div className="rounded-md border border-success/25 bg-success/8 px-3 py-2.5">
              <p className="mb-1 font-medium text-[0.6875rem] text-success uppercase tracking-widest">
                Nutzen
              </p>
              <p className="leading-relaxed">
                {process.business.benefit || "—"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-3">
          <CardHeader>
            <SectionTitle icon={ServerIcon}>Technische Sicht</SectionTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            {process.tech.flows.length > 0 && (
              <div>
                <p className="mb-1.5 font-medium text-[0.6875rem] text-muted-foreground uppercase tracking-widest">
                  Flows & Skripte
                </p>
                <ul className="flex flex-col gap-1.5">
                  {process.tech.flows.map((flow) => (
                    <li className="flex items-center gap-2" key={flow.name}>
                      <WorkflowIcon className="size-3.5 shrink-0 text-info" />
                      <span className="font-mono text-xs">{flow.name}</span>
                      <span className="text-[0.6875rem] text-muted-foreground">
                        {flow.kind}
                      </span>
                      {flow.link && (
                        <button
                          className="text-info transition-colors hover:text-info/80"
                          onClick={() =>
                            ipc.client.shell.openExternalLink({
                              url: flow.link as string,
                            })
                          }
                          title={flow.link}
                          type="button"
                        >
                          <ExternalLinkIcon className="size-3" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {process.tech.files.length > 0 && (
              <div>
                <p className="mb-1.5 font-medium text-[0.6875rem] text-muted-foreground uppercase tracking-widest">
                  Dateien
                </p>
                <ul className="flex flex-col gap-1.5">
                  {process.tech.files.map((file) => (
                    <li className="flex flex-col gap-0.5" key={file.path}>
                      <span className="flex items-center gap-2">
                        <FileIcon className="size-3.5 shrink-0 text-muted-foreground" />
                        <code className="break-all font-mono text-[0.6875rem]">
                          {file.path}
                        </code>
                      </span>
                      <span className="pl-5.5 text-[0.6875rem] text-muted-foreground">
                        {file.purpose}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {process.tech.systems.length > 0 && (
              <div>
                <p className="mb-1.5 font-medium text-[0.6875rem] text-muted-foreground uppercase tracking-widest">
                  Systeme
                </p>
                <ul className="flex flex-col gap-1.5">
                  {process.tech.systems.map((system) => (
                    <li className="flex items-baseline gap-2" key={system.name}>
                      <ServerIcon className="size-3.5 shrink-0 translate-y-0.5 text-primary" />
                      <span className="font-medium text-xs">{system.name}</span>
                      {system.detail && (
                        <span className="text-[0.6875rem] text-muted-foreground">
                          {system.detail}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {process.tech.notes && (
              <div className="rounded-md border border-warning/25 bg-warning/8 px-3 py-2.5">
                <p className="mb-1 font-medium text-[0.6875rem] text-warning uppercase tracking-widest">
                  Besonderheiten
                </p>
                <p className="text-xs leading-relaxed">{process.tech.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="gap-3 self-start lg:col-span-2">
        <CardHeader>
          <SectionTitle icon={WorkflowIcon}>Prozessablauf</SectionTitle>
        </CardHeader>
        <CardContent>
          <FlowDiagramView diagram={process.diagram} />
        </CardContent>
      </Card>
    </div>
  );
}
