import { ArrowRight, Clock3, MapPinned } from "lucide-react";

const routes = [
  {
    title: "2-hour sunset route",
    time: "5:00 PM onward",
    text: "Start near Devka or the Nani Daman waterfront, pause for the river light, then finish with a quick local food stop.",
  },
  {
    title: "Morning photo walk",
    time: "6:15 AM to 8:30 AM",
    text: "Use the softer edge of Jampore, the hidden morning beach patch, and quiet sky-heavy frames before the coast gets busy.",
  },
  {
    title: "Moti Daman heritage loop",
    time: "Late afternoon",
    text: "Walk the fort walls, chapel street edges, and Portuguese lanes slowly, leaving room for shade and small architectural details.",
  },
  {
    title: "Food + jetty evening plan",
    time: "After golden hour",
    text: "Keep the route loose: jetty walk first, then follow the active local stalls and casual corners near Nani Daman.",
  },
];

export function RouteIdeas() {
  return (
    <section id="routes" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16" aria-labelledby="routes-title">
      <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#9E3F2F]">
            <MapPinned className="h-4 w-4" />
            Build a loose route
          </p>
          <h2 id="routes-title" className="mt-3 max-w-lg font-display text-4xl font-semibold leading-none tracking-[-0.04em] text-[#151515] sm:text-5xl">
            Let the map give you a direction, not a schedule.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-[#5d5143]">
            Use this field map to build a loose route across beaches, forts, lanes, cafés, and food stops. Daman works best when the plan has room to breathe.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {routes.map((route) => (
            <article key={route.title} className="group rounded-[28px] border border-[#eadcc8] bg-[#FFFDF8]/88 p-5 shadow-[0_20px_60px_rgba(75,55,29,0.1)] transition hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(75,55,29,0.15)]">
              <div className="mb-5 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#F5EFE6] px-3 py-1.5 text-xs font-bold text-[#675844]">
                  <Clock3 className="h-3.5 w-3.5" />
                  {route.time}
                </span>
                <ArrowRight className="h-4 w-4 text-[#D99A3D] transition group-hover:translate-x-1" />
              </div>
              <h3 className="font-display text-3xl font-semibold leading-[0.98] tracking-[-0.035em] text-[#151515]">
                {route.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#5d5143]">{route.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
