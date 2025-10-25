import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root
dotenv.config({ path: join(__dirname, '..', '.env') });

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  databaseUrl: process.env.DATABASE_URL,
  openRouterApiKey: process.env.OPENROUTER_API_KEY || '',
  openRouterBaseUrl: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  lowCostModelPrimary: process.env.LOWCOST_MODEL_PRIMARY || 'deepseek/deepseek-r1:free',
  lowCostModelBackup: process.env.LOWCOST_MODEL_BACKUP || 'meta-llama/llama-3.1-8b-instruct:free',
  criticalModel: process.env.CRITICAL_MODEL || 'deepseek/deepseek-r1:200k'
};
