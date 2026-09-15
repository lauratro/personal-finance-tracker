import { PrismaService } from '../../../prisma/prisma.service';

function assertTestDatabase(): void {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is missing');
  }

  const databaseName = new URL(databaseUrl).pathname.replace(/^\//, '');

  if (!databaseName.endsWith('_test')) {
    throw new Error(
      `Refusing to clean unsafe database "${databaseName}". ` +
        'The database name must end with "_test".',
    );
  }
}

export async function cleanDatabase(prisma: PrismaService): Promise<void> {
  assertTestDatabase();

  await prisma.$transaction([
    prisma.dashboardWidget.deleteMany(),
    prisma.dashboard.deleteMany(),
    prisma.netWorthItem.deleteMany(),
    prisma.netWorthSnapshot.deleteMany(),
    prisma.investment.deleteMany(),
    prisma.refreshToken.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}
