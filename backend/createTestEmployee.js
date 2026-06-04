const mongoose = require('mongoose');
const User = require('./models/user.model');
require('dotenv').config();

const MONGO_URI = process.env.url_Mongodb || 'mongodb://127.0.0.1:27017/site_star_mousse';

async function createTestEmployee() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Créer un employé de test
    const employee = new User({
      username: 'Test Employee',
      email: 'employe@example.com',
      password: 'Test1234',
      phone: '22990001',
      role: 'employee'
    });

    await employee.save();
    console.log('✅ Employé créé avec succès!');
    console.log('Email:', employee.email);
    console.log('Mot de passe (clair):', 'Test1234');
    console.log('Rôle:', employee.role);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createTestEmployee();
