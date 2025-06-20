import express from 'express';
import userRoutes from './routes/userRoutes';
import {
  requestLogger,
  jsonErrorHandler,
  notFoundHandler,
  globalErrorHandler
} from './middleware';

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(requestLogger);
app.use(jsonErrorHandler);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
app.use('/users', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Users REST API - Technical Assessment',
    endpoints: {
      'POST /users': 'Create a new user',
      'GET /users/:id': 'Get user by ID',
      'GET /users': 'Get all users (bonus)',
      'GET /health': 'Health check'
    },
    documentation: 'See README.md for usage instructions'
  });
});

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
