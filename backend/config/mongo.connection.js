const mongoose = require('mongoose');

const getMongoUri = () =>
  process.env.url_Mongodb ||
  process.env.MONGODB_URI ||
  'mongodb://127.0.0.1:27017/site_star_mousse';

const getFallbackUri = () =>
  process.env.MONGODB_FALLBACK_URI ||
  (process.env.NODE_ENV !== 'production' ? 'mongodb://127.0.0.1:27017/site_star_mousse' : null);

module.exports.connectToMongoDB = async () => {
  const primaryUri = getMongoUri().trim();
  const uris = [primaryUri];
  const fallback = getFallbackUri();
  if (fallback && fallback !== primaryUri) {
    uris.push(fallback.trim());
  }

  let lastError;
  for (const uri of uris) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
      console.log(`connected to MongoDB (${uri.includes('127.0.0.1') || uri.includes('localhost') ? 'local' : 'remote'})`);
      return;
    } catch (err) {
      lastError = err;
      if (mongoose.connection.readyState === 1) {
        await mongoose.disconnect();
      }
      console.error(`MongoDB connection failed (${uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}):`, err.message);
    }
  }

  console.error('\nImpossible de se connecter à MongoDB.');
  console.error('- Vérifiez url_Mongodb dans .env (Atlas : IP autorisée, identifiants)');
  console.error('- Ou installez MongoDB local et utilisez : mongodb://127.0.0.1:27017/site_star_mousse');
  console.error('- Option : MONGODB_FALLBACK_URI=mongodb://127.0.0.1:27017/site_star_mousse\n');
  // If developer explicitly allows running without DB, start in degraded mode
  if (process.env.ALLOW_NO_DB === 'true') {
    console.warn('⚠️ ALLOW_NO_DB=true — démarrage en mode dégradé sans MongoDB. Certaines routes dépendantes de la base peuvent échouer.');
    return;
  }

  throw lastError;
};
