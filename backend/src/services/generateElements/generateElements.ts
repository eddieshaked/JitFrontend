import type { GenerateElementsResponse, HTMLElement } from '../../../../shared/types/elements.js';
import { OpenApiService } from '../openApi/openApi.js';
import {
    ERROR_MESSAGES,
    OPENAI_CONFIG,
    SYSTEM_PROMPT
} from './generateElements.constants.js';

export class GenerateElementsService extends OpenApiService {
  constructor() {
    super(); // Initialize parent OpenApiService
  }

  async generateElements(prompt: string): Promise<HTMLElement[]> {
    if (!prompt || typeof prompt !== 'string') {
      throw new Error(ERROR_MESSAGES.INVALID_PROMPT);
    }

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
        throw new Error(ERROR_MESSAGES.NO_RESPONSE_CONTENT);
      }

      const elementsData = JSON.parse(responseContent) as GenerateElementsResponse;

      console.log(elementsData);

      return this.processElements(elementsData.elements);
    } catch (error) {
      console.error('Error in generateElements service:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`${ERROR_MESSAGES.GENERATION_FAILED}: ${errorMessage}`);
    }
  }

  private processElements(elementsData: Array<{ html: string }>): HTMLElement[] {
    return elementsData.map((element: { html: string }, index: number) => {
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

