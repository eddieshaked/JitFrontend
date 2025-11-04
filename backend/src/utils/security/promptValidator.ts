/**
 * Prompt validation utilities for security
 * Implements comprehensive prompt injection detection and input validation
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  severity?: 'low' | 'medium' | 'high';
}

// Comprehensive prompt injection patterns based on OWASP and security research
const PROMPT_INJECTION_PATTERNS: Array<{
  pattern: RegExp;
  severity: 'low' | 'medium' | 'high';
  description: string;
}> = [
  // High severity - Direct override attempts
  {
    pattern: /ignore\s+(previous|above|all|prior)\s+(instructions?|prompts?|rules?|directions?)/i,
    severity: 'high',
    description: 'Attempt to ignore system instructions',
  },
  {
    pattern: /forget\s+(all|previous|everything|prior)\s+(instructions?|prompts?|rules?)/i,
    severity: 'high',
    description: 'Attempt to forget system instructions',
  },
  {
    pattern: /(system|assistant|user|role)\s*:\s*you\s+are\s+(now\s+)?(a|an)/i,
    severity: 'high',
    description: 'Role manipulation attempt',
  },
  {
    pattern: /override\s+(previous|system|all|the)\s+(instructions?|prompts?|rules?)/i,
    severity: 'high',
    description: 'Override instruction attempt',
  },
  {
    pattern: /disregard\s+(previous|all|the|prior)\s+(instructions?|prompts?|rules?)/i,
    severity: 'high',
    description: 'Disregard instruction attempt',
  },
  {
    pattern: /new\s+(instructions?|prompts?|rules?)\s*:/i,
    severity: 'high',
    description: 'New instruction injection',
  },
  {
    pattern: /<\|(system|assistant|user)\|>/i,
    severity: 'high',
    description: 'ChatML format injection',
  },
  {
    pattern: /\[INST\]|\[SYSTEM\]|\[ASSISTANT\]|\[/i,
    severity: 'high',
    description: 'Instruction format injection',
  },
  {
    pattern: /you\s+are\s+now\s+(a|an)\s+/i,
    severity: 'high',
    description: 'Role reassignment attempt',
  },
  {
    pattern: /(do|can|will)\s+(you\s+)?(please\s+)?(ignore|forget|disregard|override)/i,
    severity: 'medium',
    description: 'Polite override attempt',
  },
  {
    pattern: /(pretend|act\s+as|roleplay|simulate)\s+(you\s+are\s+)?(a|an)/i,
    severity: 'medium',
    description: 'Roleplay injection attempt',
  },
  {
    pattern: /(execute|run|perform)\s+(the\s+)?(following|this)\s+(command|code|script)/i,
    severity: 'high',
    description: 'Code execution attempt',
  },
  {
    pattern: /(show|reveal|tell\s+me|display)\s+(the\s+)?(system|previous|hidden)\s+(prompt|instruction)/i,
    severity: 'high',
    description: 'System prompt extraction attempt',
  },
  {
    pattern: /(translate|decode|convert)\s+(this|the\s+following|below)\s+(to|into|as)/i,
    severity: 'low',
    description: 'Potential encoding attack',
  },
  {
    pattern: /(begin|start|proceed)\s+(with\s+)?(the\s+)?(new|following|next)\s+(instructions?|prompts?)/i,
    severity: 'medium',
    description: 'Instruction continuation attempt',
  },
  {
    pattern: /(end\s+of\s+)?(previous|old|system)\s+(instructions?|prompts?)/i,
    severity: 'medium',
    description: 'Instruction boundary manipulation',
  },
];

// Dangerous HTML/script patterns
const DANGEROUS_PATTERNS: Array<{
  pattern: RegExp;
  severity: 'low' | 'medium' | 'high';
  description: string;
}> = [
  {
    pattern: /<script[\s\S]*?>/i,
    severity: 'high',
    description: 'Script tag detected',
  },
  {
    pattern: /on\w+\s*=\s*["'][^"']*["']/i,
    severity: 'high',
    description: 'Event handler attribute detected',
  },
  {
    pattern: /javascript\s*:/i,
    severity: 'high',
    description: 'JavaScript protocol detected',
  },
  {
    pattern: /data\s*:\s*text\/html/i,
    severity: 'high',
    description: 'Data URI with HTML detected',
  },
  {
    pattern: /vbscript\s*:/i,
    severity: 'high',
    description: 'VBScript protocol detected',
  },
  {
    pattern: /<iframe/i,
    severity: 'high',
    description: 'Iframe tag detected',
  },
  {
    pattern: /<object/i,
    severity: 'high',
    description: 'Object tag detected',
  },
  {
    pattern: /<embed/i,
    severity: 'high',
    description: 'Embed tag detected',
  },
  {
    pattern: /expression\s*\(/i,
    severity: 'high',
    description: 'CSS expression detected',
  },
  {
    pattern: /@import/i,
    severity: 'medium',
    description: 'CSS import detected',
  },
  {
    pattern: /<link[\s\S]*?>/i,
    severity: 'medium',
    description: 'Link tag detected',
  },
  {
    pattern: /<meta[\s\S]*?>/i,
    severity: 'low',
    description: 'Meta tag detected',
  },
];

// High-risk keywords that require context checking
const HIGH_RISK_KEYWORDS = [
  'eval',
  'exec',
  'execute',
  'function',
  'constructor',
  'prototype',
  '__proto__',
  'alert',
  'prompt',
  'confirm',
  'document.write',
  'innerHTML',
  'outerHTML',
  'dangerouslySetInnerHTML',
  'xss',
  'csrf',
  'sql injection',
  'payload',
  'exploit',
];

// Maximum prompt length
const MAX_PROMPT_LENGTH = 100;

// Minimum prompt length
const MIN_PROMPT_LENGTH = 1;

// Maximum special character ratio
const MAX_SPECIAL_CHAR_RATIO = 0.3;

// Maximum consecutive special characters
const MAX_CONSECUTIVE_SPECIAL = 5;

/**
 * Comprehensive prompt validator with multi-layer security checks
 */
export class PromptValidator {
  /**
   * Validate a prompt string for security concerns with comprehensive checks
   */
  static validate(prompt: string): ValidationResult {
    // Basic type and empty check
    if (!prompt || typeof prompt !== 'string') {
      return {
        isValid: false,
        error: 'Prompt must be a non-empty string',
        severity: 'high',
      };
    }

    const trimmedPrompt = prompt.trim();

    // Length validation
    if (trimmedPrompt.length < MIN_PROMPT_LENGTH) {
      return {
        isValid: false,
        error: 'Prompt is too short',
        severity: 'low',
      };
    }

    if (trimmedPrompt.length > MAX_PROMPT_LENGTH) {
      return {
        isValid: false,
        error: `Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters`,
        severity: 'medium',
      };
    }

    // Check for prompt injection patterns (comprehensive check)
    for (const { pattern, severity, description } of PROMPT_INJECTION_PATTERNS) {
      if (pattern.test(trimmedPrompt)) {
        return {
          isValid: false,
          error: `Prompt injection detected: ${description}`,
          severity,
        };
      }
    }

    // Check for dangerous HTML/script patterns
    for (const { pattern, severity, description } of DANGEROUS_PATTERNS) {
      if (pattern.test(trimmedPrompt)) {
        return {
          isValid: false,
          error: `Dangerous pattern detected: ${description}`,
          severity,
        };
      }
    }

    // Context-aware keyword checking
    const lowerPrompt = trimmedPrompt.toLowerCase();
    for (const keyword of HIGH_RISK_KEYWORDS) {
      const keywordLower = keyword.toLowerCase();
      if (lowerPrompt.includes(keywordLower)) {
        // Check if keyword appears in suspicious context
        const contextPatterns = [
          new RegExp(`\\b${keyword}\\s*[=\\(\\[]`, 'i'), // keyword = or keyword( or keyword[
          new RegExp(`${keyword}\\s+function`, 'i'), // keyword function
          new RegExp(`eval\\s*\\(`, 'i'), // eval(
          new RegExp(`document\\.${keyword}`, 'i'), // document.keyword
          new RegExp(`window\\.${keyword}`, 'i'), // window.keyword
        ];

        for (const contextPattern of contextPatterns) {
          if (contextPattern.test(trimmedPrompt)) {
            return {
              isValid: false,
              error: `Malicious code pattern detected with keyword: ${keyword}`,
              severity: 'high',
            };
          }
        }
      }
    }

    // Check for excessive special characters (encoding attack indicator)
    const specialChars = trimmedPrompt.match(/[<>{}[\]\\\/@#$%^&*()_+=\-|`~]/g) || [];
    const specialCharRatio = specialChars.length / trimmedPrompt.length;
    if (specialCharRatio > MAX_SPECIAL_CHAR_RATIO) {
      return {
        isValid: false,
        error: 'Prompt contains excessive special characters (possible encoding attack)',
        severity: 'medium',
      };
    }

    // Check for consecutive special characters (obfuscation attempt)
    const consecutiveSpecial = /[<>{}[\]\\\/@#$%^&*()_+=\-|`~]{5,}/.test(trimmedPrompt);
    if (consecutiveSpecial) {
      return {
        isValid: false,
        error: 'Prompt contains suspicious character sequences',
        severity: 'medium',
      };
    }

    // Check for null bytes and control characters
    if (/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(trimmedPrompt)) {
      return {
        isValid: false,
        error: 'Prompt contains invalid control characters',
        severity: 'high',
      };
    }

    // Check for Unicode normalization attacks
    const normalizedPrompt = trimmedPrompt.normalize('NFKC');
    if (normalizedPrompt !== trimmedPrompt) {
      // Check if normalization changed the string significantly (potential attack)
      const diffRatio = Math.abs(normalizedPrompt.length - trimmedPrompt.length) / trimmedPrompt.length;
      if (diffRatio > 0.1) {
        return {
          isValid: false,
          error: 'Prompt contains suspicious Unicode characters',
          severity: 'medium',
        };
      }
    }

    // Check for repeated patterns (potential DoS or obfuscation)
    const repeatedPattern = /(.{10,})\1{3,}/.test(trimmedPrompt);
    if (repeatedPattern) {
      return {
        isValid: false,
        error: 'Prompt contains suspicious repeated patterns',
        severity: 'low',
      };
    }

    // Check for base64-like patterns (potential encoded payload)
    const base64Pattern = /[A-Za-z0-9+\/]{50,}={0,2}/;
    if (base64Pattern.test(trimmedPrompt) && trimmedPrompt.length > 100) {
      // Only flag if it's a significant portion of the prompt
      const base64Matches = trimmedPrompt.match(/[A-Za-z0-9+\/]{50,}={0,2}/g) || [];
      const base64Length = base64Matches.reduce((sum, match) => sum + match.length, 0);
      if (base64Length / trimmedPrompt.length > 0.5) {
        return {
          isValid: false,
          error: 'Prompt contains suspicious encoded content',
          severity: 'medium',
        };
      }
    }

    return { isValid: true, severity: 'low' };
  }

  /**
   * Sanitize prompt by removing potentially harmful content
   * Note: This is a fallback - validation should catch issues first
   */
  static sanitize(prompt: string): string {
    if (!prompt || typeof prompt !== 'string') {
      return '';
    }

    let sanitized = prompt.trim();

    // Remove null bytes and control characters
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    // Remove common prompt injection prefixes
    sanitized = sanitized.replace(
      /^(ignore|forget|disregard|override)\s+(previous|all|above|system)\s+(instructions?|prompts?|rules?)\s*[:\-]\s*/i,
      ''
    );

    // Remove role manipulation attempts
    sanitized = sanitized.replace(
      /^(system|assistant|user)\s*:\s*(you\s+are\s+now\s+)?(a|an)\s+/i,
      ''
    );

    // Remove script tags and dangerous HTML
    sanitized = sanitized.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized.replace(/javascript\s*:/gi, '');
    sanitized = sanitized.replace(/vbscript\s*:/gi, '');

    // Limit length
    if (sanitized.length > MAX_PROMPT_LENGTH) {
      sanitized = sanitized.substring(0, MAX_PROMPT_LENGTH);
    }

    // Normalize Unicode
    sanitized = sanitized.normalize('NFKC');

    return sanitized;
  }

  /**
   * Deep validation with additional checks
   */
  static deepValidate(prompt: string): ValidationResult {
    // Run standard validation first
    const standardResult = this.validate(prompt);
    if (!standardResult.isValid) {
      return standardResult;
    }

    // Additional deep checks
    const trimmedPrompt = prompt.trim();

    // Check for homoglyph attacks (look-alike characters)
    const homoglyphPattern = /[АВСЕНКМОРТХасеоррух]/; // Cyrillic look-alikes
    if (homoglyphPattern.test(trimmedPrompt)) {
      return {
        isValid: false,
        error: 'Prompt contains suspicious character look-alikes',
        severity: 'medium',
      };
    }

    // Check for zero-width characters (potential steganography)
    if (/[\u200B-\u200D\uFEFF]/.test(trimmedPrompt)) {
      return {
        isValid: false,
        error: 'Prompt contains zero-width characters',
        severity: 'medium',
      };
    }

    // Check for excessive whitespace (potential obfuscation)
    const whitespaceRatio = (trimmedPrompt.match(/\s/g) || []).length / trimmedPrompt.length;
    if (whitespaceRatio > 0.5) {
      return {
        isValid: false,
        error: 'Prompt contains excessive whitespace',
        severity: 'low',
      };
    }

    // Check for potential SQL injection patterns (defense in depth)
    const sqlPatterns = [
      /(\bunion\s+select\b)/i,
      /(\bdrop\s+table\b)/i,
      /(\bdelete\s+from\b)/i,
      /(\binsert\s+into\b)/i,
      /(\bupdate\s+set\b)/i,
      /('|"|;|--|\/\*|\*\/)/,
    ];
    
    let sqlMatchCount = 0;
    for (const pattern of sqlPatterns) {
      if (pattern.test(trimmedPrompt)) {
        sqlMatchCount++;
      }
    }
    
    if (sqlMatchCount >= 3) {
      return {
        isValid: false,
        error: 'Prompt contains multiple SQL injection indicators',
        severity: 'high',
      };
    }

    return { isValid: true, severity: 'low' };
  }
}
