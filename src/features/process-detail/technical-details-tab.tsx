import {
  FileCode2Icon,
  FileSpreadsheetIcon,
  MonitorCogIcon,
  WorkflowIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTechnicalArtifacts } from "@/lib/queries";
import type {
  ProcessDetail,
  ProcessTechnicalArtifact,
  TechnicalArtifactKind,
} from "@/shared/domain";

const KIND_META: Record<
  TechnicalArtifactKind,
  { className: string; description: string; icon: typeof WorkflowIcon }
> = {
  "Power Automate Desktop": {
    className: "border-info/25 bg-info/8 text-info",
    description:
      "Desktop-Flow und Subflows für Datum, SAP-Export und Excel-Automation.",
    icon: WorkflowIcon,
  },
  "SAP VBScript": {
    className: "border-primary/25 bg-primary/8 text-primary",
    description: "SAP-GUI-Scripting für Transaktion, Selektion und XXL-Export.",
    icon: MonitorCogIcon,
  },
  "Excel VBA": {
    className: "border-success/25 bg-success/8 text-success",
    description:
      "Excel-Makros für Datenaufbereitung, KPI-Berechnung, Reporting und E-Mail.",
    icon: FileSpreadsheetIcon,
  },
};

const CATEGORY_ORDER: TechnicalArtifactKind[] = [
  "Power Automate Desktop",
  "SAP VBScript",
  "Excel VBA",
];

function ArtifactCard({ artifact }: { artifact: ProcessTechnicalArtifact }) {
  const meta = KIND_META[artifact.kind];
  const Icon = meta.icon;

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardHeader className="border-border/60 border-b px-4 py-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="flex items-center gap-2 font-display text-sm">
              <Icon className="size-4 text-primary" />
              <span className="break-words">{artifact.title}</span>
            </CardTitle>
            <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
              {artifact.description}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
            <Badge className={meta.className} variant="outline">
              {artifact.kind}
            </Badge>
            <Badge variant="secondary">{artifact.language}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-72">
          <pre className="min-w-full overflow-x-auto bg-muted/35 p-4 font-mono text-[0.6875rem] leading-relaxed">
            <code>{artifact.code}</code>
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function ArtifactCategoriesTabs({
  categories,
}: {
  categories: {
    artifacts: ProcessTechnicalArtifact[];
    kind: TechnicalArtifactKind;
  }[];
}) {
  const visibleCategories = categories.filter(
    ({ artifacts }) => artifacts.length > 0
  );
  const defaultKind = visibleCategories[0]?.kind;

  if (!defaultKind) {
    return null;
  }

  return (
    <Tabs className="gap-4" defaultValue={defaultKind}>
      <TabsList className="grid h-auto w-full grid-cols-1 gap-2 bg-transparent p-0 sm:grid-cols-3">
        {visibleCategories.map(({ artifacts, kind }) => {
          const meta = KIND_META[kind];
          const Icon = meta.icon;

          return (
            <TabsTrigger
              className="h-auto justify-start rounded-lg border border-border/70 bg-card/70 px-4 py-3 text-left data-active:border-primary/35 data-active:bg-card data-active:shadow-sm"
              key={kind}
              value={kind}
            >
              <span className="flex min-w-0 flex-1 items-start gap-3">
                <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="min-w-0">
                  <span className="block font-display font-semibold text-foreground text-sm">
                    {kind}
                  </span>
                  <span className="mt-1 block whitespace-normal text-muted-foreground text-xs leading-relaxed">
                    {meta.description}
                  </span>
                </span>
              </span>
              <Badge className={meta.className} variant="outline">
                {artifacts.length} Artefakte
              </Badge>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {visibleCategories.map(({ artifacts, kind }) => (
        <TabsContent className="mt-15" key={kind} value={kind}>
          <div className="flex flex-col gap-3">
            {artifacts.map((artifact) => (
              <ArtifactCard artifact={artifact} key={artifact.id} />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

export function TechnicalDetailsTab({ process }: { process: ProcessDetail }) {
  const { data: artifacts = [], isLoading } = useTechnicalArtifacts(process.id);
  const counts = artifacts.reduce<Record<TechnicalArtifactKind, number>>(
    (acc, artifact) => {
      acc[artifact.kind] += 1;
      return acc;
    },
    {
      "Excel VBA": 0,
      "Power Automate Desktop": 0,
      "SAP VBScript": 0,
    }
  );
  const artifactsByKind = CATEGORY_ORDER.map((kind) => ({
    artifacts: artifacts.filter((artifact) => artifact.kind === kind),
    kind,
  }));

  return (
    <div className="flex animate-fade-in flex-col gap-4">
      <div className="gap-4">
        <Card className="gap-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-sm">
              <FileCode2Icon className="size-4 text-primary" />
              Technische Details
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <p className="leading-relaxed">
              {artifacts.length > 0
                ? "Der Prozess besteht aus einem Power-Automate-Desktop-Flow, einem eingebetteten SAP-GUI-VBScript und mehreren Excel-Makros zur Berechnung, Übergabe und Verteilung der Servicegrad-Kennzahlen."
                : "Für diesen Prozess sind noch keine technischen Code-Artefakte in SQLite hinterlegt."}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(counts).map(([kind, count]) => {
                const meta = KIND_META[kind as TechnicalArtifactKind];
                const Icon = meta.icon;
                return (
                  <div
                    className="rounded-md border border-border/70 bg-muted/25 p-2"
                    key={kind}
                  >
                    <Icon className="mb-2 size-3.5 text-primary" />
                    <p className="font-display font-semibold text-base">
                      {count}
                    </p>
                    <p className="text-[0.625rem] text-muted-foreground leading-tight">
                      {kind}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <ArtifactCategoriesTabs categories={artifactsByKind} />
        {artifacts.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground text-sm">
              {isLoading
                ? "Technische Artefakte werden geladen."
                : "Keine technischen Code-Artefakte in SQLite hinterlegt."}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
