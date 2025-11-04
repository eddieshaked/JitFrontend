import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import type { GenerateElementsRequest, GenerateElementsResponse } from '../../shared/types/elements.js';
import { API_MESSAGES, APP_CONFIG, ERROR_MESSAGES } from './config/constants.js';
import { GenerateElementsService } from './services/generateElements/index.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: API_MESSAGES.HEALTH_OK,
  });
});

app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: API_MESSAGES.WELCOME,
    version: APP_CONFIG.VERSION,
  });
});

// Endpoint to generate elements from natural language prompts
app.post('/api/generate-elements', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body as GenerateElementsRequest;

    if (!prompt) {
      return res.status(400).json({ error: ERROR_MESSAGES.PROMPT_REQUIRED });
    }

    // Initialize service on-demand when needed
    const generateElementsService = new GenerateElementsService();
    const elements = await generateElementsService.generateElements(prompt);

    const response: GenerateElementsResponse = {
      elements: elements,
      prompt: prompt,
    };

    res.json(response);
  } catch (error) {
    console.error('Error generating elements:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      error: ERROR_MESSAGES.GENERATE_ELEMENTS_FAILED,
      details: errorMessage,
    });
  }
});

// Start server
const port = Number(APP_CONFIG.PORT);
app.listen(port, () => {
  console.log(`🚀 Backend server running on http://localhost:${port}`);
  const apiKeySuffix = process.env.OPENAI_API_KEY
    ? `***${process.env.OPENAI_API_KEY.slice(-4)}`
    : 'Missing!';
  console.log(`🔑 OpenAI API key: ${apiKeySuffix}`);
});
