import { GraduationCapIcon, PlayIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTutorial } from "@/lib/queries";
import type { ProcessDetail } from "@/shared/domain";
import { TutorialInlineText } from "./tutorial-rich-text";
import { TutorialDialog } from "./tutorial-wizard";

export function TutorialTab({
  process,
  wizardOpen,
  onWizardOpenChange,
}: {
  process: ProcessDetail;
  wizardOpen: boolean;
  onWizardOpenChange: (open: boolean) => void;
}) {
  const { data: tutorial } = useTutorial(process.id);

  if (!tutorial) {
    return (
      <div className="animate-fade-in">
        <Card className="py-12">
          <CardContent className="flex flex-col items-center gap-3 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <GraduationCapIcon className="size-5" />
            </span>
            <h3 className="font-display font-semibold">
              Noch kein Tutorial vorhanden
            </h3>
            <p className="max-w-md text-muted-foreground text-sm">
              Für diesen Prozess ist noch kein Tutorial hinterlegt.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  let currentGroup = "";

  return (
    <div className="flex animate-fade-in flex-col gap-4">
      <Card className="gap-0 py-0">
        <div className="flex items-center justify-between gap-4 border-border/60 border-b px-4 py-3">
          <div className="min-w-0">
            <h3 className="truncate font-display font-semibold text-sm">
              {tutorial.title}
            </h3>
            <p className="text-[0.6875rem] text-muted-foreground">
              {tutorial.description || "Keine Beschreibung."} —{" "}
              {tutorial.steps.length} Schritte
            </p>
          </div>
          <Button
            disabled={tutorial.steps.length === 0}
            onClick={() => onWizardOpenChange(true)}
            size="sm"
          >
            <PlayIcon data-icon="inline-start" />
            Tutorial starten
          </Button>
        </div>
        <CardContent className="p-0">
          {tutorial.steps.length === 0 && (
            <p className="px-4 py-10 text-center text-muted-foreground text-sm">
              Noch keine Schritte definiert.
            </p>
          )}
          <ol className="divide-y divide-border/60">
            {tutorial.steps.map((step, i) => {
              const showGroup = step.group && step.group !== currentGroup;
              if (showGroup) {
                currentGroup = step.group;
              }
              return (
                <li key={step.id}>
                  {showGroup && (
                    <p className="bg-muted/40 px-4 py-1.5 font-medium text-[0.625rem] text-muted-foreground uppercase tracking-widest">
                      {step.group}
                    </p>
                  )}
                  <div className="flex items-start gap-3 px-4 py-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/15 font-display font-semibold text-[0.6875rem] text-primary">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-[0.8125rem]">
                        {step.title}
                      </p>
                      <p className="mt-0.5 text-muted-foreground text-xs leading-relaxed">
                        <TutorialInlineText text={step.description} />
                      </p>
                      {step.expectedResult && (
                        <p className="mt-1 text-[0.6875rem] text-success">
                          Erwartet:{" "}
                          <TutorialInlineText text={step.expectedResult} />
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>

      {wizardOpen && tutorial.steps.length > 0 && (
        <TutorialDialog
          onClose={() => onWizardOpenChange(false)}
          processName={process.name}
          tutorial={tutorial}
        />
      )}
    </div>
  );
}
