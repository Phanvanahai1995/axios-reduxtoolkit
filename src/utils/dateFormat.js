export function dateCountdown(diff) {
  const h = Math.floor(diff / 60 / 60) % 24;
  const m = Math.floor(diff / 60) % 60;
  const s = Math.floor(diff) % 60;

  return `${h} hour: ${m} minute: ${s} second`;
}
