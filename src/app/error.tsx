"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[Hidden Spaces] App error boundary:", error);
    }
  }, [error]);

  return (
    <main className="grid min-h-[100dvh] place-items-center bg-sand px-6 text-ink">
      <section className="glass-light field-grain max-w-md rounded-[30px] p-6 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-mist">
          Map interrupted
        </p>
        <h1 className="mt-2 font-display text-[36px] font-semibold leading-none tracking-[-0.04em]">
          The field map needs a refresh
        </h1>
        <p className="mt-3 text-sm leading-6 text-charcoal/78">
          Something in the local preview failed, but the app caught it safely.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 rounded-full bg-ink px-5 py-3 text-sm font-bold text-coconut transition hover:bg-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
