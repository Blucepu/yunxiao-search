// 筛选 chips 条：每个筛选维度一个胶囊 chip，点击弹出该维度的选项 popover，
// 参考 web-pm-im 交付项目列表的 FilterChipsBar 设计；快速直观地直接筛选数据。

import { useMemo, useState } from "react";
import { XIcon } from "lucide-react";
import type { ExploreData, ExploreItem } from "../../../../yunxiao-insight/src/explore/types.ts";
import { DateRangePicker } from "@/components/explore/DateRangePicker.tsx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverPopup, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  FACET_DEFS,
  FLAGS,
  FLAG_LABEL,
  TIME_FIELDS,
  TIME_PRESETS,
  facetCounts,
  fmtDate,
  labelFor,
  type FilterState,
  type MultiKey,
} from "@/lib/explore/core.ts";
import { cn } from "@/lib/utils";

interface Props {
  data: ExploreData;
  items: ExploreItem[];
  filters: FilterState;
  now: number;
  onPatch(patch: Partial<FilterState>): void;
  onClearAll(): void;
  activeCount: number;
}

const ALL_FIELD_KEYS = ["time", "flags", ...FACET_DEFS.map((def) => def.field)] as const;

function chipValue(
  field: string,
  filters: FilterState,
  data: ExploreData,
): { text: string | null; extra: string[] } {
  if (field === "time") {
    if (filters.timePreset === "all") return { text: null, extra: [] };
    const tf = TIME_FIELDS.find((item) => item.key === filters.timeField)?.label ?? "";
    if (filters.timePreset === "custom") {
      const rangeText =
        filters.timeFrom !== null && filters.timeTo !== null
          ? `${fmtDate(filters.timeFrom)} ~ ${fmtDate(filters.timeTo)}`
          : "自定义";
      return { text: `${tf}·${rangeText}`, extra: [] };
    }
    const pl = TIME_PRESETS.find((item) => item.key === filters.timePreset)?.label ?? filters.timePreset;
    return { text: `${tf}·${pl}`, extra: [] };
  }
  if (field === "flags") {
    const active = FLAGS.filter((flag) => filters[flag]);
    if (active.length === 0) return { text: null, extra: [] };
    const labels = active.map((flag) => FLAG_LABEL[flag]);
    return { text: labels[0], extra: labels.slice(1) };
  }
  const fk = field as MultiKey;
  const vals = filters[fk];
  if (!vals || vals.length === 0) return { text: null, extra: [] };
  const labels = vals.map((value) => labelFor(fk, value, data));
  return { text: labels[0], extra: labels.slice(1) };
}

function fieldLabel(field: string): string {
  if (field === "time") return "时间";
  if (field === "flags") return "风险开关";
  return FACET_DEFS.find((def) => def.field === field)?.label ?? field;
}

export function FilterChips({ data, items, filters, now, onPatch, onClearAll, activeCount }: Props) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  // 时间/风险恒显；维度字段有已选值或当前有可选值时才展示 chip
  const orderedKeys = useMemo(() => {
    return ALL_FIELD_KEYS.filter((key) => {
      if (key === "time" || key === "flags") return true;
      const field = key as MultiKey;
      if (filters[field].length > 0) return true;
      return facetCounts(items, filters, field, now).size > 0;
    });
  }, [filters, items, now]);

  const toggleFacet = (field: MultiKey, value: string) => {
    const list = [...filters[field]];
    const index = list.indexOf(value);
    if (index === -1) list.push(value);
    else list.splice(index, 1);
    onPatch({ [field]: list } as Partial<FilterState>);
  };

  const clearFacet = (field: MultiKey) => onPatch({ [field]: [] } as Partial<FilterState>);

  const renderPopover = (key: string, close: () => void) => {
    if (key === "time") {
      return (
        <div className="flex flex-col gap-2 p-3">
          <div className="text-xs font-medium text-muted-foreground">时间字段</div>
          <Select
            items={TIME_FIELDS.map((field) => ({ value: field.key, label: field.label }))}
            value={filters.timeField}
            onValueChange={(value) => onPatch({ timeField: value as string })}
          >
            <SelectTrigger size="sm" aria-label="时间字段">
              <SelectValue />
            </SelectTrigger>
            <SelectPopup>
              {TIME_FIELDS.map((field) => (
                <SelectItem key={field.key} value={field.key}>
                  {field.label}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
          <div className="text-xs font-medium text-muted-foreground">时间范围</div>
          <Select
            items={TIME_PRESETS.map((preset) => ({ value: preset.key, label: preset.label }))}
            value={filters.timePreset}
            onValueChange={(value) => {
              const preset = value as string;
              onPatch({
                timePreset: preset,
                timeFrom: preset === "custom" ? filters.timeFrom ?? now - 29 * 86400000 : null,
                timeTo: preset === "custom" ? now : null,
              });
            }}
          >
            <SelectTrigger size="sm" aria-label="时间范围">
              <SelectValue />
            </SelectTrigger>
            <SelectPopup>
              {TIME_PRESETS.map((preset) => (
                <SelectItem key={preset.key} value={preset.key}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
          {filters.timePreset === "custom" && (
            <DateRangePicker
              from={filters.timeFrom}
              to={filters.timeTo}
              now={now}
              onApply={(from, to) => {
                onPatch({ timeFrom: from, timeTo: to });
                close();
              }}
              onCancel={close}
            />
          )}
          {filters.timePreset !== "all" && (
            <Button
              size="sm"
              variant="ghost"
              className="w-full"
              onClick={() => {
                onPatch({ timePreset: "all", timeFrom: null, timeTo: null });
                close();
              }}
            >
              清除筛选
            </Button>
          )}
        </div>
      );
    }

    if (key === "flags") {
      return (
        <div className="flex flex-col">
          <div className="p-2">
            <Input
              size="sm"
              placeholder="搜索风险开关…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            <div className="p-1">
              {FLAGS.filter((flag) =>
                FLAG_LABEL[flag].toLowerCase().includes(query.trim().toLowerCase()),
              ).map((flag) => (
                <div
                  key={flag}
                  role="option"
                  onClick={() => onPatch({ [flag]: !filters[flag] } as Partial<FilterState>)}
                  className="flex min-h-7 cursor-pointer items-center gap-2 rounded-sm px-2 py-1 text-sm hover:bg-accent"
                >
                  <Checkbox checked={filters[flag]} className="pointer-events-none" />
                  <span className="truncate">{FLAG_LABEL[flag]}</span>
                </div>
              ))}
            </div>
          </div>
          {FLAGS.some((flag) => filters[flag]) && (
            <div className="shrink-0 border-t p-2">
              <Button
                size="sm"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  const patch: Partial<FilterState> = {};
                  for (const flag of FLAGS) patch[flag] = false;
                  onPatch(patch);
                }}
              >
                清除筛选
              </Button>
            </div>
          )}
        </div>
      );
    }

    const field = key as MultiKey;
    const def = FACET_DEFS.find((item) => item.field === field);
    if (!def) return null;
    const counts = facetCounts(items, filters, field, now);
    const active = filters[field];
    const list = [...new Set([...counts.keys(), ...active])];
    list.sort((a, b) => {
      if (field === "stage") {
        return (STAGE_ORDER_INDEX[a] ?? 99) - (STAGE_ORDER_INDEX[b] ?? 99);
      }
      const diff = (counts.get(b) ?? 0) - (counts.get(a) ?? 0);
      if (diff !== 0) return diff;
      return labelFor(field, a, data).localeCompare(labelFor(field, b, data), "zh-CN", { numeric: true });
    });
    const values = list;
    const filtered = query.trim()
      ? values.filter((value) => labelFor(field, value, data).toLowerCase().includes(query.trim().toLowerCase()))
      : values;

    return (
      <div className="flex flex-col">
        <div className="p-1.5">
          <Input size="sm" placeholder={`搜索${def.label}…`} value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <div className="max-h-64 overflow-y-auto">
          <div className="p-1">
            {filtered.map((value) => {
              const count = counts.get(value) ?? 0;
              const on = active.includes(value);
              return (
                <div
                  key={value}
                  role="option"
                  onClick={() => toggleFacet(field, value)}
                  className="flex min-h-7 cursor-pointer items-center gap-2 rounded-sm px-2 py-1 text-sm hover:bg-accent"
                >
                  <Checkbox checked={on} className="pointer-events-none" />
                  <span className="min-w-0 truncate">{labelFor(field, value, data)}</span>
                  <span className="ml-auto text-xs tabular-nums text-muted-foreground">{count}</span>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="px-2 py-6 text-center text-sm text-muted-foreground">无匹配项</div>
            )}
          </div>
        </div>
        {active.length > 0 && (
          <div className="shrink-0 border-t p-2">
            <Button size="sm" variant="ghost" className="w-full" onClick={() => clearFacet(field)}>
              清除筛选
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-w-0 shrink-0 flex-wrap items-start gap-1.5">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
        {orderedKeys.map((key) => {
        const { text, extra } = chipValue(key, filters, data);
        const open = openKey === key;
        const label = fieldLabel(key);
        const onClear =
          key === "time"
            ? filters.timePreset !== "all"
              ? () => onPatch({ timePreset: "all", timeFrom: null, timeTo: null })
              : undefined
            : key === "flags"
              ? FLAGS.some((flag) => filters[flag])
                ? () => {
                    const patch: Partial<FilterState> = {};
                    for (const flag of FLAGS) patch[flag] = false;
                    onPatch(patch);
                  }
                : undefined
              : (filters[key as MultiKey]?.length ?? 0) > 0
                ? () => clearFacet(key as MultiKey)
                : undefined;

        return (
          <Popover
            key={key}
            open={open}
            onOpenChange={(next) => {
              if (next) setQuery("");
              setOpenKey(next ? key : null);
            }}
          >
            <PopoverTrigger
              render={
                <button
                  type="button"
                  className="inline-flex h-7 max-w-64 items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 text-xs font-medium text-slate-700 shadow-xs transition-colors hover:bg-slate-100 dark:border-border dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-accent"
                />
              }
            >
              <span className="shrink-0 text-muted-foreground">{label}：</span>
              <span
                className={cn("min-w-0 truncate", text ? "font-medium" : "text-muted-foreground")}
                title={text ?? "不限"}
              >
                {text ?? "不限"}
              </span>
              {extra.length > 0 && (
                <Badge variant="secondary" size="sm" className="rounded-sm px-1 font-normal">
                  +{extra.length}
                </Badge>
              )}
              {onClear ? (
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`清除${label}`}
                  className="ml-0.5 inline-flex size-3.5 items-center justify-center rounded-full hover:text-foreground"
                  onClick={(event) => {
                    event.stopPropagation();
                    onClear();
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.stopPropagation();
                      event.preventDefault();
                      onClear();
                    }
                  }}
                >
                  <XIcon className="size-3" />
                </span>
              ) : (
                <span className="ml-0.5 size-3.5 shrink-0" aria-hidden="true" />
              )}
            </PopoverTrigger>
            <PopoverPopup
              className={cn(
                "p-0 [&>[data-slot=popover-viewport]]:p-0",
                key === "time" ? "w-[26rem]" : "w-64",
              )}
              align="start"
              sideOffset={6}
            >
              {renderPopover(key, () => setOpenKey(null))}
            </PopoverPopup>
          </Popover>
        );
        })}
      </div>

      {activeCount > 0 && (
        <div className="flex h-7 shrink-0 items-center gap-2">
          <Separator orientation="vertical" className="h-4" />
          <Button size="xs" variant="ghost" className="h-7 px-2 text-xs text-muted-foreground" onClick={onClearAll}>
            清除全部（{activeCount}）
          </Button>
        </div>
      )}
    </div>
  );
}

// STAGE_ORDER_INDEX 用于阶段排序
const STAGE_ORDER_INDEX: Record<string, number> = {
  todo: 0,
  doing: 1,
  verify: 2,
  done: 3,
  canceled: 4,
  unknown: 5,
};
