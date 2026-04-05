import express from 'express';
import corsConfig from './config/corsConfig.js';
import { globalLimiter } from './middleware/rateLimiting.js';
import { apiV1 } from './middleware/apiVersion.js';
import globalErrorHandler from './middleware/errorMiddleware.js';
import cookieParser from 'cookie-parser';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import recordRoutes from './routes/recordRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();
app.use(cookieParser());

// Standard Middlewares
app.use(express.json());
app.use(corsConfig);
app.use(globalLimiter);

// API Routes
app.use(apiV1('/auth'), authRoutes);
app.use(apiV1('/records'), recordRoutes);
app.use(apiV1('/dashboard'), dashboardRoutes);

// Handle undefined routes (404)
app.use((req, res, next) => {
    const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    err.statusCode = 404;
    next(err);
  });
// Global Error Handler (Hamesha end mein hona chahiye)
app.use(globalErrorHandler);

export default app;