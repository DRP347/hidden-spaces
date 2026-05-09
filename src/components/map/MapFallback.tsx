export function MapFallback() {
  const pins = [
    "left-[42%] top-[32%]",
    "left-[55%] top-[42%]",
    "left-[48%] top-[58%]",
    "left-[66%] top-[54%]",
    "left-[36%] top-[48%]",
  ];

  return (
    <div
      className="map-loading-fallback absolute inset-0 overflow-hidden bg-[#F6EFE4]"
      role="status"
      aria-label="Preparing Daman field map"
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(188,218,224,0.62)_0%,rgba(255,253,248,0.70)_38%,rgba(246,239,228,0.86)_100%)]" />
      <div className="absolute inset-0 opacity-[0.26] [background-image:linear-gradient(rgba(75,55,29,.14)_1px,transparent_1px),linear-gradient(90deg,rgba(75,55,29,.1)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute left-[20%] top-[28%] h-px w-[58%] rotate-[8deg] bg-[#D9C69C]/70" />
      <div className="absolute left-[26%] top-[52%] h-px w-[48%] -rotate-[13deg] bg-[#D9C69C]/60" />
      <div className="absolute left-[52%] top-[16%] h-[88%] w-[18%] -rotate-[7deg] rounded-full border-x border-[#A6CAD4]/38" />
      <div className="absolute bottom-[-18%] left-[8%] h-[38%] w-[70%] rounded-[50%] border border-white/54 bg-white/18" />

      {pins.map((position, index) => (
        <span
          key={position}
          className={`map-loading-pin absolute ${position}`}
          style={{ animationDelay: `${index * 140}ms` }}
        />
      ))}

      <div className="absolute left-4 top-[42%] rounded-full border border-white/70 bg-[#FFFDF8]/72 px-4 py-2 text-xs font-bold text-[#5d5143] shadow-[0_12px_32px_rgba(75,55,29,0.10)] backdrop-blur-xl sm:bottom-6 sm:left-6 sm:top-auto">
        Preparing Daman field map...
      </div>
    </div>
  );
}
