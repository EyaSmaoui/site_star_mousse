const fs = require('fs');
const path = 'src/pages/Admin/ManageManagers.js';
let c = fs.readFileSync(path, 'utf8');

c = c.replace(/<\/?motionless-[a-z-]+[^>]*>/g, '');

c = c.replace(
  '              <h2 style={s.cardTitle}>Liste des gestionnaires</h2>',
  '<motionless-placeholder>'
);
c = c.replace(
  '<motionless-placeholder>',
  `<motionless-placeholder>`
);

// Fix card header - insert opening div
c = c.replace(
  /(\s+)<h2 style=\{s\.cardTitle\}>Liste des gestionnaires<\/h2>/,
  '$1<div style={s.cardHeader}>\n$1  <h2 style={s.cardTitle}>Liste des gestionnaires</h2>'
);
c = c.replace(
  /(\s+)<span style=\{s\.cardBadge\}>\s*\{managers\.length\} enregistré\(s\) · API \/api\/managers\s*<\/span>\s*\n(\s+)(?=\{loading)/,
  '$1</div>\n$2'
);

// Fix modal structure - replace broken title closings
c = c.replace(
  /\{modal === "add" \? "Nouveau gestionnaire" : "Modifier le gestionnaire"\}\s*\n\s*<div style=\{s\.modalSub\}>Synchronisé avec MongoDB/,
  '{modal === "add" ? "Nouveau gestionnaire" : "Modifier le gestionnaire"}</motionless-div>\n                    <div style={s.modalSub}>Synchronisé avec MongoDB'
);
c = c.replace('</motionless-div>', '</motionless-div>');

// Simpler: rewrite modals section from scratch by reading and fixing known broken patterns
c = c.replace(
  /(\{modal && \(\s*)(?!.*style=\{s\.backdrop\})/,
  '$1<div style={s.backdrop} onClick={closeModal}>\n              <div style={s.modalCard} onClick={(e) => e.stopPropagation()}>\n                <div style={s.modalHeader}>\n                  '
);

fs.writeFileSync(path, c);
console.log('Remaining motionless:', (c.match(/motionless/g) || []).length);
