// 自定义时间范围面板：与 web-pm-im 项目列表/爬虫任务列表的时间范围交互一致——
// 左侧预设（今天/昨天/近 7 天/近 30 天/本月至今/上个月/今年至今/去年），
// 右侧 range 日历两步选择：第一次点击=开始日期（悬停实时预览范围），第二次点击=结束日期；
// 已有范围时再点击任意日期=重新开始选择。草稿态点选，「确定」后才应用，「取消」还原。
// 内嵌渲染（非弹层套弹层），避免嵌套 Popover 的点击关闭问题。

import { useCallback, useMemo, useState } from "react";
import { zhCN } from "react-day-picker/locale";
import { DayButton, type DateRange } from "react-day-picker";
import type * as React from "react";
import { CalendarDaysIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { DAY_MS, fmtDate, startOfDay, startOfMonth } from "@/lib/explore/core.ts";
import { cn } from "@/lib/utils";

interface Props {
  from: number | null;
  to: number | null;
  /** 当前时间（预设/默认月份依赖） */
  now: number;
  /** 点「确定」后应用 */
  onApply(from: number | null, to: number | null): void;
  /** 点「取消」还原草稿并回调（FilterChips 中用于收起弹窗） */
  onCancel?(): void;
  /** side：预设列在左（宽弹窗）；stacked：预设横排在日历上方（窄抽屉） */
  layout?: "side" | "stacked";
}

type Range = [number | null, number | null];

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

export function DateRangePicker({ from, to, now, onApply, onCancel, layout = "side" }: Props) {
  const [draft, setDraft] = useState<Range>([from, to]);
  const [draftFrom, draftTo] = draft;

  // 外部值变化（应用/清除）时同步草稿；草稿期间外部值不变，不会被打断（render 期间调整状态）
  const [prevApplied, setPrevApplied] = useState<Range>([from, to]);
  if (prevApplied[0] !== from || prevApplied[1] !== to) {
    setPrevApplied([from, to]);
    setDraft([from, to]);
  }

  const today = useMemo(() => startOfDay(now), [now]);
  const [month, setMonth] = useState<Date>(new Date(draftFrom ?? today));

  // 两步选择状态：第一次点击开始日期后进入 selecting，悬停实时预览范围
  const [selecting, setSelecting] = useState(false);
  const [hoverDate, setHoverDate] = useState<Date | undefined>(undefined);
  const [pendingFrom, setPendingFrom] = useState<Date | undefined>(undefined);

  const presets = useMemo(() => {
    const monthStart = startOfMonth(today);
    const lastMonthStart = startOfMonth(monthStart - DAY_MS);
    const yearStart = startOfDay(new Date(new Date(today).getFullYear(), 0, 1).getTime());
    const lastYearStart = startOfDay(new Date(new Date(today).getFullYear() - 1, 0, 1).getTime());
    return [
      { label: "今天", range: [today, today] as Range },
      { label: "昨天", range: [today - DAY_MS, today - DAY_MS] as Range },
      { label: "近 7 天", range: [today - 6 * DAY_MS, today] as Range },
      { label: "近 30 天", range: [today - 29 * DAY_MS, today] as Range },
      { label: "本月至今", range: [monthStart, today] as Range },
      { label: "上个月", range: [lastMonthStart, monthStart - 1] as Range },
      { label: "今年至今", range: [yearStart, today] as Range },
      { label: "去年", range: [lastYearStart, yearStart - 1] as Range },
    ];
  }, [today]);

  // 两步选择：参考 web-pm-im DateRangeCalendarPanel 的点击交互
  const handleSelect = useCallback(
    (range: DateRange | undefined) => {
      if (!range?.from) {
        setSelecting(false);
        setPendingFrom(undefined);
        setHoverDate(undefined);
        setDraft([null, null]);
        return;
      }

      if (!selecting) {
        // 第一步（新选择或已有范围时重新开始）：提取实际点击的日期
        const clickedDate =
          draftTo !== null && range.to && startOfDay(range.to.getTime()) !== draftTo
            ? range.to
            : draftFrom !== null && startOfDay(range.from.getTime()) !== draftFrom
              ? range.from
              : range.from;
        setPendingFrom(clickedDate);
        setSelecting(true);
        setHoverDate(undefined);
        return;
      }

      // 第二步：选中结束日期
      if (!pendingFrom) {
        setSelecting(false);
        setPendingFrom(undefined);
        setHoverDate(undefined);
        return;
      }
      const clickedDate =
        range.to && range.to.getTime() !== pendingFrom.getTime()
          ? range.to
          : range.from.getTime() !== pendingFrom.getTime()
            ? range.from
            : range.from;
      const [fromDate, toDate] =
        pendingFrom.getTime() <= clickedDate.getTime() ? [pendingFrom, clickedDate] : [clickedDate, pendingFrom];

      setSelecting(false);
      setPendingFrom(undefined);
      setHoverDate(undefined);
      setDraft([startOfDay(fromDate.getTime()), startOfDay(toDate.getTime())]);
    },
    [selecting, draftFrom, draftTo, pendingFrom],
  );

  // 选择中 + 悬停：预览从开始日期到悬停日期的范围
  const calendarDisplaySelected: DateRange | undefined =
    selecting && pendingFrom
      ? { from: pendingFrom, to: hoverDate ?? pendingFrom }
      : {
          from: draftFrom !== null ? new Date(draftFrom) : undefined,
          to: draftTo !== null ? new Date(draftTo) : undefined,
        };

  // 自定义 DayButton：注入 hover 事件实现范围预览
  // 依赖 selecting：仅在「开始选择/完成选择」时重建，日历其余渲染保持稳定
  const HoverableDayButton = useMemo(() => {
    if (!selecting) return undefined;
    const Component = (props: React.ComponentProps<typeof DayButton>) => (
      <DayButton
        {...props}
        onMouseEnter={() => setHoverDate(props.day.date)}
        onMouseLeave={() => setHoverDate(undefined)}
      />
    );
    return Component;
  }, [selecting]);

  const displayText =
    draftFrom !== null && draftTo !== null
      ? `${fmtDate(draftFrom)} - ${fmtDate(draftTo)}`
      : draftFrom !== null
        ? `${fmtDate(draftFrom)} - 请选择结束日期`
        : "选择时间范围";

  const applyRange = (range: Range) => {
    const [nextFrom, nextTo] = range;
    onApply(
      nextFrom !== null ? startOfDay(nextFrom) : null,
      nextTo !== null ? startOfDay(nextTo) + DAY_MS - 1 : null,
    );
  };

  return (
    <div className="flex flex-col">
      <div className="flex h-7 items-center gap-1.5 px-3 pt-3 text-xs text-muted-foreground">
        <CalendarDaysIcon className="size-3.5 shrink-0" />
        <span className={cn("truncate", draftFrom === null && "text-muted-foreground/70")}>{displayText}</span>
      </div>

      <div className={cn("flex", layout === "stacked" && "flex-col")}>
        <div
          className={cn(
            "flex gap-0.5 px-2 py-3",
            layout === "side" ? "w-28 shrink-0 flex-col border-r" : "flex-row flex-wrap border-b",
          )}
        >
          {presets.map((preset) => {
            const active = preset.range[0] === draftFrom && preset.range[1] === draftTo;
            return (
              <Button
                key={preset.label}
                size="sm"
                variant={active ? "secondary" : "ghost"}
                className={cn("justify-start font-normal", layout === "side" ? "w-full" : "w-auto")}
                onClick={() => {
                  setSelecting(false);
                  setPendingFrom(undefined);
                  setHoverDate(undefined);
                  setDraft(preset.range);
                  setMonth(new Date(preset.range[1] ?? today));
                }}
              >
                {preset.label}
              </Button>
            );
          })}
        </div>

        <div className="flex justify-center p-3">
          <Calendar
            mode="range"
            locale={zhCN}
            month={month}
            onMonthChange={setMonth}
            selected={calendarDisplaySelected}
            onSelect={handleSelect}
            components={HoverableDayButton ? { DayButton: HoverableDayButton } : undefined}
            formatters={{
              formatCaption: (date) => `${date.getFullYear()}年${date.getMonth() + 1}月`,
              formatWeekdayName: (date) => WEEKDAYS[date.getDay()] ?? "",
            }}
          />
        </div>
      </div>

      <Separator />
      <div className="flex justify-end gap-2 p-3">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSelecting(false);
            setPendingFrom(undefined);
            setHoverDate(undefined);
            setDraft([from, to]);
            onCancel?.();
          }}
        >
          取消
        </Button>
        <Button size="sm" onClick={() => applyRange(draft)}>
          确定
        </Button>
      </div>
    </div>
  );
}
