# Déploiement & Checklist pré-hébergement

Ce fichier contient les tâches et commandes recommandées avant de mettre en production.

## Commandes rapides

Vérifier les variables d'environnement (depuis le dossier `backend`):
```bash
node scripts/check_env.js
```

Sauvegarder la base de données (PowerShell):
```powershell
.\scripts\backup_db.ps1 -uri $env:URL_MONGODB -out C:\backups
```

Sauvegarder la base de données (Linux/macOS):
```bash
./scripts/backup_db.sh "$URL_MONGODB" ./backups
```

Désactiver le mode debug: définir `NODE_ENV=production` et redémarrer le serveur.

## Sécurité
- Activer HTTPS (Nginx + Certbot) — exemple de configuration dans `nginx/`.
- Configurer `SENTRY_DSN` si vous utilisez Sentry.
- Mettre à jour tous les mots de passe et secrets dans un coffre (Vault).

## Logs
- Les logs sont gérés par `backend/logger.js` (winston + rotation quotidienne).
- Vérifier l'espace disque et la rotation des logs.

## Nginx (extrait)
- Voir `nginx/star-mousse.conf` pour un exemple (SSL, proxy_pass, gzip static).
