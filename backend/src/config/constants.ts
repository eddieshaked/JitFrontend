/**
 * Application-level constants
 */

export const APP_CONFIG = {
  PORT: process.env.PORT || 5000,
  VERSION: '1.0.0',
  NAME: 'Jit Backend API',
} as const;

export const API_MESSAGES = {
  WELCOME: 'Welcome to Jit Backend API',
} as const;

// Centralized error messages for the entire application
export const ERROR_MESSAGES = {
  // General errors
  PROMPT_REQUIRED: 'Prompt is required',
  PROMPT_VALIDATION_FAILED: 'Prompt validation failed',
  GENERATE_ELEMENTS_FAILED: 'Failed to generate elements',
  
  // OpenAI service errors
  MISSING_API_KEY: 'OPENAI_API_KEY is not set in environment variables',
  INITIALIZATION_FAILED: 'Failed to initialize OpenAI client',
  
  // GenerateElements service errors
  INVALID_PROMPT: 'Prompt must be a non-empty string',
  NO_RESPONSE_CONTENT: 'No content in OpenAI response',
  PARSE_ERROR: 'Could not parse element data from OpenAI response',
  GENERATION_FAILED: 'Failed to generate elements',
  MALICIOUS_CONTENT_DETECTED: 'Potentially harmful content detected in prompt',
  HTML_SANITIZATION_FAILED: 'Generated HTML failed security validation',
} as const;

// Log messages
export const LOG_MESSAGES = {
  CLIENT_INITIALIZED: 'OpenAI client initialized',
  INITIALIZATION_ERROR: 'Error initializing OpenAI client',
} as const;

