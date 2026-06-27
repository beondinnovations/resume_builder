"use client";

import { useEffect, useRef, useState } from "react";
import { ResumePreview } from "./resume-preview";
import type { ResumeData } from "@/lib/resume-types";

const PAPER_WIDTH = 816; // 8.5in at 96dpi

export function ScaledPreview({ data, scale = 1 }: { data: ResumeData; scale?: number }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(1056);

  useEffect(() => {
    if (!contentRef.current) return;
    const update = () => setContentHeight(contentRef.current?.clientHeight ?? 1056);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [data, scale]);

  return (
    <div className="inline-block align-top">
      <div
        className="overflow-hidden"
        style={{ height: contentHeight * scale, width: PAPER_WIDTH * scale }}
      >
        <div
          ref={contentRef}
          className="origin-top-left transition-transform duration-200"
          style={{ transform: `scale(${scale})`, width: PAPER_WIDTH }}
        >
          <ResumePreview data={data} />
        </div>
      </div>
    </div>
  );
}
