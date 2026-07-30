const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const logLevel = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');
const isProduction = process.env.NODE_ENV === 'production';

const redactMeta = (meta = {}) => {
  const sensitiveKeys = new Set(['password', 'token', 'authorization', 'cookie', 'session', 'secret']);
  const clone = { ...meta };

  Object.keys(clone).forEach((key) => {
    const normalizedKey = key.toLowerCase();
    if (sensitiveKeys.has(normalizedKey) || normalizedKey.includes('token') || normalizedKey.includes('secret')) {
      clone[key] = '[REDACTED]';
    }
  });

  return clone;
};

const transportConsole = new winston.transports.Console({
  format: winston.format.combine(
    isProduction
      ? winston.format.uncolorize()
      : winston.format.colorize(),
    isProduction
      ? winston.format.printf((info) => JSON.stringify(redactMeta(info)))
      : winston.format.simple()
  ),
});

const transportRotate = new DailyRotateFile({
  filename: 'logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
  zippedArchive: true,
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((info) => JSON.stringify(redactMeta(info)))
  ),
});

const logger = winston.createLogger({
  level: logLevel,
  defaultMeta: { service: 'star-mousse-api' },
  transports: [transportConsole, transportRotate],
});

logger.stream = {
  write: (message) => {
    logger.info({ http: message.trim() });
  },
};

module.exports = logger;
