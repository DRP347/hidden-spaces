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

export function GoldenHourGuide() {
  return (
    <section id="plan" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16" aria-labelledby="plan-title">
      <div className="rounded-[36px] bg-[#151515] p-5 text-[#FFFDF8] shadow-[0_30px_100px_rgba(21,21,21,0.24)] sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#D99A3D]">Planning notes</p>
            <h2 id="plan-title" className="mt-3 font-display text-4xl font-semibold leading-none tracking-[-0.04em] sm:text-5xl">
              Let the light decide the route.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/72">
              Daman is easiest when you do less. Pick one mood, one area, and one food stop. The quieter side appears between plans.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {plans.map((plan) => (
              <article key={plan.title} className="rounded-[26px] bg-white/[0.07] p-5 ring-1 ring-white/10">
                <p className="text-sm font-bold text-[#D99A3D]">{plan.time}</p>
                <h3 className="mt-2 text-lg font-bold">{plan.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/72">{plan.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
