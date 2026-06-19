import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { DEFAULT_THEME, getStoredTheme, setTheme } from "@/actions/theme";
import type { ThemeMode } from "@/types/theme-mode";
import { cn } from "@/utils/tailwind";

const THEMES: {
  mode: ThemeMode;
  icon: typeof MonitorIcon;
  label: string;
  description: string;
}[] = [
  {
    mode: "system",
    icon: MonitorIcon,
    label: "System",
    description: "Folgt den Einstellungen von Windows oder macOS.",
  },
  {
    mode: "dark",
    icon: MoonIcon,
    label: "Dunkel",
    description: "Leitstand-Design mit dunklem Hintergrund.",
  },
  {
    mode: "light",
    icon: SunIcon,
    label: "Hell",
    description: "Helle Darstellung für gut beleuchtete Umgebungen.",
  },
];

export default function ThemeSelector() {
  const [active, setActive] = useState<ThemeMode>(DEFAULT_THEME);

  useEffect(() => {
    setActive(getStoredTheme());
  }, []);

  const selectTheme = async (mode: ThemeMode) => {
    setActive(mode);
    await setTheme(mode);
  };

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {THEMES.map((item) => {
        const selected = active === item.mode;

        return (
          <button
            className={cn(
              "flex flex-col gap-2 rounded-lg border p-4 text-left transition-all",
              selected
                ? "glow-primary border-primary/50 bg-primary/10"
                : "border-border/60 bg-card hover:border-primary/30"
            )}
            key={item.mode}
            onClick={() => selectTheme(item.mode)}
            type="button"
          >
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-lg",
                selected
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <item.icon className="size-4" />
            </span>
            <span className="font-display font-semibold text-sm">
              {item.label}
            </span>
            <span className="text-[0.6875rem] text-muted-foreground leading-relaxed">
              {item.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
