const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user.model');
require('dotenv').config();

const MONGO_URI = process.env.url_Mongodb || 'mongodb://127.0.0.1:27017/site_star_mousse';

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const email = 'admin@starmousse.com';
    const plainPassword = 'ChangeMe123!';

    const existingAdmin = await User.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      existingAdmin.password = plainPassword;
      existingAdmin.role = 'admin';
      existingAdmin.username = existingAdmin.username || 'Administrateur';
      existingAdmin.phone = existingAdmin.phone || '00000000';
      await existingAdmin.save();
      console.log(`Admin existant mis à jour : ${email}`);
      console.log('Mot de passe temporaire :', plainPassword);
      console.log('Pense à changer ce mot de passe immédiatement.');
      process.exit(0);
    }

    const admin = new User({
      username: 'Administrateur',
      email: email.toLowerCase(),
      password: plainPassword,
      phone: '00000000',
      role: 'admin'
    });

    await admin.save();
    console.log('Admin créé avec succès !');
    console.log('Email :', email);
    console.log('Mot de passe temporaire :', plainPassword);
    console.log('Pense à changer ce mot de passe immédiatement.');
  } catch (error) {
    console.error('Erreur lors de la création de l\'admin :', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
