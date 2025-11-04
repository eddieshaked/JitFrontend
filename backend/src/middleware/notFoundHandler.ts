/**
 * 404 Not Found handler middleware
 */
import { Request, Response } from 'express';

/**
 * Middleware to handle 404 errors for unmatched routes
 * Should be placed before error handler
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: `Route ${req.method} ${req.path} not found`,
  });
};

