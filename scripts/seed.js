import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@hvac.com' },
    update: {},
    create: {
      email: 'demo@hvac.com',
      password: hashedPassword,
      planTier: 'growth'
    }
  });

  console.log('✅ Created demo user:', user.email);

  // Create BusinessProfileSetup
  await prisma.businessProfileSetup.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      status: 'live',
      businessDesc: 'We are a 24/7 emergency HVAC and furnace repair company serving Tacoma and Bellevue.',
      categories: 'HVAC contractor, Emergency AC repair',
      servicesOffered: '24hr furnace repair, emergency AC repair, seasonal tune-up',
      serviceArea: 'Tacoma, Bellevue, Seattle',
      hoursJSON: {
        monday: '24 hours',
        tuesday: '24 hours',
        wednesday: '24 hours',
        thursday: '24 hours',
        friday: '24 hours',
        saturday: '24 hours',
        sunday: '24 hours'
      }
    }
  });

  console.log('✅ Created Business Profile Setup');

  // Create AdsCampaignPlan
  await prisma.adsCampaignPlan.create({
    data: {
      userId: user.id,
      campaignName: '24/7 Emergency HVAC Leads',
      geoTargets: 'Tacoma,Bellevue',
      keywordsJSON: [
        { keyword: '24hr AC repair bellevue', matchType: 'phrase', bid: 2.6 },
        { keyword: 'emergency furnace repair tacoma', matchType: 'exact', bid: 3.1 },
        { keyword: 'emergency HVAC bellevue', matchType: 'phrase', bid: 2.8 },
        { keyword: 'furnace repair tacoma', matchType: 'broad', bid: 1.9 },
        { keyword: 'AC repair near me', matchType: 'phrase', bid: 2.4 }
      ],
      negativeKeywords: 'free, salary, DIY',
      dailyBudget: 50.00,
      bidStrategyNote: 'Focus budget on after-hours emergency calls where close rate is highest.',
      status: 'active'
    }
  });

  console.log('✅ Created Ads Campaign Plan');

  // Create sample reviews
  const reviews = [
    {
      userId: user.id,
      rating: 5,
      content: 'Amazing service! They came out at 11pm when our furnace died. Fixed it in 30 minutes. Will definitely call again!',
      sourcePlatform: 'google',
      status: 'new',
      aiSuggestedReply: 'Thank you so much for the kind words! We\'re always here 24/7 for emergencies. It was our pleasure to help get your heat back on quickly. We appreciate your business!'
    },
    {
      userId: user.id,
      rating: 4,
      content: 'Good work but a bit pricey for what was done. Tech was professional though.',
      sourcePlatform: 'google',
      status: 'new',
      aiSuggestedReply: 'We appreciate your feedback! Our pricing reflects our 24/7 availability and certified technicians. We\'re glad you had a positive experience with our team. Thank you for choosing us!'
    },
    {
      userId: user.id,
      rating: 2,
      content: 'Waited 3 hours for the tech to show up. Not happy with the \'emergency\' response time.',
      sourcePlatform: 'google',
      status: 'escalated'
    },
    {
      userId: user.id,
      rating: 5,
      content: 'Best HVAC company in Tacoma! Always reliable and fair pricing.',
      sourcePlatform: 'google',
      status: 'replied',
      aiSuggestedReply: 'Thank you for your continued trust!'
    }
  ];

  for (const review of reviews) {
    await prisma.review.create({ data: review });
  }

  console.log('✅ Created sample reviews');

  // Create ad summary
  await prisma.adSummary.create({
    data: {
      userId: user.id,
      weekEnding: new Date(),
      spend: 287.50,
      leads: 14,
      estRevenue: 4200.00
    }
  });

  console.log('✅ Created ad summary');

  // Create optimization actions
  const optimizations = [
    {
      userId: user.id,
      area: 'ADS',
      actionSummary: 'Increased bid on "emergency furnace repair tacoma" from $2.80 to $3.10 based on high conversion rate',
      impactNote: 'Expected 15% increase in emergency calls'
    },
    {
      userId: user.id,
      area: 'GBP',
      actionSummary: 'Posted seasonal promotion: "Winter furnace tune-up special - $79 (reg $129)"',
      impactNote: 'Generated 23 profile views in first 24 hours'
    },
    {
      userId: user.id,
      area: 'ADS',
      actionSummary: 'Added negative keyword "DIY" to prevent wasted spend on non-buyer traffic',
      impactNote: 'Reduced irrelevant clicks by 8%'
    },
    {
      userId: user.id,
      area: 'GBP',
      actionSummary: 'Updated business hours to highlight 24/7 emergency availability',
      impactNote: 'Increased after-hours call volume'
    },
    {
      userId: user.id,
      area: 'ADS',
      actionSummary: 'Paused underperforming keyword "cheap AC repair" (0.4% CTR)',
      impactNote: 'Reallocated $45/week to high-intent terms'
    }
  ];

  for (const opt of optimizations) {
    await prisma.optimizationAction.create({ data: opt });
  }

  console.log('✅ Created optimization actions');

  // Create chat history
  const messages = [
    {
      userId: user.id,
      role: 'user',
      content: 'How are my ads performing this week?'
    },
    {
      userId: user.id,
      role: 'assistant',
      content: 'Your ads are performing well! This week you spent $287.50 and generated 14 leads, with an estimated revenue of $4,200. That\'s a strong 14.6x ROAS. Your emergency keywords are converting especially well during evening hours.'
    },
    {
      userId: user.id,
      role: 'user',
      content: 'Should I increase my budget?'
    },
    {
      userId: user.id,
      role: 'assistant',
      content: 'Based on your current performance, I\'d recommend a modest 20% budget increase to $60/day. Your top keywords still have room to scale, and we\'re not hitting daily budget caps yet. This should capture more high-intent emergency calls without sacrificing ROI.'
    }
  ];

  for (const msg of messages) {
    await prisma.chatMessage.create({ data: msg });
  }

  console.log('✅ Created chat history');

  console.log('🎉 Seeding complete!');
  console.log('\nDemo credentials:');
  console.log('  Email: demo@hvac.com');
  console.log('  Password: demo123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
