# Sentinel Local

**Sentinel Local is NOT just analytics.** It is an AI marketing operator that creates, maintains, and continuously optimizes a client's Google Business Profile and Google Ads campaigns for local businesses.

The platform intelligently tunes keywords, bids, and promotional content, logging every optimization action so business owners can see exactly what's being done for them.

## Overview

Sentinel Local is a production-grade AI marketing manager designed for local businesses. Each client receives:

- **Reputation Module** - Google reviews ingestion with AI-powered reply drafting
- **Ads Module** - Google Ads campaign creation, management, and optimization suggestions
- **Owner Chat Module** - Natural language Q&A and action requests with AI assistance
- **Campaign Management** - Automated creation and maintenance of Google Business Profile and Ads campaigns
- **Optimization Tracking** - Complete audit log of all AI-driven marketing actions

## Tech Stack

### Frontend
- **React** with Vite for fast development
- **TypeScript** for type safety
- **Tailwind CSS** for modern, responsive design
- **Wouter** for lightweight routing
- **TanStack Query** for server state management
- **Shadcn UI** for accessible component primitives

### Backend
- **Node.js** with Express
- **PostgreSQL** database
- **Drizzle ORM** for type-safe database queries
- **JWT** for secure authentication
- **bcrypt** for password hashing

### AI Integration (Planned)
- **OpenRouter API** for flexible AI model access
- Dual-tier strategy: low-cost models for routine tasks, premium models for critical decisions
- Graceful fallbacks for rate limits and failures

## Features

### Current MVP
✅ User authentication with email/password  
✅ Dashboard with key metrics (spend, leads, revenue, reputation health)  
✅ Reviews management with AI-suggested replies  
✅ Active campaign status monitoring  
✅ On-demand AI optimization suggestions  
✅ Optimization action audit log  
✅ Chat interface for AI assistant  
✅ Responsive, professional UI  

### Planned Integrations
🔄 Google Business Profile API for live review ingestion  
🔄 Google Ads API for campaign creation and management  
🔄 OpenRouter API for production AI generation  
🔄 Automated optimization scheduling  
🔄 Email/SMS notifications  

## Prerequisites

- **Node.js** (v20 or later)
- **PostgreSQL** (running locally or accessible remotely)
- **npm** or **yarn** package manager

## Installation

1. **Clone the repository** (or download the source code)

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/sentinel_local
   
   # Authentication
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # OpenRouter API (Optional - stubbed in MVP)
   OPENROUTER_API_KEY=your-openrouter-api-key
   OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
   LOWCOST_MODEL_PRIMARY=deepseek/deepseek-r1:free
   LOWCOST_MODEL_BACKUP=meta-llama/llama-3.1-8b-instruct:free
   CRITICAL_MODEL=deepseek/deepseek-r1:200k
   ```

   **Note:** The application runs without OpenRouter credentials using intelligent fallback responses.

4. **Run database migrations**
   ```bash
   npm run db:push
   ```

5. **Seed the database** (optional - creates demo data)
   ```bash
   npm run seed
   ```

## Running the Application

### Development Mode

Start both frontend and backend concurrently:

```bash
npm run dev
```

This will:
- Start the Express backend on `http://localhost:5000`
- Start the Vite frontend on `http://localhost:5000` (served through Express)
- Enable hot module replacement for rapid development

### Production Mode

```bash
npm run build
npm start
```

## Demo Credentials

If you ran the seed script, you can log in with:

- **Email:** demo@hvac.com
- **Password:** demo123

This demo account includes:
- Sample reviews (5-star, 4-star, and escalated 2-star)
- Active Google Business Profile setup
- Live Google Ads campaign plan
- Optimization action history
- Chat message history

## Project Structure

```
sentinel-local/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/           # Shadcn base components
│   │   │   ├── MetricCard.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── StarRating.tsx
│   │   │   ├── ReviewCard.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ActiveCampaignsCard.tsx
│   │   │   ├── OptimizationTimeline.tsx
│   │   │   └── Navigation.tsx
│   │   ├── pages/            # Route pages
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Reviews.tsx
│   │   │   └── Chat.tsx
│   │   ├── lib/              # Utilities
│   │   └── App.tsx           # Main app component
│   └── index.html
├── server/                    # Backend Express application
│   ├── routes.ts             # API route definitions
│   ├── storage.ts            # Data persistence layer
│   └── index.ts              # Server entry point
├── shared/                    # Shared TypeScript types
│   └── schema.ts             # Database schema definitions
├── db/                        # Database files (if using SQLite)
├── .env                       # Environment variables (create this)
├── package.json
└── README.md
```

## Key Concepts

### AI Model Strategy

Sentinel Local uses a dual-tier AI approach:

1. **Low-Cost Generation** (`lowCostGenerate`)
   - Used for polite review replies (4-5 stars)
   - Performance summaries
   - Google Business Profile promotional posts
   - Primary/backup retry pattern for reliability
   - Graceful fallback to safe placeholder text

2. **Critical Generation** (`criticalGenerate`)
   - Used for ROI analysis and explanations
   - Ad spend recommendations
   - Bid adjustment suggestions
   - Direct fallback to deterministic metrics-based responses

This ensures cost efficiency while maintaining reliability for business-critical insights.

### Data Model

**Core Entities:**
- `User` - Business owner accounts with plan tier
- `Review` - Customer reviews with AI-suggested replies
- `AdSummary` - Weekly campaign performance snapshots
- `ChatMessage` - Conversation history with AI assistant
- `BusinessProfileSetup` - Google Business Profile configuration
- `AdsCampaignPlan` - Active campaign structure with keywords/bids
- `OptimizationAction` - Audit log of AI-driven changes

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate and receive JWT

### Reviews
- `GET /api/reviews` - List all reviews for logged-in user
- `POST /api/reviews/:id/approve-reply` - Approve AI-suggested reply
- `POST /api/reviews/:id/escalate` - Mark review for manual attention

### Ads
- `GET /api/ads/summary` - Get latest campaign performance

### Chat
- `GET /api/chat/history` - Retrieve conversation history
- `POST /api/chat/send` - Send message and receive AI response

### Marketing (Planned)
- `GET /api/marketing/overview` - Get active campaign status and recent optimizations
- `POST /api/marketing/optimize` - Trigger AI optimization for GBP or Ads

All non-auth endpoints require JWT authorization via `Authorization: Bearer <token>` header.

## Development Workflow

1. **Make changes** to frontend or backend code
2. **Watch for auto-reload** - Vite handles HMR for frontend, nodemon restarts backend
3. **Test features** in the browser at `http://localhost:5000`
4. **Check logs** in the terminal for errors or debug output

## Future Enhancements

- **Google API Integration** - Live data instead of stubs
- **Advanced AI Models** - GPT-4 integration for sophisticated responses
- **Multi-user Support** - Agency accounts managing multiple businesses
- **Performance Analytics** - Advanced reporting and forecasting
- **Automated Actions** - AI can apply optimizations directly with approval workflows
- **Mobile App** - React Native companion app

## Security Notes

⚠️ **Important for Production:**
- Change `JWT_SECRET` to a strong, random value
- Use HTTPS in production
- Enable PostgreSQL SSL connections
- Store API keys in secure environment variables, not in code
- Implement rate limiting on authentication endpoints
- Add CORS restrictions for production domains

## Troubleshooting

**Database Connection Issues:**
- Verify PostgreSQL is running: `pg_isready`
- Check `DATABASE_URL` format in `.env`
- Ensure database user has create/read/write permissions

**Port Already in Use:**
- Check if another process is using port 5000: `lsof -i :5000`
- Change port in `server/index.ts` if needed

**Build Errors:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf client/dist`

## Contributing

This project follows a clean architecture with separation of concerns:
- Keep business logic in the backend
- Use TypeScript for type safety
- Follow existing component patterns
- Write meaningful commit messages

## License

Proprietary - All rights reserved

---

**Built with ❤️ for local businesses who deserve AI-powered marketing without the complexity.**
