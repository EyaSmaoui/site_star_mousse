const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, 'Le nom d\'utilisateur est requis'], 
    trim: true,
    minlength: [2, 'Le nom d\'utilisateur doit contenir au moins 2 caractères']
  },
  email: { 
    type: String, 
    required: [true, 'L\'email est requis'], 
    unique: true, 
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Veuillez entrer un email valide']
  },
  password: { 
    type: String, 
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
  },
  phone: { 
    type: String, 
    required: [true, 'Le numéro de téléphone est requis'], 
    trim: true
  },
  address: { 
    type: String, 
    trim: true,
    default: ''
  },
  role: { 
    type: String, 
    enum: {
      values: ["client", "user", "admin", "manager", "employee", "employeur"],
      message: 'Le rôle doit être client, user, admin, manager, employee ou employeur'
    },
    default: "client" 
  }
}, { timestamps: true });

// Hachage automatique du mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Méthode Statique pour le Login
userSchema.statics.Login = async function(email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error('Utilisateur non trouvé');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Mot de passe incorrect');
    return user;
};

module.exports = mongoose.model('User', userSchema);