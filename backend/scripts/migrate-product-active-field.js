const mongoose = require('mongoose');
const logger = require('../logger');

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/site_star_mousse';

async function main() {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });

  const migrated = await mongoose.connection.collection('products').updateMany(
    { isActive: { $exists: false }, isAvctive: { $exists: true } },
    [{ $set: { isActive: '$isAvctive' } }]
  );

  const defaulted = await mongoose.connection.collection('products').updateMany(
    { isActive: { $exists: false } },
    { $set: { isActive: true } }
  );

  logger.info('Product active flag migration completed', { migrated: migrated.modifiedCount, defaulted: defaulted.modifiedCount });
  console.log(JSON.stringify({ migrated: migrated.modifiedCount, defaulted: defaulted.modifiedCount }, null, 2));
}

main()
  .catch((error) => {
    logger.error('Product active flag migration failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
