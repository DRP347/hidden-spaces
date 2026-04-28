"use client";

import { motion } from "framer-motion";

import { categoryMeta } from "@/lib/categories";
import { placeCategories, type PlaceCategory } from "@/types/placeTypes";

type FilterChipsProps = {
  activeCategory: PlaceCategory | null;
  onChange: (category: PlaceCategory | null) => void;
};

export function FilterChips({ activeCategory, onChange }: FilterChipsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.16, type: "spring", stiffness: 120, damping: 18 }}
      className="pointer-events-auto mx-auto flex max-w-[860px] gap-2 overflow-x-auto rounded-full p-1 hide-scrollbar"
      aria-label="Filter hidden spaces by category"
    >
      <FilterChip
        label="All"
        active={!activeCategory}
        accent="#247B75"
        onClick={() => onChange(null)}
      />
      {placeCategories.map((category) => (
        <FilterChip
          key={category}
          label={category}
          active={activeCategory === category}
          accent={categoryMeta[category].accent}
          onClick={() => onChange(category)}
        />
      ))}
    </motion.div>
  );
}

function FilterChip({
  label,
  active,
  accent,
  onClick,
}: {
  label: string;
  active: boolean;
  accent: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      layout
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      className="relative h-10 shrink-0 rounded-full px-4 text-xs font-semibold text-ink/78 transition hover:text-ink"
      style={{
        background: active
          ? "rgba(255, 253, 247, 0.72)"
          : "rgba(255, 253, 247, 0.44)",
        border: active
          ? `1px solid ${accent}55`
          : "1px solid rgba(255, 255, 255, 0.5)",
        boxShadow: active
          ? `0 10px 26px ${accent}18, inset 0 1px 0 rgba(255,255,255,0.78)`
          : "inset 0 1px 0 rgba(255,255,255,0.54)",
        backdropFilter: "blur(12px) saturate(130%)",
      }}
    >
      {label}
      {active ? (
        <motion.span
          layoutId="filter-underline"
          className="absolute inset-x-4 -bottom-1 h-0.5 rounded-full"
          style={{ backgroundColor: accent }}
          transition={{ type: "spring", stiffness: 180, damping: 20 }}
        />
      ) : null}
    </motion.button>
  );
}
