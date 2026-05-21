from pathlib import Path
import re

base = Path(__file__).resolve().parent.parent
files = [
    'src/pages/Product/ConfortPlus.js',
    'src/pages/Product/MedicoPlus.js',
    'src/pages/Product/Tendresse.js',
    'src/pages/Product/VenisePlus.js',
    'src/pages/Product/bebe/BebeConfortPlus.js',
    'src/pages/Product/bebe/BebeSoft.js',
    'src/pages/Product/bebe/BebeVenise.js',
    'src/pages/Product/pillow/RelaxPillow.js',
    'src/pages/Product/pillow/MedicoPillow.js',
    'src/pages/Product/pillow/VenisePillow.js',
    'src/pages/Product/pillow/TendressePillow.js',
    'src/pages/Product/oreillers/AromaLavande.js',
    'src/pages/Product/oreillers/AromaMenthe.js',
    'src/pages/Product/oreillers/OceanPuff.js',
]

handle_code = '''const handleOrder = async () => {
    if (!form.nom?.trim() || !form.tel?.trim() || !form.adresse?.trim()) {
      alert("Veuillez remplir les champs obligatoires pour valider votre commande.");
      return;
    }

    setLoading(true);
    const productLabel = `${PRODUCT.name}${selectedSize?.label ? ` (${selectedSize.label})` : ""}`;
    const unitPrice = selectedSize?.price ?? PRODUCT.price ?? 0;
    const orderData = {
      name: form.nom.trim(),
      email: form.email?.trim(),
      phone: form.tel.trim(),
      address: form.adresse.trim(),
      products: [{ name: productLabel, quantity: qty || 1, price: unitPrice }],
      total: unitPrice * (qty || 1),
    };

    try {
      const response = await submitProductOrder(orderData);
      alert(`✅ Commande envoyée ! Référence : ${response.data._id?.slice(-6) || 'OK'}`);
      setForm({ nom: "", tel: "", adresse: "", email: "" });
      setTimeout(() => {
        window.location.href = "/admin/dashboard";
      }, 1800);
    } catch (error) {
      console.error("Erreur commande :", error);
      alert("Erreur lors de l'envoi de la commande. Réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  };'''

for rel in files:
    path = base / rel
    text = path.read_text(encoding='utf-8')
    original = text
    if 'submitProductOrder' not in text:
        import_line = 'import React, { useState, useEffect, useRef } from "react";'
        if import_line in text:
            rel_depth = rel.count('/')
            import_path = '../../utils/orderService' if rel_depth == 3 else '../../../utils/orderService'
            text = text.replace(import_line, import_line + f'\nimport {{ submitProductOrder }} from "{import_path}";')
        else:
            print(f'Cannot find react import in {rel}')
    if 'const [loading, setLoading] = useState(false);' not in text:
        text = re.sub(r'(const \[form, setForm\][^\n]*\n)', r'\1  const [loading, setLoading] = useState(false);\n', text, count=1)
    new_text, count = re.subn(r'const handleOrder = (?:async )?\([^\)]*\) => \{[\s\S]*?\n  \};', handle_code, text, count=1)
    if count == 0:
        print(f'No handleOrder replaced in {rel}')
    else:
        text = new_text
    if text != original:
        path.write_text(text, encoding='utf-8')
        print(f'Patched {rel}')
