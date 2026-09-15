const { execFileSync } = require('node:child_process');
const path = require('node:path');

const testDatabaseUrl = process.env.TEST_DATABASE_URL;

if (!testDatabaseUrl) {
  throw new Error('TEST_DATABASE_URL is required to migrate the test database');
}

const parsedUrl = new URL(testDatabaseUrl);
const databaseName = parsedUrl.pathname.replace(/^\//, '');

if (parsedUrl.protocol !== 'postgresql:' && parsedUrl.protocol !== 'postgres:') {
  throw new Error('Integration tests require a PostgreSQL database');
}

if (!databaseName.endsWith('_test')) {
  throw new Error(
    `Refusing to migrate unsafe database "${databaseName}". ` +
      'The database name must end with "_test".',
  );
}

execFileSync(
  process.execPath,
  [path.resolve('node_modules/prisma/build/index.js'), 'migrate', 'deploy'],
  {
    env: {
      ...process.env,
      DATABASE_URL: testDatabaseUrl,
    },
    stdio: 'inherit',
  },
);
