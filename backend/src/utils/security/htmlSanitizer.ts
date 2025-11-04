/**
 * HTML sanitization utilities using sanitize-html package
 * Provides robust, production-ready HTML sanitization
 */

import sanitizeHtml from 'sanitize-html';
import { logger } from '../../utils/logger.js';

interface SanitizationResult {
  isValid: boolean;
  sanitizedHtml?: string;
  error?: string;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Allowed HTML tags for UI elements
const ALLOWED_TAGS = [
  'button',
  'input',
  'textarea',
  'select',
  'option',
  'label',
  'div',
  'span',
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'form',
  'fieldset',
  'legend',
];

// Allowed attributes per tag
const ALLOWED_ATTRIBUTES: sanitizeHtml.IOptions['allowedAttributes'] = {
  button: ['type', 'style', 'class', 'id', 'disabled', 'aria-label'],
  input: [
    'type',
    'style',
    'class',
    'id',
    'name',
    'placeholder',
    'value',
    'disabled',
    'required',
    'aria-label',
  ],
  textarea: [
    'style',
    'class',
    'id',
    'name',
    'placeholder',
    'rows',
    'cols',
    'disabled',
    'required',
    'aria-label',
  ],
  select: ['style', 'class', 'id', 'name', 'disabled', 'required', 'aria-label'],
  option: ['value', 'selected', 'disabled'],
  label: ['style', 'class', 'id', 'for', 'aria-label'],
  div: ['style', 'class', 'id', 'aria-label'],
  span: ['style', 'class', 'id', 'aria-label'],
  p: ['style', 'class', 'id'],
  h1: ['style', 'class', 'id'],
  h2: ['style', 'class', 'id'],
  h3: ['style', 'class', 'id'],
  h4: ['style', 'class', 'id'],
  h5: ['style', 'class', 'id'],
  h6: ['style', 'class', 'id'],
  form: ['style', 'class', 'id', 'action', 'method'],
  fieldset: ['style', 'class', 'id'],
  legend: ['style', 'class', 'id'],
};

// Sanitization options
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: ALLOWED_ATTRIBUTES,
  allowedStyles: {
    '*': {
      // Allow all CSS properties in style attribute for flexibility
      // This is safe because we're only allowing specific tags
      color: [/^#[0-9a-fA-F]{3,6}$/, /^rgb/, /^rgba/, /^hsl/, /^hsla/, /^[a-z]+$/],
      backgroundColor: [/^#[0-9a-fA-F]{3,6}$/, /^rgb/, /^rgba/, /^hsl/, /^hsla/, /^[a-z]+$/],
      border: [/./],
      borderRadius: [/./],
      padding: [/./],
      margin: [/./],
      fontSize: [/./],
      fontWeight: [/./],
      width: [/./],
      height: [/./],
      cursor: [/./],
      display: [/./],
      flexDirection: [/./],
      gap: [/./],
      alignItems: [/./],
      justifyContent: [/./],
    },
  },
  // Disallow all protocols
  allowedSchemes: [],
  allowedSchemesByTag: {},
  allowedSchemesAppliedToAttributes: [],
  // Disallow all data URIs
  allowProtocolRelative: false,
  // Don't allow script tags
  disallowedTagsMode: 'discard',
};

/**
 * HTML sanitization utilities using sanitize-html library
 */
export class HTMLSanitizer {
  /**
   * Validate and sanitize HTML string using sanitize-html
   */
  static sanitize(html: string): SanitizationResult {
    if (!html || typeof html !== 'string') {
      return {
        isValid: false,
        error: 'HTML string is required',
      };
    }

    try {
      // Use sanitize-html for robust sanitization
      const sanitized = sanitizeHtml(html, SANITIZE_OPTIONS);

      // Additional validation: check if sanitization removed too much (potential attack)
      if (sanitized.length === 0 && html.trim().length > 0) {
        return {
          isValid: false,
          error: 'HTML was completely removed by sanitization (likely malicious)',
        };
      }

      // Check if any dangerous patterns still exist (double-check)
      const dangerousPatterns = [
        /<script/i,
        /on\w+\s*=/i,
        /javascript\s*:/i,
        /vbscript\s*:/i,
        /<iframe/i,
        /<object/i,
        /<embed/i,
      ];

      for (const pattern of dangerousPatterns) {
        if (pattern.test(sanitized)) {
          return {
            isValid: false,
            error: 'Dangerous patterns detected after sanitization',
          };
        }
      }

      // Validate that only allowed tags are present
      const tagPattern = /<\/?([a-z][a-z0-9]*)\b/gi;
      const matches = sanitized.matchAll(tagPattern);
      for (const match of matches) {
        const tagName = match[1]?.toLowerCase();
        if (tagName && !ALLOWED_TAGS.includes(tagName)) {
          return {
            isValid: false,
            error: `Unauthorized tag detected: <${tagName}>`,
          };
        }
      }

      return {
        isValid: true,
        sanitizedHtml: sanitized,
      };
    } catch (error) {
      logger.error('HTML sanitization error', { error });
      return {
        isValid: false,
        error: 'HTML sanitization failed',
      };
    }
  }

  /**
   * Validate HTML without sanitizing
   */
  static validate(html: string): ValidationResult {
    const sanitizeResult = this.sanitize(html);
    return {
      isValid: sanitizeResult.isValid,
      error: sanitizeResult.error,
    };
  }
}
