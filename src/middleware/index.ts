import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types/user';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
  next();
}

export function jsonErrorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof SyntaxError && 'body' in err) {
    const errorResponse: ErrorResponse = {
      success: false,
      error: 'Invalid JSON',
      message: 'Request body contains invalid JSON'
    };
    res.status(400).json(errorResponse);
    return;
  }
  next(err);
}

export function notFoundHandler(req: Request, res: Response): void {
  const errorResponse: ErrorResponse = {
    success: false,
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  };
  res.status(404).json(errorResponse);
}

export function globalErrorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  console.error('Unhandled error:', err);
 
  const errorResponse: ErrorResponse = {
    success: false,
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  };
 
  res.status(500).json(errorResponse);
}