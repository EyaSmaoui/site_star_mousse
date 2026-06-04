export default function formatPrice(price, currency = 'DT') {
  if (price == null) return '';

  if (typeof price === 'string') {
    const trimmed = price.trim();
    
    // Handle price ranges like "530,00 د.ت – 1 850,00 د.ت" or "530 – 1850"
    if (trimmed.includes('–') || trimmed.includes('-')) {
      // Split by range separator
      const parts = trimmed.split(/–|-/).map(p => p.trim());
      return parts.map(part => {
        // Extract just the numeric part
        const cleaned = part.replace(/[^\d.,]/g, '').replace(/,/g, '.');
        const num = parseFloat(cleaned);
        if (!Number.isNaN(num)) {
          return `${Math.round(num).toLocaleString('fr-FR')} ${currency}`;
        }
        return part;
      }).join(' – ');
    }
    
    // Handle single numeric values
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
