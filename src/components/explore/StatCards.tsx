// 聚合卡片：随当前筛选结果实时重算，含阶段分布条。

import {
  STAGE_LABEL,
  STAGE_ORDER,
  pct,
  type Aggregate,
} from "@/lib/explore/core.ts";
import { cn } from "@/lib/utils";

const STAGE_BAR: Record<string, string> = {
  todo: "bg-muted-foreground/50",
  doing: "bg-info",
  verify: "bg-warning",
  done: "bg-success",
  canceled: "bg-muted-foreground/30",
  unknown: "bg-muted-foreground/30",
};

export function StatCards({ agg }: { agg: Aggregate }) {
  const cells = [
    { label: "结果条数", value: String(agg.total) },
    { label: "完成率", value: pct(agg.rate, agg.effective), tone: agg.rate >= 0.7 ? "ok" : "" },
    { label: "已完成 / 有效", value: `${agg.done}/${agg.effective}` },
    { label: "未完成", value: String(agg.open) },
    { label: "逾期", value: String(agg.overdue), tone: agg.overdue > 0 ? "risk" : "" },
    { label: "停滞", value: String(agg.stale), tone: agg.stale > 0 ? "risk" : "" },
    { label: "未分配", value: String(agg.unassigned), tone: agg.unassigned > 0 ? "risk" : "" },
    { label: "3 天内到期", value: String(agg.dueSoon), tone: agg.dueSoon > 0 ? "risk" : "" },
    { label: "本周完成", value: String(agg.weekCompleted), tone: agg.weekCompleted > 0 ? "ok" : "" },
    { label: "本周新增", value: String(agg.weekCreated) },
  ];

  const segments = STAGE_ORDER.filter((stage) => (agg.stages[stage] ?? 0) > 0);
  const total = Math.max(1, agg.total);

  return (
    <div className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-10">
      {cells.map((cell) => (
        <div
          key={cell.label}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-none transition-colors hover:bg-slate-50 dark:border-border dark:bg-card dark:hover:bg-muted/30"
        >
          <div
            className={cn(
              "text-xl font-semibold tracking-tight tabular-nums",
              cell.tone === "risk" && "text-destructive",
              cell.tone === "ok" && "text-success",
            )}
          >
            {cell.value}
          </div>
          <div className="text-xs font-medium text-muted-foreground">{cell.label}</div>
        </div>
      ))}
      <div className="col-span-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-none dark:border-border dark:bg-card">
        <div className="mb-1.5 text-xs text-muted-foreground">
          当前结果的阶段分布 · <b className="tabular-nums">{agg.total}</b> 条
        </div>
        <div className="flex h-2 overflow-hidden rounded-full bg-muted">
          {segments.map((stage) => (
            <span
              key={stage}
              className={cn("h-full", STAGE_BAR[stage])}
              style={{ width: `${(((agg.stages[stage] ?? 0) / total) * 100).toFixed(3)}%` }}
              title={`${STAGE_LABEL[stage]} ${agg.stages[stage]}`}
            />
          ))}
        </div>
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {segments.map((stage) => (
            <span key={stage} className="inline-flex items-center gap-1">
              <i className={cn("inline-block size-2 rounded-sm", STAGE_BAR[stage])} />
              {STAGE_LABEL[stage]} <b className="tabular-nums">{agg.stages[stage]}</b>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
