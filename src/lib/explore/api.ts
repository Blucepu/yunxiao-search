// 数据接入层：三级探测，对上层暴露同一接口。
//   1. config.js 配置了 apiBase（自持实时代理，如云函数）→ 跨域实时模式
//   2. 同源存在 /api/health（yunxiao-insight serve / vite dev proxy）→ 本地实时模式
//   3. 都没有 → 静态模式，轮询同目录 data.json
// token 永远不进入前端产物。

import type { ExploreData } from "../../../../yunxiao-insight/src/explore/types.ts";

export type DataMode = "live" | "static";

export interface DataSource {
  mode: DataMode;
  /** 拉取当前数据 */
  fetchData(): Promise<ExploreData>;
  /** 主动刷新：live 模式触发服务端重新同步云效；static 模式重新拉 data.json */
  refresh(): Promise<ExploreData>;
}

interface DeployConfig {
  apiBase?: string;
}

declare global {
  interface Window {
    __YUNXIAO_SEARCH__?: DeployConfig;
  }
}

function configuredApiBase(): string {
  const base = window.__YUNXIAO_SEARCH__?.apiBase?.trim() ?? "";
  return base.replace(/\/+$/, "");
}

async function probeHealth(base: string): Promise<boolean> {
  try {
    const response = await fetch(`${base}/api/health`, { cache: "no-store" });
    if (!response.ok) return false;
    const body = (await response.json()) as { ok?: boolean };
    return Boolean(body && body.ok);
  } catch {
    return false;
  }
}

function assertData(value: unknown): ExploreData {
  const data = value as ExploreData;
  if (!data || typeof data !== "object" || !data.meta || !Array.isArray(data.items)) {
    throw new Error("数据格式不正确");
  }
  return data;
}

function liveSource(base: string): DataSource {
  const call = async (refresh: boolean): Promise<ExploreData> => {
    const response = await fetch(`${base}/api/data${refresh ? "?refresh=1" : ""}`, { cache: "no-store" });
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(body?.error || `实时接口错误（HTTP ${response.status}）`);
    }
    return assertData(await response.json());
  };
  return { mode: "live", fetchData: () => call(false), refresh: () => call(true) };
}

export async function createSource(): Promise<DataSource> {
  const configured = configuredApiBase();
  if (configured && (await probeHealth(configured))) {
    return liveSource(configured);
  }
  if (await probeHealth(".")) {
    return liveSource(".");
  }
  const load = async (): Promise<ExploreData> => {
    const response = await fetch("./data.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`无法加载 data.json（HTTP ${response.status}）`);
    return assertData(await response.json());
  };
  return { mode: "static", fetchData: load, refresh: load };
}

export function dataVersion(data: ExploreData): string {
  return `${data.meta.fetchedAt}:${data.meta.generatedAt}`;
}
