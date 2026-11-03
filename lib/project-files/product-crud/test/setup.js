// Starts an in-memory MongoDB and loads the app with test settings.
// Each test file calls setup() in `before` and teardown() in `after`.

const { MongoMemoryServer } = require('mongodb-memory-server');

let mongo;

async function setup() {
  mongo = await MongoMemoryServer.create();
  process.env.NODE_ENV = 'test';
  process.env.DEV_DATABASE = mongo.getUri();

  const { connectDatabase } = require('../src/config/database');
  await connectDatabase(process.env.DEV_DATABASE);
  return require('../src/app');
}

async function teardown() {
  const { disconnectDatabase } = require('../src/config/database');
  await disconnectDatabase();
  await mongo?.stop();
}

module.exports = { setup, teardown };
