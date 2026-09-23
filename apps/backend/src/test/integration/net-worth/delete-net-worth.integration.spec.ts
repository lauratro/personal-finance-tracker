import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '../../../prisma/prisma.service';
import { cleanDatabase } from '../helpers/clean-database';
import { createIntegrationApp } from '../helpers/create-integration-app';

type AuthResponse = {
  accessToken: string;
};

describe('Net worth ownership (integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    app = await createIntegrationApp();
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await cleanDatabase(prisma);
  });

  afterAll(async () => {
    if (prisma) {
      await cleanDatabase(prisma);
    }

    await app?.close();
  });

  it("prevents a user from deleting another user's snapshot", async () => {
    const owner = await register('owner@example.com');
    const otherUser = await register('other@example.com');

    const created = await request(app.getHttpServer())
      .post('/api/net-worth')
      .set('Authorization', `Bearer ${owner.accessToken}`)
      .send({
        monthStart: '2026-09-15T00:00:00.000Z',
        items: [
          {
            name: 'Savings account',
            category: 'SAVINGS_ACCOUNT',
            value: 5000,
          },
        ],
      })
      .expect(201);

    const snapshotId = created.body.id as string;

    await request(app.getHttpServer())
      .delete(`/api/net-worth/${snapshotId}`)
      .set('Authorization', `Bearer ${otherUser.accessToken}`)
      .expect(404);

    // Confirm that the unauthorized request did not delete the snapshot.
    const snapshotAfterUnauthorizedDelete =
      await prisma.netWorthSnapshot.findUnique({
        where: { id: snapshotId },
      });

    expect(snapshotAfterUnauthorizedDelete).not.toBeNull();

    // Confirm that the real owner can delete it.
    await request(app.getHttpServer())
      .delete(`/api/net-worth/${snapshotId}`)
      .set('Authorization', `Bearer ${owner.accessToken}`)
      .expect(200);

    const snapshotAfterOwnerDelete = await prisma.netWorthSnapshot.findUnique({
      where: { id: snapshotId },
    });

    expect(snapshotAfterOwnerDelete).toBeNull();
  });

  async function register(email: string): Promise<AuthResponse> {
    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email,
        password: 'integration-password',
        firstName: 'Integration',
        lastName: 'User',
      })
      .expect(201);

    return response.body as AuthResponse;
  }
});
