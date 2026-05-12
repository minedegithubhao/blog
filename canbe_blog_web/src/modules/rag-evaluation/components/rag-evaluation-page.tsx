"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, FlaskConical, Play, RefreshCcw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  checkStale,
  generateEvalSet,
  listEvalRunResults,
  listEvalRuns,
  listEvalSets,
  startEvalRun
} from "../api";
import type { EvalRun, EvalRunResult, EvalSet } from "../types";

export function RagEvaluationPage() {
  const [evalSets, setEvalSets] = useState<EvalSet[]>([]);
  const [runs, setRuns] = useState<EvalRun[]>([]);
  const [results, setResults] = useState<EvalRunResult[]>([]);
  const [selectedEvalSetId, setSelectedEvalSetId] = useState("");
  const [selectedRunId, setSelectedRunId] = useState("");
  const [name, setName] = useState("jd_help_eval_v1");
  const [totalCount, setTotalCount] = useState(20);
  const [seed, setSeed] = useState(20260511);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);

  const selectedEvalSet = useMemo(() => evalSets.find((item) => item.eval_set_id === selectedEvalSetId), [evalSets, selectedEvalSetId]);
  const selectedRun = useMemo(() => runs.find((item) => item.run_id === selectedRunId), [runs, selectedRunId]);
  const failedResults = useMemo(() => results.filter((item) => !item.ok), [results]);

  async function refreshEvalSets() {
    setLoading(true);
    try {
      const items = await listEvalSets();
      setEvalSets(items);
      if (!selectedEvalSetId && items[0]) {
        setSelectedEvalSetId(items[0].eval_set_id);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "加载评估集失败");
    } finally {
      setLoading(false);
    }
  }

  async function refreshRuns(evalSetId = selectedEvalSetId) {
    if (!evalSetId) {
      setRuns([]);
      setResults([]);
      return;
    }
    try {
      const items = await listEvalRuns(evalSetId);
      setRuns(items);
      setSelectedRunId(items[0]?.run_id ?? "");
      if (!items[0]) {
        setResults([]);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "加载运行历史失败");
    }
  }

  async function refreshResults(runId = selectedRunId) {
    if (!runId) {
      setResults([]);
      return;
    }
    try {
      setResults(await listEvalRunResults(runId));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "加载评估明细失败");
    }
  }

  useEffect(() => {
    void refreshEvalSets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void refreshRuns(selectedEvalSetId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEvalSetId]);

  useEffect(() => {
    void refreshResults(selectedRunId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRunId]);

  async function handleGenerate() {
    setBusy(true);
    try {
      const result = await generateEvalSet({ name, total_count: totalCount, seed });
      toast.success(`已生成评估集：${result.eval_set_id}`);
      await refreshEvalSets();
      setSelectedEvalSetId(result.eval_set_id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "生成评估集失败");
    } finally {
      setBusy(false);
    }
  }

  async function handleCheckStale() {
    if (!selectedEvalSetId) {
      toast.warning("请先选择评估集");
      return;
    }
    setBusy(true);
    try {
      const result = await checkStale(selectedEvalSetId);
      toast.success(`过期检查完成：有效 ${result.summary.valid ?? 0}，过期 ${result.summary.stale ?? 0}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "过期检查失败");
    } finally {
      setBusy(false);
    }
  }

  async function handleStartRun() {
    if (!selectedEvalSetId) {
      toast.warning("请先选择评估集");
      return;
    }
    setBusy(true);
    try {
      const result = await startEvalRun(selectedEvalSetId);
      toast.success(`评估完成，通过率 ${formatPercent(result.summary.passRate)}`);
      await refreshRuns(selectedEvalSetId);
      setSelectedRunId(result.run_id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "启动评估失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-950">RAG 评估实验室</h1>
          <p className="mt-1 text-sm text-muted-foreground">生成可追溯测试集，运行评估，并复核失败原因。当前先不上 RAGAS。</p>
        </div>
        <Button type="button" variant="outline" onClick={() => void refreshEvalSets()} disabled={loading}>
          <RefreshCcw className="h-4 w-4" />
          刷新
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FlaskConical className="h-4 w-4 text-primary" />
              生成测试集
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>名称</Label>
              <Input value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>数量</Label>
                <Input type="number" min={1} max={1000} value={totalCount} onChange={(event) => setTotalCount(Number(event.target.value))} />
              </div>
              <div className="grid gap-2">
                <Label>Seed</Label>
                <Input type="number" value={seed} onChange={(event) => setSeed(Number(event.target.value))} />
              </div>
            </div>
            <Button type="button" className="w-full" onClick={() => void handleGenerate()} disabled={busy}>
              生成测试案例集
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-4 w-4 text-primary" />
              当前评估集
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2 md:grid-cols-3">
              {evalSets.map((item) => (
                <button
                  key={item.eval_set_id}
                  type="button"
                  onClick={() => setSelectedEvalSetId(item.eval_set_id)}
                  className={`rounded-lg border p-3 text-left transition hover:border-primary ${item.eval_set_id === selectedEvalSetId ? "border-primary bg-primary/5" : "border-border bg-white"}`}
                >
                  <div className="truncate text-sm font-semibold text-gray-950">{item.name}</div>
                  <div className="mt-1 truncate text-xs text-muted-foreground">{item.eval_set_id}</div>
                  <div className="mt-3 flex gap-2 text-xs">
                    <Badge variant="secondary">总数 {item.summary?.total ?? 0}</Badge>
                    <Badge variant="secondary">有效 {item.summary?.validated ?? 0}</Badge>
                  </div>
                </button>
              ))}
              {!evalSets.length ? <div className="text-sm text-muted-foreground">暂无评估集，请先生成。</div> : null}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => void handleCheckStale()} disabled={!selectedEvalSetId || busy}>
                过期检查
              </Button>
              <Button type="button" onClick={() => void handleStartRun()} disabled={!selectedEvalSetId || busy}>
                <Play className="h-4 w-4" />
                一键运行评估
              </Button>
            </div>

            {selectedEvalSet ? (
              <div className="rounded-lg bg-muted/40 p-3 text-sm text-muted-foreground">
                数据源：{selectedEvalSet.source_path ?? "-"}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">运行历史</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {runs.map((run) => (
              <button
                key={run.run_id}
                type="button"
                onClick={() => setSelectedRunId(run.run_id)}
                className={`w-full rounded-lg border p-3 text-left transition hover:border-primary ${run.run_id === selectedRunId ? "border-primary bg-primary/5" : "border-border bg-white"}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold">{run.run_id}</span>
                  <MetricBadge value={run.summary.passRate} />
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <span>总数 {run.summary.total}</span>
                  <span>通过 {run.summary.passed}</span>
                  <span>越界 {run.summary.overreachViolations}</span>
                </div>
              </button>
            ))}
            {!runs.length ? <div className="text-sm text-muted-foreground">当前评估集还没有运行记录。</div> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">失败复核</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedRun ? (
              <div className="mb-4 grid gap-3 md:grid-cols-4">
                <SummaryCard label="通过率" value={formatPercent(selectedRun.summary.passRate)} />
                <SummaryCard label="命中率" value={formatPercent(selectedRun.summary.answerableHitRate)} />
                <SummaryCard label="兜底率" value={formatPercent(selectedRun.summary.fallbackRate)} />
                <SummaryCard label="来源完整率" value={formatPercent(selectedRun.summary.sourceCompletenessRate)} />
              </div>
            ) : null}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case</TableHead>
                  <TableHead>问题</TableHead>
                  <TableHead className="text-center">状态</TableHead>
                  <TableHead>失败原因</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(failedResults.length ? failedResults : results).slice(0, 20).map((item) => (
                  <TableRow key={item.case_id}>
                    <TableCell className="whitespace-nowrap text-xs">{item.case_id}</TableCell>
                    <TableCell className="max-w-[360px] truncate" title={item.query}>
                      {item.query}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.ok ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          通过
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          失败
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{item.failure_reasons?.length ? item.failure_reasons.join("，") : "-"}</TableCell>
                  </TableRow>
                ))}
                {!results.length ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      请选择运行记录。
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-white p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-xl font-semibold text-gray-950">{value}</div>
    </div>
  );
}

function MetricBadge({ value }: { value: number }) {
  const ok = value >= 0.9;
  return <Badge className={ok ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"}>{formatPercent(value)}</Badge>;
}

function formatPercent(value?: number) {
  return `${Math.round((value ?? 0) * 100)}%`;
}
