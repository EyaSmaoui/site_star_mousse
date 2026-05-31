# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Cloud - Recommandé pour la production)

### Étapes:

1. **Créer un compte MongoDB Atlas**
   - Allez sur https://www.mongodb.com/cloud/atlas
   - Cliquez sur "Register" et créez un compte
   - Vérifiez votre email

2. **Créer un Cluster**
   - Cliquez sur "Create a Deployment"
   - Choisissez "M0 Sandbox" (gratuit)
   - Sélectionnez votre région
   - Attendez que le cluster soit créé (~5-10 minutes)

3. **Configurer la sécurité**
   - Allez dans "Network Access"
   - Cliquez sur "Add IP Address"
   - Choisissez "Allow Access from Anywhere" (0.0.0.0/0) pour développement
   - Allez dans "Database Access"
   - Créez un utilisateur (ex: admin)
   - Définissez un mot de passe fort

4. **Obtenir la connexion**
   - Cliquez sur "Connect"
   - Choisissez "Drivers"
   - Copiez l'URI de connexion
   - Remplacez `<username>` et `<password>` avec vos identifiants

### Format de l'URI:
```
mongodb+srv://<username>:<password>@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority
```

## Option 2: MongoDB Local (Développement)

### Installation sur Windows:

1. **Télécharger MongoDB Community Edition**
   ```bash
   # Via Chocolatey
   choco install mongodb-community
   ```

2. **Créer le répertoire de données**
   ```bash
   mkdir "C:\data\db"
   ```

3. **Démarrer MongoDB**
   ```bash
   mongod --dbpath "C:\data\db"
   ```

### URI locale:
```
mongodb://localhost:27017/database-name
```

## Configuration dans votre .env

### Backend (.env):
```
MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/database-name
DB_NAME=site_star_mousse
NODE_ENV=development
```

### Pour les tests:
```
MONGODB_TEST_URI=mongodb://localhost:27017/test_db
```

## Vérifier la connexion

### Avec MongoDB Compass (GUI):
1. Télécharger MongoDB Compass: https://www.mongodb.com/products/tools/compass
2. Coller votre URI de connexion
3. Cliquer sur "Connect"

### Avec mongosh (CLI):
```bash
# Installation
npm install -g mongosh

# Connexion
mongosh "mongodb+srv://username:password@cluster.mongodb.net/database"

# Vérifier les collections
show databases
use database-name
show collections
```

## Performance Tips

1. **Indexing**: Créez des index sur les champs fréquemment requêtés
2. **Connection pooling**: Configurez la taille du pool dans les options
3. **Monitoring**: Utilisez MongoDB Atlas Monitoring pour surveiller les performances

## Backup & Restore

### Backup automatique (Atlas):
- Les backups automatiques sont inclus dans Atlas
- Allez dans "Backup" pour voir/restaurer

### Backup manuel:
```bash
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/db" --out=backup/

# Restore
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/db" backup/
```

## Troubleshooting

### Erreur: "MongoNetworkError"
- Vérifiez que votre IP est whitelist en Network Access
- Vérifiez les identifiants MongoDB

### Erreur: "Authentication failed"
- Vérifiez le mot de passe (caractères spéciaux besoin d'URL encoding)
- Vérifiez le nom d'utilisateur

### Connexion lente
- Vérifiez la région du cluster
- Vérifiez votre connexion Internet
- Utilisez connection pooling

## Resources
- MongoDB Documentation: https://docs.mongodb.com/
- MongoDB Atlas Guide: https://docs.atlas.mongodb.com/
- Mongoose Guide: https://mongoosejs.com/docs/
