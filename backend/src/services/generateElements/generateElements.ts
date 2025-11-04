import type { GenerateElementsResponse, HTMLElement } from '../../../../shared/types/elements.js';
import { ERROR_MESSAGES } from '../../config/constants.js';
import { AppError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { HTMLSanitizer } from '../../utils/security/index.js';
import { OpenAIService } from '../openAI/openAI.js';
import {
    OPENAI_CONFIG,
    SYSTEM_PROMPT
} from './generateElements.constants.js';

export class GenerateElementsService extends OpenAIService {
  constructor() {
    super(); // Initialize parent OpenAIService
  }

  async generateElements(prompt: string): Promise<HTMLElement[]> {
    // Basic type check (validation and sanitization are handled by middleware)
    if (!prompt || typeof prompt !== 'string') {
      throw new AppError(ERROR_MESSAGES.INVALID_PROMPT, 400);
    }

    // Prompt is already sanitized by middleware, use it directly
    const openaiClient = this.getClient();

    try {
      const completion = await openaiClient.chat.completions.create({
        model: OPENAI_CONFIG.MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        response_format: OPENAI_CONFIG.RESPONSE_FORMAT,
        temperature: OPENAI_CONFIG.TEMPERATURE,
      });

      const responseContent = completion.choices[0].message.content;
      if (!responseContent) {
        throw new AppError(ERROR_MESSAGES.NO_RESPONSE_CONTENT, 500);
      }

      const elementsData = JSON.parse(responseContent) as GenerateElementsResponse;
      console.log(elementsData);

      logger.debug('Generated elements data', { elementCount: elementsData.elements.length });

      return this.processElements(elementsData.elements);
    } catch (error) {
      // If it's already an AppError, re-throw it
      if (error instanceof AppError) {
        throw error;
      }

      // If it's a JSON parse error, handle it specifically
      if (error instanceof SyntaxError) {
        throw new AppError(ERROR_MESSAGES.PARSE_ERROR, 500);
      }

      // For other errors, wrap them in AppError
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new AppError(
        `${ERROR_MESSAGES.GENERATION_FAILED}: ${errorMessage}`,
        500
      );
    }
  }

  private processElements(elementsData: Array<{ html: string }>): HTMLElement[] {
    return elementsData.map((element: { html: string }, index: number) => {
      // Validate and sanitize HTML before returning
      const sanitizationResult = HTMLSanitizer.sanitize(element.html);
      
      if (!sanitizationResult.isValid) {
        logger.warn('Element failed HTML validation', {
          elementIndex: index,
          error: sanitizationResult.error,
        });
        // Return a safe placeholder instead of the malicious HTML
        return {
          id: this.generateElementId(index),
          html: '<div style="padding: 12px; border: 1px solid #dc3545; border-radius: 4px; color: #dc3545;">Invalid element - security validation failed</div>',
        };
      }

      return {
        id: this.generateElementId(index),
        html: element.html,
      };
    });
  }

  private generateElementId(index: number): string {
    return `element-${Date.now()}-${index}`;
  }
}

