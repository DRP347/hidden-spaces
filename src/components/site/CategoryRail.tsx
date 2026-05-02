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
  const categories: ActiveCategory[] = ["All", ...spotCategories];

  return (
    <section className="relative -mx-4 overflow-x-auto px-4 hide-scrollbar sm:mx-0 sm:px-0" aria-label="Filter hidden spaces by category">
      <div className="flex min-w-max gap-2 py-2">
        {categories.map((category) => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onChange(category)}
              className={`group min-h-11 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C] active:scale-[0.98] ${
                isActive
                  ? "border-[#1E4E8C] bg-[#1E4E8C] text-white shadow-[0_16px_36px_rgba(30,78,140,0.22)]"
                  : "border-[#E3D4BE] bg-[#FFFDF8]/78 text-[#473b2e] shadow-sm hover:-translate-y-0.5 hover:border-[#D99A3D] hover:bg-white"
              }`}
              aria-pressed={isActive}
            >
              <span>{category}</span>
              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                  isActive ? "bg-white/18 text-white" : "bg-[#F5EFE6] text-[#756651]"
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
