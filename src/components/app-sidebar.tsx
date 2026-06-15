import { Link, useRouterState } from "@tanstack/react-router";
import {
  FolderIcon,
  GaugeIcon,
  LayersIcon,
  SettingsIcon,
  StarIcon,
} from "lucide-react";
import { useDashboard, useRole } from "@/lib/queries";
import { ROLE_LABELS } from "@/shared/domain";
import { cn } from "@/utils/tailwind";

const NAV_ITEMS = [
  { to: "/", label: "Leitstand", icon: GaugeIcon, exact: true },
  { to: "/prozesse", label: "Prozesskatalog", icon: LayersIcon, exact: false },
  {
    to: "/einstellungen",
    label: "Einstellungen",
    icon: SettingsIcon,
    exact: false,
  },
] as const;

export default function AppSidebar() {
  const { data: stats } = useDashboard();
  const { data: role } = useRole();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="flex w-56 shrink-0 flex-col border-border/60 border-r bg-sidebar/50">
      <nav className="flex flex-col gap-0.5 p-3">
        {NAV_ITEMS.map((item) => {
          const active = item.exact
            ? pathname === item.to
            : pathname.startsWith(item.to);
          return (
            <Link
              className={cn(
                "group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 font-medium text-[0.8125rem] transition-colors",
                active
                  ? "bg-primary/12 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
              key={item.to}
              to={item.to}
            >
              <item.icon
                className={cn(
                  "size-4 transition-transform group-hover:scale-110",
                  active && "text-primary"
                )}
              />
              {item.label}
              {active && (
                <span className="glow-primary ml-auto size-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mx-3 border-border/60 border-t" />

      <div className="flex flex-col gap-0.5 p-3">
        <p className="mb-1 px-2.5 font-medium text-[0.625rem] text-muted-foreground/70 uppercase tracking-widest">
          Schnellzugriff
        </p>
        <Link
          className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[0.8125rem] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          search={{ fav: true }}
          to="/prozesse"
        >
          <StarIcon className="size-4 text-warning" />
          Favoriten
        </Link>
      </div>

      {stats && stats.categories.length > 0 && (
        <>
          <div className="mx-3 border-border/60 border-t" />
          <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto p-3">
            <p className="mb-1 px-2.5 font-medium text-[0.625rem] text-muted-foreground/70 uppercase tracking-widest">
              Kategorien
            </p>
            {stats.categories.map((cat) => (
              <Link
                className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[0.8125rem] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                key={cat.category}
                search={{ kategorie: cat.category }}
                to="/prozesse"
              >
                <FolderIcon className="size-4 opacity-60" />
                <span className="truncate">{cat.category}</span>
                <span className="ml-auto rounded-full bg-muted px-1.5 font-mono text-[0.625rem] text-muted-foreground">
                  {cat.count}
                </span>
              </Link>
            ))}
          </div>
        </>
      )}

      <div className="mt-auto border-border/60 border-t p-3">
        <div className="flex items-center gap-2.5 rounded-md bg-muted/50 px-2.5 py-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary/15 font-display font-semibold text-primary text-xs">
            {(role ?? "?").charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium text-xs">Lokales Profil</p>
            <p className="text-[0.6875rem] text-muted-foreground">
              Rolle: {role ? ROLE_LABELS[role] : "…"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
