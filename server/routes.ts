import type { Express } from "express";
import { createServer, type Server } from "http";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

// OpenRouter config
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
const LOWCOST_MODEL_PRIMARY = process.env.LOWCOST_MODEL_PRIMARY || 'deepseek/deepseek-r1:free';
const LOWCOST_MODEL_BACKUP = process.env.LOWCOST_MODEL_BACKUP || 'meta-llama/llama-3.1-8b-instruct:free';
const CRITICAL_MODEL = process.env.CRITICAL_MODEL || 'deepseek/deepseek-r1:200k';

// AI generation functions
async function callOpenRouter(prompt: string, model: string): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured');
  }

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://sentinel-local.app',
      'X-Title': 'Sentinel Local'
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

async function lowCostGenerate(prompt: string): Promise<string> {
  try {
    return await callOpenRouter(prompt, LOWCOST_MODEL_PRIMARY);
  } catch (error) {
    try {
      return await callOpenRouter(prompt, LOWCOST_MODEL_BACKUP);
    } catch {
      // Safe fallback
      if (prompt.includes('review') || prompt.includes('reply')) {
        return "Thank you so much for your feedback! We truly appreciate your business and are always here to help. Please don't hesitate to reach out if you need anything.";
      }
      return "🔧 Need reliable HVAC service? We're available 24/7 for all your heating and cooling needs. Call us today for fast, professional service!";
    }
  }
}

async function criticalGenerate(prompt: string): Promise<string> {
  try {
    return await callOpenRouter(prompt, CRITICAL_MODEL);
  } catch {
    // Deterministic fallback
    if (prompt.includes('bid') || prompt.includes('keyword')) {
      return "Based on current performance data, consider increasing bids on high-converting keywords during peak hours (6pm-10pm) when emergency calls are highest. Monitor cost-per-lead and pause underperforming keywords with conversion rates below 2%.";
    }
    return "Analysis suggests maintaining current strategy while monitoring key performance indicators. Consider incremental adjustments based on weekly performance data.";
  }
}

// JWT middleware
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = user;
    next();
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // AUTH ROUTES
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, password: hashedPassword, planTier: 'free' }
      });

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
      res.json({ token, user: { id: user.id, email: user.email, planTier: user.planTier } });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
      res.json({ token, user: { id: user.id, email: user.email, planTier: user.planTier } });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // REVIEWS ROUTES
  app.get('/api/reviews', authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.userId;

      let reviews = await prisma.review.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });

      // Generate AI replies for 4-5 star reviews without one
      reviews = await Promise.all(reviews.map(async (review) => {
        if (review.rating >= 4 && review.status === 'new' && !review.aiSuggestedReply) {
          const prompt = `Write a polite, professional response (2-3 sentences) to this ${review.rating}-star review: "${review.content}"`;
          const aiReply = await lowCostGenerate(prompt);
          
          const updated = await prisma.review.update({
            where: { id: review.id },
            data: { aiSuggestedReply: aiReply }
          });
          
          return updated;
        }
        return review;
      }));

      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/reviews/:id/approve-reply', authenticateToken, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const review = await prisma.review.findFirst({ where: { id, userId } });
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      const updated = await prisma.review.update({
        where: { id },
        data: { status: 'replied' }
      });

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/reviews/:id/escalate', authenticateToken, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const review = await prisma.review.findFirst({ where: { id, userId } });
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      const updated = await prisma.review.update({
        where: { id },
        data: { status: 'escalated' }
      });

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ADS ROUTES
  app.get('/api/ads/summary', authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.userId;

      const summary = await prisma.adSummary.findFirst({
        where: { userId },
        orderBy: { weekEnding: 'desc' }
      });

      if (!summary) {
        return res.json({ spend: 0, leads: 0, estRevenue: 0 });
      }

      res.json({
        spend: parseFloat(summary.spend.toString()),
        leads: summary.leads,
        estRevenue: parseFloat(summary.estRevenue.toString())
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // CHAT ROUTES
  app.get('/api/chat/history', authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.userId;

      const messages = await prisma.chatMessage.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' },
        take: 100
      });

      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/chat/send', authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.userId;
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message required' });
      }

      await prisma.chatMessage.create({
        data: { userId, role: 'user', content: message }
      });

      const prompt = `You are Sentinel, an AI marketing assistant for a local business. The business owner asks: "${message}". Provide a helpful, concise response (2-3 sentences) about their marketing, ads, or business performance.`;
      const aiResponse = await criticalGenerate(prompt);

      const assistantMessage = await prisma.chatMessage.create({
        data: { userId, role: 'assistant', content: aiResponse }
      });

      res.json(assistantMessage);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // MARKETING ROUTES
  app.get('/api/marketing/overview', authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.userId;

      const businessProfile = await prisma.businessProfileSetup.findUnique({
        where: { userId }
      });

      const adsCampaign = await prisma.adsCampaignPlan.findFirst({
        where: { userId, status: 'active' },
        orderBy: { lastOptimizedAt: 'desc' }
      });

      const recentOptimizations = await prisma.optimizationAction.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
        take: 5
      });

      res.json({
        businessProfile,
        adsCampaign,
        recentOptimizations
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/marketing/optimize', authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.userId;
      const { area } = req.body;

      if (!area || !['GBP', 'ADS'].includes(area)) {
        return res.status(400).json({ error: 'Invalid area. Must be "GBP" or "ADS"' });
      }

      let suggestion: string;
      let actionSummary: string;

      if (area === 'GBP') {
        const businessProfile = await prisma.businessProfileSetup.findUnique({
          where: { userId }
        });

        const prompt = `Create a promotional Google Business Profile post (2-3 sentences) for a business with this description: "${businessProfile?.businessDesc || 'local service business'}". Make it engaging and include a call-to-action.`;
        suggestion = await lowCostGenerate(prompt);
        actionSummary = `Generated new GBP promotional post: "${suggestion.substring(0, 100)}..."`;
      } else {
        const adsCampaign = await prisma.adsCampaignPlan.findFirst({
          where: { userId, status: 'active' },
          orderBy: { lastOptimizedAt: 'desc' }
        });

        const keywords = adsCampaign?.keywordsJSON ? JSON.stringify(adsCampaign.keywordsJSON) : 'emergency HVAC services';
        const prompt = `Suggest one specific Google Ads optimization (bid adjustment, keyword change, or budget reallocation) for a campaign targeting: ${keywords}. Be specific with numbers.`;
        suggestion = await criticalGenerate(prompt);
        actionSummary = `Ads optimization suggested: ${suggestion.substring(0, 100)}...`;
      }

      await prisma.optimizationAction.create({
        data: {
          userId,
          area,
          actionSummary,
          impactNote: 'Pending implementation'
        }
      });

      res.json({ suggestion, area });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
