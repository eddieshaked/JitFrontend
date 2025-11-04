import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import type { GenerateElementsRequest, GenerateElementsResponse } from '../../shared/types/elements.js';
import { API_MESSAGES, APP_CONFIG } from './config/constants.js';
import { asyncHandler, errorHandler, notFoundHandler, validatePrompt } from './middleware/index.js';
import { GenerateElementsService } from './services/generateElements/index.js';
import { logger } from './utils/logger.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Limit request body size

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Initialize service once (singleton pattern)
const generateElementsService = new GenerateElementsService();

// Routes
app.get('/api', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: API_MESSAGES.WELCOME,
    version: APP_CONFIG.VERSION,
  });
});

app.post(
  '/api/generate-elements',
  validatePrompt,
  asyncHandler(async (req: Request, res: Response) => {
    const { prompt } = req.body as GenerateElementsRequest;

    const elements = await generateElementsService.generateElements(prompt);

    const response: GenerateElementsResponse = {
      elements: elements,
      prompt: prompt,
    };

    res.json(response);
  })
);

// 404 handler for unmatched routes (must be before error handler)
app.use(notFoundHandler);

// Global error handling middleware (must be last)
app.use(errorHandler);

// Start server
const port = Number(APP_CONFIG.PORT);

// Validate service initialization before starting server
try {
  if (!generateElementsService.isInitialized()) {
    throw new Error('Failed to initialize services');
  }
  logger.info('Services initialized successfully');
} catch (error) {
  logger.error('Failed to initialize services', { error });
  process.exit(1);
}

app.listen(port, () => {
  logger.info(`🚀 Backend server running on http://localhost:${port}`, {
    port,
    environment: process.env.NODE_ENV || 'development',
  });
  const apiKeySuffix = process.env.OPENAI_API_KEY
    ? `***${process.env.OPENAI_API_KEY.slice(-4)}`
    : 'Missing!';
  logger.info(`🔑 OpenAI API key: ${apiKeySuffix}`);
});
