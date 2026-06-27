"use client";

import { useState } from "react";
import { Loader2, Target, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { scoreResume } from "@/lib/ai.functions";
import { resumeToText } from "@/lib/parse-resume";
import { useResumeStore } from "@/lib/resume-store";

type Score = {
  ats: number;
  readability: number;
  keyword: number;
  professionalism: number;
  missingKeywords: string[];
  suggestions: string[];
  matchPercent: number;
};

export function ScorePanel() {
  const { data } = useResumeStore();
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Score | null>(null);

  async function run() {
    setLoading(true);
    try {
      const text = resumeToText(data);
      const res = await scoreResume({ resumeText: text, jobDescription: jd || undefined });
      setResult(res);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <Card className="p-5 space-y-4 bg-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl tracking-tight flex items-center gap-2">
              <TrendingUp className="size-5" />
              ATS & Job Match
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Paste a job description for keyword match analysis.
            </p>
          </div>
          <Button
            onClick={run}
            disabled={loading}
            className="gap-1.5 cursor-pointer shrink-0 transition-all duration-200"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Target className="size-4" />}
            Analyze
          </Button>
        </div>
        <Textarea
          rows={5}
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste a job description here to compare against your resume..."
        />
      </Card>

      {result && (
        <Card className="p-5 space-y-5 bg-card">
          <div className="grid grid-cols-2 gap-4">
            <ScoreRing label="ATS" value={result.ats} />
            <ScoreRing label="Readability" value={result.readability} />
            <ScoreRing label="Keywords" value={result.keyword} />
            <ScoreRing label="Professional" value={result.professionalism} />
          </div>

          {jd && (
            <div className="rounded-lg border border-border bg-secondary/30 p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                JD Match
              </div>
              <div className="text-4xl font-display">{result.matchPercent}%</div>
            </div>
          )}

          {result.missingKeywords.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium mb-2">
                <AlertCircle className="size-4" />
                Missing keywords
              </div>
              <div className="flex flex-wrap gap-1.5">
                {result.missingKeywords.map((k, i) => (
                  <Badge key={i} variant="outline" className="text-muted-foreground">
                    {k}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {result.suggestions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium mb-2">
                <CheckCircle2 className="size-4" />
                Suggestions
              </div>
              <ul className="text-sm space-y-2">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

function ScoreRing({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? "bg-emerald-500" : value >= 60 ? "bg-amber-500" : "bg-rose-500";
  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-3">
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-medium">{value}</span>
      </div>
      <Progress value={value} className="h-2" />
      <div className={`mt-2 h-1 w-full rounded-full ${color} opacity-20`} />
    </div>
  );
}
