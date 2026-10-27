// 数据上下文：启动时探测本地实时 API（yunxiao-insight serve），不通则轮询同目录 data.json。
// token 永远不进入本仓库；两种模式对页面暴露同一接口。

/* eslint-disable react-refresh/only-export-components -- Context 文件同时导出 Provider 与 hook 是标准用法 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ExploreData } from "../../../../yunxiao-insight/src/explore/types.ts";
import { toastManager } from "@/components/ui/toast";
import { createSource, dataVersion, type DataMode, type DataSource } from "./api.ts";

const POLL_INTERVAL = 30_000;

export interface ExploreDataState {
  data: ExploreData | null;
  /** live = 本地 serve 实时模式；static = OSS 静态快照轮询 */
  mode: DataMode | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  /** 主动刷新：live 模式触发服务端同步云效；static 模式重新拉 data.json */
  refresh(): void;
}

const ExploreDataContext = createContext<ExploreDataState | null>(null);

function toast(message: string) {
  toastManager.add({ title: message });
}

export function ExploreDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ExploreData | null>(null);
  const [mode, setMode] = useState<DataMode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const sourceRef = useRef<DataSource | null>(null);
  const versionRef = useRef("");
  const pollingRef = useRef(false);

  const applyData = useCallback((next: ExploreData) => {
    versionRef.current = dataVersion(next);
    setData(next);
    setError(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    createSource()
      .then(async (source) => {
        if (cancelled) return;
        sourceRef.current = source;
        setMode(source.mode);
        applyData(await source.fetchData());
      })
      .catch((cause: unknown) => {
        if (!cancelled) setError(cause instanceof Error ? cause.message : String(cause));
      });
    return () => {
      cancelled = true;
    };
  }, [applyData]);

  useEffect(() => {
    const tick = async () => {
      const source = sourceRef.current;
      if (!source || pollingRef.current) return;
      pollingRef.current = true;
      try {
        const next = await source.fetchData();
        if (dataVersion(next) !== versionRef.current) {
          applyData(next);
          toast("数据已更新");
        }
      } catch {
        // 轮询失败静默，保持当前数据
      } finally {
        pollingRef.current = false;
      }
    };
    const timer = setInterval(tick, POLL_INTERVAL);
    const onVisible = () => {
      if (!document.hidden) void tick();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [applyData]);

  const refresh = useCallback(() => {
    const source = sourceRef.current;
    if (!source || refreshing) return;
    setRefreshing(true);
    source
      .refresh()
      .then((next) => {
        const changed = dataVersion(next) !== versionRef.current;
        applyData(next);
        toast(changed ? "已同步云效最新数据" : "数据已是最新");
      })
      .catch((cause: unknown) => {
        const message = cause instanceof Error ? cause.message : String(cause);
        setError(message);
        toast(`刷新失败：${message}`);
      })
      .finally(() => setRefreshing(false));
  }, [refreshing, applyData]);

  const value: ExploreDataState = {
    data,
    mode,
    loading: !data && !error,
    refreshing,
    error,
    refresh,
  };

  return <ExploreDataContext.Provider value={value}>{children}</ExploreDataContext.Provider>;
}

export function useExploreData(): ExploreDataState {
  const state = useContext(ExploreDataContext);
  if (!state) throw new Error("useExploreData 必须在 ExploreDataProvider 内使用");
  return state;
}
