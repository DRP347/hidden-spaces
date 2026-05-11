"use client";

import { spotCategories, type SpotCategory } from "@/types/spot";

export type ActiveCategory = "All" | SpotCategory;

export function CategoryRail({
  activeCategory,
  counts,
  onChange,
}: {
  activeCategory: ActiveCategory;
  counts: Record<string, number>;
  onChange: (category: ActiveCategory) => void;
}) {
  const categories: ActiveCategory[] = [
    "All",
    ...spotCategories.filter(
      (category) => (counts[category] ?? 0) > 0 || activeCategory === category,
    ),
  ];

  return (
    <section
      className="category-rail relative -mx-4 overflow-x-auto px-4 hide-scrollbar sm:mx-0 sm:overflow-visible sm:px-0"
      aria-label="Filter hidden spaces by category"
    >
      <div className="flex min-w-max gap-2 py-2 sm:min-w-0 sm:flex-wrap">
        {categories.map((category) => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onChange(category)}
              className={`glass-chip min-h-11 whitespace-nowrap px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C] active:scale-[0.98] ${
                isActive
                  ? "glass-chip-active"
                  : "text-[#473b2e] hover:-translate-y-0.5 hover:bg-white/76"
              }`}
              aria-pressed={isActive}
            >
              <span>{category}</span>
              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                  isActive ? "bg-white/18 text-white" : "bg-[#EFF4EF] text-[#4d6d62]"
                }`}
              >
                {counts[category] ?? 0}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
