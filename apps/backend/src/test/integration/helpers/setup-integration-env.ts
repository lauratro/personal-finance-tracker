const testDatabaseUrl = process.env.TEST_DATABASE_URL;

if (!testDatabaseUrl) {
  throw new Error('TEST_DATABASE_URL is required to run integration tests');
}

const parsedUrl = new URL(testDatabaseUrl);
const databaseName = parsedUrl.pathname.replace(/^\//, '');

if (parsedUrl.protocol !== 'postgresql:' && parsedUrl.protocol !== 'postgres:') {
  throw new Error('Integration tests require a PostgreSQL database');
}

if (!databaseName.endsWith('_test')) {
  throw new Error(
    `Unsafe integration database: "${databaseName}". ` +
      'The database name must end with "_test".',
  );
}

process.env.DATABASE_URL = testDatabaseUrl;
process.env.NODE_ENV = 'test';

// AppModule constructs these providers during integration-test bootstrap.
// Explicit test values prevent ConfigModule from falling back to local secrets.
process.env.JWT_ACCESS_SECRET = 'integration-test-access-secret';
process.env.JWT_REFRESH_SECRET = 'integration-test-refresh-secret';
process.env.JWT_ACCESS_TTL = '15m';
process.env.JWT_REFRESH_TTL = '7d';
process.env.BCRYPT_ROUNDS = '4';
process.env.FRONTEND_ORIGIN = 'http://localhost:5173';
process.env.GEMINI_API_KEY = 'integration-test-placeholder';
process.env.GEMINI_MODEL = 'integration-test-model';
