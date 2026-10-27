// 全局搜索主页面：顶栏（搜索 / 实时模式 / 刷新）+ 筛选面板 + 表格 / 数据汇总 Tab + 详情抽屉。

import { useCallback, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SearchIcon } from "lucide-react";
import { Drawer, DrawerHeader, DrawerPanel, DrawerPopup, DrawerTitle } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import { toastManager } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/explore/DataTable.tsx";
import { DetailSheet } from "@/components/explore/DetailSheet.tsx";
import { FilterChips } from "@/components/explore/FilterChips.tsx";
import { FilterPanel } from "@/components/explore/FilterPanel.tsx";
import { FilterTriggerButton } from "@/components/explore/FilterTriggerButton.tsx";
import { StatCards } from "@/components/explore/StatCards.tsx";
import { WeeklyView } from "@/components/explore/WeeklyView.tsx";
import { useExploreData } from "@/lib/explore/data.tsx";
import { useFilters } from "@/lib/explore/filters.ts";
import {
  FLAGS,
  MULTI_KEYS,
  aggregate,
  emptyState,
  filterItems,
  sortItems,
  stateToQuery,
  type FilterState,
  type MultiKey,
} from "@/lib/explore/core.ts";

function showToast(message: string) {
  toastManager.add({ title: message });
}

function copyText(text: string, message: string) {
  const done = () => showToast(message);
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
}

function fallbackCopy(text: string, done: () => void) {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  try {
    document.execCommand("copy");
    done();
  } catch {
    // 复制失败由用户手动处理
  }
  area.remove();
}

export default function ExplorePage() {
  const { data, loading, refreshing, error, refresh } = useExploreData();
  const { filters, patch, set } = useFilters();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const tab = location.pathname.startsWith("/weekly") ? "weekly" : "items";
  const selectedId = params.id ?? null;

  const [drawerOpen, setDrawerOpen] = useState(false);


  const now = data?.meta.now ?? 0;
  const items = useMemo(() => data?.items ?? [], [data]);
  const filtered = useMemo(() => filterItems(items, filters, now), [items, filters, now]);
  const rows = useMemo(() => sortItems(filtered, filters.sort, filters.dir), [filtered, filters.sort, filters.dir]);
  const agg = useMemo(() => aggregate(rows, now), [rows, now]);
  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (filters.q.trim()) n += 1;
    for (const field of MULTI_KEYS) if (filters[field].length > 0) n += filters[field].length;
    for (const flag of FLAGS) if (filters[flag]) n += 1;
    if (filters.timePreset !== "all") n += 1;
    return n;
  }, [filters]);

  const selectedItem = useMemo(
    () => (selectedId ? (items.find((item) => item.id === selectedId) ?? null) : null),
    [items, selectedId],
  );

  const scopeLabel = useMemo(() => {
    if (!data) return "全部项目";
    const parts: string[] = [];
    if (filters.project.length > 0) {
      parts.push(
        filters.project.map((id) => data.projects.find((project) => project.id === id)?.name ?? id).join("、"),
      );
    }
    if (filters.q.trim()) parts.push(`搜索「${filters.q.trim()}」`);
    return parts.length > 0 ? parts.join(" · ") : "全部项目";
  }, [data, filters.project, filters.q]);

  const selectItem = useCallback(
    (id: string | null) => {
      const query = location.search;
      const base = tab === "weekly" ? "/weekly" : "/items";
      if (id) navigate(`${base}/${encodeURIComponent(id)}${query}`);
      else navigate(`${base}${query}`);
    },
    [location.search, navigate, tab],
  );

  const switchTab = useCallback(
    (next: string) => {
      navigate(next === "weekly" ? `/weekly${location.search}` : `/items${location.search}`);
    },
    [location.search, navigate],
  );

  const filterFromDrawer = useCallback(
    (field: MultiKey, value: string) => {
      // 直接携带新筛选参数跳转（先 set 再 navigate('/items') 会丢掉刚设置的 query）
      const next = { ...emptyState(), [field]: [value] } as FilterState;
      const query = stateToQuery(next);
      navigate(`/items${query ? `?${query}` : ""}`);
      showToast("已按该条件筛选");
    },
    [navigate],
  );

  if (loading) {
    return (
      <div className="flex h-screen flex-col gap-4 p-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-[420px] w-full" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="flex max-w-md flex-col items-center gap-3 rounded-xl border bg-card p-10 text-center">
          <b>数据加载失败</b>
          <span className="text-sm text-muted-foreground">{error}</span>
          <span className="text-xs text-muted-foreground">
            本地实时模式：在 yunxiao-insight 仓库运行 <code>bun run serve</code>；
            OSS 部署：确认 data.json 与页面同目录。
          </span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      <header className="z-30 flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b border-slate-200 bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur-xl dark:border-border dark:bg-card/80">
        <div className="flex shrink-0 items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <SearchIcon className="size-3.5" />
          </div>
          <div className="leading-tight">
            <div className="text-[10px] tracking-[0.14em] text-muted-foreground">YUNXIAO · GLOBAL EXPLORE</div>
            <h1 className="text-sm font-semibold whitespace-nowrap">{data.meta.title}</h1>
          </div>
        </div>
      </header>

      <main className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-hidden p-4">
        <StatCards agg={agg} />

        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <Tabs value={tab} onValueChange={(value) => switchTab(value as string)}>
            <TabsList>
              <TabsTab value="items">表格</TabsTab>
              <TabsTab value="weekly">数据汇总</TabsTab>
            </TabsList>
          </Tabs>
          <div className="ml-auto flex items-center gap-2">
            {refreshing && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Spinner className="size-3.5" />
                正在获取最新数据…
              </span>
            )}
            <FilterTriggerButton activeCount={activeFilterCount} onClick={() => setDrawerOpen(true)} />
          </div>
        </div>

        <FilterChips
          data={data}
          items={items}
          filters={filters}
          now={now}
          onPatch={patch}
          onClearAll={() => set(emptyState())}
          activeCount={activeFilterCount}
        />

        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col overflow-hidden transition-opacity",
            refreshing && "opacity-60",
          )}
        >
          {tab === "items" ? (
            <DataTable
              rows={rows}
              now={now}
              selectedId={selectedId}
              sort={filters.sort}
              dir={filters.dir}
              onSort={(sort, dir) => patch({ sort, dir })}
              onSelect={(id) => selectItem(id)}
              onToast={showToast}
              onRefresh={refresh}
              refreshing={refreshing}
              fetchedAt={data.meta.fetchedAt}
            />
          ) : (
            <div className="min-h-0 flex-1 overflow-auto pr-1">
              <WeeklyView
                rows={rows}
                now={now}
                scopeLabel={scopeLabel}
                onOpenItem={(id) => selectItem(id)}
                onCopy={copyText}
              />
            </div>
          )}
        </div>
      </main>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} position="right">
        <DrawerPopup showCloseButton>
          <DrawerHeader>
            <DrawerTitle>筛选条件</DrawerTitle>
          </DrawerHeader>
          <DrawerPanel>
            <FilterPanel data={data} items={items} filters={filters} now={now} onPatch={patch} />
          </DrawerPanel>
        </DrawerPopup>
      </Drawer>

      <DetailSheet
        data={data}
        item={selectedItem}
        onClose={() => selectItem(null)}
        onFilter={filterFromDrawer}
        onJump={(id) => selectItem(id)}
        onCopy={copyText}
      />
    </div>
  );
}
