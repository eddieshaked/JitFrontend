/**
 * Middleware for validating and sanitizing prompt in request body
 */
import { NextFunction, Request, Response } from 'express';
import { ERROR_MESSAGES } from '../config/constants.js';
import { PromptValidator } from '../utils/security/promptValidator.js';
import { logger } from '../utils/logger.js';

/**
 * Extend Express Request to include sanitized prompt
 */
declare global {
  namespace Express {
    interface Request {
      sanitizedPrompt?: string;
    }
  }
}

/**
 * Middleware to validate and sanitize prompt in request body
 * Validates prompt length, security, and content, then sanitizes it
 */
export const validatePrompt = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { prompt } = req.body;

  // Check if prompt exists
  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({
      error: ERROR_MESSAGES.PROMPT_REQUIRED,
    });
    return;
  }

  // Perform deep validation
  const validationResult = PromptValidator.deepValidate(prompt);

  if (!validationResult.isValid) {
    // Log validation failure for security monitoring
    logger.warn('Prompt validation failed', {
      error: validationResult.error,
      severity: validationResult.severity,
      promptLength: prompt.length,
    });

    // Return appropriate status code based on severity
    const statusCode = validationResult.severity === 'high' ? 403 : 400;

    res.status(statusCode).json({
      error: validationResult.error || ERROR_MESSAGES.PROMPT_VALIDATION_FAILED,
      severity: validationResult.severity,
    });
    return;
  }

  // Validation passed, sanitize the prompt
  const sanitizedPrompt = PromptValidator.sanitize(prompt);

  // Attach sanitized prompt to request object for use in route handler
  req.sanitizedPrompt = sanitizedPrompt;

  // Also update req.body.prompt with sanitized version
  req.body.prompt = sanitizedPrompt;

  // Continue to next middleware/route handler
  next();
};

