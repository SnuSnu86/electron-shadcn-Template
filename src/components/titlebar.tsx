import { useEffect, useState } from "react";
import { getPlatform } from "@/actions/app";
import { closeWindow, maximizeWindow, minimizeWindow } from "@/actions/window";
import { useDashboard } from "@/lib/queries";
import { cn } from "@/utils/tailwind";

function RunningIndicator() {
  const { data } = useDashboard();
  const running = data?.runningNow ?? 0;
  if (running === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[0.6875rem] text-muted-foreground/70">
        <span className="size-1.5 rounded-full bg-muted-foreground/40" />
        Bereit
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[0.6875rem] text-info">
      <span className="size-1.5 animate-pulse-dot rounded-full bg-info" />
      {running} {running === 1 ? "Lauf aktiv" : "Läufe aktiv"}
    </span>
  );
}

export default function Titlebar() {
  const [platform, setPlatform] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getPlatform()
      .then((value) => {
        if (active) {
          setPlatform(value);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const isMacOS = platform === "darwin";

  return (
    <header className="draglayer relative z-20 flex h-10 w-full shrink-0 items-center justify-between border-border/60 border-b bg-background/80">
      <div className={cn("flex items-center gap-3 pl-4", isMacOS && "pl-20")}>
        <div className="flex select-none items-baseline gap-2">
          <span className="font-display font-semibold text-[0.9375rem] tracking-tight">
            JOZI
            <span className="text-primary">.</span>
          </span>
          <span className="hidden font-medium text-[0.6875rem] text-muted-foreground tracking-wide sm:inline">
            CONTROL & DOCUMENTATION CENTER
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="no-drag">
          <RunningIndicator />
        </div>
        {!isMacOS && <WindowButtons />}
      </div>
    </header>
  );
}

function WindowButtons() {
  return (
    <div className="no-drag flex h-10 items-stretch">
      <button
        className="flex w-11 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        onClick={minimizeWindow}
        title="Minimieren"
        type="button"
      >
        <svg aria-hidden="true" height="12" viewBox="0 0 12 12" width="12">
          <rect fill="currentColor" height="1" width="10" x="1" y="6" />
        </svg>
      </button>
      <button
        className="flex w-11 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        onClick={maximizeWindow}
        title="Maximieren"
        type="button"
      >
        <svg aria-hidden="true" height="12" viewBox="0 0 12 12" width="12">
          <rect
            fill="none"
            height="9"
            stroke="currentColor"
            width="9"
            x="1.5"
            y="1.5"
          />
        </svg>
      </button>
      <button
        className="flex w-11 items-center justify-center text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground hover:text-white"
        onClick={closeWindow}
        title="Schließen"
        type="button"
      >
        <svg aria-hidden="true" height="12" viewBox="0 0 12 12" width="12">
          <polygon
            fill="currentColor"
            fillRule="evenodd"
            points="11 1.576 6.583 6 11 10.424 10.424 11 6 6.583 1.576 11 1 10.424 5.417 6 1 1.576 1.576 1 6 5.417 10.424 1"
          />
        </svg>
      </button>
    </div>
  );
}
