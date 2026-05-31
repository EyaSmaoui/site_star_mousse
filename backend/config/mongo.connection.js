const mongoose = require('mongoose');

mongoose.set('bufferCommands', false);

const getMongoUri = () =>
  process.env.url_Mongodb ||
  process.env.MONGODB_URI ||
  'mongodb://127.0.0.1:27017/site_star_mousse';

const getFallbackUri = () =>
  process.env.MONGODB_FALLBACK_URI ||
  (process.env.NODE_ENV !== 'production' ? 'mongodb://127.0.0.1:27017/site_star_mousse' : null);

const connectWithHardTimeout = async (uri, timeoutMS = 7000) => {
  let timeout;
  try {
    await Promise.race([
      mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
        socketTimeoutMS: 10000,
        maxPoolSize: 10,
      }),
      new Promise((_, reject) => {
        timeout = setTimeout(() => {
          reject(new Error(`MongoDB connection timed out after ${timeoutMS}ms`));
        }, timeoutMS);
      }),
    ]);
  } finally {
    clearTimeout(timeout);
  }
};

const disconnectWithHardTimeout = async (timeoutMS = 1000) => {
  let timeout;
  try {
    await Promise.race([
      mongoose.disconnect(),
      new Promise((resolve) => {
        timeout = setTimeout(resolve, timeoutMS);
      }),
    ]);
  } finally {
    clearTimeout(timeout);
  }
};

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
      await connectWithHardTimeout(uri);
      console.log(`connected to MongoDB (${uri.includes('127.0.0.1') || uri.includes('localhost') ? 'local' : 'remote'})`);
      return;
    } catch (err) {
      lastError = err;
      if (mongoose.connection.readyState !== 0) {
        await disconnectWithHardTimeout();
      }
      console.error(`MongoDB connection failed (${uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}):`, err.message);
      if (mongoose.connection.readyState !== 0) {
        console.error('MongoDB cleanup still pending; skipping remaining URIs for this attempt.');
        break;
      }
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
