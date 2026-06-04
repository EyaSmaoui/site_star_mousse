export default function formatPrice(price, currency = 'DT') {
  if (price == null) return '';

  // Preserve already formatted strings or ranges (e.g. "530,00 د.ت – 1 850,00 د.ت")
  if (typeof price === 'string') {
    const trimmed = price.trim();
    // If it contains a range separator or non-numeric currency characters, return as-is
    if (trimmed.includes('–') || trimmed.includes('-') || /[\p{L}]/u.test(trimmed)) {
      return trimmed;
    }
    // Otherwise try to parse a single numeric value
    const cleaned = trimmed.replace(/[^0-9.,]/g, '').replace(/,/g, '.');
    const num = parseFloat(cleaned);
    if (!Number.isNaN(num)) {
      return `${Math.round(num).toLocaleString('fr-FR')} ${currency}`;
    }
    return trimmed;
  }

  if (typeof price === 'number') {
    return `${Math.round(price).toLocaleString('fr-FR')} ${currency}`;
  }

  return String(price);
}
