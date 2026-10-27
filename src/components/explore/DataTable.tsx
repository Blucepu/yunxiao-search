// 数据表格：关键列 + 可配置扩展列、表头排序、虚拟滚动、CSV 导出。

import { useEffect, useState } from "react";
import { ArrowDownUpIcon, ArrowDownWideNarrowIcon, ArrowUpNarrowWideIcon, DownloadIcon, RefreshCwIcon } from "lucide-react";
import type { ExploreItem } from "../../../../yunxiao-insight/src/explore/types.ts";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import {
  defaultDir,
  exportRows,
  fmtDateTime,
  fmtMonthDay,
  fmtRelative,
  initial,
  PRIORITY_TAG_CLASS,
  STAGE_TAG_CLASS,
  TAG_CLASS,
  priorityClass,
  statusTagClass,
  type SortDir,
} from "@/lib/explore/core.ts";
import { cn } from "@/lib/utils";

const ROW_HEIGHT = 46;
const COL_GAP = 10; // gap-2.5
const MIN_FLEX_WIDTH = 220; // 标题列最小宽度

interface Column {
  key: string;
  label: string;
  width: number;
  sortKey?: string;
}

const COLUMNS: Column[] = [
  { key: "serial", label: "编号", width: 118, sortKey: "serial" },
  { key: "title", label: "标题", width: 0 },
  { key: "stage", label: "阶段", width: 86, sortKey: "stage" },
  { key: "status", label: "状态", width: 92 },
  { key: "priority", label: "优先级", width: 72, sortKey: "priority" },
  { key: "assignee", label: "负责人", width: 104, sortKey: "assignee" },
  { key: "creator", label: "创建人", width: 104 },
  { key: "project", label: "项目", width: 128, sortKey: "project" },
  { key: "sprint", label: "迭代", width: 116 },
  { key: "when", label: "更新 / 截止", width: 116, sortKey: "updated" },
];

function Tag({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span title={typeof children === "string" ? children : undefined} className={cn(TAG_CLASS, className ?? "bg-slate-100 text-slate-600 dark:bg-slate-400/10 dark:text-slate-400")}>
      <span className="truncate">{children}</span>
    </span>
  );
}

interface Props {
  rows: ExploreItem[];
  now: number;
  selectedId: string | null;
  sort: string | null;
  dir: SortDir;
  onSort(sort: string | null, dir: SortDir): void;
  onSelect(id: string): void;
  onToast(message: string): void;
  onRefresh?(): void;
  refreshing?: boolean;
  /** 云效数据的真实拉取时间（用于展示“数据更新于 x 前”） */
  fetchedAt?: number;
}

function WhenCell({ item, now }: { item: ExploreItem; now: number }) {
  if (item.overdue) return <span className="text-destructive">逾期 {item.overdueDays} 天</span>;
  if (item.stage === "done") {
    return <span>{item.completedAt !== null ? `完成 ${fmtMonthDay(item.completedAt)}` : "已完成"}</span>;
  }
  if (item.stage === "canceled") return <span className="text-muted-foreground">已取消</span>;
  if (item.dueSoon) return <span className="text-warning">{fmtMonthDay(item.planEndAt)} 到期</span>;
  if (item.planEndAt !== null) return <span>{fmtMonthDay(item.planEndAt)} 截止</span>;
  return <span className="text-muted-foreground">{fmtRelative(item.updatedAt, now)}</span>;
}

export function DataTable({ rows, now, selectedId, sort, dir, onSort, onSelect, onToast, onRefresh, refreshing, fetchedAt }: Props) {
  const [scrollTop, setScrollTop] = useState(0);
  const [viewHeight, setViewHeight] = useState(560);
  // 新鲜度文案定时重算（30s）
  const [nowTs, setNowTs] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNowTs(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);
  const visibleColumns = COLUMNS;
  // 弹性列（标题）设置最小宽度，列总宽不足时表格横向滚动
  const template = visibleColumns
    .map((column) => (column.width > 0 ? `${column.width}px` : `minmax(${MIN_FLEX_WIDTH}px,1fr)`))
    .join(" ");
  const totalMinWidth =
    visibleColumns.reduce((sum, column) => sum + (column.width > 0 ? column.width : MIN_FLEX_WIDTH), 0) +
    (visibleColumns.length - 1) * COL_GAP +
    32;

  const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - 6);
  const end = Math.min(rows.length, start + Math.ceil(viewHeight / ROW_HEIGHT) + 12);
  const visible = rows.slice(start, end);

  const exportCsv = () => {
    const csv = exportRows(rows);
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `yunxiao-explore-${new Date(now).toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
    onToast(`已导出 ${rows.length} 条`);
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-none dark:border-border dark:bg-card">
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-2.5 dark:border-border dark:bg-card">
        <span className="text-sm text-muted-foreground">
          共 <b className="tabular-nums text-foreground">{rows.length}</b> 条
        </span>
        {fetchedAt !== undefined && (
          <span className="text-xs text-muted-foreground" title={fmtDateTime(fetchedAt)}>
            数据更新于 {fmtRelative(fetchedAt, nowTs)}
          </span>
        )}
        <div className="flex-1" />
        {onRefresh && (
          <Button
            size="icon-sm"
            variant="outline"
            aria-label="刷新数据"
            title="刷新数据"
            disabled={refreshing}
            onClick={onRefresh}
          >
            <RefreshCwIcon className={refreshing ? "animate-spin" : undefined} />
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={exportCsv}>
          <DownloadIcon />
          导出 CSV
        </Button>
      </div>

      <div
        ref={(node) => {
          if (node) setViewHeight(node.clientHeight || 560);
        }}
        onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
        className="min-h-[360px] flex-1 overflow-auto"
        role="grid"
        aria-label="工作项列表"
      >
        <div style={{ minWidth: totalMinWidth }}>
          <div
            className="sticky top-0 z-10 grid items-center gap-2.5 border-b border-slate-200 bg-slate-50 px-4 text-xs font-medium text-slate-600 dark:border-border dark:bg-muted/50 dark:text-muted-foreground"
            style={{ gridTemplateColumns: template, height: 38 }}
            role="row"
          >
        {visibleColumns.map((column) => {
          const active = sort !== null && column.sortKey === sort;
          return (
            <div
              key={column.key}
              role="columnheader"
              className={cn(
                "select-none",
                column.sortKey && "cursor-pointer hover:text-foreground",
                active && "text-foreground",
              )}
              onClick={() => {
                if (!column.sortKey) return;
                // 三态循环：升序 -> 降序 -> 取消排序
                if (!active) onSort(column.sortKey, defaultDir(column.sortKey));
                else if (dir === "asc") onSort(column.sortKey, "desc");
                else onSort(null, "desc");
              }}
            >
              <span className="inline-flex min-w-0 items-center gap-1">
                <span className="truncate">{column.label}</span>
                {column.sortKey ? (
                  active && dir === "asc" ? (
                    <ArrowUpNarrowWideIcon className="size-3.5 shrink-0 text-blue-600" aria-hidden="true" />
                  ) : active ? (
                    <ArrowDownWideNarrowIcon className="size-3.5 shrink-0 text-blue-600" aria-hidden="true" />
                  ) : (
                    <ArrowDownUpIcon className="size-3.5 shrink-0 opacity-40" aria-hidden="true" />
                  )
                ) : null}
              </span>
            </div>
          );
        })}
          </div>

          {rows.length === 0 ? (
          <Empty>
            <EmptyTitle>没有匹配的工作项</EmptyTitle>
            <EmptyDescription>试试放宽筛选，或清空搜索关键词。</EmptyDescription>
          </Empty>
        ) : (
          <div style={{ position: "relative", height: rows.length * ROW_HEIGHT }}>
            {visible.map((item, offset) => {
              const index = start + offset;
              const selected = item.id === selectedId;
              const pClass = priorityClass(item.priority);
              return (
                <div
                  key={item.id}
                  role="row"
                  aria-selected={selected}
                  onClick={() => onSelect(item.id)}
                  className={cn(
                    "absolute inset-x-0 grid cursor-pointer items-center gap-2.5 border-b border-slate-100 px-4 text-sm transition-colors hover:bg-slate-50/60 dark:border-border/60 dark:hover:bg-muted/50",
                    selected && "bg-blue-50 dark:bg-primary/10",
                  )}
                  style={{ gridTemplateColumns: template, top: index * ROW_HEIGHT, height: ROW_HEIGHT }}
                >
                  {visibleColumns.map((column) => {
                    switch (column.key) {
                      case "serial":
                        return (
                          <div key={column.key} className="flex min-w-0 items-center gap-1.5 tabular-nums text-muted-foreground">
                            <span
                              className={cn(
                                "size-2 shrink-0 rounded-full bg-border",
                                pClass === "high" && "bg-destructive",
                                pClass === "mid" && "bg-warning",
                                pClass === "low" && "bg-success",
                              )}
                              title={`优先级：${item.priority}`}
                            />
                            <span className="truncate">{item.serial}</span>
                          </div>
                        );
                      case "title":
                        return (
                          <div key={column.key} className="flex min-w-0 items-center gap-1.5" title={item.subject}>
                            {item.riskReasons.length > 0 && (
                              <span
                                className="flex size-4 shrink-0 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white"
                                title={item.riskReasons.join("；")}
                              >
                                !
                              </span>
                            )}
                            <span className="truncate">{item.subject}</span>
                            {item.parentSerial && (
                              <span className="shrink-0 text-xs text-muted-foreground">↳ {item.parentSerial}</span>
                            )}
                          </div>
                        );
                      case "stage":
                        return (
                          <div key={column.key} className="min-w-0">
                            <Tag className={STAGE_TAG_CLASS[item.stage] ?? STAGE_TAG_CLASS.unknown}>{item.stageLabel}</Tag>
                          </div>
                        );
                      case "status":
                        return (
                          <div key={column.key} className="min-w-0">
                            {item.status && item.status !== "-" ? (
                              <Tag className={statusTagClass(item.status)}>{item.status}</Tag>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </div>
                        );
                      case "priority":
                        return (
                          <div key={column.key} className="min-w-0">
                            {item.priority && item.priority !== "-" ? (
                              <Tag className={pClass ? PRIORITY_TAG_CLASS[pClass] : "bg-slate-100 text-slate-600"}>
                                {item.priority}
                              </Tag>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </div>
                        );
                      case "assignee":
                        return (
                          <div key={column.key} className="flex min-w-0 items-center gap-1.5">
                            <Avatar className="size-5 text-[10px]">{initial(item.assignee)}</Avatar>
                            <span className={cn("truncate", !item.assignee && "text-muted-foreground")}>
                              {item.assignee || "未分配"}
                            </span>
                          </div>
                        );
                      case "creator":
                        return (
                          <div key={column.key} className="flex min-w-0 items-center gap-1.5">
                            <Avatar className="size-5 text-[10px]">{initial(item.creator)}</Avatar>
                            <span className={cn("truncate", !item.creator && "text-muted-foreground")}>
                              {item.creator || "-"}
                            </span>
                          </div>
                        );
                      case "project":
                        return (
                          <div key={column.key} className="truncate" title={item.projectName}>
                            {item.projectName}
                          </div>
                        );
                      case "sprint":
                        return (
                          <div key={column.key} className="truncate text-muted-foreground" title={item.sprintName}>
                            {item.sprintName || "-"}
                          </div>
                        );
                      case "when":
                      default:
                        return (
                          <div key={column.key} className="truncate">
                            <WhenCell item={item} now={now} />
                          </div>
                        );
                    }
                  })}
                </div>
              );
            })}
          </div>
          )}
        </div>
      </div>
    </section>
  );
}
