/**
 * Constants for OpenApi Service
 */

export const ERROR_MESSAGES = {
  MISSING_API_KEY: 'OPENAI_API_KEY is not set in environment variables',
  INITIALIZATION_FAILED: 'Failed to initialize OpenAI client',
} as const;

export const LOG_MESSAGES = {
  CLIENT_INITIALIZED: '✅ OpenAI client initialized',
  INITIALIZATION_ERROR: '❌ Error initializing OpenAI client',
} as const;

