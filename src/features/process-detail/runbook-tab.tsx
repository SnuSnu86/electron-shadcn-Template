import {
  AlertOctagonIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
  HelpCircleIcon,
  ListChecksIcon,
  PhoneForwardedIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProcessDetail } from "@/shared/domain";

export function RunbookTab({ process }: { process: ProcessDetail }) {
  const rb = process.runbook;

  return (
    <div className="grid animate-fade-in gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <Card className="gap-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-sm">
              <HelpCircleIcon className="size-4 text-primary" />
              Wann nutze ich diesen Prozess?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed">
            {rb.whenToUse || (
              <span className="text-muted-foreground">Nicht dokumentiert.</span>
            )}
          </CardContent>
        </Card>

        <Card className="gap-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-sm">
              <ListChecksIcon className="size-4 text-info" />
              Voraussetzungen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2 text-sm">
              {rb.prerequisites.map((item) => (
                <li className="flex items-start gap-2.5" key={item}>
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-info" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
              {rb.prerequisites.length === 0 && (
                <li className="text-muted-foreground">Keine dokumentiert.</li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card className="gap-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-sm">
              <ClipboardListIcon className="size-4 text-primary" />
              Auszuführende Schritte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="flex flex-col gap-2.5 text-sm">
              {rb.steps.map((step, i) => (
                <li className="flex items-start gap-3" key={step}>
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 font-display font-semibold text-[0.6875rem] text-primary">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
              {rb.steps.length === 0 && (
                <li className="text-muted-foreground">Keine dokumentiert.</li>
              )}
            </ol>
          </CardContent>
        </Card>

        <Card className="gap-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-sm">
              <CheckCircle2Icon className="size-4 text-success" />
              Erwartete Ergebnisse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2 text-sm">
              {rb.expectedResults.map((item) => (
                <li className="flex items-start gap-2.5" key={item}>
                  <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-success" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
              {rb.expectedResults.length === 0 && (
                <li className="text-muted-foreground">Keine dokumentiert.</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="gap-3 self-start">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-sm">
            <AlertOctagonIcon className="size-4 text-destructive" />
            Fehler & Workarounds
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {rb.errors.length === 0 && (
            <p className="text-muted-foreground text-sm">
              Keine bekannten Fehlerbilder dokumentiert.
            </p>
          )}
          {rb.errors.map((error) => (
            <div
              className="rounded-lg border border-border/60 bg-muted/30 p-3"
              key={error.problem}
            >
              <p className="font-medium text-destructive text-sm">
                {error.problem}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed">{error.solution}</p>
              {error.escalation && (
                <p className="mt-2 flex items-center gap-1.5 text-[0.6875rem] text-muted-foreground">
                  <PhoneForwardedIcon className="size-3" />
                  Eskalation: {error.escalation}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
