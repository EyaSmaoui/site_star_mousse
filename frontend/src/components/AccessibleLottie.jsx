import React, { useEffect, useState } from "react";
import { Lottie } from "lottie-react";

function useReducedMotionPreference() {
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = (event) => setReducedMotion(event.matches);
    setReducedMotion(media.matches);
    media.addEventListener?.("change", updatePreference);
    return () => media.removeEventListener?.("change", updatePreference);
  }, []);

  return reducedMotion;
}

export default function AccessibleLottie({ animationData, label, className = "", loop = true }) {
  const reducedMotion = useReducedMotionPreference();

  return (
    <div className={className} role="img" aria-label={label}>
      <Lottie
        key={reducedMotion ? "reduced-motion" : "motion-enabled"}
        src={animationData}
        autoplay={!reducedMotion}
        loop={loop && !reducedMotion}
        aria-hidden="true"
      />
    </div>
  );
}
