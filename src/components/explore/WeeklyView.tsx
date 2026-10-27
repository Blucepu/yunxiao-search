// 数据汇总视图：自由选择时间范围（本周 / 上周 / 本月 / 上月 / 自定义），
// 基于当前筛选结果自动汇总，一键复制 Markdown 汇总素材。

import { useMemo, useState } from "react";
import { ClipboardCopyIcon } from "lucide-react";
import type { ExploreItem } from "../../../../yunxiao-insight/src/explore/types.ts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverPopup, PopoverTrigger } from "@/components/ui/popover";
import { DateRangePicker } from "@/components/explore/DateRangePicker.tsx";
import {
  DAY_MS,
  buildSummary,
  fmtDate,
  pct,
  startOfMonth,
  startOfWeek,
  weeklyMarkdown,
  type WeeklyGroup,
} from "@/lib/explore/core.ts";


interface Props {
  rows: ExploreItem[];
  now: number;
  scopeLabel: string;
  onOpenItem(id: string): void;
  onCopy(text: string, message: string): void;
}

const RANGE_OPTIONS = [
  { key: "thisWeek", label: "本周" },
  { key: "lastWeek", label: "上周" },
  { key: "thisMonth", label: "本月" },
  { key: "lastMonth", label: "上月" },
  { key: "custom", label: "自定义" },
] as const;

type RangeKey = (typeof RANGE_OPTIONS)[number]["key"];

function resolveRange(key: RangeKey, customFrom: number | null, customTo: number | null, now: number): [number, number] {
  if (key === "custom") return [customFrom ?? now - 29 * DAY_MS, customTo ?? now];
  if (key === "lastWeek") {
    const week = startOfWeek(now);
    return [week - 7 * DAY_MS, week - 1];
  }
  if (key === "thisMonth") return [startOfMonth(now), now];
  if (key === "lastMonth") {
    const month = startOfMonth(now);
    return [startOfMonth(month - DAY_MS), month - 1];
  }
  return [startOfWeek(now), now];
}

function ItemLine({
  item,
  extra,
  onOpenItem,
}: {
  item: ExploreItem;
  extra?: string;
  onOpenItem(id: string): void;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 py-0.5 text-sm">
      <button
        type="button"
        className="shrink-0 text-primary tabular-nums hover:underline"
        onClick={() => onOpenItem(item.id)}
      >
        {item.serial}
      </button>
      <span className="truncate" title={item.subject}>
        {item.subject}
      </span>
      <span className="shrink-0 text-xs text-muted-foreground">
        {extra ?? `${item.assignee || "未分配"} · ${item.stageLabel}`}
      </span>
    </div>
  );
}

function SummaryCard({
  title,
  count,
  groups,
  items,
  tone,
  onOpenItem,
  emptyText,
}: {
  title: string;
  count: number;
  groups?: WeeklyGroup[];
  items?: ExploreItem[];
  tone?: "risk";
  onOpenItem(id: string): void;
  emptyText: string;
}) {
  const empty = (groups ?? items ?? []).length === 0;
  return (
    <div
      className={
        tone === "risk"
          ? "rounded-lg border border-red-200 bg-white p-4 shadow-none dark:border-destructive/40 dark:bg-card"
          : "rounded-lg border border-slate-200 bg-white p-4 shadow-none dark:border-border dark:bg-card"
      }
    >
      <h3 className="mb-2.5 flex items-baseline gap-2 text-sm font-semibold">
        {title}
        <span className="text-primary tabular-nums">{count}</span>
      </h3>
      {empty && <p className="text-sm text-muted-foreground">{emptyText}</p>}
      {groups?.map((group) => (
        <div key={group.name} className="mb-2.5">
          <div className="mb-1 flex items-baseline gap-2 text-sm">
            <b>{group.name}</b>
            <Badge variant="secondary" size="sm">
              {group.items.length}
            </Badge>
          </div>
          {group.items.map((item) => (
            <ItemLine key={item.id} item={item} onOpenItem={onOpenItem} />
          ))}
        </div>
      ))}
      {items?.map((item) => (
        <ItemLine
          key={item.id}
          item={item}
          extra={tone === "risk" ? item.riskReasons.join("；") || "风险" : undefined}
          onOpenItem={onOpenItem}
        />
      ))}
    </div>
  );
}

export function WeeklyView({ rows, now, scopeLabel, onOpenItem, onCopy }: Props) {
  const [rangeKey, setRangeKey] = useState<RangeKey>("thisWeek");
  const [customFrom, setCustomFrom] = useState<number | null>(null);
  const [customTo, setCustomTo] = useState<number | null>(null);
  const [customOpen, setCustomOpen] = useState(false);

  const [rangeStart, rangeEnd] = useMemo(
    () => resolveRange(rangeKey, customFrom, customTo, now),
    [rangeKey, customFrom, customTo, now],
  );
  const summary = useMemo(() => buildSummary(rows, rangeStart, rangeEnd, now), [rows, rangeStart, rangeEnd, now]);
  const { agg } = summary;
  const rangeText = `${fmtDate(summary.weekStart)} ~ ${fmtDate(summary.weekEnd)}`;

  return (
    <section aria-label="数据汇总" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-none dark:border-border dark:bg-card">
        <div className="flex flex-col gap-2">
          <div>
            <h2 className="text-base font-semibold">数据汇总（{rangeText}）</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              范围：{scopeLabel} · 完成率 {pct(agg.rate, agg.effective)}（{agg.done}/{agg.effective}） · 未完成{" "}
              {agg.open} · 逾期 {agg.overdue} · 停滞 {agg.stale} · 未分配 {agg.unassigned}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              基于当前筛选结果与所选时间范围实时汇总；调整筛选条件即可改变口径。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {RANGE_OPTIONS.map((option) =>
              option.key === "custom" ? (
                <Popover
                  key={option.key}
                  open={customOpen}
                  onOpenChange={(open) => {
                    setCustomOpen(open);
                    if (open) setRangeKey("custom");
                  }}
                >
                  <PopoverTrigger
                    render={
                      <Button
                        size="xs"
                        variant={rangeKey === "custom" ? "default" : "outline"}
                        aria-pressed={rangeKey === "custom"}
                      />
                    }
                  >
                    {option.label}
                    {rangeKey === "custom" && customFrom !== null && customTo !== null
                      ? ` ${fmtDate(customFrom)} ~ ${fmtDate(customTo)}`
                      : ""}
                  </PopoverTrigger>
                  <PopoverPopup className="p-0 [&>[data-slot=popover-viewport]]:p-0" align="start" sideOffset={6}>
                    <DateRangePicker
                      from={customFrom}
                      to={customTo}
                      now={now}
                      onApply={(from, to) => {
                        setCustomFrom(from);
                        setCustomTo(to);
                        setRangeKey("custom");
                        setCustomOpen(false);
                      }}
                      onCancel={() => {
                        setCustomOpen(false);
                        if (customFrom === null && customTo === null) setRangeKey("thisWeek");
                      }}
                    />
                  </PopoverPopup>
                </Popover>
              ) : (
                <Button
                  key={option.key}
                  size="xs"
                  variant={rangeKey === option.key ? "default" : "outline"}
                  aria-pressed={rangeKey === option.key}
                  onClick={() => setRangeKey(option.key)}
                >
                  {option.label}
                </Button>
              ),
            )}
          </div>
        </div>

        <Button onClick={() => onCopy(weeklyMarkdown(summary, scopeLabel), "汇总素材已复制")}>
          <ClipboardCopyIcon />
          复制 Markdown 汇总
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <SummaryCard
          title="周期内完成"
          count={summary.completed.length}
          groups={summary.completedByAssignee}
          onOpenItem={onOpenItem}
          emptyText="周期内暂无完成记录"
        />
        <SummaryCard
          title="周期内新增"
          count={summary.created.length}
          groups={summary.createdByProject}
          onOpenItem={onOpenItem}
          emptyText="周期内暂无新增"
        />
        <SummaryCard
          title="进行中"
          count={summary.inProgress.length}
          items={summary.inProgress.slice(0, 30)}
          onOpenItem={onOpenItem}
          emptyText="暂无进行中的工作项"
        />
        <SummaryCard
          title="风险与阻塞"
          count={summary.risks.length}
          tone="risk"
          items={summary.risks.slice(0, 30)}
          onOpenItem={onOpenItem}
          emptyText="暂无风险项"
        />
      </div>
    </section>
  );
}
