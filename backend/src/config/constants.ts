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
  HEALTH_OK: 'Backend is running',
} as const;

export const ERROR_MESSAGES = {
  PROMPT_REQUIRED: 'Prompt is required',
  GENERATE_ELEMENTS_FAILED: 'Failed to generate elements',
} as const;

