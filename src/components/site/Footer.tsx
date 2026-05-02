import { spotCategories } from "@/types/spot";

export function Footer() {
  return (
    <footer className="border-t border-[#e8dac5] bg-[#FFFDF8]" aria-labelledby="footer-title">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:py-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 id="footer-title" className="text-balance font-display text-[2.35rem] font-semibold leading-[0.98] tracking-[-0.04em] text-[#151515] sm:text-4xl">
            Hidden Spaces Daman
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5d5143]">
            A calm local discovery guide for Daman’s quiet beaches, Portuguese heritage corners, peaceful cafés, sunset points, hidden lanes, and food stops around Nani Daman and Moti Daman.
          </p>
          <p className="mt-4 text-sm font-semibold text-[#395B45]">
            Built as a living field map for slower weekends, photo walks, and local-first travel.
          </p>
        </div>
        <nav aria-label="Footer categories">
          <p className="text-sm font-bold text-[#151515]">Explore by mood</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {spotCategories.map((category) => (
              <a
                key={category}
                href="#spots"
                className="rounded-full bg-[#F5EFE6] px-3 py-1.5 text-sm font-semibold text-[#675844] transition hover:bg-[#EADDC8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4E8C]"
              >
                {category}
              </a>
            ))}
          </div>
          <p className="mt-5 text-xs leading-5 text-[#7a6d5b]">
            Local notes are editorial, not official tourism advice. Check weather, tides, and opening times before you go.
          </p>
        </nav>
      </div>
    </footer>
  );
}
