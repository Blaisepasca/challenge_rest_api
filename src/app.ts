import express from 'express';
import userRoutes from './routes/userRoutes';
import {
  requestLogger,
  jsonErrorHandler,
  notFoundHandler,
  globalErrorHandler
} from './middleware';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(requestLogger);
app.use(jsonErrorHandler);

app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Users REST API - Technical Assessment',
    endpoints: {
      'POST /users': 'Create a new user',
      'GET /users/:id': 'Get user by ID',
      'GET /users': 'Get all users (bonus)',
    },
    documentation: 'See README.md for usage instructions'
  });
});

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
