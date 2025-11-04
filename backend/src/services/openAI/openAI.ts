import OpenAI from 'openai';
import { ERROR_MESSAGES, LOG_MESSAGES } from '../../config/constants.js';
import { AppError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';

export class OpenAIService {
  private client: OpenAI | null = null;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      throw new AppError(ERROR_MESSAGES.MISSING_API_KEY, 500);
    }

    try {
      this.client = new OpenAI({
        apiKey: apiKey,
      });

      logger.info(LOG_MESSAGES.CLIENT_INITIALIZED);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(LOG_MESSAGES.INITIALIZATION_ERROR, { error: errorMessage });
      throw new AppError(`${ERROR_MESSAGES.INITIALIZATION_FAILED}: ${errorMessage}`, 500);
    }
  }

  getClient(): OpenAI {
    if (!this.client) {
      this.initialize();
    }
    return this.client!;
  }

  isInitialized(): boolean {
    return this.client !== null;
  }

  reset(): void {
    this.client = null;
  }
}

