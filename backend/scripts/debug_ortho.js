// Script debug pour tester isCategoryMatch contre MongoDB
const mongoose = require('mongoose');
const Product = require('C:/site_star_mousse/backend/models/product.model');
const { extractProductCategory, isCategoryMatch } = require('C:/site_star_mousse/backend/services/chatbot.utils');

const MONGO_URI = 'mongodb://127.0.0.1:27017/site_star_mousse';

async function main() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connecté à MongoDB');
  } catch (err) {
    console.error('❌ Connexion MongoDB échouée:', err.message);
    process.exit(1);
  }

  const products = await Product.find({ isAvctive: { $ne: false } }).lean();
  console.log(`📦 ${products.length} produits actifs trouvés`);

  // Test catégorie orthopedique
  const cat = extractProductCategory('orthopedique');
  console.log('\n🏷️  Catégorie détectée pour "orthopedique":', cat);

  const matchedOrtho = products.filter((p) => isCategoryMatch(p, 'orthopedique'));
  console.log(`\n✅ Produits matchant "orthopedique" (isCategoryMatch): ${matchedOrtho.length}`);
  matchedOrtho.forEach((p) => {
    console.log(`   - ${p.name} | cat: ${p.category} | tags: ${JSON.stringify(p.tags)} | desc: ${(p.description || '').substring(0, 60)}`);
  });

  // Produits "medico"
  const medicoProducts = products.filter((p) => p.name && p.name.toLowerCase().includes('medico'));
  console.log(`\n💉 Produits contenant "medico" dans le nom: ${medicoProducts.length}`);
  medicoProducts.forEach((p) => {
    const matchOrtho = isCategoryMatch(p, 'orthopedique');
    const matchMed = isCategoryMatch(p, 'orthomedical');
    const normName = (p.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    console.log(`   - ${p.name} | includes "soft": ${normName.includes('soft')} | includes "venise": ${normName.includes('venise')} | matchOrtho: ${matchOrtho} | matchMed: ${matchMed}`);
  });

  // Produits "soft"
  const softProducts = products.filter((p) => p.name && p.name.toLowerCase().includes('soft'));
  console.log(`\n🛏️  Produits contenant "soft" dans le nom: ${softProducts.length}`);
  softProducts.forEach((p) => {
    const name = (p.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    console.log(`   - ${p.name} | normalized: "${name}" | category: ${p.category} | matchOrtho: ${isCategoryMatch(p, 'orthopedique')}`);
  });

  await mongoose.disconnect();
  console.log('\n🔌 Déconnecté de MongoDB');
}

main().catch(console.error);
