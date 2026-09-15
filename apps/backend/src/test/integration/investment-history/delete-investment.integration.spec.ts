import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '../../../prisma/prisma.service';
import { cleanDatabase } from '../helpers/clean-database';
import { createIntegrationApp } from '../helpers/create-integration-app';

type AuthResponse = {
  accessToken: string;
};

describe('Investment ownership (integration)', () => {
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

  it("prevents a user from reading, editing, or deleting another user's investment", async () => {
    const owner = await register('owner@example.com');
    const otherUser = await register('other@example.com');

    const created = await request(app.getHttpServer())
      .post('/api/investment-history')
      .set('Authorization', `Bearer ${owner.accessToken}`)
      .send({
        name: 'Portfolio ETF',
        assetType: 'ETF',
        boughtDate: '2026-01-15T00:00:00.000Z',
        totalAmountInvested: 1000,
        costSingleStock: 100,
        quantity: 10,
      })
      .expect(201);

    const investmentId = created.body.id as string;
    const otherUserAuthorization = `Bearer ${otherUser.accessToken}`;

    await request(app.getHttpServer())
      .get(`/api/investment-history/${investmentId}`)
      .set('Authorization', otherUserAuthorization)
      .expect(404);

    await request(app.getHttpServer())
      .patch(`/api/investment-history/${investmentId}`)
      .set('Authorization', otherUserAuthorization)
      .send({ name: 'Unauthorized change' })
      .expect(404);

    await request(app.getHttpServer())
      .delete(`/api/investment-history/${investmentId}`)
      .set('Authorization', otherUserAuthorization)
      .expect(404);

    const ownerResponse = await request(app.getHttpServer())
      .get(`/api/investment-history/${investmentId}`)
      .set('Authorization', `Bearer ${owner.accessToken}`)
      .expect(200);

    expect(ownerResponse.body.name).toBe('Portfolio ETF');
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
