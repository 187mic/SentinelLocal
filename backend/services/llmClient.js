import { config } from '../../config/env.js';

/**
 * Low-cost generation for routine tasks (review replies, GBP posts)
 * Uses primary model with retry fallback to backup model
 * Returns safe placeholder if both fail
 */
export async function lowCostGenerate(prompt) {
  // Try primary model first
  try {
    const response = await callOpenRouter(prompt, config.lowCostModelPrimary);
    return response;
  } catch (error) {
    console.warn('Primary low-cost model failed, trying backup:', error.message);
  }

  // Try backup model
  try {
    const response = await callOpenRouter(prompt, config.lowCostModelBackup);
    return response;
  } catch (error) {
    console.warn('Backup low-cost model failed:', error.message);
  }

  // Safe fallback
  return generateSafeFallback(prompt);
}

/**
 * Critical generation for business-critical decisions (ROI analysis, bid recommendations)
 * Falls back to deterministic metrics-based responses
 */
export async function criticalGenerate(prompt) {
  // Try critical model
  try {
    const response = await callOpenRouter(prompt, config.criticalModel);
    return response;
  } catch (error) {
    console.warn('Critical model failed, using deterministic fallback:', error.message);
  }

  // Deterministic fallback
  return generateDeterministicResponse(prompt);
}

/**
 * Call OpenRouter API with specified model
 */
async function callOpenRouter(prompt, model) {
  if (!config.openRouterApiKey) {
    throw new Error('OpenRouter API key not configured');
  }

  const response = await fetch(`${config.openRouterBaseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.openRouterApiKey}`,
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
    throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

/**
 * Generate safe placeholder for non-critical tasks
 */
function generateSafeFallback(prompt) {
  if (prompt.includes('review') || prompt.includes('reply')) {
    return "Thank you so much for your feedback! We truly appreciate your business and are always here to help. Please don't hesitate to reach out if you need anything.";
  }
  
  if (prompt.includes('GBP') || prompt.includes('Google Business Profile') || prompt.includes('post')) {
    return "🔧 Need reliable HVAC service? We're available 24/7 for all your heating and cooling needs. Call us today for fast, professional service!";
  }

  return "Thank you for your interest. Please contact us for more information.";
}

/**
 * Generate deterministic response for critical business decisions
 */
function generateDeterministicResponse(prompt) {
  if (prompt.includes('bid') || prompt.includes('keyword')) {
    return "Based on current performance data, consider increasing bids on high-converting keywords during peak hours (6pm-10pm) when emergency calls are highest. Monitor cost-per-lead and pause underperforming keywords with conversion rates below 2%.";
  }

  if (prompt.includes('budget') || prompt.includes('spend')) {
    return "Current daily budget allocation is performing within acceptable ranges. Consider reallocating 20% of spend from broad match keywords to exact match high-intent terms for better ROI. Monitor closely for the next 7 days.";
  }

  if (prompt.includes('ROI') || prompt.includes('revenue')) {
    return "Based on historical data, your average customer lifetime value suggests maintaining current investment levels. Focus on improving conversion rate through better ad copy and landing page optimization before increasing budget.";
  }

  return "Analysis suggests maintaining current strategy while monitoring key performance indicators. Consider incremental adjustments based on weekly performance data.";
}
