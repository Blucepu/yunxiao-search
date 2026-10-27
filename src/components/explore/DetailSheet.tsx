// 详情抽屉：点击表格行从右侧滑出（Sheet），展示工作项字段全集。

import { CopyIcon, ExternalLinkIcon } from "lucide-react";
import type * as React from "react";
import type { ExploreData, ExploreItem } from "../../../../yunxiao-insight/src/explore/types.ts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetDescription,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  NONE,
  PRIORITY_TAG_CLASS,
  STAGE_TAG_CLASS,
  TAG_CLASS,
  fmtDate,
  fmtDateTime,
  pct,
  priorityClass,
  severityTagClass,
  statusTagClass,
  type MultiKey,
} from "@/lib/explore/core.ts";
import { cn } from "@/lib/utils";

interface Props {
  data: ExploreData;
  item: ExploreItem | null;
  onClose(): void;
  onFilter(field: MultiKey, value: string): void;
  onJump(id: string): void;
  onCopy(text: string, message: string): void;
}

function Jump({ onClick, children }: { onClick(): void; children: React.ReactNode }) {
  return (
    <button type="button" className="text-primary hover:underline" onClick={onClick}>
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0">{children}</dd>
    </>
  );
}

export function DetailSheet({ data, item, onClose, onFilter, onJump, onCopy }: Props) {
  const sprint = item?.sprintId ? data.sprints[item.sprintId] : null;

  return (
    <Sheet open={item !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetPopup side="right" className="sm:max-w-xl">
        {item && (
          <>
            <SheetHeader>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className={cn(TAG_CLASS, STAGE_TAG_CLASS[item.stage] ?? STAGE_TAG_CLASS.unknown)}>
                  {item.stageLabel}
                </span>
                <span className={cn(TAG_CLASS, "bg-slate-100 text-slate-600 dark:bg-slate-400/10 dark:text-slate-400")}>
                  {item.categoryLabel}
                </span>
                {item.type && item.type !== item.categoryLabel && (
                  <span className={cn(TAG_CLASS, "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400")}>
                    {item.type}
                  </span>
                )}
                {item.status && item.status !== "-" && (
                  <span className={cn(TAG_CLASS, statusTagClass(item.status))}>{item.status}</span>
                )}
                {item.priority && item.priority !== "-" && (
                  <span className={cn(TAG_CLASS, PRIORITY_TAG_CLASS[priorityClass(item.priority)] ?? "bg-slate-100 text-slate-600 dark:bg-slate-400/10 dark:text-slate-400")}>
                    {item.priority}
                  </span>
                )}
                {item.severity && item.severity !== "-" && (
                  <span className={cn(TAG_CLASS, severityTagClass(item.severity))}>
                    严重程度 {item.severity}
                  </span>
                )}
              </div>
              <SheetTitle className="leading-snug">{item.subject}</SheetTitle>
              <SheetDescription>
                {item.serial} ·{" "}
                <Jump onClick={() => onFilter("project", item.projectId)}>{item.projectName}</Jump>
              </SheetDescription>
              <div className="flex flex-wrap gap-2 pt-1">
                {item.url && (
                  <Button size="sm" render={<a href={item.url} target="_blank" rel="noopener noreferrer" />}>
                    打开云效
                    <ExternalLinkIcon />
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => onCopy(item.serial, "已复制编号")}>
                  <CopyIcon />
                  复制编号
                </Button>
              </div>
            </SheetHeader>

            <SheetPanel className="flex flex-col gap-5">
              <section>
                <h4 className="mb-2 text-xs font-medium tracking-wide text-muted-foreground">风险</h4>
                {item.riskReasons.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {item.riskReasons.map((reason) => (
                      <Badge
                        key={reason}
                        variant={reason.includes("到期") && !reason.includes("逾期") ? "warning" : "error"}
                      >
                        {reason}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">无</span>
                )}
              </section>

              <Separator />

              <section>
                <h4 className="mb-2 text-xs font-medium tracking-wide text-muted-foreground">基本信息</h4>
                <dl className="grid grid-cols-[76px_1fr] gap-x-3 gap-y-1.5 text-sm">
                  <Field label="负责人">
                    <Jump onClick={() => onFilter("assignee", item.assignee || NONE)}>
                      {item.assignee || "未分配"}
                    </Jump>
                  </Field>
                  <Field label="迭代">
                    {sprint ? (
                      <>
                        <Jump onClick={() => onFilter("sprint", sprint.id)}>{sprint.name}</Jump>
                        <span className="text-xs text-muted-foreground">
                          {" "}
                          · {fmtDate(sprint.startAt)} ~ {fmtDate(sprint.endAt)} · 完成率{" "}
                          {pct(sprint.rate, sprint.effective)}（{sprint.done}/{sprint.effective}）
                        </span>
                      </>
                    ) : (
                      item.sprintName || "-"
                    )}
                  </Field>
                  <Field label="计划">
                    {item.planStartAt !== null ? fmtDate(item.planStartAt) : "-"} ~{" "}
                    {item.planEndAt !== null ? fmtDate(item.planEndAt) : "-"}
                    {item.overdue && <Badge variant="error" className="ml-1.5">逾期 {item.overdueDays} 天</Badge>}
                  </Field>
                  <Field label="优先级">{item.priority || "-"}</Field>
                  <Field label="严重程度">{item.severity || "-"}</Field>
                  <Field label="预计工时">{item.estimatedHours !== null ? `${item.estimatedHours} h` : "-"}</Field>
                  <Field label="创建人">
                    {item.creator ? (
                      <Jump onClick={() => onFilter("creator", item.creator)}>{item.creator}</Jump>
                    ) : (
                      "-"
                    )}
                  </Field>
                </dl>
              </section>

              <Separator />

              <section>
                <h4 className="mb-2 text-xs font-medium tracking-wide text-muted-foreground">时间线</h4>
                <dl className="grid grid-cols-[76px_1fr] gap-x-3 gap-y-1.5 text-sm">
                  <Field label="创建">
                    {fmtDateTime(item.createdAt)}
                    {item.ageDays !== null && <span className="text-muted-foreground"> · {item.ageDays} 天前</span>}
                  </Field>
                  <Field label="更新">
                    {fmtDateTime(item.updatedAt)}
                    {item.idleDays !== null && <span className="text-muted-foreground"> · 停滞 {item.idleDays} 天</span>}
                  </Field>
                  <Field label="完成">
                    {fmtDateTime(item.completedAt)}
                    {item.cycleDays !== null && (
                      <span className="text-muted-foreground"> · 周期 {Math.round(item.cycleDays * 10) / 10} 天</span>
                    )}
                  </Field>
                </dl>
              </section>

              <Separator />

              <section>
                <h4 className="mb-2 text-xs font-medium tracking-wide text-muted-foreground">父子关联</h4>
                <dl className="grid grid-cols-[76px_1fr] gap-x-3 gap-y-1.5 text-sm">
                  <Field label="父项">
                    {item.parentId ? (
                      item.parentSerial ? (
                        <Jump onClick={() => onJump(item.parentId)}>{item.parentSerial}</Jump>
                      ) : (
                        <span className="text-muted-foreground">父项不在当前范围</span>
                      )
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </Field>
                  <Field label="子项">
                    {item.children.length > 0 ? (
                      <div className="flex flex-col gap-1.5">
                        {item.children.map((child) => (
                          <div key={child.id} className="flex min-w-0 items-center gap-2">
                            <Jump onClick={() => onJump(child.id)}>{child.serial}</Jump>
                            <span className="truncate" title={child.subject}>
                              {child.subject}
                            </span>
                            <span className={cn(TAG_CLASS, STAGE_TAG_CLASS[child.stage] ?? STAGE_TAG_CLASS.unknown)}>
                              {child.stageLabel}
                            </span>
                          </div>
                        ))}
                        <span className="text-xs text-muted-foreground">
                          子项完成率 {pct(item.childRate, item.childEffective)}（{item.childDone}/{item.childEffective}）
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </Field>
                </dl>
              </section>

              <Separator />

              <section>
                <h4 className="mb-2 text-xs font-medium tracking-wide text-muted-foreground">标签</h4>
                <div className="flex flex-wrap gap-1.5">
                  {item.labels.length > 0 ? (
                    item.labels.map((label) => (
                      <Badge
                        key={label}
                        variant="outline"
                        render={<button type="button" onClick={() => onFilter("label", label)} />}
                      >
                        {label}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">无</span>
                  )}
                </div>
              </section>
            </SheetPanel>
          </>
        )}
      </SheetPopup>
    </Sheet>
  );
}
