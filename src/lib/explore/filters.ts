// 筛选状态与 URL search params 的双向绑定（配合 HashRouter）。

import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { emptyState, queryToState, stateToQuery, type FilterState } from "./core.ts";

export interface FiltersApi {
  filters: FilterState;
  /** 替换式更新（不产生历史记录），适合输入/点选 */
  patch(patch: Partial<FilterState>): void;
  /** 替换整个状态 */
  set(next: FilterState, mode?: "push" | "replace"): void;
  reset(): void;
}

export function useFilters(): FiltersApi {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => queryToState(searchParams.toString()), [searchParams]);

  const set = useCallback(
    (next: FilterState, mode: "push" | "replace" = "replace") => {
      const query = stateToQuery(next);
      setSearchParams(query ? `?${query}` : "", { replace: mode === "replace" });
    },
    [setSearchParams],
  );

  const patch = useCallback(
    (patch: Partial<FilterState>) => {
      set({ ...filters, ...patch });
    },
    [filters, set],
  );

  const reset = useCallback(() => {
    set(emptyState(), "push");
  }, [set]);

  return { filters, patch, set, reset };
}
