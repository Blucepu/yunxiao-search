// 筛选面板：使用现有的多选 Combobox 组件，每个维度一个可搜索的多选器，
// 替代原先平铺的选项按钮，便于快速直观地筛选数据。

import { useMemo } from "react";
import type { ExploreData, ExploreItem } from "../../../../yunxiao-insight/src/explore/types.ts";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxValue,
} from "@/components/ui/combobox";
import { DateRangePicker } from "@/components/explore/DateRangePicker.tsx";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FACET_DEFS,
  FLAGS,
  FLAG_LABEL,
  TIME_FIELDS,
  TIME_PRESETS,
  facetCounts,
  labelFor,
  type FilterState,
  type MultiKey,
} from "@/lib/explore/core.ts";

interface Props {
  data: ExploreData;
  items: ExploreItem[];
  filters: FilterState;
  now: number;
  onPatch(patch: Partial<FilterState>): void;
}

export function FilterPanel({ data, items, filters, now, onPatch }: Props) {
  return (
    <aside className="flex w-full flex-col gap-4 p-1">
      <section className="flex flex-col gap-2">
        <Label className="text-xs font-medium text-muted-foreground">时间字段</Label>
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
      </section>

      <section className="flex flex-col gap-2">
        <Label className="text-xs font-medium text-muted-foreground">时间范围</Label>
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
            layout="stacked"
            from={filters.timeFrom}
            to={filters.timeTo}
            now={now}
            onApply={(from, to) => onPatch({ timeFrom: from, timeTo: to })}
          />
        )}
      </section>

      <section className="flex flex-col gap-2">
        <Label className="text-xs font-medium text-muted-foreground">风险开关</Label>
        <Combobox<string, true>
          multiple
          items={FLAGS as unknown as string[]}
          value={FLAGS.filter((flag) => filters[flag])}
          onValueChange={(next) => {
            const set = new Set(next ?? []);
            const patch: Partial<FilterState> = {};
            for (const flag of FLAGS) patch[flag] = set.has(flag);
            onPatch(patch);
          }}
          itemToStringLabel={(value) => FLAG_LABEL[value as (typeof FLAGS)[number]]}
        >
          <ComboboxChips>
            <ComboboxValue>
              {(value: string[]) => (value ?? []).map((flag) => (
                <ComboboxChip key={flag} removeProps={{ onClick: () => onPatch({ [flag]: false } as Partial<FilterState>) }}>
                  {FLAG_LABEL[flag as (typeof FLAGS)[number]]}
                </ComboboxChip>
              ))}
            </ComboboxValue>
            <ComboboxChipsInput placeholder="选择风险开关…" />
          </ComboboxChips>
          <ComboboxPopup>
            <ComboboxInput placeholder="搜索…" />
            <ComboboxList>
              <ComboboxEmpty>无匹配项</ComboboxEmpty>
              <ComboboxCollection>
                {(flag: string) => (
                  <ComboboxItem key={flag} value={flag}>
                    {FLAG_LABEL[flag as (typeof FLAGS)[number]]}
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxList>
          </ComboboxPopup>
        </Combobox>
      </section>

      {FACET_DEFS.map((def) => (
        <FacetCombobox
          key={def.field}
          data={data}
          items={items}
          filters={filters}
          now={now}
          field={def.field}
          label={def.label}
          onPatch={onPatch}
        />
      ))}
    </aside>
  );
}

function FacetCombobox({
  data,
  items,
  filters,
  now,
  field,
  label,
  onPatch,
}: {
  data: ExploreData;
  items: ExploreItem[];
  filters: FilterState;
  now: number;
  field: MultiKey;
  label: string;
  onPatch(patch: Partial<FilterState>): void;
}) {
  const counts = useMemo(() => facetCounts(items, filters, field, now), [items, filters, field, now]);
  const active = filters[field];
  const options = useMemo(() => {
    const list = [...new Set([...counts.keys(), ...active])];
    list.sort((a, b) => {
      if (field === "stage") {
        const order = ["todo", "doing", "verify", "done", "canceled", "unknown"];
        return order.indexOf(a) - order.indexOf(b);
      }
      const diff = (counts.get(b) ?? 0) - (counts.get(a) ?? 0);
      if (diff !== 0) return diff;
      return labelFor(field, a, data).localeCompare(labelFor(field, b, data), "zh-CN", { numeric: true });
    });
    return list.filter((value) => value !== "");
  }, [counts, active, field, data]);

  return (
    <section className="flex flex-col gap-2">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <Combobox<string, true>
        multiple
        items={options}
        value={active}
        onValueChange={(next) => onPatch({ [field]: next ?? [] } as Partial<FilterState>)}
        itemToStringLabel={(value) => labelFor(field, value, data)}
      >
        <ComboboxChips>
          <ComboboxValue>
            {(value: string[]) => (value ?? []).map((v) => (
              <ComboboxChip key={v} removeProps={{ onClick: () => {
                const list = filters[field].filter((item) => item !== v);
                onPatch({ [field]: list } as Partial<FilterState>);
              } }}>
                {labelFor(field, v, data)}
              </ComboboxChip>
            ))}
          </ComboboxValue>
          <ComboboxChipsInput placeholder={`选择${label}…`} />
        </ComboboxChips>
        <ComboboxPopup>
          <ComboboxInput placeholder={`搜索${label}…`} />
          <ComboboxList>
            <ComboboxEmpty>无匹配项</ComboboxEmpty>
            <ComboboxCollection>
              {(value: string) => (
                <ComboboxItem key={value} value={value}>
                  <span className="truncate">{labelFor(field, value, data)}</span>
                  <span className="ml-auto text-xs tabular-nums text-muted-foreground">{counts.get(value) ?? 0}</span>
                </ComboboxItem>
              )}
            </ComboboxCollection>
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
    </section>
  );
}
