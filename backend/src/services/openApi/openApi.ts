import OpenAI from 'openai';
import { ERROR_MESSAGES, LOG_MESSAGES } from './openApi.constants.js';

export class OpenApiService {
  private client: OpenAI | null = null;

  constructor() {
    this.initialize();
  }

  private initialize(): void {

    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      throw new Error(ERROR_MESSAGES.MISSING_API_KEY);
    }

    try {
      this.client = new OpenAI({
        apiKey: apiKey,
      });

      console.log(LOG_MESSAGES.CLIENT_INITIALIZED);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`${LOG_MESSAGES.INITIALIZATION_ERROR}:`, errorMessage);
      throw new Error(`${ERROR_MESSAGES.INITIALIZATION_FAILED}: ${errorMessage}`);
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

