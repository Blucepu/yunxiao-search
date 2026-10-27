import { describe, expect, it } from "vitest";
import {
  aggregate,
  buildWeekly,
  defaultDir,
  emptyState,
  filterItems,
  formatRoute,
  parseRoute,
  queryToState,
  sortItems,
  startOfWeek,
  stateToQuery,
  statusTagClass,
  weeklyMarkdown,
} from "../src/lib/explore/core.ts";
import { DAY_MS, NOW, sampleItems } from "./fixtures.ts";

const items = sampleItems();

describe("搜索与筛选", () => {
  it("跨字段全文搜索，支持多关键词", () => {
    const state = emptyState();
    state.q = "APM-1 登录";
    expect(filterItems(items, state, NOW).map((item) => item.id)).toEqual(["1"]);
  });

  it("负责人 / 阶段 / 类别 / 迭代多选", () => {
    const state = emptyState();
    state.stage = ["done", "canceled"];
    expect(filterItems(items, state, NOW).map((item) => item.id).sort()).toEqual(["2", "3"]);

    const bySprint = emptyState();
    bySprint.sprint = ["s1"];
    bySprint.category = ["Req"];
    expect(filterItems(items, bySprint, NOW).map((item) => item.id)).toEqual(["1"]);
  });

  it("创建人筛选", () => {
    const state = emptyState();
    state.creator = ["创建人"];
    expect(filterItems(items, state, NOW)).toHaveLength(4);
    state.creator = ["不存在的人"];
    expect(filterItems(items, state, NOW)).toHaveLength(0);
  });

  it("未分配 / 停滞 / 风险预设", () => {
    const unassigned = emptyState();
    unassigned.unassigned = true;
    expect(filterItems(items, unassigned, NOW).map((item) => item.id)).toEqual(["4"]);

    const stale = emptyState();
    stale.stale = true;
    expect(filterItems(items, stale, NOW).map((item) => item.id)).toEqual(["4"]);

    const risk = emptyState();
    risk.risk = true;
    expect(filterItems(items, risk, NOW).map((item) => item.id).sort()).toEqual(["1", "4"]);
  });

  it("时间范围按字段筛选，null 值被排除", () => {
    const state = emptyState();
    state.timeField = "updated";
    state.timePreset = "7d";
    expect(filterItems(items, state, NOW).map((item) => item.id).sort()).toEqual(["1", "2", "3"]);

    const done = emptyState();
    done.timeField = "completed";
    done.timePreset = "custom";
    done.timeFrom = NOW - 2 * DAY_MS;
    done.timeTo = NOW;
    expect(filterItems(items, done, NOW).map((item) => item.id)).toEqual(["2"]);
  });
});

describe("排序", () => {
  it("更新时间默认倒序", () => {
    expect(sortItems(items, "updated").map((item) => item.id)).toEqual(["2", "1", "3", "4"]);
  });

  it("取消排序保持原始顺序", () => {
    expect(sortItems(items, null).map((item) => item.id)).toEqual(items.map((item) => item.id));
  });

  it("取消排序在 URL 中以 sort=none 表示", () => {
    expect(stateToQuery({ ...emptyState(), sort: null })).toBe("sort=none");
    expect(queryToState("sort=none").sort).toBeNull();
  });
});

describe("状态 tag 配色", () => {
  it("关键词命中语义色", () => {
    expect(statusTagClass("已完成")).toContain("green");
    expect(statusTagClass("已拒绝")).toContain("slate");
    expect(statusTagClass("待处理")).toContain("amber");
    expect(statusTagClass("修复中")).toContain("blue");
    expect(statusTagClass("待验收")).toContain("violet");
  });

  it("未知状态按文本哈希稳定分配", () => {
    expect(statusTagClass("自定义状态A")).toBe(statusTagClass("自定义状态A"));
    expect(statusTagClass("自定义状态A")).not.toBe("");
  });

  it("计划完成升序时 null 排最后", () => {
    const sorted = sortItems(items, "planEnd", "asc");
    expect(sorted[0]?.id).toBe("1");
    expect(sorted.at(-1)?.id).toBe("4");
  });

  it("风险优先按风险分倒序", () => {
    expect(sortItems(items, "risk")[0]?.id).toBe("4");
  });

  it("优先级方向反转后高优先级在前", () => {
    expect(sortItems(items, "priority", "desc")[0]?.id).toBe("1");
    expect(defaultDir("priority")).toBe("desc");
    expect(defaultDir("planEnd")).toBe("asc");
  });
});

describe("聚合", () => {
  it("按当前结果计算阶段与风险", () => {
    const agg = aggregate(items, NOW);
    expect(agg.total).toBe(4);
    expect(agg.effective).toBe(3);
    expect(agg.done).toBe(1);
    expect(agg.canceled).toBe(1);
    expect(agg.open).toBe(2);
    expect(agg.unassigned).toBe(1);
    expect(agg.stale).toBe(1);
    expect(agg.dueSoon).toBe(1);
    expect(agg.risk).toBe(2);
    expect(agg.weekCompleted).toBe(1);
    expect(startOfWeek(NOW)).toBeLessThanOrEqual(NOW);
  });
});

describe("Hash 路由", () => {
  it("筛选状态与选中项可往返", () => {
    const state = emptyState();
    state.q = "登录 改造";
    state.project = ["p1"];
    state.stage = ["doing", "todo"];
    state.category = ["Req"];
    state.open = true;
    state.timeField = "completed";
    state.timePreset = "custom";
    state.timeFrom = NOW - 7 * DAY_MS;
    state.timeTo = NOW;
    state.sort = "priority";
    state.dir = "asc";

    const hash = formatRoute("42", state);
    expect(hash.startsWith("#/items/42?")).toBe(true);
    const parsed = parseRoute(hash);
    expect(parsed.selectedId).toBe("42");
    expect(parsed.tab).toBe("items");
    expect(parsed.state).toEqual(state);
  });

  it("数据汇总 Tab 路由", () => {
    const hash = formatRoute(null, emptyState(), "weekly");
    expect(hash).toBe("#/weekly");
    const parsed = parseRoute(hash);
    expect(parsed.tab).toBe("weekly");
    expect(parsed.selectedId).toBeNull();
  });

  it("空路由等价于默认状态", () => {
    const parsed = parseRoute("");
    expect(parsed.selectedId).toBeNull();
    expect(parsed.tab).toBe("items");
    expect(parsed.state).toEqual(emptyState());
  });

  it("未知排序 / 时间字段回退到默认值", () => {
    const state = queryToState("sort=nope&timeField=nope&dir=nope&timePreset=7d");
    expect(state.sort).toBe("updated");
    expect(state.timeField).toBe("updated");
    expect(state.dir).toBe("desc");
    expect(state.timeFrom).toBeNull();
  });
});

describe("数据汇总", () => {
  it("按本周窗口聚合完成 / 新增 / 进行中 / 风险", () => {
    const summary = buildWeekly(items, NOW);
    expect(summary.weekStart).toBe(startOfWeek(NOW));
    expect(summary.completed.map((item) => item.id)).toEqual(["2"]);
    expect(summary.completedByAssignee[0]?.name).toBe("张三");
    expect(summary.inProgress.map((item) => item.id)).toEqual(["1"]);
    expect(summary.risks.map((item) => item.id).sort()).toEqual(["1", "4"]);
    expect(summary.created.map((item) => item.id)).toEqual(["2"]);
    expect(summary.createdByProject[0]?.name).toBe("APM_IM");
  });

  it("生成 Markdown 汇总素材", () => {
    const summary = buildWeekly(items, NOW);
    const md = weeklyMarkdown(summary, "APM_IM");
    expect(md).toContain("## 数据汇总");
    expect(md).toContain("范围：APM_IM");
    expect(md).toContain("### 周期内完成（1）");
    expect(md).toContain("**张三**（1）：APM-2 子项：接口");
    expect(md).toContain("### 风险与阻塞（2）");
  });
});
