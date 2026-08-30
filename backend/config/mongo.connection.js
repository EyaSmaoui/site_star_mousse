const mongoose = require('mongoose');

mongoose.set('bufferCommands', false);
mongoose.set('sanitizeFilter', true);

const hasConfiguredMongoUri = () => Boolean(process.env.url_Mongodb || process.env.MONGODB_URI);

const getMongoUri = () => process.env.url_Mongodb || process.env.MONGODB_URI;

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
  const uri = getMongoUri();

  if (!uri) {
    console.error('\nConfiguration MongoDB manquante.');
    console.error('- Définissez url_Mongodb ou MONGODB_URI dans .env pour utiliser MongoDB Atlas en ligne');
    throw new Error('MongoDB URI missing. Set url_Mongodb or MONGODB_URI.');
  }

  try {
    await connectWithHardTimeout(uri.trim());
    console.log('connected to MongoDB (online)');
    return;
  } catch (err) {
    if (mongoose.connection.readyState !== 0) {
      await disconnectWithHardTimeout();
    }

    console.error(`MongoDB connection failed (${uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}):`, err.message);
    console.error('\nImpossible de se connecter à MongoDB Atlas.');
    console.error('- Vérifiez url_Mongodb dans .env (Atlas : IP autorisée, identifiants)');
    console.error('- Vérifiez aussi le réseau / pare-feu / VPN / IP publique autorisée dans Atlas\n');

    if (process.env.ALLOW_NO_DB === 'true') {
      console.warn('⚠️ ALLOW_NO_DB=true — démarrage en mode dégradé sans MongoDB. Certaines routes dépendantes de la base peuvent échouer.');
      return;
    }

    throw err;
  }
};
