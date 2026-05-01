"use client";

import { useEffect, useMemo, useState } from "react";

function getDamanTime() {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());
}

function getMood() {
  const hour = Number(
    new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      hourCycle: "h23",
    }).format(new Date()),
  );

  if (hour >= 5 && hour < 9) return "morning calm";
  if (hour >= 16 && hour < 19) return "golden hour soon";
  if (hour >= 19 && hour < 22) return "evening food trail";
  return "quiet planning time";
}

export function LiveDamanBadge() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTime(getDamanTime());
    update();
    const timer = window.setInterval(update, 30000);

    return () => window.clearInterval(timer);
  }, []);

  const mood = useMemo(() => (time ? getMood() : "Daman field time"), [time]);

  return (
    <div
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-[#151515] shadow-[0_16px_40px_rgba(76,53,24,0.12)] backdrop-blur-md"
      aria-live="polite"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D99A3D] opacity-45" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#D99A3D]" />
      </span>
      <span>{time ?? "Daman local time"}</span>
      <span className="text-[#6d604f]">·</span>
      <span className="text-[#395B45]">{mood}</span>
    </div>
  );
}
