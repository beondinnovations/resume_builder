import { TEMPLATES, type TemplateId } from "@/lib/resume-types";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function TemplatePicker({
  value,
  onChange,
}: {
  value: TemplateId;
  onChange: (t: TemplateId) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-3">
      {TEMPLATES.map((t) => {
        const active = value === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={cn(
              "group relative text-left border rounded-lg overflow-hidden bg-card transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              active
                ? "border-foreground ring-1 ring-foreground shadow-sm"
                : "border-border hover:border-foreground/50 hover:shadow-sm",
            )}
          >
            <div className="aspect-[3/4] bg-white p-2.5">
              <ThumbPreview kind={t.id} />
            </div>
            <div className="p-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium leading-tight">{t.name}</span>
                {active && (
                  <span className="size-5 rounded-full bg-foreground text-background grid place-items-center">
                    <Check className="size-3" />
                  </span>
                )}
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">{t.description}</div>
              <div className="mt-2 inline-flex items-center rounded-full border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                ATS {t.ats}/100
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ThumbPreview({ kind }: { kind: TemplateId }) {
  const bar = "h-1 bg-neutral-200 rounded-sm";
  const dark = "h-1 bg-neutral-700 rounded-sm";
  const centered = kind === "executive" || kind === "academic";
  const tightSpacing = kind === "compact";
  const boxed = kind === "federal";
  const leftBar = kind === "technical-lead" || kind === "creative-clean";
  const doubleRule = kind === "executive";
  return (
    <div
      className={`h-full w-full text-neutral-800 flex flex-col ${tightSpacing ? "gap-1" : "gap-1.5"}`}
    >
      <div className={centered ? "text-center" : ""}>
        <div
          className={cn(
            "h-2 w-3/5 bg-neutral-800 rounded-sm",
            centered && "mx-auto",
            kind === "minimalist" && "w-4/5",
          )}
        />
        <div className={cn("h-1 w-2/5 bg-neutral-400 rounded-sm mt-1", centered && "mx-auto")} />
      </div>
      <div
        className={cn(
          "my-1",
          doubleRule ? "h-[3px] border-y border-neutral-400" : "h-px bg-neutral-300",
        )}
      />
      <div
        className={cn(
          dark,
          "w-1/4",
          boxed && "border border-neutral-700 bg-transparent w-1/3",
          leftBar && "border-l-2 border-neutral-700 bg-transparent pl-1 w-1/3",
        )}
      />
      <div className={bar} />
      <div className={bar + " w-11/12"} />
      <div className={bar + " w-10/12"} />
      <div
        className={cn(
          dark,
          "w-1/3 mt-1",
          boxed && "border border-neutral-700 bg-transparent",
          leftBar && "border-l-2 border-neutral-700 bg-transparent pl-1",
        )}
      />
      <div className={bar} />
      <div className={bar + " w-11/12"} />
      {(kind === "engineer" || kind === "graduate" || kind === "technical-lead") && (
        <>
          <div className={dark + " w-1/4 mt-1"} />
          <div className={bar} />
          <div className={bar + " w-3/4"} />
        </>
      )}
      <div className={dark + " w-1/4 mt-1"} />
      <div className={bar} />
      <div className={bar + " w-2/3"} />
    </div>
  );
}
