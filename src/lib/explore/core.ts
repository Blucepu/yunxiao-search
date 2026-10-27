// 全局搜索 Web 应用的纯逻辑层：筛选 / 排序 / 聚合 / 路由 / 周报汇总。
// 不依赖 React 与 DOM，Vitest 直接单测。

import type { ExploreData, ExploreItem } from "../../../../yunxiao-insight/src/explore/types.ts";

export const DAY_MS = 24 * 60 * 60 * 1000;
export const NONE = "__none__";

export const STAGE_ORDER = ["todo", "doing", "verify", "done", "canceled", "unknown"] as const;
export type StageKey = (typeof STAGE_ORDER)[number];

export const STAGE_LABEL: Record<string, string> = {
  todo: "未开始",
  doing: "进行中",
  verify: "待验收",
  done: "已完成",
  canceled: "已取消",
  unknown: "未知",
};

export const CATEGORY_LABEL: Record<string, string> = {
  Req: "需求",
  Bug: "缺陷",
  Task: "任务",
  Risk: "风险",
};

export interface TimeFieldDef {
  key: string;
  field: "createdAt" | "updatedAt" | "completedAt" | "planEndAt";
  label: string;
}

export const TIME_FIELDS: TimeFieldDef[] = [
  { key: "created", field: "createdAt", label: "创建时间" },
  { key: "updated", field: "updatedAt", label: "更新时间" },
  { key: "completed", field: "completedAt", label: "完成时间" },
  { key: "planEnd", field: "planEndAt", label: "计划完成" },
];

export const TIME_PRESETS = [
  { key: "all", label: "不限" },
  { key: "7d", label: "近 7 天" },
  { key: "30d", label: "近 30 天" },
  { key: "thisWeek", label: "本周" },
  { key: "lastWeek", label: "上周" },
  { key: "thisMonth", label: "本月" },
  { key: "custom", label: "自定义" },
] as const;

export const SORT_OPTIONS = [
  { key: "updated", label: "最近更新" },
  { key: "created", label: "最近创建" },
  { key: "completed", label: "最近完成" },
  { key: "planEnd", label: "计划完成" },
  { key: "risk", label: "风险优先" },
  { key: "serial", label: "编号" },
  { key: "project", label: "项目" },
  { key: "assignee", label: "负责人" },
  { key: "stage", label: "阶段" },
  { key: "priority", label: "优先级" },
] as const;

export const MULTI_KEYS = [
  "project",
  "stage",
  "category",
  "type",
  "status",
  "priority",
  "severity",
  "assignee",
  "creator",
  "sprint",
  "label",
] as const;
export type MultiKey = (typeof MULTI_KEYS)[number];

export const FLAGS = ["open", "overdue", "stale", "unassigned", "dueSoon", "risk"] as const;
export type FlagKey = (typeof FLAGS)[number];

export const FLAG_LABEL: Record<FlagKey, string> = {
  open: "未完成",
  overdue: "逾期",
  stale: "停滞",
  unassigned: "未分配",
  dueSoon: "3 天内到期",
  risk: "风险项",
};

export type SortDir = "asc" | "desc";

export interface FilterState {
  q: string;
  project: string[];
  stage: string[];
  category: string[];
  type: string[];
  status: string[];
  priority: string[];
  severity: string[];
  assignee: string[];
  creator: string[];
  sprint: string[];
  label: string[];
  open: boolean;
  overdue: boolean;
  stale: boolean;
  unassigned: boolean;
  dueSoon: boolean;
  risk: boolean;
  timeField: string;
  timePreset: string;
  timeFrom: number | null;
  timeTo: number | null;
  /** null 表示取消排序，保持筛选结果的原始顺序 */
  sort: string | null;
  dir: SortDir;
}

/* ----------------------------- 时间与状态 ----------------------------- */

export function startOfDay(now: number): number {
  const date = new Date(now);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

export function startOfWeek(now: number): number {
  const date = new Date(now);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return date.getTime();
}

export function startOfMonth(now: number): number {
  const date = new Date(now);
  date.setHours(0, 0, 0, 0);
  date.setDate(1);
  return date.getTime();
}

export function defaultDir(sort: string | null): SortDir {
  if (!sort) return "desc";
  return ["planEnd", "serial", "project", "assignee", "stage"].includes(sort) ? "asc" : "desc";
}

export function emptyState(): FilterState {
  return {
    q: "",
    project: [],
    stage: [],
    category: [],
    type: [],
    status: [],
    priority: [],
    severity: [],
    assignee: [],
    creator: [],
    sprint: [],
    label: [],
    open: false,
    overdue: false,
    stale: false,
    unassigned: false,
    dueSoon: false,
    risk: false,
    timeField: "updated",
    timePreset: "all",
    timeFrom: null,
    timeTo: null,
    sort: "updated",
    dir: "desc",
  };
}

export interface TimeRange {
  field: TimeFieldDef["field"];
  from: number | null;
  to: number | null;
  label: string;
}

export function resolveTimeRange(state: FilterState, now: number): TimeRange {
  const entry = TIME_FIELDS.find((item) => item.key === state.timeField) ?? TIME_FIELDS[1]!;
  const preset = state.timePreset || "all";
  if (preset === "all") return { field: entry.field, from: null, to: null, label: "不限" };

  let from: number | null = null;
  let to: number | null = now;
  if (preset === "7d") from = startOfDay(now - 6 * DAY_MS);
  else if (preset === "30d") from = startOfDay(now - 29 * DAY_MS);
  else if (preset === "thisWeek") from = startOfWeek(now);
  else if (preset === "lastWeek") {
    const week = startOfWeek(now);
    from = week - 7 * DAY_MS;
    to = week - 1;
  } else if (preset === "thisMonth") from = startOfMonth(now);
  else if (preset === "custom") {
    from = state.timeFrom;
    to = state.timeTo;
  }
  return {
    field: entry.field,
    from,
    to,
    label: TIME_PRESETS.find((item) => item.key === preset)?.label ?? "不限",
  };
}

/* ------------------------------- 过滤 ------------------------------- */

function has(list: string[]): boolean {
  return Array.isArray(list) && list.length > 0;
}

export function filterItems(items: ExploreItem[], state: FilterState, now: number): ExploreItem[] {
  const tokens = state.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const range = resolveTimeRange(state, now);

  return items.filter((item) => {
    if (has(state.project) && !state.project.includes(item.projectId)) return false;
    if (has(state.stage) && !state.stage.includes(item.stage)) return false;
    if (has(state.category) && !state.category.includes(item.category)) return false;
    if (has(state.type) && !state.type.includes(item.type || "")) return false;
    if (has(state.status) && !state.status.includes(item.status || "")) return false;
    if (has(state.priority) && !state.priority.includes(item.priority || "")) return false;
    if (has(state.severity) && !state.severity.includes(item.severity || "")) return false;
    if (has(state.assignee) && !state.assignee.includes(item.assignee || NONE)) return false;
    if (has(state.creator) && !state.creator.includes(item.creator || NONE)) return false;
    if (has(state.sprint) && !state.sprint.includes(item.sprintId || NONE)) return false;
    if (has(state.label) && !state.label.some((label) => item.labels.includes(label))) return false;
    if (state.open && !item.open) return false;
    if (state.overdue && !item.overdue) return false;
    if (state.stale && !item.stale) return false;
    if (state.unassigned && !item.unassigned) return false;
    if (state.dueSoon && !item.dueSoon) return false;
    if (state.risk && !(item.overdue || item.stale || item.unassigned || item.dueSoon)) return false;
    if (range.from !== null || range.to !== null) {
      const value = item[range.field];
      if (value === null || value === undefined) return false;
      if (range.from !== null && value < range.from) return false;
      if (range.to !== null && value > range.to) return false;
    }
    if (tokens.length) {
      const hay = [
        item.serial,
        item.subject,
        item.projectName,
        item.assignee,
        item.creator,
        item.status,
        item.type,
        item.categoryLabel,
        item.sprintName,
        item.parentSerial,
        item.labels.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      if (!tokens.every((token) => hay.includes(token))) return false;
    }
    return true;
  });
}

export function priorityRank(priority: string): number {
  if (/紧急|最高|P0|blocker/i.test(priority)) return 4;
  if (/高|P1/i.test(priority)) return 3;
  if (/中|P2/i.test(priority)) return 2;
  if (/低|P3/i.test(priority)) return 1;
  return 0;
}

export function severityRank(severity: string): number {
  if (/致命|严重|blocker|critical/i.test(severity)) return 4;
  if (/高|major/i.test(severity)) return 3;
  if (/中|normal/i.test(severity)) return 2;
  if (/低|minor|轻微/i.test(severity)) return 1;
  return 0;
}

export function riskScore(item: ExploreItem): number {
  const overdue = (item.overdueDays || 0) * 100;
  const stale = item.stale ? Math.min(item.idleDays ?? 0, 120) * 2 : 0;
  const unassigned = item.unassigned ? 25 : 0;
  const dueSoon = item.dueSoon ? 10 : 0;
  return overdue + stale + unassigned + dueSoon + priorityRank(item.priority) * 3 + severityRank(item.severity);
}

export function sortItems(items: ExploreItem[], sort: string | null, dir: SortDir = defaultDir(sort)): ExploreItem[] {
  const list = [...items];
  if (sort === null) return list;
  const sign = dir === "asc" ? 1 : -1;
  const text = (a: string, b: string) => (a || "￿").localeCompare(b || "￿", "zh-CN") * sign;
  const number = (a: number | null, b: number | null) => {
    if (a === null || a === undefined) return b === null || b === undefined ? 0 : 1;
    if (b === null || b === undefined) return -1;
    return (a - b) * sign;
  };
  const stageIndex = (item: ExploreItem) => STAGE_ORDER.indexOf(item.stage as StageKey);

  switch (sort) {
    case "created":
      list.sort((a, b) => number(a.createdAt, b.createdAt));
      break;
    case "completed":
      list.sort((a, b) => number(a.completedAt, b.completedAt));
      break;
    case "planEnd":
      list.sort((a, b) => number(a.planEndAt, b.planEndAt));
      break;
    case "serial":
      list.sort((a, b) => a.serial.localeCompare(b.serial, "zh-CN", { numeric: true }) * sign);
      break;
    case "project":
      list.sort(
        (a, b) =>
          text(a.projectName, b.projectName) ||
          a.serial.localeCompare(b.serial, "zh-CN", { numeric: true }),
      );
      break;
    case "assignee":
      list.sort((a, b) => text(a.assignee || "未分配", b.assignee || "未分配"));
      break;
    case "stage":
      list.sort((a, b) => (stageIndex(a) - stageIndex(b)) * sign);
      break;
    case "priority":
      list.sort(
        (a, b) =>
          (priorityRank(a.priority) - priorityRank(b.priority)) * sign ||
          (severityRank(a.severity) - severityRank(b.severity)) * sign,
      );
      break;
    case "risk":
      list.sort((a, b) => (riskScore(a) - riskScore(b)) * sign);
      break;
    case "updated":
    default:
      list.sort((a, b) => number(a.updatedAt, b.updatedAt));
      break;
  }
  return list;
}

/* ------------------------------- 聚合 ------------------------------- */

export interface Aggregate {
  total: number;
  effective: number;
  done: number;
  canceled: number;
  open: number;
  overdue: number;
  stale: number;
  unassigned: number;
  dueSoon: number;
  risk: number;
  weekCompleted: number;
  weekCreated: number;
  rate: number;
  stages: Record<string, number>;
}

export function aggregate(items: ExploreItem[], now: number): Aggregate {
  const weekStart = startOfWeek(now);
  const stages: Record<string, number> = {};
  for (const stage of STAGE_ORDER) stages[stage] = 0;
  let done = 0;
  let canceled = 0;
  let open = 0;
  let overdue = 0;
  let stale = 0;
  let unassigned = 0;
  let dueSoon = 0;
  let risk = 0;
  let weekCompleted = 0;
  let weekCreated = 0;

  for (const item of items) {
    stages[item.stage] = (stages[item.stage] ?? 0) + 1;
    if (item.stage === "done") done += 1;
    if (item.stage === "canceled") canceled += 1;
    if (item.open) open += 1;
    if (item.overdue) overdue += 1;
    if (item.stale) stale += 1;
    if (item.unassigned) unassigned += 1;
    if (item.dueSoon) dueSoon += 1;
    if (item.overdue || item.stale || item.unassigned || item.dueSoon) risk += 1;
    if (item.stage === "done" && item.completedAt !== null && item.completedAt >= weekStart) weekCompleted += 1;
    if (item.createdAt !== null && item.createdAt >= weekStart) weekCreated += 1;
  }

  const total = items.length;
  const effective = total - canceled;
  return {
    total,
    effective,
    done,
    canceled,
    open,
    overdue,
    stale,
    unassigned,
    dueSoon,
    risk,
    weekCompleted,
    weekCreated,
    rate: effective > 0 ? done / effective : 0,
    stages,
  };
}

/* ------------------------------- 路由 ------------------------------- */

export type TabKey = "items" | "weekly";

function decode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export interface Route {
  selectedId: string | null;
  state: FilterState;
  tab: TabKey;
}

export function parseRoute(hash: string): Route {
  const raw = String(hash || "").replace(/^#/, "");
  const queryIndex = raw.indexOf("?");
  const pathPart = queryIndex === -1 ? raw : raw.slice(0, queryIndex);
  const queryPart = queryIndex === -1 ? "" : raw.slice(queryIndex + 1);
  const parts = pathPart.split("/").filter(Boolean).map(decode);
  const tab: TabKey = parts[0] === "weekly" ? "weekly" : "items";
  const selectedId = (parts[0] === "items" || parts[0] === "weekly") && parts[1] ? parts[1] : null;
  return { selectedId, state: queryToState(queryPart), tab };
}

export function formatRoute(selectedId: string | null, state: FilterState, tab: TabKey = "items"): string {
  const base =
    tab === "weekly"
      ? selectedId
        ? `#/weekly/${encodeURIComponent(selectedId)}`
        : "#/weekly"
      : selectedId
        ? `#/items/${encodeURIComponent(selectedId)}`
        : "#/items";
  const query = stateToQuery(state);
  return query ? `${base}?${query}` : base;
}

export function stateToQuery(state: FilterState): string {
  const params = new URLSearchParams();
  const q = state.q.trim();
  if (q) params.set("q", q);
  for (const field of MULTI_KEYS) {
    for (const value of state[field]) {
      if (value !== "") params.append(field, value);
    }
  }
  for (const flag of FLAGS) if (state[flag]) params.set(flag, "1");
  if (state.timeField && state.timeField !== "updated") params.set("timeField", state.timeField);
  if (state.timePreset && state.timePreset !== "all") params.set("timePreset", state.timePreset);
  if (state.timePreset === "custom") {
    if (state.timeFrom !== null) params.set("from", String(state.timeFrom));
    if (state.timeTo !== null) params.set("to", String(state.timeTo));
  }
  if (state.sort === null) params.set("sort", "none");
  else if (state.sort !== "updated") params.set("sort", state.sort);
  if (state.dir && state.dir !== defaultDir(state.sort || "updated")) params.set("dir", state.dir);
  return params.toString();
}

export function queryToState(query: string): FilterState {
  const state = emptyState();
  const params = new URLSearchParams(query || "");
  state.q = params.get("q") || "";
  for (const field of MULTI_KEYS) state[field] = params.getAll(field).filter(Boolean);
  for (const flag of FLAGS) state[flag] = params.get(flag) === "1";
  const timeField = params.get("timeField");
  if (timeField && TIME_FIELDS.some((item) => item.key === timeField)) state.timeField = timeField;
  const timePreset = params.get("timePreset");
  if (timePreset && TIME_PRESETS.some((item) => item.key === timePreset)) state.timePreset = timePreset;
  const from = params.get("from");
  const to = params.get("to");
  state.timeFrom = from && Number.isFinite(Number(from)) ? Number(from) : null;
  state.timeTo = to && Number.isFinite(Number(to)) ? Number(to) : null;
  if (state.timePreset !== "custom") {
    state.timeFrom = null;
    state.timeTo = null;
  }
  const sort = params.get("sort");
  if (sort === "none") state.sort = null;
  else if (sort && SORT_OPTIONS.some((item) => item.key === sort)) state.sort = sort;
  const dir = params.get("dir");
  state.dir = dir === "asc" || dir === "desc" ? dir : defaultDir(state.sort);
  return state;
}

/* ------------------------------- 维度 ------------------------------- */

export interface FacetDef {
  field: MultiKey;
  label: string;
  pick: (item: ExploreItem) => string[];
}

export const FACET_DEFS: FacetDef[] = [
  { field: "project", label: "项目", pick: (item) => [item.projectId] },
  { field: "stage", label: "阶段", pick: (item) => [item.stage] },
  { field: "category", label: "类别", pick: (item) => [item.category] },
  { field: "type", label: "类型", pick: (item) => [item.type || ""] },
  { field: "status", label: "状态", pick: (item) => [item.status || ""] },
  { field: "priority", label: "优先级", pick: (item) => [item.priority || ""] },
  { field: "severity", label: "严重程度", pick: (item) => [item.severity || ""] },
  { field: "assignee", label: "负责人", pick: (item) => [item.assignee || NONE] },
  { field: "creator", label: "创建人", pick: (item) => [item.creator || NONE] },
  { field: "sprint", label: "迭代", pick: (item) => [item.sprintId || NONE] },
  { field: "label", label: "标签", pick: (item) => item.labels },
];

/** 某字段在其他筛选生效后的可选值计数（用于筛选面板） */
export function facetCounts(
  items: ExploreItem[],
  state: FilterState,
  field: MultiKey,
  now: number,
): Map<string, number> {
  const scratch = { ...state, [field]: [] as string[] };
  const passed = filterItems(items, scratch, now);
  const def = FACET_DEFS.find((entry) => entry.field === field);
  const counts = new Map<string, number>();
  if (!def) return counts;
  for (const item of passed) {
    for (const value of def.pick(item)) {
      if (value === "") continue;
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }
  return counts;
}

export function labelFor(field: MultiKey, value: string, data: ExploreData): string {
  if (field === "project") {
    return data.projects.find((project) => project.id === value)?.name ?? value;
  }
  if (field === "stage") return STAGE_LABEL[value] ?? value;
  if (field === "category") return CATEGORY_LABEL[value] ?? value;
  if (field === "assignee" || field === "creator") return value === NONE ? "未分配" : value;
  if (field === "sprint") {
    if (value === NONE) return "无迭代";
    return data.sprints[value]?.name ?? value;
  }
  return value || "-";
}

/* ------------------------------- 周报 ------------------------------- */

export interface WeeklyGroup {
  name: string;
  items: ExploreItem[];
}

export interface WeeklySummary {
  weekStart: number;
  weekEnd: number;
  agg: Aggregate;
  completed: ExploreItem[];
  created: ExploreItem[];
  inProgress: ExploreItem[];
  risks: ExploreItem[];
  completedByAssignee: WeeklyGroup[];
  createdByProject: WeeklyGroup[];
}

function groupBy(items: ExploreItem[], key: (item: ExploreItem) => string): WeeklyGroup[] {
  const map = new Map<string, ExploreItem[]>();
  for (const item of items) {
    const name = key(item);
    const list = map.get(name);
    if (list) list.push(item);
    else map.set(name, [item]);
  }
  return [...map.entries()]
    .map(([name, group]) => ({ name, items: group }))
    .sort((a, b) => b.items.length - a.items.length || a.name.localeCompare(b.name, "zh-CN"));
}

/** 基于（已筛选的）结果集，按任意时间范围汇总周期内完成 / 新增 / 进行中 / 风险 */
export function buildSummary(
  items: ExploreItem[],
  rangeStart: number,
  rangeEnd: number,
  now: number,
): WeeklySummary {
  const completed = sortItems(
    items.filter(
      (item) =>
        item.stage === "done" &&
        item.completedAt !== null &&
        item.completedAt >= rangeStart &&
        item.completedAt <= rangeEnd,
    ),
    "completed",
  );
  const created = sortItems(
    items.filter((item) => item.createdAt !== null && item.createdAt >= rangeStart && item.createdAt <= rangeEnd),
    "created",
  );
  const inProgress = sortItems(
    items.filter((item) => item.stage === "doing" || item.stage === "verify"),
    "updated",
  );
  const risks = sortItems(
    items.filter((item) => item.overdue || item.stale || item.unassigned || item.dueSoon),
    "risk",
  );
  return {
    weekStart: rangeStart,
    weekEnd: rangeEnd,
    agg: aggregate(items, now),
    completed,
    created,
    inProgress,
    risks,
    completedByAssignee: groupBy(completed, (item) => item.assignee || "未分配"),
    createdByProject: groupBy(created, (item) => item.projectName),
  };
}

/** 本周汇总（buildSummary 的便捷封装） */
export function buildWeekly(items: ExploreItem[], now: number): WeeklySummary {
  const weekStart = startOfWeek(now);
  return buildSummary(items, weekStart, weekStart + 7 * DAY_MS - 1, now);
}

function mdLine(item: ExploreItem, extra = ""): string {
  const tail = extra || [item.assignee || "未分配", item.stageLabel].filter(Boolean).join(" · ");
  return `${item.serial} ${item.subject}（${tail}）`;
}

/** 生成可直接粘贴的 Markdown 周报素材 */
export function weeklyMarkdown(summary: WeeklySummary, scope: string): string {
  const { agg } = summary;
  const lines: string[] = [];
  lines.push(`## 数据汇总（${fmtDate(summary.weekStart)} ~ ${fmtDate(summary.weekEnd)}）`);
  lines.push("");
  lines.push(
    `> 范围：${scope} · 完成率 ${pct(agg.rate, agg.effective)}（${agg.done}/${agg.effective}） · ` +
      `未完成 ${agg.open} · 逾期 ${agg.overdue} · 停滞 ${agg.stale} · 未分配 ${agg.unassigned}`,
  );
  lines.push("");
  lines.push(`### 周期内完成（${summary.completed.length}）`);
  if (summary.completedByAssignee.length === 0) lines.push("- 无");
  for (const group of summary.completedByAssignee) {
    lines.push(`- **${group.name}**（${group.items.length}）：${group.items.map((item) => `${item.serial} ${item.subject}`).join("；")}`);
  }
  lines.push("");
  lines.push(`### 周期内新增（${summary.created.length}）`);
  if (summary.createdByProject.length === 0) lines.push("- 无");
  for (const group of summary.createdByProject) {
    lines.push(`- **${group.name}**（${group.items.length}）：${group.items.map((item) => `${item.serial} ${item.subject}`).join("；")}`);
  }
  lines.push("");
  lines.push(`### 进行中（${summary.inProgress.length}）`);
  if (summary.inProgress.length === 0) lines.push("- 无");
  for (const item of summary.inProgress.slice(0, 20)) lines.push(`- ${mdLine(item)}`);
  if (summary.inProgress.length > 20) lines.push(`- … 其余 ${summary.inProgress.length - 20} 条略`);
  lines.push("");
  lines.push(`### 风险与阻塞（${summary.risks.length}）`);
  if (summary.risks.length === 0) lines.push("- 无");
  for (const item of summary.risks.slice(0, 20)) {
    lines.push(`- ${mdLine(item, item.riskReasons.join("；") || "风险")}`);
  }
  if (summary.risks.length > 20) lines.push(`- … 其余 ${summary.risks.length - 20} 条略`);
  lines.push("");
  return lines.join("\n");
}

/* ------------------------------- 格式化 ------------------------------- */

export function pad(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

export function fmtDate(ts: number | null): string {
  if (ts === null || ts === undefined) return "";
  const date = new Date(ts);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fmtMonthDay(ts: number | null): string {
  if (ts === null || ts === undefined) return "-";
  const date = new Date(ts);
  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fmtDateTime(ts: number | null): string {
  if (ts === null || ts === undefined) return "-";
  const date = new Date(ts);
  return `${fmtDate(ts)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fmtRelative(ts: number | null, now: number): string {
  if (ts === null || ts === undefined) return "-";
  const diff = now - ts;
  if (diff < 0) return "刚刚";
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} 天前`;
  return fmtDate(ts);
}

export function pct(rate: number, total: number): string {
  if (!total || total <= 0) return "-";
  return `${(rate * 100).toFixed(1)}%`;
}

export function initial(name: string): string {
  const text = name.trim();
  return text ? ([...text][0] ?? "?") : "?";
}

/** 与 web-pm-im 一致的浅底色小标签 */
export const TAG_CLASS =
  "inline-flex max-w-full items-center whitespace-nowrap rounded px-2 py-1 text-xs font-medium";

/** 阶段 tag 配色 */
export const STAGE_TAG_CLASS: Record<string, string> = {
  todo: "bg-slate-100 text-slate-500 dark:bg-slate-400/10 dark:text-slate-400",
  doing: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  verify: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
  done: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
  canceled: "bg-slate-100 text-slate-500 dark:bg-slate-400/10 dark:text-slate-400",
  unknown: "bg-slate-100 text-slate-500 dark:bg-slate-400/10 dark:text-slate-400",
};

/** 类别 tag 配色（需求/缺陷/任务/风险） */
export const CATEGORY_TAG_CLASS: Record<string, string> = {
  Req: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  Bug: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  Task: "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400",
  Risk: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
};

/** 优先级 tag 配色 */
export const PRIORITY_TAG_CLASS: Record<string, string> = {
  high: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  mid: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  low: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
};

/** 严重程度 tag 配色：按 severityRank 分级 */
export function severityTagClass(severity: string): string {
  const rank = severityRank(severity);
  if (rank >= 4) return "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400";
  if (rank === 3) return "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400";
  if (rank === 2) return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
  if (rank === 1) return "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400";
  return "bg-slate-100 text-slate-600 dark:bg-slate-400/10 dark:text-slate-400";
}

/** 状态 tag 配色：常见关键词命中语义色，其余按文本哈希稳定分配调色板 */
export function statusTagClass(status: string): string {
  const text = status || "";
  if (/完成|解决|关闭|通过|已发布|上线/.test(text)) {
    return "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400";
  }
  if (/拒绝|取消|失败|不处理|无效/.test(text)) {
    return "bg-slate-100 text-slate-500 dark:bg-slate-400/10 dark:text-slate-400";
  }
  if (/验收|验证|评审/.test(text)) {
    return "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400";
  }
  if (/待|未|新建|打开|重新/.test(text)) {
    return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
  }
  if (/进行|处理中|修复|开发|测试|设计|分析/.test(text)) {
    return "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400";
  }
  const palette = [
    "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400",
    "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
    "bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400",
    "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
    "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400",
  ];
  let hash = 0;
  for (const ch of text) hash = (hash * 31 + (ch.codePointAt(0) ?? 0)) >>> 0;
  return palette[hash % palette.length]!;
}

export function priorityClass(priority: string): string {
  if (/紧急|最高|P0|blocker/i.test(priority)) return "high";
  if (/高|P1/i.test(priority)) return "mid";
  if (/低|P3/i.test(priority)) return "low";
  return "";
}

export function toCsv(headers: string[], rows: (string | number)[][]): string {
  const safe = (value: string | number) => {
    let text = String(value ?? "");
    if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
    return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  };
  return [headers, ...rows].map((row) => row.map(safe).join(",")).join("\r\n");
}

export function exportRows(rows: ExploreItem[]): string {
  const headers = [
    "编号", "标题", "项目", "阶段", "状态", "类别", "类型", "负责人", "创建人", "迭代",
    "优先级", "严重程度", "计划开始", "计划完成", "创建时间", "更新时间", "完成时间",
    "逾期天数", "停滞天数", "周期(天)", "风险", "父项", "子项数", "链接",
  ];
  return toCsv(
    headers,
    rows.map((item) => [
      item.serial, item.subject, item.projectName, item.stageLabel, item.status, item.categoryLabel, item.type,
      item.assignee || "未分配", item.creator, item.sprintName, item.priority, item.severity,
      fmtDate(item.planStartAt), fmtDate(item.planEndAt), fmtDateTime(item.createdAt), fmtDateTime(item.updatedAt),
      fmtDateTime(item.completedAt), item.overdueDays, item.idleDays ?? "", item.cycleDays === null ? "" : Math.round(item.cycleDays * 10) / 10,
      item.riskReasons.join("; "), item.parentSerial, item.childTotal, item.url,
    ]),
  );
}
