import { ArrowRight, Clock3, MapPinned } from "lucide-react";

import { ImageWithFallback } from "@/components/site/ImageWithFallback";

const routes = [
  {
    title: "2-hour sunset route",
    time: "5:00 PM onward",
    text: "Start near Devka or the Nani Daman waterfront, pause for the river light, then finish with a quick local food stop.",
    imageSrc: "/images/spots/route-sunset-jetty.jpg",
    imageAlt: "Golden-hour fishermen jetty and waterfront light near Nani Daman",
    gradientFallback: "from-[#D99A3D] via-[#B96F4A] to-[#1E4E8C]",
    mood: "river light + food stop",
  },
  {
    title: "Morning photo walk",
    time: "6:15 AM to 8:30 AM",
    text: "Use the softer edge of Jampore, the hidden morning beach patch, and quiet sky-heavy frames before the coast gets busy.",
    imageSrc: "/images/spots/route-morning-photo-walk.jpg",
    imageAlt: "Jampore beach edge with casuarina trees and morning sand textures",
    gradientFallback: "from-[#4F8FA8] via-[#E2D2B8] to-[#8FA382]",
    mood: "soft sky + coastal texture",
  },
  {
    title: "Moti Daman heritage loop",
    time: "Late afternoon",
    text: "Walk the fort walls, chapel street edges, and Portuguese lanes slowly, leaving room for shade and small architectural details.",
    imageSrc: "/images/spots/route-heritage-loop.jpg",
    imageAlt: "Portuguese lanes and fort-side heritage textures in Moti Daman",
    gradientFallback: "from-[#9E3F2F] via-[#C79A52] to-[#1E4E8C]",
    mood: "fort walls + chapel lanes",
  },
  {
    title: "Food + jetty evening plan",
    time: "After golden hour",
    text: "Keep the route loose: jetty walk first, then follow the active local stalls and casual corners near Nani Daman.",
    imageSrc: "/images/spots/local-food-corner-jetty.jpg",
    imageAlt: "Evening waterfront route near Nani Daman jetty",
    gradientFallback: "from-[#D99A3D] via-[#9E3F2F] to-[#395B45]",
    mood: "waterfront + local corners",
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
        <div className="grid gap-4 sm:grid-cols-2">
          {routes.map((route) => (
            <article key={route.title} className="group overflow-hidden rounded-[30px] bg-[#FFFDF8] shadow-[0_24px_76px_rgba(75,55,29,0.12)] ring-1 ring-[#eadcc8] transition duration-300 hover:-translate-y-1 hover:shadow-[0_32px_96px_rgba(75,55,29,0.17)]">
              <div className="relative aspect-[16/9] overflow-hidden">
                <ImageWithFallback
                  src={route.imageSrc}
                  alt={route.imageAlt}
                  fallbackClassName={route.gradientFallback}
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                  label={route.mood}
                  className="transition duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,21,21,0.02),rgba(21,21,21,0.48))]" />
                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-[#FFFDF8]/86 px-3 py-1.5 text-xs font-bold text-[#473b2e] shadow-sm ring-1 ring-white/70 backdrop-blur">
                  <Clock3 className="h-3.5 w-3.5" />
                  {route.time}
                </div>
              </div>
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#9E3F2F]">{route.mood}</p>
                  <ArrowRight className="h-4 w-4 text-[#D99A3D] transition group-hover:translate-x-1" />
                </div>
                <h3 className="font-display text-3xl font-semibold leading-[0.98] tracking-[-0.035em] text-[#151515]">
                  {route.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#5d5143]">{route.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
