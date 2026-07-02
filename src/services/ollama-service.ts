import type { SimulationInput, SimulationResult } from '@/lib/types'

interface OllamaConfig {
  baseUrl: string
  model: string
}

const defaultConfig: OllamaConfig = {
  baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  model: process.env.OLLAMA_MODEL || 'llama3.2',
}

export async function queryOllama(prompt: string, config: Partial<OllamaConfig> = {}): Promise<string> {
  const { baseUrl, model } = { ...defaultConfig, ...config }

  try {
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: { temperature: 0.3, top_k: 10, top_p: 0.9 },
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.response || ''
  } catch (error) {
    console.warn('Ollama query failed, using fallback analysis:', error)
    return ''
  }
}

export async function enhanceSimulationWithAI(
  input: SimulationInput,
  result: SimulationResult,
): Promise<{ enhancedReasoning: string[]; predictions: string[] }> {
  const prompt = `
    You are PredictFlow AI, a decision simulation expert.
    Analyze this business action and predict its consequences:

    Action: ${input.title}
    Type: ${input.scenarioType}
    Description: ${input.description}
    Parameters: ${JSON.stringify(input.parameters)}

    Current Analysis:
    Risk Score: ${result.risk.riskScore}
    Confidence: ${result.risk.confidenceScore}
    Severity: ${result.risk.severity}

    Provide:
    1. Three specific potential negative outcomes
    2. Two specific positive outcomes
    3. One unexpected consequence to watch for
    4. A recommended mitigation strategy

    Format as a JSON array of strings.
  `

  const response = await queryOllama(prompt)

  if (!response) {
    return {
      enhancedReasoning: result.risk.reasoning,
      predictions: [
        'Standard prediction: Monitor system performance after execution',
        'Standard prediction: Review audit logs for anomalies',
      ],
    }
  }

  const lines = response.split('\n').filter((l) => l.trim())
  return {
    enhancedReasoning: [
      ...result.risk.reasoning,
      'AI-Enhanced Analysis:',
      ...lines.slice(0, 5),
    ],
    predictions: lines.slice(5, 10),
  }
}

export function isOllamaAvailable(): boolean {
  return !!process.env.OLLAMA_BASE_URL
}
