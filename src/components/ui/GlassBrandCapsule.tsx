"use client";

import { motion } from "framer-motion";

export function GlassBrandCapsule() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 130, damping: 18 }}
      className="glass-light field-grain pointer-events-auto flex h-16 items-center gap-3 rounded-[24px] px-4 text-ink sm:h-[70px] sm:px-5"
    >
      <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-coconut/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.88)]">
        <motion.span
          className="absolute h-7 w-7 rounded-full border border-teal/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        />
        <span className="h-2.5 w-2.5 rounded-full bg-teal shadow-[0_0_14px_rgba(36,123,117,0.34)]" />
      </span>
      <span className="leading-none">
        <span className="block font-display text-[28px] font-semibold leading-[0.9] tracking-[-0.03em] text-ink sm:text-[32px]">
          Hidden Spaces
        </span>
        <span className="mt-1.5 block text-[11px] font-semibold uppercase tracking-[0.22em] text-mist">
          Daman field map
        </span>
      </span>
    </motion.div>
  );
}
