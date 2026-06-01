require('dotenv').config();

var express = require('express');
var path = require('path');
var morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const logger = require('./logger');
const Sentry = require('@sentry/node');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const { connectToMongoDB } = require('./config/mongo.connection');

var app = express();

const defaultOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5175',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
  : defaultOrigins;
const deploymentOrigins = [
  'https://site-star-mousse.vercel.app',
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, '')}` : null,
].filter(Boolean).map((origin) => origin.replace(/\/$/, ''));
const allowedOrigins = [...new Set([...corsOrigins, ...deploymentOrigins])];

// MIDDLEWARES
// Sentry (optional)
if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
  app.use(Sentry.Handlers.requestHandler());
}

// Security & performance middlewares
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
// Rate limiting
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));
// Logging: use morgan stream -> winston in production
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', { stream: logger.stream }));
} else {
  app.use(morgan('dev', { stream: logger.stream }));
}
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'star_mousse_backend_session_secret_2026',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  },
}));
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/managers', require('./routes/manager.routes'));
app.use('/api/clients', require('./routes/client.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/paniers', require('./routes/panier.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/chatbot', require('./routes/chatbot.routes'));

app.get('/api/health', (req, res) => {
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    ok: true,
    message: 'API Star Mousse opérationnelle',
    db: dbStates[mongoose.connection.readyState] || 'unknown',
    timestamp: new Date().toISOString(),
  });
});

// Frontend React en production
if (process.env.NODE_ENV === 'production') {
  const distPath = process.env.FRONTEND_BUILD_PATH
    ? path.resolve(process.env.FRONTEND_BUILD_PATH)
    : path.join(__dirname, '..', 'frontend', 'build');
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'), (err) => {
      if (err) next(err);
    });
  });
}

// SERVEUR
const PORT = process.env.PORT || 3000;
const server = http.createServer({
  maxHeaderSize: 32768,
}, app);

let mongoRetryTimer = null;
let mongoConnecting = false;

const ensureMongoConnection = async () => {
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2 || mongoConnecting) {
    return;
  }

  mongoConnecting = true;
  try {
    await connectToMongoDB();
    if (mongoRetryTimer) {
      clearInterval(mongoRetryTimer);
      mongoRetryTimer = null;
    }
  } catch (err) {
    console.error('MongoDB indisponible, API demarree en mode degrade:', err.message);
  } finally {
    mongoConnecting = false;
  }
};

const startServer = async () => {
  await ensureMongoConnection();
  if (mongoose.connection.readyState !== 1 && !mongoRetryTimer) {
    mongoRetryTimer = setInterval(ensureMongoConnection, 30000);
  }

  server.listen(PORT, () => {
    console.log(`✅ Serveur prêt sur le port ${PORT} avec toutes les routes activées`);
  });
};

startServer().catch((err) => {
  console.error('Impossible de démarrer le serveur:', err.message);
  process.exit(1);
});

// ─── Error handlers (debug) ───────────────────────────────────────────────────
process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[FATAL] Unhandled rejection at:', promise, 'reason:', reason);
});
