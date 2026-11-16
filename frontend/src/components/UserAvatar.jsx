import React, { useState } from "react";
import { getDiceBearAvatar } from "../utils/dicebear";

const getInitials = (name) => {
  const parts = String(name || "Star Mousse").trim().split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : parts[0]?.slice(0, 2) || "SM").toUpperCase();
};

/** A consistent, accessible avatar with a local monogram fallback. */
export default function UserAvatar({ name, src, size = 40, className = "", decorative = false }) {
  const [failed, setFailed] = useState(false);
  const label = name?.trim() || "Votre profil";
  const imageSrc = src || getDiceBearAvatar(label, "initials");

  return (
    <span
      className={`sm-user-avatar ${className}`.trim()}
      style={{ "--avatar-size": `${size}px` }}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : `Avatar de ${label}`}
      aria-hidden={decorative ? "true" : undefined}
    >
      {!failed && <img src={imageSrc} alt="" loading="lazy" onError={() => setFailed(true)} />}
      {failed && <span aria-hidden="true">{getInitials(label)}</span>}
    </span>
  );
}
