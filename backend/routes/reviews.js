import { PrismaClient } from '@prisma/client';
import { lowCostGenerate } from '../services/llmClient.js';

const prisma = new PrismaClient();

export default async function reviewsRoutes(fastify) {
  // GET /api/reviews
  fastify.get('/', {
    onRequest: [fastify.authenticate]
  }, async (request) => {
    const userId = request.user.userId;

    let reviews = await prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    // Generate AI replies for 4-5 star reviews without one
    reviews = await Promise.all(reviews.map(async (review) => {
      if (review.rating >= 4 && review.status === 'new' && !review.aiSuggestedReply) {
        const prompt = `Write a polite, professional response (2-3 sentences) to this ${review.rating}-star review: "${review.content}"`;
        const aiReply = await lowCostGenerate(prompt);
        
        // Update in database
        const updated = await prisma.review.update({
          where: { id: review.id },
          data: { aiSuggestedReply: aiReply }
        });
        
        return updated;
      }
      return review;
    }));

    return reviews;
  });

  // POST /api/reviews/:id/approve-reply
  fastify.post('/:id/approve-reply', {
    onRequest: [fastify.authenticate]
  }, async (request, reply) => {
    const { id } = request.params;
    const userId = request.user.userId;

    // Verify ownership
    const review = await prisma.review.findFirst({
      where: { id, userId }
    });

    if (!review) {
      return reply.code(404).send({ error: 'Review not found' });
    }

    // Update status to replied
    const updated = await prisma.review.update({
      where: { id },
      data: { status: 'replied' }
    });

    return updated;
  });

  // POST /api/reviews/:id/escalate
  fastify.post('/:id/escalate', {
    onRequest: [fastify.authenticate]
  }, async (request, reply) => {
    const { id } = request.params;
    const userId = request.user.userId;

    // Verify ownership
    const review = await prisma.review.findFirst({
      where: { id, userId }
    });

    if (!review) {
      return reply.code(404).send({ error: 'Review not found' });
    }

    // Update status to escalated
    const updated = await prisma.review.update({
      where: { id },
      data: { status: 'escalated' }
    });

    return updated;
  });
}
