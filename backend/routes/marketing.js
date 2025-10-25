import { PrismaClient } from '@prisma/client';
import { lowCostGenerate, criticalGenerate } from '../services/llmClient.js';

const prisma = new PrismaClient();

export default async function marketingRoutes(fastify) {
  // GET /api/marketing/overview
  fastify.get('/overview', {
    onRequest: [fastify.authenticate]
  }, async (request) => {
    const userId = request.user.userId;

    // Get BusinessProfileSetup
    const businessProfile = await prisma.businessProfileSetup.findUnique({
      where: { userId }
    });

    // Get most recent active AdsCampaignPlan
    const adsCampaign = await prisma.adsCampaignPlan.findFirst({
      where: { userId, status: 'active' },
      orderBy: { lastOptimizedAt: 'desc' }
    });

    // Get 5 most recent OptimizationActions
    const recentOptimizations = await prisma.optimizationAction.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 5
    });

    return {
      businessProfile,
      adsCampaign,
      recentOptimizations
    };
  });

  // POST /api/marketing/optimize
  fastify.post('/optimize', {
    onRequest: [fastify.authenticate]
  }, async (request) => {
    const userId = request.user.userId;
    const { area } = request.body;

    if (!area || !['GBP', 'ADS'].includes(area)) {
      return { error: 'Invalid area. Must be "GBP" or "ADS"' };
    }

    let suggestion;
    let actionSummary;

    if (area === 'GBP') {
      // Generate GBP promotional post
      const businessProfile = await prisma.businessProfileSetup.findUnique({
        where: { userId }
      });

      const prompt = `Create a promotional Google Business Profile post (2-3 sentences) for a business with this description: "${businessProfile?.businessDesc || 'local service business'}". Make it engaging and include a call-to-action.`;
      suggestion = await lowCostGenerate(prompt);
      actionSummary = `Generated new GBP promotional post: "${suggestion.substring(0, 100)}..."`;
    } else {
      // Generate Ads optimization suggestion
      const adsCampaign = await prisma.adsCampaignPlan.findFirst({
        where: { userId, status: 'active' },
        orderBy: { lastOptimizedAt: 'desc' }
      });

      const keywords = adsCampaign?.keywordsJSON ? JSON.stringify(adsCampaign.keywordsJSON) : 'emergency HVAC services';
      const prompt = `Suggest one specific Google Ads optimization (bid adjustment, keyword change, or budget reallocation) for a campaign targeting: ${keywords}. Be specific with numbers.`;
      suggestion = await criticalGenerate(prompt);
      actionSummary = `Ads optimization suggested: ${suggestion.substring(0, 100)}...`;
    }

    // Log the optimization action
    await prisma.optimizationAction.create({
      data: {
        userId,
        area,
        actionSummary,
        impactNote: 'Pending implementation'
      }
    });

    return {
      suggestion,
      area
    };
  });
}
