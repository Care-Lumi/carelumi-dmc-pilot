// AI Cost Calculator
// Pricing as of January 2025 (per 1M tokens)

interface ModelPricing {
  input: number // Cost per 1M input tokens
  output: number // Cost per 1M output tokens
}

// Exact model names from our codebase
const MODEL_PRICING: Record<string, ModelPricing> = {
  "gemini-2.0-flash-exp": {
    input: 0.0001, // $0.10 per 1M tokens
    output: 0.0004, // $0.40 per 1M tokens
  },
  "gpt-4o": {
    input: 0.0025, // $2.50 per 1M tokens
    output: 0.01, // $10.00 per 1M tokens
  },
  "claude-sonnet-4": {
    input: 0.003, // $3.00 per 1M tokens
    output: 0.015, // $15.00 per 1M tokens
  },
}

export interface AIUsage {
  provider: "gemini" | "openai" | "claude"
  model: string
  inputTokens: number
  outputTokens: number
}

/**
 * Calculate the cost of an AI API call in USD
 * @param usage - The AI usage details (provider, model, tokens)
 * @returns Cost in USD (6 decimal places)
 */
export function calculateAICost(usage: AIUsage): number {
  const pricing = MODEL_PRICING[usage.model]

  if (!pricing) {
    console.warn(`[CareLumi] No pricing found for model: ${usage.model}`)
    return 0
  }

  // Calculate cost: (tokens / 1,000,000) * price per million
  const inputCost = (usage.inputTokens / 1_000_000) * pricing.input
  const outputCost = (usage.outputTokens / 1_000_000) * pricing.output

  return Number((inputCost + outputCost).toFixed(6))
}

/**
 * Get provider name from model string
 */
export function getProviderFromModel(model: string): "gemini" | "openai" | "claude" {
  if (model.includes("gemini")) return "gemini"
  if (model.includes("gpt") || model.includes("openai")) return "openai"
  if (model.includes("claude")) return "claude"
  return "gemini" // default
}
