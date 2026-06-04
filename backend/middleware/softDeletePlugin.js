/**
 * SOFT DELETE PATTERN
 * Tous les deletes deviennent un update avec flag isDeleted=true
 */

// Middleware pour automatiquement filtrer les documents supprimés
exports.excludeDeleted = (modelName) => {
  return (req, res, next) => {
    // Enregistrer le middleware pour utilisation dans les contrôleurs
    req.excludeDeletedQuery = (query) => {
      return query.where({ isDeleted: false });
    };
    next();
  };
};

/**
 * Soft delete helper functions
 */
exports.softDelete = async (model, id) => {
  return await model.findByIdAndUpdate(
    id,
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );
};

exports.softDeleteMany = async (model, filter) => {
  return await model.updateMany(
    filter,
    { isDeleted: true, deletedAt: new Date() }
  );
};

exports.restore = async (model, id) => {
  return await model.findByIdAndUpdate(
    id,
    { isDeleted: false, deletedAt: null },
    { new: true }
  );
};

exports.permanentDelete = async (model, id) => {
  return await model.findByIdAndRemove(id);
};

/**
 * Mongoose schema plugin pour soft delete
 */
exports.softDeletePlugin = (schema) => {
  // Ajouter les champs
  schema.add({
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
  });

  // Middleware pour query: exclure les documents supprimés par défaut
  schema.pre('find', function() {
    if (!this.getOptions().includeSoftDeleted) {
      this.where({ isDeleted: false });
    }
  });

  schema.pre('findOne', function() {
    if (!this.getOptions().includeSoftDeleted) {
      this.where({ isDeleted: false });
    }
  });

  schema.pre('findOneAndUpdate', function() {
    if (!this.getOptions().includeSoftDeleted) {
      this.where({ isDeleted: false });
    }
  });

  schema.pre('countDocuments', function() {
    if (!this.getOptions().includeSoftDeleted) {
      this.where({ isDeleted: false });
    }
  });

  // Méthode pour query avec soft deletes inclus
  schema.query.withDeleted = function() {
    return this.setOptions({ includeSoftDeleted: true });
  };

  // Méthode pour restore
  schema.methods.restore = function() {
    this.isDeleted = false;
    this.deletedAt = null;
    return this.save();
  };

  // Méthode pour soft delete
  schema.methods.softDelete = function() {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return this.save();
  };

  // Méthode pour permanent delete
  schema.methods.permanentDelete = function() {
    return this.deleteOne();
  };
};

module.exports = exports;
