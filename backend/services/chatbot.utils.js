// chatbot.utils.js
const normalizeText = (t) => String(t).toLowerCase().trim();

const extractDimension = (msg) => {
    const text = normalizeText(msg);
    const match = text.match(/(\d{2,3})\s*[\s*xX/_-]\s*(\d{2,3})/);
    if (!match) return null;
    const d1 = parseInt(match[1]);
    const d2 = parseInt(match[2]);
    // Standardisation : toujours "petit x grand"
    return `${Math.min(d1, d2)}x${Math.max(d1, d2)}`;
};

const extractBudget = (msg) => {
    const text = normalizeText(msg);
    // Protection : si dimension détectée, on ignore le budget pour éviter confusion
    if (/(\d{2,3})\s*[\s*xX/_-]\s*(\d{2,3})/.test(text)) return null;
    const match = text.match(/(?:budget|soum|prix|b)\s*(\d+)/) || text.match(/(\d+)\s*dt/);
    return match ? parseInt(match[1]) : null;
};

module.exports = { normalizeText, extractDimension, extractBudget };