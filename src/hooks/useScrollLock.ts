"use client";

import { useEffect } from "react";

export function useScrollLock(lock: boolean) {
  useEffect(() => {
    if (!lock) {
      document.body.style.overflow = "";
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow || "";
    };
  }, [lock]);
}
