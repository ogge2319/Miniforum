// formatDate.js – Formaterar datum till läsbar text

export function formatDate(isoString) {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    return date.toLocaleString("sv-SE", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch (err) {
    console.error("Fel vid datumformatering:", err);
    return isoString;
  }
}
