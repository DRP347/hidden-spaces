"use client";

import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { useEffect, useState } from "react";

function getMood(hour: number) {
  if (hour >= 5 && hour < 9) return "Soft morning";
  if (hour >= 16 && hour < 19) return "Golden hour soon";
  if (hour >= 19 && hour < 22) return "Blue hour calm";
  return "Quiet map";
}

export function MoodChip() {
  const [time, setTime] = useState("6:12 PM");
  const [mood, setMood] = useState("Golden hour soon");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setMood(getMood(now.getHours()));
      setTime(
        now.toLocaleTimeString("en-IN", {
          hour: "numeric",
          minute: "2-digit",
        }),
      );
    };

    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12, type: "spring", stiffness: 120, damping: 18 }}
      className="glass-light-quiet field-grain pointer-events-auto hidden h-14 items-center gap-3 rounded-full px-4 text-ink md:flex"
    >
      <span className="grid h-9 w-9 place-items-center rounded-full bg-teal/10 text-teal">
        <Compass className="h-4 w-4" strokeWidth={1.8} />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-mist">
          Daman now
        </span>
        <span className="mt-0.5 block whitespace-nowrap text-sm font-semibold text-ink">
          {mood} · {time}
        </span>
      </span>
    </motion.div>
  );
}
