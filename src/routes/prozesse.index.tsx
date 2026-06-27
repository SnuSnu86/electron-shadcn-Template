import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowDownAZIcon, SearchIcon, StarIcon, XIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import {
  ActionTypeBadge,
  ProcessStatusBadge,
  RunStatusBadge,
} from "@/components/status-indicators";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ipc } from "@/ipc/manager";
import { queryKeys, useCategories, useProcesses, useTags } from "@/lib/queries";
import {
  FREQUENCY_LABELS,
  PROCESS_STATUS_LABELS,
  type ProcessStatus,
} from "@/shared/domain";
import { formatRelative } from "@/utils/format";
import { cn } from "@/utils/tailwind";

const searchSchema = z.object({
  q: z.string().optional(),
  kategorie: z.string().optional(),
  status: z.enum(["active", "deprecated", "maintenance"]).optional(),
  tag: z.string().optional(),
  fav: z.boolean().optional(),
  sort: z.enum(["name", "lastRun", "freq"]).optional(),
});

type CatalogSearch = z.infer<typeof searchSchema>;

const FREQ_ORDER = ["daily", "weekly", "monthly", "ondemand", "adhoc"];

const ALL = "__alle__";

function CatalogPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const queryClient = useQueryClient();

  const [searchText, setSearchText] = useState(search.q ?? "");

  // Debounce der Volltextsuche in den Suchparameter
  useEffect(() => {
    const handle = setTimeout(() => {
      if ((search.q ?? "") !== searchText) {
        navigate({
          search: (prev: CatalogSearch) => ({
            ...prev,
            q: searchText || undefined,
          }),
          replace: true,
        });
      }
    }, 250);
    return () => clearTimeout(handle);
  }, [searchText, search.q, navigate]);

  const filter = useMemo(
    () => ({
      search: search.q,
      category: search.kategorie,
      status: search.status,
      tag: search.tag,
      favoritesOnly: search.fav,
    }),
    [search]
  );

  const { data: processes, isLoading } = useProcesses(filter);
  const { data: categories } = useCategories();
  const { data: tags } = useTags();

  const sorted = useMemo(() => {
    const list = [...(processes ?? [])];
    switch (search.sort) {
      case "lastRun":
        list.sort((a, b) =>
          (b.lastRunAt ?? "").localeCompare(a.lastRunAt ?? "")
        );
        break;
      case "freq":
        list.sort(
          (a, b) =>
            FREQ_ORDER.indexOf(a.frequency) - FREQ_ORDER.indexOf(b.frequency)
        );
        break;
      default:
        break; // bereits nach Name sortiert
    }
    return list;
  }, [processes, search.sort]);

  const updateSearch = (patch: Partial<CatalogSearch>) =>
    navigate({
      search: (prev: CatalogSearch) => ({ ...prev, ...patch }),
      replace: true,
    });

  const hasFilters =
    search.q || search.kategorie || search.status || search.tag || search.fav;

  const toggleFavorite = async (id: number) => {
    await ipc.client.catalog.toggleFavorite({ id });
    queryClient.invalidateQueries({ queryKey: ["processes"] });
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex animate-fade-up items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-semibold text-3xl tracking-tight">
            Prozesskatalog
          </h1>
          <p className="mt-1 text-muted-foreground text-sm">
            {processes?.length ?? "…"} Automationen — durchsuchen, filtern,
            starten.
          </p>
        </div>
      </div>

      <div
        className="flex animate-fade-up flex-wrap items-center gap-2"
        style={{ animationDelay: "60ms" }}
      >
        <div className="relative min-w-56 flex-1">
          <SearchIcon className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-8"
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Suchen nach Name, Beschreibung, Tag, System …"
            value={searchText}
          />
        </div>
        <Select
          onValueChange={(v) =>
            updateSearch({ kategorie: v === ALL ? undefined : v })
          }
          value={search.kategorie ?? ALL}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Kategorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Alle Kategorien</SelectItem>
            {categories?.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(v) =>
            updateSearch({
              status: v === ALL ? undefined : (v as ProcessStatus),
            })
          }
          value={search.status ?? ALL}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Jeder Status</SelectItem>
            {(Object.keys(PROCESS_STATUS_LABELS) as ProcessStatus[]).map(
              (s) => (
                <SelectItem key={s} value={s}>
                  {PROCESS_STATUS_LABELS[s]}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(v) =>
            updateSearch({
              sort: v === "name" ? undefined : (v as CatalogSearch["sort"]),
            })
          }
          value={search.sort ?? "name"}
        >
          <SelectTrigger className="w-40">
            <ArrowDownAZIcon className="size-3.5" />
            <SelectValue placeholder="Sortierung" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="lastRun">Letzter Lauf</SelectItem>
            <SelectItem value="freq">Frequenz</SelectItem>
          </SelectContent>
        </Select>
        <Button
          aria-pressed={search.fav === true}
          onClick={() => updateSearch({ fav: search.fav ? undefined : true })}
          size="icon"
          title="Nur Favoriten"
          variant={search.fav ? "default" : "outline"}
        >
          <StarIcon />
        </Button>
        {hasFilters && (
          <Button
            onClick={() => {
              setSearchText("");
              navigate({ search: {}, replace: true });
            }}
            size="sm"
            variant="ghost"
          >
            <XIcon data-icon="inline-start" />
            Zurücksetzen
          </Button>
        )}
      </div>

      {tags && tags.length > 0 && (
        <div
          className="flex animate-fade-up flex-wrap gap-1.5"
          style={{ animationDelay: "100ms" }}
        >
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() =>
                updateSearch({ tag: search.tag === tag ? undefined : tag })
              }
              type="button"
            >
              <Badge
                className={cn(
                  "cursor-pointer transition-all",
                  search.tag === tag
                    ? "border-primary/40 bg-primary/15 text-primary"
                    : "hover:border-primary/30 hover:text-foreground"
                )}
                variant="outline"
              >
                #{tag}
              </Badge>
            </button>
          ))}
        </div>
      )}

      <div
        className="animate-fade-up overflow-hidden rounded-lg border border-border/60 bg-card/60"
        style={{ animationDelay: "140ms" }}
      >
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-8" />
              <TableHead>Prozess</TableHead>
              <TableHead>Kategorie</TableHead>
              <TableHead>Frequenz</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Letzter Lauf</TableHead>
              <TableHead>Owner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell
                  className="h-32 text-center text-muted-foreground"
                  colSpan={7}
                >
                  Lade Prozesse …
                </TableCell>
              </TableRow>
            )}
            {!isLoading && sorted.length === 0 && (
              <TableRow>
                <TableCell
                  className="h-32 text-center text-muted-foreground"
                  colSpan={7}
                >
                  Keine Prozesse gefunden.
                  {hasFilters && " Filter anpassen oder zurücksetzen."}
                </TableCell>
              </TableRow>
            )}
            {sorted.map((process, i) => (
              <TableRow
                className="animate-fade-up cursor-pointer"
                key={process.id}
                onClick={() =>
                  navigate({
                    to: "/prozesse/$processId",
                    params: { processId: String(process.id) },
                  })
                }
                style={{ animationDelay: `${160 + Math.min(i, 15) * 25}ms` }}
              >
                <TableCell
                  className="pr-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(process.id);
                  }}
                >
                  <StarIcon
                    className={cn(
                      "size-3.5 transition-colors",
                      process.favorite
                        ? "fill-warning text-warning"
                        : "text-muted-foreground/40 hover:text-warning"
                    )}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-[0.8125rem]">
                      {process.name}
                    </span>
                    <span className="line-clamp-1 max-w-md text-[0.6875rem] text-muted-foreground">
                      {process.descriptionShort}
                    </span>
                    <ActionTypeBadge type={process.actionType} />
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {process.category}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {FREQUENCY_LABELS[process.frequency]}
                </TableCell>
                <TableCell>
                  <ProcessStatusBadge status={process.status} />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-xs">
                      {formatRelative(process.lastRunAt)}
                    </span>
                    {process.lastRunStatus && (
                      <RunStatusBadge status={process.lastRunStatus} />
                    )}
                  </div>
                </TableCell>
                <TableCell className="max-w-32 truncate text-muted-foreground text-xs">
                  {process.businessOwner}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/prozesse/")({
  component: CatalogPage,
  validateSearch: searchSchema,
});
