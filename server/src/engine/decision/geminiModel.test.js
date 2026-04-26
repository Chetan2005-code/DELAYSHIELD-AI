import { expect } from 'chai'
import {
  DEFAULT_GEMINI_MODEL,
  getCandidateModels,
  isModelNotFoundError,
  isTransientGeminiError
} from './geminiModel.js'

describe('geminiModel helper', () => {
  it('prefers the configured default model and deduplicates candidates', () => {
    const candidates = getCandidateModels()

    expect(candidates[0]).to.equal(DEFAULT_GEMINI_MODEL)
    expect(new Set(candidates).size).to.equal(candidates.length)
    expect(candidates).to.include('gemini-2.0-flash')
    expect(candidates).to.include('gemini-1.5-flash-latest')
  })

  it('detects Gemini model-not-found errors from the API message', () => {
    const error = new Error(
      '[GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent: [404 Not Found] models/gemini-1.5-flash is not found for API version v1beta, or is not supported for generateContent.'
    )

    expect(isModelNotFoundError(error)).to.equal(true)
  })

  it('does not classify non-404 API failures as model-not-found errors', () => {
    const error = new Error(
      '[GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent: [503 Service Unavailable] The model is overloaded.'
    )

    expect(isModelNotFoundError(error)).to.equal(false)
  })

  it('classifies temporary overload errors as transient Gemini errors', () => {
    const error = new Error(
      '[GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent: [503 Service Unavailable] This model is currently experiencing high demand.'
    )

    expect(isTransientGeminiError(error)).to.equal(true)
  })
})
