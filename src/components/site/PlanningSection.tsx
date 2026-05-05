const plans = [
  {
    title: "Morning calm",
    time: "6:15 AM",
    text: "Start with Jampore or a hidden beach patch before the day gets bright and busy.",
  },
  {
    title: "Golden hour",
    time: "5:35 PM",
    text: "Choose Nani Daman Jetty or a sea-view corner and arrive before the sky changes.",
  },
  {
    title: "Food trail",
    time: "7:15 PM",
    text: "Keep dinner flexible. Follow local turnover near the jetty and order what moves fast.",
  },
  {
    title: "Weekend route",
    time: "Half day",
    text: "Moti Daman fort walls, chapel lanes, café pause, then sunset across the river.",
  },
];

export function PlanningSection() {
  return (
    <section id="plan" className="section-shell mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-12 lg:py-16" aria-labelledby="plan-title">
      <div className="rounded-[30px] border border-white/70 bg-[#FFFDF8]/78 p-5 text-[#151515] shadow-[0_24px_80px_rgba(75,55,29,0.12),inset_0_1px_0_rgba(255,255,255,0.84)] backdrop-blur-xl sm:rounded-[36px] sm:p-8">
        <div className="grid gap-7 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#D99A3D]">Planning notes</p>
            <h2 id="plan-title" className="mt-3 text-balance font-display text-[2.35rem] font-semibold leading-[0.98] tracking-[-0.04em] sm:text-5xl">
              Let the light decide the route.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-[#5d5143]">
              Daman is easiest when you do less. Pick one mood, one area, and one food stop. The quieter side appears between plans.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {plans.map((plan) => (
              <article key={plan.title} className="rounded-[24px] bg-[#F5EFE6]/84 p-4 ring-1 ring-[#eadcc8] sm:p-5">
                <p className="text-sm font-bold text-[#9E3F2F]">{plan.time}</p>
                <h3 className="mt-2 text-lg font-bold tracking-[-0.02em]">{plan.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#5d5143]">{plan.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
