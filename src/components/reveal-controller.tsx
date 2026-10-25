"use client";

import { useEffect } from "react";

/** Marks `[data-reveal]` elements as they scroll into view; CSS does the motion. */
export function RevealController() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-shown", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    for (const node of document.querySelectorAll("[data-reveal]")) observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return null;
}
