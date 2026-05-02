export function MapFallback() {
  return (
    <div
      className="absolute inset-0 overflow-hidden bg-[#d9cdb8]"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_16%,rgba(255,253,248,0.78),transparent_28%),radial-gradient(circle_at_78%_78%,rgba(111,166,161,0.34),transparent_34%),linear-gradient(135deg,#E7DDCA_0%,#D6CAB5_46%,#9FB7C2_100%)]" />
      <div className="absolute inset-0 bg-[url('/images/spots/hero-daman-map-coast.jpg')] bg-cover bg-center opacity-[0.18] mix-blend-multiply" />
      <div className="absolute left-[8%] top-[18%] h-[54%] w-[62%] rotate-[-8deg] rounded-[48%] border border-white/35 bg-[#E7DDCA]/70 shadow-[0_30px_120px_rgba(22,32,42,0.12)]" />
      <div className="absolute right-[-8%] top-[-6%] h-[74%] w-[44%] rounded-bl-[55%] bg-[#9FB7C2]/80" />
      <div className="absolute left-[18%] top-[42%] h-1 w-[42%] rotate-[-14deg] rounded-full bg-white/70 shadow-[0_20px_44px_rgba(22,32,42,0.1)]" />
      <div className="absolute left-[34%] top-[26%] h-1 w-[28%] rotate-[18deg] rounded-full bg-white/60" />
      <div className="absolute bottom-[24%] left-[26%] h-1 w-[34%] rotate-[7deg] rounded-full bg-white/65" />
      <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(22,32,42,.2)_1px,transparent_1px),linear-gradient(90deg,rgba(22,32,42,.14)_1px,transparent_1px)] [background-size:14px_14px]" />
    </div>
  );
}
