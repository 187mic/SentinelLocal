We are updating the plan based on the current README. You must correct and extend the implementation details below. Treat these as MVP requirements, not future roadmap.

1. STACK AND FOLDER STRUCTURE (CORRECTION)
Do NOT build Express + Drizzle. Build Fastify + Prisma.
Project layout MUST be:
- /backend (Fastify server, JWT auth plugin, route files, llmClient service)
- /frontend (React + Vite + Tailwind)
- /prisma (Prisma schema + migrations)
- /scripts (seed.js)
- /config (env loader)
Root package.json should include scripts for backend, frontend, dev, seed, and prisma:migrate.

2. REQUIRED PRISMA MODELS (MVP)
In addition to User, Review, AdSummary, ChatMessage:
You MUST include these models in schema.prisma and wire their relations into User:

model BusinessProfileSetup {
id String @id @default(cuid())
user User @relation(fields: [userId], references: [id])
userId String
status String // "not_started" | "in_progress" | "live"
businessDesc String? // proposed GBP description text
categories String? // comma-separated categories
servicesOffered String? // comma-separated service keywords
serviceArea String? // comma-separated zips / cities
hoursJSON Json? // proposed hours structure
lastUpdated DateTime @default(now())
}

model AdsCampaignPlan {
id String @id @default(cuid())
user User @relation(fields: [userId], references: [id])
userId String
campaignName String
geoTargets String? // comma-separated zips / cities
keywordsJSON Json // [{keyword, matchType, bid}]
negativeKeywords String? // comma-separated negatives
dailyBudget Decimal @db.Decimal(10,2)
bidStrategyNote String? // plain-English rationale
status String // "draft" | "active" | "paused"
lastOptimizedAt DateTime @default(now())
}

model OptimizationAction {
id String @id @default(cuid())
user User @relation(fields: [userId], references: [id])
userId String
timestamp DateTime @default(now())
area String // "GBP" | "ADS"
actionSummary String // human-readable summary like "Paused keyword 'cheap furnace fix'..."
impactNote String? // optional outcome note

Update model User to include:
businessProfileSetup BusinessProfileSetup?
adsCampaignPlans AdsCampaignPlan[]
optimizationActions OptimizationAction[]

These three entities (BusinessProfileSetup, AdsCampaignPlan, OptimizationAction) ARE part of MVP, not future work.

3. SEED SCRIPT (MVP CONTENT)
In /scripts/seed.js:
- Create 1 demo User with email demo@hvac.com / password demo123 / planTier "growth".
- Create BusinessProfileSetup for that user with:
status="live"
businessDesc="We are a 24/7 emergency HVAC and furnace repair company serving Tacoma and Bellevue."
categories="HVAC contractor, Emergency AC repair"
servicesOffered="24hr furnace repair, emergency AC repair, seasonal tune-up"
serviceArea="Tacoma, Bellevue, Seattle"
hoursJSON representing 24/7 availability
- Create AdsCampaignPlan for that user with:
campaignName="24/7 Emergency HVAC Leads"
geoTargets="Tacoma,Bellevue"
keywordsJSON including high-intent terms like:
[{keyword:"24hr AC repair bellevue", matchType:"phrase", bid:2.6},
{keyword:"emergency furnace repair tacoma", matchType:"exact", bid:3.1}]
negativeKeywords="free, salary, DIY"
dailyBudget=50.00
bidStrategyNote="Focus budget on after-hours emergency calls where close rate is highest."
status="active"
- /backend/routes/auth.js
- /backend/routes/reviews.js
- /backend/routes/ads.js
- /backend/routes/chat.js
- /backend/routes/marketing.js
Protect all except /api/auth/register and /api/auth/login with JWT middleware.

Implement:
GET /api/marketing/overview
Returns:
- BusinessProfileSetup (for the logged-in user)
- Most recent active AdsCampaignPlan
- The 5 most recent OptimizationAction rows, newest first
This powers the Active Campaigns card.

POST /api/marketing/optimize
Body: { "area": "GBP" | "ADS" }
Behavior:

- If area === "GBP":
Call lowCostGenerate() with a prompt asking for a new GBP promo post.
Create new OptimizationAction row area="GBP" with that summary.
Return that suggestion string.
- If area === "ADS":
Call criticalGenerate() with a prompt asking for next bid/keyword optimization.
Create new OptimizationAction row area="ADS" with that summary.
Return that suggestion string.
For MVP we are not calling Google APIs; we’re simulating the proposed optimization and logging it.

These /api/marketing/* endpoints are NOT "planned". They are required in the first code generation.

6. FRONTEND REQUIREMENTS (MVP)
React + Vite + Tailwind in /frontend.
Pages:
- Login / Register
- Dashboard
- Reviews
- Chat

Dashboard.jsx MUST render FOUR things:
1. "This Week's Results" (spend, leads, estRevenue) from /api/ads/summary
2. "Reputation Health" (avg star rating, #new reviews)
3. "Open Fires" (escalated low-star reviews)
4. "Active Campaigns":
- Fetch from GET /api/marketing/overview
- Show GBP status (not_started / in_progress / live)
- Show Ads status (draft / active / paused)
- Show the latest OptimizationAction.actionSummary lines (ex: "Paused keyword 'cheap furnace fix'...")
- Include two buttons:
[Optimize Google Profile]
[Optimize Ads Budget]
Each button calls POST /api/marketing/optimize with {area:"GBP"} or {area:"ADS"}, then shows the suggestion text returned.

Reviews.jsx:
Table of reviews with rating, content snippet, aiSuggestedReply, Approve button (POST /api/reviews/:id/approve-reply), Escalate button (POST /api/reviews/:id/escalate).
If a review is rating >= 4 and status="new" and aiSuggestedReply is empty, call lowCostGenerate() server-side before returning it so the table always has a draft reply.

Chat.jsx:
Shows conversation history from /api/chat/history
On send, POST /api/chat/send with the user's question; backend uses criticalGenerate() to create assistant reply, saves it, returns it.

7. README ALIGNMENT
Update README.md language so that:
- Stack is Fastify + Prisma, not Express + Drizzle.
- /api/marketing/overview and /api/marketing/optimize are described as part of current MVP, not "planned".
- Dashboard is explicitly described as having the "Active Campaigns" card plus the two optimization buttons that call /api/marketing/optimize.

Please acknowledge all of the above, restate the full updated plan back to me in your own words, and then start generating the codebase using this updated plan.