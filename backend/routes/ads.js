import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function adsRoutes(fastify) {
  // GET /api/ads/summary
  fastify.get('/summary', {
    onRequest: [fastify.authenticate]
  }, async (request) => {
    const userId = request.user.userId;

    // Get most recent ad summary
    const summary = await prisma.adSummary.findFirst({
      where: { userId },
      orderBy: { weekEnding: 'desc' }
    });

    if (!summary) {
      // Return default values if no data
      return {
        spend: 0,
        leads: 0,
        estRevenue: 0
      };
    }

    return {
      spend: parseFloat(summary.spend),
      leads: summary.leads,
      estRevenue: parseFloat(summary.estRevenue)
    };
  });
}
