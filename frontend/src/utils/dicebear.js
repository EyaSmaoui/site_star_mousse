const DICEBEAR_BASE_URL = "https://api.dicebear.com/9.x";

export function getDiceBearAvatar(seed, style = "personas") {
  const safeSeed = String(seed || "star-mousse").trim() || "star-mousse";
  return `${DICEBEAR_BASE_URL}/${style}/svg?seed=${encodeURIComponent(safeSeed)}`;
}
