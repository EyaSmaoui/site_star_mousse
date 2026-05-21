from pathlib import Path

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
root = Path('c:/site_star_mousse')
old1 = '    const productLabel = `${PRODUCT.name}${selectedSize?.label ? ` (${selectedSize.label})` : ""}`;'
new1 = '    const productLabel = PRODUCT.name + (typeof selectedSize !== "undefined" && selectedSize?.label ? ` (${selectedSize.label})` : "");'
old2 = '    const unitPrice = selectedSize?.price ?? PRODUCT.price ?? 0;'
new2 = '    const unitPrice = (typeof selectedSize !== "undefined" ? selectedSize?.price : PRODUCT.price) ?? PRODUCT.price ?? 0;'

for f in files:
    path = root / f
    text = path.read_text(encoding='utf-8')
    updated = text.replace(old1, new1).replace(old2, new2)
    if text != updated:
        path.write_text(updated, encoding='utf-8')
        print('Updated', f)
