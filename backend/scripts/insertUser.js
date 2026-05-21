const mongoose = require('mongoose');
const User = require('../models/user.model');
require('dotenv').config();

const MONGO_URI = process.env.url_Mongodb || 'mongodb://127.0.0.1:27017/site_star_mousse';

function parseArgs() {
  const args = process.argv.slice(2);
  const result = {};

  args.forEach(arg => {
    const [key, value] = arg.split('=');
    if (!value) return;
    const normalizedKey = key.replace(/^--/, '');
    result[normalizedKey] = value;
  });

  return result;
}

async function insertUser(data) {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const user = new User({
      username: data.username,
      email: data.email.toLowerCase(),
      password: data.password,
      phone: data.phone,
      address: data.address || '',
      role: data.role || 'client',
    });

    await user.save();
    console.log('Utilisateur inséré avec succès !');
    console.log('Email :', user.email);
    console.log('Rôle :', user.role);
  } catch (error) {
    console.error('Erreur lors de l\'insertion :', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

const params = parseArgs();

if (!params.username || !params.email || !params.password || !params.phone) {
  console.error('Usage : node scripts/insertUser.js --username=nom --email=xxx@yyy.com --password=MotDePasse123 --phone=0601020304 [--role=client] [--address="Rue ..."]');
  process.exit(1);
}

insertUser(params);
