import { GoogleGenerativeAI } from '@google/generative-ai'

export const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite-preview'

const MODEL_FALLBACKS = [
  DEFAULT_GEMINI_MODEL,
  'gemini-3.1-flash-lite-preview',
  'gemini-2.5-flash-lite-preview-09-2025',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest'
]

export function getCandidateModels() {
  return [...new Set(MODEL_FALLBACKS.filter(Boolean))]
}

export function isModelNotFoundError(error) {
  const message = String(error?.message || '')
  return error?.status === 404 ||
    error?.code === 404 ||
    /404/i.test(message) &&
    /not found/i.test(message) &&
    /generatecontent/i.test(message)
}

export function isTransientGeminiError(error) {
  const message = String(error?.message || '')
  return error?.status === 429 ||
    error?.status === 500 ||
    error?.status === 503 ||
    error?.code === 429 ||
    error?.code === 500 ||
    error?.code === 503 ||
    /429/i.test(message) && /rate limit|too many requests/i.test(message) ||
    /500/i.test(message) && /internal/i.test(message) ||
    /503/i.test(message) && /unavailable|high demand|overloaded/i.test(message)
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function generateContentWithModelFallback({
  apiKey,
  prompt,
  signal,
  retriesPerModel = 1,
  retryDelayMs = 900
}) {
  const genAI = new GoogleGenerativeAI(apiKey)
  let lastModelError = null

  for (const modelName of getCandidateModels()) {
    for (let attempt = 0; attempt <= retriesPerModel; attempt += 1) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName })
        const result = await model.generateContent(prompt, { signal })
        return { result, modelName }
      } catch (error) {
        if (signal?.aborted) throw error

        if (isModelNotFoundError(error)) {
          lastModelError = error
          break
        }

        if (isTransientGeminiError(error)) {
          lastModelError = error

          if (attempt < retriesPerModel) {
            await sleep(retryDelayMs * (attempt + 1))
            continue
          }

          break
        }

        throw error
      }
    }
  }

  if (lastModelError) {
    throw new Error(
      `No supported Gemini generateContent model was available. Tried: ${getCandidateModels().join(', ')}. Last error: ${lastModelError.message}`
    )
  }

  throw new Error('No Gemini model candidates configured')
}
