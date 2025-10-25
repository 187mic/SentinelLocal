import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCors from '@fastify/cors';
import { config } from '../config/env.js';
import authRoutes from './routes/auth.js';
import reviewsRoutes from './routes/reviews.js';
import adsRoutes from './routes/ads.js';
import chatRoutes from './routes/chat.js';
import marketingRoutes from './routes/marketing.js';

const fastify = Fastify({
  logger: true
});

// Register JWT plugin
await fastify.register(fastifyJwt, {
  secret: config.jwtSecret
});

// Register CORS
await fastify.register(fastifyCors, {
  origin: true
});

// JWT verification decorator
fastify.decorate('authenticate', async function(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized' });
  }
});

// Register routes
await fastify.register(authRoutes, { prefix: '/api/auth' });
await fastify.register(reviewsRoutes, { prefix: '/api/reviews' });
await fastify.register(adsRoutes, { prefix: '/api/ads' });
await fastify.register(chatRoutes, { prefix: '/api/chat' });
await fastify.register(marketingRoutes, { prefix: '/api/marketing' });

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: config.port, host: '0.0.0.0' });
    console.log(`🚀 Sentinel Local API running on http://0.0.0.0:${config.port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
