import { PrismaClient } from '@prisma/client';
import { criticalGenerate } from '../services/llmClient.js';

const prisma = new PrismaClient();

export default async function chatRoutes(fastify) {
  // GET /api/chat/history
  fastify.get('/history', {
    onRequest: [fastify.authenticate]
  }, async (request) => {
    const userId = request.user.userId;

    const messages = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      take: 100 // Last 100 messages
    });

    return messages;
  });

  // POST /api/chat/send
  fastify.post('/send', {
    onRequest: [fastify.authenticate]
  }, async (request) => {
    const userId = request.user.userId;
    const { message } = request.body;

    if (!message) {
      return { error: 'Message required' };
    }

    // Save user message
    await prisma.chatMessage.create({
      data: {
        userId,
        role: 'user',
        content: message
      }
    });

    // Generate AI response
    const prompt = `You are Sentinel, an AI marketing assistant for a local business. The business owner asks: "${message}". Provide a helpful, concise response (2-3 sentences) about their marketing, ads, or business performance.`;
    const aiResponse = await criticalGenerate(prompt);

    // Save assistant message
    const assistantMessage = await prisma.chatMessage.create({
      data: {
        userId,
        role: 'assistant',
        content: aiResponse
      }
    });

    return assistantMessage;
  });
}
