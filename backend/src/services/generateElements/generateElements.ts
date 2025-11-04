import type { GenerateElementsResponse, UIElement } from '../../../../shared/types/elements.js';
import { OpenApiService } from '../openApi/openApi.js';
import {
    DEFAULT_BUTTON_STYLE,
    DEFAULT_ELEMENT_VALUES,
    ERROR_MESSAGES,
    OPENAI_CONFIG,
    SYSTEM_PROMPT
} from './generateElements.constants.js';

/**
 * GenerateElements Service Class
 * Extends OpenApiService to generate UI elements from natural language prompts
 */
export class GenerateElementsService extends OpenApiService {
  constructor() {
    super(); // Initialize parent OpenApiService
  }

  /**
   * Generate UI elements from natural language prompts using OpenAI
   * @param {string} prompt - Natural language description of elements to create
   * @returns {Promise<UIElement[]>} Array of element configurations
   */
  async generateElements(prompt: string): Promise<UIElement[]> {
    if (!prompt || typeof prompt !== 'string') {
      throw new Error(ERROR_MESSAGES.INVALID_PROMPT);
    }

    // Get OpenAI client from parent class
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

  private processElements(elementsData: UIElement[]): UIElement[] {
    return elementsData.map((element: UIElement, index: number) => {
      const baseElement: UIElement = {
        id: this.generateElementId(index),
        type: element.type || DEFAULT_ELEMENT_VALUES.TYPE,
        text: element.text || DEFAULT_ELEMENT_VALUES.TEXT,
        style: element.style || DEFAULT_BUTTON_STYLE,
        placeholder: element.placeholder,
        name: element.name,
        onClick: element.onClick,
      };

      return baseElement;
    });
  }

  private generateElementId(index: number): string {
    return `element-${Date.now()}-${index}`;
  }
}

