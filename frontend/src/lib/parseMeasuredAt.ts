export const parseMeasuredAt = (
  raw?: string | number | null,
): Date | null => {
  if (raw === null || raw === undefined) return null;

  if (typeof raw === "number") {
    const millis = raw < 10_000_000_000 ? raw * 1000 : raw;
    const date = new Date(millis);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
};
