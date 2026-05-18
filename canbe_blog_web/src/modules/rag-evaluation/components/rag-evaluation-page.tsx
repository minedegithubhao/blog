"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Eye, History, Play, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteEvalSet, generateEvalSet, getEvalRun, listEvalRunResults, listEvalRuns, listEvalSets, startEvalRun } from "../api";
import type { Distribution, EvalCaseMetrics, EvalRun, EvalRunConfig, EvalRunResult, EvalRunSummary, EvalSet, EvalSetGeneratePayload } from "../types";

const SOURCE_PATH = "exports/jd_help_faq.chunks.jsonl";
const CATEGORY_DEFAULTS: Distribution = {
  "特色服务": 0.213198,
  "售后服务": 0.151438,
  "历史规则": 0.14467,
  "账户及会员": 0.113367,
  "购物指南": 0.096447,
  "支付问题": 0.08714,
  "订单百事通": 0.059222,
  "企业会员帮助中心": 0.05753,
  "配送方式": 0.046531,
  "发票问题": 0.030457
};
const QUESTION_STYLE_DEFAULTS: Distribution = { original: 0.3, colloquial: 0.4, synonym: 0.2, abbreviated: 0.1 };
const DIFFICULTY_DEFAULTS: Distribution = { easy: 0.3, medium: 0.5, hard: 0.2 };
const RUN_CONFIG: EvalRunConfig = { configured_k: 5, retrieval_top_n: 20, similarity_threshold: 0.72, rerank_enabled: true };
const PAGE_SIZE_OPTIONS = [10, 20, 50];

type EvalSetQuery = {
  name: string;
  sourcePath: string;
  createdBy: string;
  status: string;
};

const EMPTY_QUERY: EvalSetQuery = {
  name: "",
  sourcePath: "",
  createdBy: "",
  status: "all"
};

type CaseDiffType = "improved" | "regressed" | "unchanged";

type CaseCompareRow = {
  caseId: string;
  question: string;
  diffType: CaseDiffType;
  left: EvalRunResult;
  right: EvalRunResult;
};

export function RagEvaluationPage() {
  const [evalSets, setEvalSets] = useState<EvalSet[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [query, setQuery] = useState<EvalSetQuery>(EMPTY_QUERY);
  const [appliedQuery, setAppliedQuery] = useState<EvalSetQuery>(EMPTY_QUERY);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [historyEvalSet, setHistoryEvalSet] = useState<EvalSet | null>(null);
  const [deleteEvalSetTarget, setDeleteEvalSetTarget] = useState<EvalSet | null>(null);
  const [detailRun, setDetailRun] = useState<EvalRun | null>(null);
  const [compareRuns, setCompareRuns] = useState<EvalRun[]>([]);
  const [runs, setRuns] = useState<EvalRun[]>([]);
  const [results, setResults] = useState<EvalRunResult[]>([]);
  const [caseDetail, setCaseDetail] = useState<EvalRunResult | null>(null);

  async function refreshEvalSets() {
    setLoading(true);
    try {
      setEvalSets(await listEvalSets({ limit: 200 }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "加载评估集失败");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshEvalSets();
  }, []);

  useEffect(() => {
    if (!historyEvalSet || !runs.some((run) => run.status === "running")) {
      return;
    }
    const timer = window.setInterval(() => {
      void openHistory(historyEvalSet);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [historyEvalSet, runs]);

  async function handleStartRun(evalSet: EvalSet) {
    setBusyId(evalSet.eval_set_id);
    try {
      const response = await startEvalRun(evalSet.eval_set_id, RUN_CONFIG);
      toast.success(`评估已启动：${response.run_id}`);
      await refreshEvalSets();
      await openHistory(evalSet);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "启动评估失败");
    } finally {
      setBusyId("");
    }
  }

  async function openHistory(evalSet: EvalSet) {
    setHistoryEvalSet(evalSet);
    try {
      setRuns(await listEvalRuns(evalSet.eval_set_id));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "加载评估记录失败");
    }
  }

  async function openRunDetail(run: EvalRun) {
    try {
      const [runDetail, runResults] = await Promise.all([getEvalRun(run.run_id), listEvalRunResults(run.run_id, { page: 1, pageSize: 50 })]);
      setDetailRun(runDetail);
      setResults(runResults);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "加载评估详情失败");
    }
  }

  async function handleDeleteEvalSet() {
    if (!deleteEvalSetTarget) {
      return;
    }
    setBusyId(deleteEvalSetTarget.eval_set_id);
    try {
      const response = await deleteEvalSet(deleteEvalSetTarget.eval_set_id);
      toast.success(`已删除评估集，案例 ${response.deleted_cases} 条，运行记录 ${response.deleted_runs} 条`);
      setDeleteEvalSetTarget(null);
      await refreshEvalSets();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "删除评估集失败");
    } finally {
      setBusyId("");
    }
  }

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    setAppliedQuery(query);
    setPage(1);
  }

  function handleReset() {
    setQuery(EMPTY_QUERY);
    setAppliedQuery(EMPTY_QUERY);
    setPage(1);
  }

  const filteredEvalSets = useMemo(() => filterEvalSets(evalSets, appliedQuery), [evalSets, appliedQuery]);
  const total = filteredEvalSets.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedEvalSets = filteredEvalSets.slice((safePage - 1) * pageSize, safePage * pageSize);
  const visiblePages = buildVisiblePages(safePage, totalPages);

  return (
    <div className="min-w-0 max-w-full space-y-4">
      <Card className="min-w-0 rounded-md">
        <CardContent className="min-w-0 pt-0">
          <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-4">
            <SearchField label="名称">
              <Input value={query.name} onChange={(event) => setQuery((current) => ({ ...current, name: event.target.value }))} />
            </SearchField>
            <SearchField label="数据源">
              <Input value={query.sourcePath} onChange={(event) => setQuery((current) => ({ ...current, sourcePath: event.target.value }))} />
            </SearchField>
            <SearchField label="创建人">
              <Input value={query.createdBy} onChange={(event) => setQuery((current) => ({ ...current, createdBy: event.target.value }))} />
            </SearchField>
            <SearchField label="状态">
              <Select value={query.status} onValueChange={(value) => setQuery((current) => ({ ...current, status: value }))}>
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="ready">ready</SelectItem>
                </SelectContent>
              </Select>
            </SearchField>
            <div className="flex items-center gap-2">
              <Button type="submit" className="cursor-pointer">
                查询
              </Button>
              <Button type="button" variant="outline" className="cursor-pointer" onClick={handleReset}>
                重置
              </Button>
              <Button type="button" className="cursor-pointer" onClick={() => setGenerateOpen(true)}>
                <Plus className="h-4 w-4" />
                一键生成评估集
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="min-w-0 rounded-md">
        <CardContent className="min-w-0 pt-0">
          <Table className="min-w-[980px] table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[24%]">名称</TableHead>
                <TableHead className="w-[24%]">数据源</TableHead>
                <TableHead className="w-[8%] text-center">案例数</TableHead>
                <TableHead className="w-[9%] text-center">状态</TableHead>
                <TableHead className="w-[10%]">创建人</TableHead>
                <TableHead className="w-[13%]">创建时间</TableHead>
                <TableHead className="w-[120px] text-center">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    加载中...
                  </TableCell>
                </TableRow>
              ) : null}
              {!loading && pagedEvalSets.map((item) => (
                <TableRow key={item.eval_set_id}>
                  <TableCell>
                    <div className="min-w-0 truncate font-medium text-gray-950" title={item.name}>{item.name}</div>
                    <div className="mt-1 min-w-0 truncate text-xs text-muted-foreground" title={item.eval_set_id}>{item.eval_set_id}</div>
                  </TableCell>
                  <TableCell title={item.source_path}>
                    <div className="min-w-0 truncate">{item.source_path || "-"}</div>
                  </TableCell>
                  <TableCell className="text-center">{item.summary?.total ?? 0}</TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">{String((item as EvalSet & { status?: string }).status ?? "ready")}</Badge>
                  </TableCell>
                  <TableCell><div className="min-w-0 truncate">{item.created_by || "admin"}</div></TableCell>
                  <TableCell><div className="min-w-0 truncate" title={formatDate(item.created_at)}>{formatDate(item.created_at)}</div></TableCell>
                  <TableCell className="w-[120px] text-center">
                    <div className="flex justify-center gap-1">
                      <Button type="button" size="icon" title="开始评估" onClick={() => void handleStartRun(item)} disabled={busyId === item.eval_set_id}>
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button type="button" size="icon" variant="outline" title="评估记录" onClick={() => void openHistory(item)}>
                        <History className="h-4 w-4" />
                      </Button>
                      <Button type="button" size="icon" variant="outline" title="删除" onClick={() => setDeleteEvalSetTarget(item)} disabled={busyId === item.eval_set_id}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && !pagedEvalSets.length ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    暂无数据
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-sm text-muted-foreground">
            <span>共 {total} 条</span>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="outline" size="icon" className="cursor-pointer" onClick={() => void refreshEvalSets()} disabled={loading}>
                <RefreshCcw className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Select
                value={String(pageSize)}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[110px] cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size} 条/页
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Pagination className="mx-0 w-auto justify-start">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      className={classNames("cursor-pointer", safePage <= 1 && "pointer-events-none opacity-50")}
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                    />
                  </PaginationItem>
                  {visiblePages.map((item, index) => (
                    <PaginationItem key={item === "ellipsis" ? `ellipsis-${index}` : item}>
                      {item === "ellipsis" ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink isActive={item === safePage} className="cursor-pointer" onClick={() => setPage(item)}>
                          {item}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      className={classNames("cursor-pointer", safePage >= totalPages && "pointer-events-none opacity-50")}
                      onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </CardContent>
      </Card>

      <GenerateEvalSetDialog
        open={generateOpen}
        onOpenChange={setGenerateOpen}
        onGenerated={async () => {
          setGenerateOpen(false);
          await refreshEvalSets();
        }}
      />
      <EvalRunHistoryDialog
        evalSet={historyEvalSet}
        runs={runs}
        open={Boolean(historyEvalSet)}
        onOpenChange={(open) => {
          if (!open) setHistoryEvalSet(null);
        }}
        onOpenDetail={(run) => void openRunDetail(run)}
        onOpenCompare={setCompareRuns}
      />
      <EvalRunDetailDialog
        run={detailRun}
        results={results}
        open={Boolean(detailRun)}
        onOpenChange={(open) => {
          if (!open) setDetailRun(null);
        }}
        onOpenCase={setCaseDetail}
      />
      <EvalRunCompareDialog
        runs={compareRuns}
        open={compareRuns.length === 2}
        onOpenChange={(open) => {
          if (!open) setCompareRuns([]);
        }}
      />
      <CaseDiagnosticsDrawer result={caseDetail} open={Boolean(caseDetail)} onOpenChange={(open) => !open && setCaseDetail(null)} />
      <AlertDialog open={Boolean(deleteEvalSetTarget)} onOpenChange={(open) => !open && setDeleteEvalSetTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除评估集</AlertDialogTitle>
            <AlertDialogDescription>
              将删除评估集「{deleteEvalSetTarget?.name}」及其案例、评估记录和评估结果。删除后不可恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">取消</AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer bg-destructive text-white hover:bg-destructive/90"
              onClick={() => void handleDeleteEvalSet()}
              disabled={Boolean(deleteEvalSetTarget && busyId === deleteEvalSetTarget.eval_set_id)}
            >
              {deleteEvalSetTarget && busyId === deleteEvalSetTarget.eval_set_id ? "删除中..." : "确认删除"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function GenerateEvalSetDialog({ open, onOpenChange, onGenerated }: { open: boolean; onOpenChange: (open: boolean) => void; onGenerated: () => Promise<void> }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("jd_help_eval_v1");
  const [totalCount, setTotalCount] = useState(100);
  const [evalMode, setEvalMode] = useState<"single_chunk" | "multi_chunk" | "mixed">("mixed");
  const [evalTypeDist, setEvalTypeDist] = useState<Distribution>({ single_chunk: 0.7, multi_chunk: 0.3 });
  const [questionStyleDist, setQuestionStyleDist] = useState<Distribution>(QUESTION_STYLE_DEFAULTS);
  const [difficultyDist, setDifficultyDist] = useState<Distribution>(DIFFICULTY_DEFAULTS);
  const [categoryDist, setCategoryDist] = useState<Distribution>(CATEGORY_DEFAULTS);
  const [submitting, setSubmitting] = useState(false);

  const finalEvalTypeDist = useMemo(() => {
    if (evalMode === "single_chunk") return { single_chunk: 1 };
    if (evalMode === "multi_chunk") return { multi_chunk: 1 };
    return evalTypeDist;
  }, [evalMode, evalTypeDist]);
  const valid = isDistributionValid(finalEvalTypeDist) && isDistributionValid(questionStyleDist) && isDistributionValid(difficultyDist) && isDistributionValid(categoryDist);

  async function handleSubmit() {
    const payload: EvalSetGeneratePayload = {
      name,
      total_count: totalCount,
      source_path: SOURCE_PATH,
      eval_type_distribution: finalEvalTypeDist,
      question_style_distribution: questionStyleDist,
      difficulty_distribution: difficultyDist,
      category_distribution: categoryDist
    };
    setSubmitting(true);
    try {
      const response = await generateEvalSet(payload);
      toast.success(`已生成评估集：${response.eval_set_id}`);
      await onGenerated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "生成评估集失败");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>一键生成评估集</DialogTitle>
          <DialogDescription>步骤：① 基础信息 → ② 抽样策略 → ③ 生成预览与确认</DialogDescription>
        </DialogHeader>
        {step === 1 ? (
          <div className="grid gap-4">
            <Field label="评估集名称" value={name} onChange={setName} />
            <NumberField label="生成数量" value={totalCount} onChange={setTotalCount} />
            <ReadOnly label="数据源" value={SOURCE_PATH} />
            <ReadOnly label="数据源指纹" value="后端生成时自动计算 source_hash" />
          </div>
        ) : null}
        {step === 2 ? (
          <div className="space-y-5">
            <section className="space-y-2">
              <Label>评测类型 eval_type</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  ["single_chunk", "single_chunk"],
                  ["multi_chunk", "multi_chunk"],
                  ["mixed", "single_chunk + multi_chunk"]
                ].map(([value, label]) => (
                  <Button key={value} type="button" variant={evalMode === value ? "default" : "outline"} onClick={() => setEvalMode(value as typeof evalMode)}>
                    {label}
                  </Button>
                ))}
              </div>
              {evalMode === "mixed" ? <DistributionEditor value={evalTypeDist} onChange={setEvalTypeDist} labels={{ single_chunk: "single_chunk", multi_chunk: "multi_chunk" }} /> : null}
            </section>
            <DistributionEditor title="问题改写方式 question_style" value={questionStyleDist} onChange={setQuestionStyleDist} labels={{ original: "original", colloquial: "colloquial", synonym: "synonym", abbreviated: "abbreviated" }} onReset={() => setQuestionStyleDist(QUESTION_STYLE_DEFAULTS)} />
            <DistributionEditor title="难度 difficulty" value={difficultyDist} onChange={setDifficultyDist} labels={{ easy: "easy", medium: "medium", hard: "hard" }} onReset={() => setDifficultyDist(DIFFICULTY_DEFAULTS)} />
            <DistributionEditor title="类别分布 category" value={categoryDist} onChange={setCategoryDist} labels={Object.fromEntries(Object.keys(CATEGORY_DEFAULTS).map((key) => [key, key]))} onReset={() => setCategoryDist(CATEGORY_DEFAULTS)} />
          </div>
        ) : null}
        {step === 3 ? <GeneratePreview totalCount={totalCount} evalTypeDist={finalEvalTypeDist} questionStyleDist={questionStyleDist} difficultyDist={difficultyDist} categoryDist={categoryDist} /> : null}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => (step === 1 ? onOpenChange(false) : setStep(step - 1))}>
            {step === 1 ? "取消" : "上一步"}
          </Button>
          {step < 3 ? (
            <Button type="button" onClick={() => setStep(step + 1)} disabled={step === 2 && !valid}>
              下一步
            </Button>
          ) : (
            <Button type="button" onClick={() => void handleSubmit()} disabled={!valid || submitting}>
              确认生成
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EvalRunHistoryDialog({ evalSet, runs, open, onOpenChange, onOpenDetail, onOpenCompare }: { evalSet: EvalSet | null; runs: EvalRun[]; open: boolean; onOpenChange: (open: boolean) => void; onOpenDetail: (run: EvalRun) => void; onOpenCompare: (runs: EvalRun[]) => void }) {
  const [selectedRunIds, setSelectedRunIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (!open) {
      setSelectedRunIds([]);
      setPage(1);
    }
  }, [open]);

  useEffect(() => {
    setPage(1);
  }, [evalSet?.eval_set_id]);

  function toggleRun(runId: string) {
    setSelectedRunIds((current) => {
      if (current.includes(runId)) {
        return current.filter((item) => item !== runId);
      }
      if (current.length >= 2) {
        return [current[1], runId];
      }
      return [...current, runId];
    });
  }

  function openCompare() {
    const selected = runs.filter((run) => selectedRunIds.includes(run.run_id));
    if (selected.length === 2) {
      onOpenCompare(selected);
    }
  }

  const total = runs.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedRuns = runs.slice((safePage - 1) * pageSize, safePage * pageSize);
  const visiblePages = buildVisiblePages(safePage, totalPages);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>评估记录：{evalSet?.name}</DialogTitle>
          <DialogDescription>同一个评估集可以多次运行，用于比较不同 RAG 配置下的检索表现。</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
          <span>可勾选两条运行记录进行对比。</span>
          <Button type="button" size="sm" onClick={openCompare} disabled={selectedRunIds.length !== 2}>
            对比选中运行
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[52px] text-center">选择</TableHead>
              <TableHead>Run ID</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>进度</TableHead>
                <TableHead>耗时</TableHead>
                <TableHead>时间</TableHead>
                <TableHead>Hit@K</TableHead>
              <TableHead>Recall@K</TableHead>
              <TableHead>nDCG@K</TableHead>
              <TableHead>Filtered P</TableHead>
              <TableHead>Errors</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedRuns.map((run) => (
              <TableRow key={run.run_id}>
                <TableCell className="text-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={selectedRunIds.includes(run.run_id)}
                    onChange={() => toggleRun(run.run_id)}
                  />
                </TableCell>
                <TableCell className="max-w-[220px] truncate">{run.run_id}</TableCell>
                <TableCell><RunStatusBadge status={run.status} /></TableCell>
                <TableCell className="min-w-[220px]">
                  <div className="space-y-2">
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${progressPercent(run)}%` }} />
                    </div>
                    <div className="text-xs text-muted-foreground">{formatProgress(run)}</div>
                  </div>
                </TableCell>
                <TableCell>{formatRunDuration(run)}</TableCell>
                <TableCell>{formatDate(run.created_at)}</TableCell>
                <TableCell>{formatPercent(summaryHit(run.summary))}</TableCell>
                <TableCell>{formatPercent(summaryRecall(run.summary))}</TableCell>
                <TableCell>{formatNumber(summaryRank(run.summary))}</TableCell>
                <TableCell>{formatPercent(summaryFilteredPrecision(run.summary))}</TableCell>
                <TableCell>{formatCount(run.summary.error_count)}</TableCell>
                <TableCell className="text-right">
                  <Button type="button" size="sm" variant="outline" onClick={() => onOpenDetail(run)} disabled={run.status === "running"}>
                    <Eye className="h-4 w-4" />
                    详情
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!runs.length ? (
              <TableRow>
                <TableCell colSpan={12} className="h-24 text-center text-muted-foreground">
                  当前评估集还没有运行记录。
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-sm text-muted-foreground">
          <span>共 {total} 条运行记录</span>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[110px] cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size} 条/页
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Pagination className="mx-0 w-auto justify-start">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className={classNames("cursor-pointer", safePage <= 1 && "pointer-events-none opacity-50")}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                  />
                </PaginationItem>
                {visiblePages.map((item, index) => (
                  <PaginationItem key={item === "ellipsis" ? `run-history-ellipsis-${index}` : `run-history-page-${item}`}>
                    {item === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink isActive={item === safePage} className="cursor-pointer" onClick={() => setPage(item)}>
                        {item}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    className={classNames("cursor-pointer", safePage >= totalPages && "pointer-events-none opacity-50")}
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EvalRunCompareDialog({ runs, open, onOpenChange }: { runs: EvalRun[]; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [left, right] = runs;
  const [leftResults, setLeftResults] = useState<EvalRunResult[]>([]);
  const [rightResults, setRightResults] = useState<EvalRunResult[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [compareFilter, setCompareFilter] = useState<"all" | "improved" | "regressed" | "hit_changed" | "rank_changed">("all");
  const [selectedCase, setSelectedCase] = useState<CaseCompareRow | null>(null);

  useEffect(() => {
    if (!open || !left?.run_id || !right?.run_id) {
      setLeftResults([]);
      setRightResults([]);
      setSelectedCase(null);
      return;
    }
    let cancelled = false;
    async function loadResults() {
      setLoadingResults(true);
      try {
        const [nextLeft, nextRight] = await Promise.all([listEvalRunResults(left.run_id), listEvalRunResults(right.run_id)]);
        if (!cancelled) {
          setLeftResults(nextLeft);
          setRightResults(nextRight);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(error instanceof Error ? error.message : "加载运行对比结果失败");
        }
      } finally {
        if (!cancelled) {
          setLoadingResults(false);
        }
      }
    }
    void loadResults();
    return () => {
      cancelled = true;
    };
  }, [open, left?.run_id, right?.run_id]);

  const caseRows = useMemo(() => buildCaseCompareRows(leftResults, rightResults), [leftResults, rightResults]);
  const caseSummary = useMemo(() => summarizeCaseDiffs(caseRows), [caseRows]);
  const filteredCaseRows = useMemo(
    () =>
      caseRows.filter((row) => {
        if (compareFilter === "all") return true;
        if (compareFilter === "hit_changed") return metricChanged(caseHit(row.left.metrics), caseHit(row.right.metrics));
        if (compareFilter === "rank_changed") return metricChanged(caseRank(row.left.metrics), caseRank(row.right.metrics));
        return row.diffType === compareFilter;
      }),
    [caseRows, compareFilter]
  );

  if (!left || !right) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>运行对比</DialogTitle>
          <DialogDescription>对比同一评估集下两次运行的参数、指标和耗时变化。</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>项目</TableHead>
                <TableHead>{left.run_id}</TableHead>
                <TableHead>{right.run_id}</TableHead>
                <TableHead>变化</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buildCompareRows(left, right).map((row) => (
                <TableRow key={row.label}>
                  <TableCell>{row.label}</TableCell>
                  <TableCell>{row.left}</TableCell>
                  <TableCell>{row.right}</TableCell>
                  <TableCell className={deltaClassName(row.deltaTone)}>{row.delta}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Separator />
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">变好 {caseSummary.improved}</Badge>
                <Badge variant="secondary">变差 {caseSummary.regressed}</Badge>
                <Badge variant="secondary">无变化 {caseSummary.unchanged}</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  ["all", "全部"],
                  ["improved", "仅变好"],
                  ["regressed", "仅变差"],
                  ["hit_changed", "仅命中变化"],
                  ["rank_changed", "仅排序变化"],
                ].map(([value, label]) => (
                  <Button
                    key={value}
                    type="button"
                    size="sm"
                    variant={compareFilter === value ? "default" : "outline"}
                    onClick={() => setCompareFilter(value as typeof compareFilter)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>case_id</TableHead>
                  <TableHead>问题</TableHead>
                  <TableHead>{left.run_id}</TableHead>
                  <TableHead>{right.run_id}</TableHead>
                  <TableHead>变化</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingResults ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      加载对比结果中...
                    </TableCell>
                  </TableRow>
                ) : null}
                {!loadingResults && filteredCaseRows.map((row) => (
                  <TableRow key={row.caseId}>
                    <TableCell className="whitespace-nowrap text-xs">{row.caseId}</TableCell>
                    <TableCell className="max-w-[260px] truncate" title={row.question}>{row.question}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      Hit {formatNumber(caseHit(row.left.metrics))} | Recall {formatNumber(caseRecall(row.left.metrics))} | {caseRankLabel(row.left.metrics)} {formatNumber(caseRank(row.left.metrics))}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      Hit {formatNumber(caseHit(row.right.metrics))} | Recall {formatNumber(caseRecall(row.right.metrics))} | {caseRankLabel(row.right.metrics)} {formatNumber(caseRank(row.right.metrics))}
                    </TableCell>
                    <TableCell><CaseDiffBadge diffType={row.diffType} /></TableCell>
                    <TableCell className="text-right">
                      <Button type="button" size="sm" variant="outline" onClick={() => setSelectedCase(row)}>
                        查看详情
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!loadingResults && filteredCaseRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      当前筛选条件下没有差异 case。
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
      <CaseCompareDetailDialog row={selectedCase} open={Boolean(selectedCase)} onOpenChange={(nextOpen) => !nextOpen && setSelectedCase(null)} />
    </Dialog>
  );
}

function CaseCompareDetailDialog({ row, open, onOpenChange }: { row: CaseCompareRow | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  if (!row) {
    return null;
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Case 对比详情：{row.caseId}</DialogTitle>
          <DialogDescription>{row.question}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 md:grid-cols-3">
          <MetricCard label="Hit@K" value={`${formatNumber(caseHit(row.left.metrics))} → ${formatNumber(caseHit(row.right.metrics))}`} />
          <MetricCard label="Recall@K" value={`${formatNumber(caseRecall(row.left.metrics))} → ${formatNumber(caseRecall(row.right.metrics))}`} />
          <MetricCard label="nDCG@K" value={`${formatNumber(caseRank(row.left.metrics))} → ${formatNumber(caseRank(row.right.metrics))}`} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Section title="Run A 诊断">
            failure_reasons: {(row.left.diagnostics.failure_reasons ?? []).join("、") || "-"}<br />
            expected_chunk_ids: {(row.left.diagnostics.expected_chunk_ids ?? []).join(", ") || "-"}<br />
            top_k_chunk_ids: {(row.left.diagnostics.top_k_chunk_ids ?? []).join(", ") || "-"}<br />
            top_k_matched_chunk_ids: {(row.left.diagnostics.top_k_matched_chunk_ids ?? []).join(", ") || "-"}<br />
            retrieved_chunk_ids: {(row.left.diagnostics.retrieved_chunk_ids ?? []).join(", ") || "-"}<br />
            matched_chunk_ids: {(row.left.diagnostics.matched_chunk_ids ?? []).join(", ") || "-"}
          </Section>
          <Section title="Run B 诊断">
            failure_reasons: {(row.right.diagnostics.failure_reasons ?? []).join("、") || "-"}<br />
            expected_chunk_ids: {(row.right.diagnostics.expected_chunk_ids ?? []).join(", ") || "-"}<br />
            top_k_chunk_ids: {(row.right.diagnostics.top_k_chunk_ids ?? []).join(", ") || "-"}<br />
            top_k_matched_chunk_ids: {(row.right.diagnostics.top_k_matched_chunk_ids ?? []).join(", ") || "-"}<br />
            retrieved_chunk_ids: {(row.right.diagnostics.retrieved_chunk_ids ?? []).join(", ") || "-"}<br />
            matched_chunk_ids: {(row.right.diagnostics.matched_chunk_ids ?? []).join(", ") || "-"}
          </Section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EvalRunDetailDialog({ run, results, open, onOpenChange, onOpenCase }: { run: EvalRun | null; results: EvalRunResult[]; open: boolean; onOpenChange: (open: boolean) => void; onOpenCase: (result: EvalRunResult) => void }) {
  const [filter, setFilter] = useState("all");
  const filtered = results.filter((item) => filter === "all" || item.diagnostics.failure_reasons?.includes(filter));
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>评估详情：{run?.run_id}</DialogTitle>
          <DialogDescription>
            配置：configured_k={run?.rag_config?.configured_k ?? "-"} | retrieval_top_n={run?.rag_config?.retrieval_top_n ?? "-"} | threshold={run?.rag_config?.similarity_threshold ?? "-"} | rerank={run?.rag_config?.rerank_enabled ? "开启" : "关闭"} | case并发={formatConfigValue((run?.rag_config as Record<string, unknown> | undefined)?.case_concurrency)} | 提交批次={formatConfigValue((run?.rag_config as Record<string, unknown> | undefined)?.commit_batch_size)}
          </DialogDescription>
        </DialogHeader>
        {run ? <SummaryGrid run={run} /> : null}
        {run ? <TimingSummaryCard run={run} /> : null}
        <Separator />
        <div className="flex flex-wrap gap-2">
          {[
            ["all", "全部"],
            ["miss", "未命中"],
            ["low_recall", "低召回"],
            ["filtered_low_recall", "过滤误杀"],
            ["low_rank", "低排序"],
            ["zero_effective_k", "Effective K=0"],
            ["threshold_filtered", "阈值过滤"],
            ["too_many_noise_chunks", "噪声过多"]
          ].map(([value, label]) => (
            <Button key={value} type="button" size="sm" variant={filter === value ? "default" : "outline"} onClick={() => setFilter(value)}>
              {label}
            </Button>
          ))}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>case_id</TableHead>
              <TableHead>问题</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>命中</TableHead>
              <TableHead>Recall</TableHead>
              <TableHead>nDCG</TableHead>
              <TableHead>Filtered P</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.case_id}>
                <TableCell className="whitespace-nowrap text-xs">{item.case_id}</TableCell>
                <TableCell className="max-w-[300px] truncate" title={item.question}>{item.question}</TableCell>
                <TableCell><Badge variant="secondary">{item.eval_type}</Badge></TableCell>
                <TableCell>{caseHit(item.metrics) ? "是" : "否"}</TableCell>
                <TableCell>{formatNumber(caseRecall(item.metrics))}</TableCell>
                <TableCell>{formatNumber(caseRank(item.metrics))}</TableCell>
                <TableCell>{formatNumber(caseFilteredPrecision(item.metrics))}</TableCell>
                <TableCell className="text-right">
                  <Button type="button" size="sm" variant="outline" onClick={() => onOpenCase(item)}>
                    查看
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}

function CaseDiagnosticsDrawer({ result, open, onOpenChange }: { result: EvalRunResult | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Case 详情：{result?.case_id}</SheetTitle>
          <SheetDescription>对比期望 chunk 和实际召回 chunk，定位检索失败原因。</SheetDescription>
        </SheetHeader>
        {result ? (
          <div className="space-y-5 p-4">
            <Section title="问题">{result.question}</Section>
            <Section title="基础信息">
              eval_type: {result.eval_type}<br />
              question_style: {result.question_style}<br />
              difficulty: {result.difficulty}<br />
              category: {result.category}
            </Section>
            <Section title="本 Case 指标">
              Hit@K: {formatNumber(caseHit(result.metrics))}<br />
              Recall@K: {formatNumber(caseRecall(result.metrics))}<br />
              {caseRankLabel(result.metrics)}: {formatNumber(caseRank(result.metrics))}<br />
              Filtered Precision: {formatNumber(caseFilteredPrecision(result.metrics))}<br />
              Filtered Recall: {formatNumber(caseFilteredRecall(result.metrics))}<br />
              Error Count: {formatCount(result.metrics.error_count)}
            </Section>
            <ChunkList title="期望召回 chunks" ids={result.diagnostics.expected_chunk_ids} />
            <ChunkList title="过滤前 Top-K chunks" ids={result.diagnostics.top_k_chunk_ids ?? result.diagnostics.retrieved_chunk_ids} />
            <section className="space-y-2">
              <h3 className="text-sm font-semibold">过滤后 contexts</h3>
              {(result.diagnostics.retrieved_contexts ?? []).map((item, index) => (
                <div key={`${item.chunk_id}-${index}`} className="rounded-lg border p-3 text-sm">
                  <div className="font-medium">{index + 1}. {item.chunk_id} score={formatNumber(item.score)} {item.matched ? "命中" : "未命中"}</div>
                  <div className="mt-1 text-muted-foreground">{item.content || "-"}</div>
                </div>
              ))}
            </section>
            <Section title="诊断结论">{(result.diagnostics.failure_reasons ?? []).join("、") || "本 case 未发现明显检索问题。"}</Section>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function SummaryGrid({ run }: { run: EvalRun }) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      <MetricCard label="Success Rate" value={formatPercent(summarySuccessRate(run.summary))} />
      <MetricCard label="Hit@K" value={formatPercent(summaryHit(run.summary))} />
      <MetricCard label="Recall@K" value={formatPercent(summaryRecall(run.summary))} />
      <MetricCard label={summaryRankLabel(run.summary)} value={formatNumber(summaryRank(run.summary))} />
      <MetricCard label="Filtered Precision" value={formatPercent(summaryFilteredPrecision(run.summary))} />
      <MetricCard label="Filtered Recall" value={formatPercent(summaryFilteredRecall(run.summary))} />
      <MetricCard label="Filtered Avg K" value={formatNumber(summaryFilteredAvgK(run.summary))} />
      <MetricCard label="Empty Context Rate" value={formatPercent(summaryEmptyContextRate(run.summary))} />
      <MetricCard label="Errors" value={formatCount(run.summary.error_count)} />
    </div>
  );
}

function TimingSummaryCard({ run }: { run: EvalRun }) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard label="总耗时" value={formatDurationFromMs(run.timing?.total_ms)} />
        <MetricCard label="检索累计耗时" value={formatDurationFromMs(run.timing?.retrieve_ms)} />
        <MetricCard label="提交累计耗时" value={formatDurationFromMs(run.timing?.commit_ms)} />
        <MetricCard label="汇总耗时" value={formatDurationFromMs(run.timing?.summary_ms)} />
      </div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-6 text-slate-600">
        说明：总耗时是本次评估真实运行时间；检索累计耗时是所有 case 检索阶段的时间累加，在并发执行时可能大于总耗时。
      </div>
    </div>
  );
}

function DistributionEditor({ title, value, onChange, labels, onReset }: { title?: string; value: Distribution; onChange: (value: Distribution) => void; labels: Record<string, string>; onReset?: () => void }) {
  return (
    <section className="space-y-2">
      {title ? <div className="flex items-center justify-between"><Label>{title}</Label>{onReset ? <Button type="button" size="sm" variant="ghost" onClick={onReset}>恢复推荐值</Button> : null}</div> : null}
      <div className="grid gap-2">
        {Object.entries(value).map(([key, raw]) => (
          <div key={key} className="grid grid-cols-[1fr_120px] items-center gap-3">
            <span className="text-sm">{labels[key] ?? key}</span>
            <Input type="number" min={0} max={100} value={Math.round(raw * 100)} onChange={(event) => onChange({ ...value, [key]: Number(event.target.value) / 100 })} />
          </div>
        ))}
      </div>
      <div className={isDistributionValid(value) ? "text-xs text-green-700" : "text-xs text-red-600"}>合计：{Math.round(sumDistribution(value) * 100)}%</div>
    </section>
  );
}

function GeneratePreview({ totalCount, evalTypeDist, questionStyleDist, difficultyDist, categoryDist }: { totalCount: number; evalTypeDist: Distribution; questionStyleDist: Distribution; difficultyDist: Distribution; categoryDist: Distribution }) {
  return (
    <div className="space-y-4 text-sm">
      <p className="font-medium">预计生成：{totalCount} 条</p>
      <PreviewBlock title="eval_type" total={totalCount} value={evalTypeDist} />
      <PreviewBlock title="question_style" total={totalCount} value={questionStyleDist} />
      <PreviewBlock title="difficulty" total={totalCount} value={difficultyDist} />
      <PreviewBlock title="category" total={totalCount} value={categoryDist} />
      <div className="rounded-lg border bg-muted/30 p-3">
        <div className="font-medium">示例案例</div>
        <div className="mt-2 text-muted-foreground">question: 下单后还能改规格吗？</div>
        <div className="text-muted-foreground">expected_retrieved_chunk_ids: [chunk_订单相关_2_001]</div>
      </div>
    </div>
  );
}

function PreviewBlock({ title, total, value }: { title: string; total: number; value: Distribution }) {
  return <div><div className="font-medium">{title}</div>{Object.entries(value).map(([key, weight]) => <div key={key} className="text-muted-foreground">{key}: {Math.round(total * weight)} 条</div>)}</div>;
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <div className="grid gap-2"><Label>{label}</Label><Input value={value} onChange={(event) => onChange(event.target.value)} /></div>;
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <div className="grid gap-2"><Label>{label}</Label><Input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} /></div>;
}

function ReadOnly({ label, value }: { label: string; value: string }) {
  return <div className="grid gap-2"><Label>{label}</Label><div className="rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">{value}</div></div>;
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border bg-white p-3"><div className="text-xs text-muted-foreground">{label}</div><div className="mt-1 text-xl font-semibold text-gray-950">{value}</div></div>;
}

function RunStatusBadge({ status }: { status?: EvalRun["status"] }) {
  if (status === "running") {
    return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">运行中</Badge>;
  }
  if (status === "failed") {
    return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">失败</Badge>;
  }
  return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">完成</Badge>;
}

function CaseDiffBadge({ diffType }: { diffType: CaseDiffType }) {
  if (diffType === "improved") {
    return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">变好</Badge>;
  }
  if (diffType === "regressed") {
    return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">变差</Badge>;
  }
  return <Badge variant="secondary">无变化</Badge>;
}

function formatProgress(run: EvalRun) {
  const completed = run.progress?.completed_cases ?? (run.status === "completed" ? run.summary.total : 0);
  const total = run.progress?.total_cases ?? run.summary.total ?? 0;
  const percent = run.progress?.percent ?? (total ? completed / total : 0);
  return `${completed}/${total} (${Math.round(percent * 100)}%)`;
}

function progressPercent(run: EvalRun) {
  const percent = run.progress?.percent ?? 0;
  return Math.max(0, Math.min(100, Math.round(percent * 100)));
}

function formatRunDuration(run: EvalRun) {
  if (run.timing?.total_ms) {
    return formatDurationFromMs(run.timing.total_ms);
  }
  if (run.started_at && run.status === "running") {
    const elapsed = Date.now() - new Date(run.started_at).getTime();
    return `已运行 ${formatDurationFromMs(elapsed)}`;
  }
  return "-";
}

function summaryRecall(summary: EvalRunSummary) {
  return firstNumber(summary.recall_at_k, summary.context_recall_at_k);
}

function summaryRank(summary: EvalRunSummary) {
  return firstNumber(summary.ndcg_at_k, summary.mrr_at_k);
}

function summaryRankLabel(summary: EvalRunSummary) {
  return summary.ndcg_at_k == null && summary.mrr_at_k != null ? "MRR@K" : "nDCG@K";
}

function summaryFilteredPrecision(summary: EvalRunSummary) {
  return firstNumber(summary.filtered_precision, summary.precision_at_effective_k, summary.precision_at_configured_k);
}

function summaryFilteredRecall(summary: EvalRunSummary) {
  return firstNumber(summary.filtered_recall, summary.context_recall_at_k);
}

function summaryFilteredAvgK(summary: EvalRunSummary) {
  return firstNumber(summary.filtered_avg_k, summary.avg_effective_k);
}

function summaryEmptyContextRate(summary: EvalRunSummary) {
  return firstNumber(summary.filtered_empty_context_rate, summary.zero_context_rate);
}

function summarySuccessRate(summary: EvalRunSummary) {
  return firstNumber(summary.success_rate);
}

function summaryHit(summary: EvalRunSummary) {
  return firstNumber(summary.hit_at_k);
}

function caseRecall(metrics: EvalCaseMetrics) {
  return firstNumber(metrics.recall_at_k, metrics.context_recall_at_k);
}

function caseRank(metrics: EvalCaseMetrics) {
  return firstNumber(metrics.ndcg_at_k, metrics.mrr_at_k);
}

function caseRankLabel(metrics: EvalCaseMetrics) {
  return metrics.ndcg_at_k == null && metrics.mrr_at_k != null ? "MRR@K" : "nDCG@K";
}

function caseFilteredPrecision(metrics: EvalCaseMetrics) {
  return firstNumber(metrics.filtered_precision, metrics.precision_at_effective_k, metrics.precision_at_configured_k);
}

function caseFilteredRecall(metrics: EvalCaseMetrics) {
  return firstNumber(metrics.filtered_recall, metrics.context_recall_at_k);
}

function caseHit(metrics: EvalCaseMetrics) {
  return firstNumber(metrics.hit_at_k);
}

function firstNumber(...values: Array<number | undefined>) {
  return values.find((value) => value != null && Number.isFinite(value));
}

function metricChanged(left?: number, right?: number) {
  return Math.abs((right ?? 0) - (left ?? 0)) > 0.000001;
}

function metricDiff(left?: number, right?: number) {
  const diff = (right ?? 0) - (left ?? 0);
  return Math.abs(diff) > 0.000001 ? diff : 0;
}

function buildCompareRows(left: EvalRun, right: EvalRun) {
  return [
    compareRow("状态", formatRunStatus(left.status), formatRunStatus(right.status)),
    compareRow("进度", formatProgress(left), formatProgress(right)),
    compareRow("Success Rate", formatPercent(summarySuccessRate(left.summary)), formatPercent(summarySuccessRate(right.summary)), summarySuccessRate(left.summary), summarySuccessRate(right.summary), "percent"),
    compareRow("Hit@K", formatPercent(summaryHit(left.summary)), formatPercent(summaryHit(right.summary)), summaryHit(left.summary), summaryHit(right.summary), "percent"),
    compareRow("Recall@K", formatPercent(summaryRecall(left.summary)), formatPercent(summaryRecall(right.summary)), summaryRecall(left.summary), summaryRecall(right.summary), "percent"),
    compareRow("nDCG@K", formatNumber(summaryRank(left.summary)), formatNumber(summaryRank(right.summary)), summaryRank(left.summary), summaryRank(right.summary), "number"),
    compareRow("Filtered Precision", formatPercent(summaryFilteredPrecision(left.summary)), formatPercent(summaryFilteredPrecision(right.summary)), summaryFilteredPrecision(left.summary), summaryFilteredPrecision(right.summary), "percent"),
    compareRow("Filtered Recall", formatPercent(summaryFilteredRecall(left.summary)), formatPercent(summaryFilteredRecall(right.summary)), summaryFilteredRecall(left.summary), summaryFilteredRecall(right.summary), "percent"),
    compareRow("Empty Context Rate", formatPercent(summaryEmptyContextRate(left.summary)), formatPercent(summaryEmptyContextRate(right.summary)), summaryEmptyContextRate(left.summary), summaryEmptyContextRate(right.summary), "percent"),
    compareRow("Filtered Avg K", formatNumber(summaryFilteredAvgK(left.summary)), formatNumber(summaryFilteredAvgK(right.summary)), summaryFilteredAvgK(left.summary), summaryFilteredAvgK(right.summary), "number"),
    compareRow("Errors", formatCount(left.summary.error_count), formatCount(right.summary.error_count), left.summary.error_count, right.summary.error_count, "number"),
    compareRow("configured_k", formatConfigValue(left.rag_config?.configured_k), formatConfigValue(right.rag_config?.configured_k)),
    compareRow("retrieval_top_n", formatConfigValue(left.rag_config?.retrieval_top_n), formatConfigValue(right.rag_config?.retrieval_top_n)),
    compareRow("similarity_threshold", formatConfigValue(left.rag_config?.similarity_threshold), formatConfigValue(right.rag_config?.similarity_threshold)),
    compareRow("rerank_enabled", formatConfigValue(left.rag_config?.rerank_enabled), formatConfigValue(right.rag_config?.rerank_enabled)),
    compareRow("case并发", formatConfigValue((left.rag_config as Record<string, unknown> | undefined)?.case_concurrency), formatConfigValue((right.rag_config as Record<string, unknown> | undefined)?.case_concurrency)),
    compareRow("提交批次", formatConfigValue((left.rag_config as Record<string, unknown> | undefined)?.commit_batch_size), formatConfigValue((right.rag_config as Record<string, unknown> | undefined)?.commit_batch_size)),
    compareRow("总耗时", formatDurationFromMs(left.timing?.total_ms), formatDurationFromMs(right.timing?.total_ms), left.timing?.total_ms, right.timing?.total_ms, "duration"),
    compareRow("检索累计耗时", formatDurationFromMs(left.timing?.retrieve_ms), formatDurationFromMs(right.timing?.retrieve_ms), left.timing?.retrieve_ms, right.timing?.retrieve_ms, "duration"),
    compareRow("提交累计耗时", formatDurationFromMs(left.timing?.commit_ms), formatDurationFromMs(right.timing?.commit_ms), left.timing?.commit_ms, right.timing?.commit_ms, "duration"),
    compareRow("汇总耗时", formatDurationFromMs(left.timing?.summary_ms), formatDurationFromMs(right.timing?.summary_ms), left.timing?.summary_ms, right.timing?.summary_ms, "duration"),
  ];
}

function buildCaseCompareRows(leftResults: EvalRunResult[], rightResults: EvalRunResult[]): CaseCompareRow[] {
  const leftMap = new Map(leftResults.map((item) => [item.case_id, item]));
  const rightMap = new Map(rightResults.map((item) => [item.case_id, item]));
  return Array.from(leftMap.keys())
    .filter((caseId) => rightMap.has(caseId))
    .map((caseId) => {
      const left = leftMap.get(caseId)!;
      const right = rightMap.get(caseId)!;
      return {
        caseId,
        question: right.question || left.question,
        diffType: resolveCaseDiffType(left, right),
        left,
        right,
      };
    });
}

function resolveCaseDiffType(left: EvalRunResult, right: EvalRunResult): CaseDiffType {
  const hitDiff = metricDiff(caseHit(left.metrics), caseHit(right.metrics));
  if (hitDiff > 0) return "improved";
  if (hitDiff < 0) return "regressed";
  const recallDiff = metricDiff(caseRecall(left.metrics), caseRecall(right.metrics));
  if (recallDiff > 0) return "improved";
  if (recallDiff < 0) return "regressed";
  const rankDiff = metricDiff(caseRank(left.metrics), caseRank(right.metrics));
  if (rankDiff > 0) return "improved";
  if (rankDiff < 0) return "regressed";
  return "unchanged";
}

function summarizeCaseDiffs(rows: CaseCompareRow[]) {
  return rows.reduce(
    (summary, row) => {
      summary[row.diffType] += 1;
      return summary;
    },
    { improved: 0, regressed: 0, unchanged: 0 }
  );
}

function compareRow(label: string, left: string, right: string, leftValue?: number, rightValue?: number, mode?: "percent" | "number" | "duration") {
  const delta = formatDelta(leftValue, rightValue, mode);
  return {
    label,
    left,
    right,
    delta: delta.text,
    deltaTone: delta.tone,
  };
}

function formatDelta(left?: number, right?: number, mode?: "percent" | "number" | "duration") {
  if (left == null || right == null || !Number.isFinite(left) || !Number.isFinite(right)) {
    return { text: "-", tone: "neutral" as const };
  }
  const diff = right - left;
  if (Math.abs(diff) < 0.000001) {
    return { text: "无变化", tone: "neutral" as const };
  }
  if (mode === "duration") {
    const seconds = Math.round(diff / 1000);
    return { text: `${seconds > 0 ? "+" : ""}${seconds}秒`, tone: diff < 0 ? "positive" as const : "negative" as const };
  }
  if (mode === "percent") {
    const percentPoints = Math.round(diff * 100);
    return { text: `${percentPoints > 0 ? "+" : ""}${percentPoints}%`, tone: diff > 0 ? "positive" as const : "negative" as const };
  }
  return { text: `${diff > 0 ? "+" : ""}${diff.toFixed(2)}`, tone: diff > 0 ? "positive" as const : "negative" as const };
}

function formatRunStatus(status?: EvalRun["status"]) {
  if (status === "running") return "运行中";
  if (status === "failed") return "失败";
  return "完成";
}

function formatDurationFromMs(value?: number) {
  const totalMs = Number(value ?? 0);
  if (!Number.isFinite(totalMs) || totalMs <= 0) {
    return "-";
  }
  const totalSeconds = Math.round(totalMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes <= 0) {
    return `${seconds}秒`;
  }
  return `${minutes}分${seconds}秒`;
}

function formatConfigValue(value: unknown) {
  return value == null ? "-" : String(value);
}

function deltaClassName(tone: "positive" | "negative" | "neutral") {
  if (tone === "positive") {
    return "text-emerald-600 font-medium";
  }
  if (tone === "negative") {
    return "text-rose-600 font-medium";
  }
  return "text-muted-foreground";
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="space-y-2"><h3 className="text-sm font-semibold">{title}</h3><div className="rounded-lg border p-3 text-sm text-muted-foreground">{children}</div></section>;
}

function ChunkList({ title, ids }: { title: string; ids: string[] }) {
  return <Section title={title}>{ids.map((id, index) => <div key={id}>{index + 1}. {id}</div>)}</Section>;
}

function SearchField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <Label className="whitespace-nowrap text-sm text-[#666]">{label}</Label>
      <div className="w-full min-w-0 sm:w-[180px]">{children}</div>
    </div>
  );
}

function filterEvalSets(items: EvalSet[], query: EvalSetQuery) {
  const name = query.name.trim().toLowerCase();
  const sourcePath = query.sourcePath.trim().toLowerCase();
  const createdBy = query.createdBy.trim().toLowerCase();
  return items.filter((item) => {
    const status = String((item as EvalSet & { status?: string }).status ?? "ready");
    if (name && !`${item.name} ${item.eval_set_id}`.toLowerCase().includes(name)) {
      return false;
    }
    if (sourcePath && !String(item.source_path ?? "").toLowerCase().includes(sourcePath)) {
      return false;
    }
    if (createdBy && !String(item.created_by ?? "admin").toLowerCase().includes(createdBy)) {
      return false;
    }
    if (query.status !== "all" && status !== query.status) {
      return false;
    }
    return true;
  });
}

function buildVisiblePages(currentPage: number, totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }
  if (currentPage >= totalPages - 3) {
    return [1, "ellipsis", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
}

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function isDistributionValid(value: Distribution) {
  return Math.abs(sumDistribution(value) - 1) < 0.000001;
}

function sumDistribution(value: Distribution) {
  return Object.values(value).reduce((sum, item) => sum + item, 0);
}

function formatPercent(value?: number) {
  return `${Math.round((value ?? 0) * 100)}%`;
}

function formatNumber(value?: number) {
  return Number(value ?? 0).toFixed(2);
}

function formatCount(value?: number) {
  return String(Math.round(value ?? 0));
}

function formatDate(value?: string) {
  return value ? new Date(value).toLocaleString("zh-CN") : "-";
}
