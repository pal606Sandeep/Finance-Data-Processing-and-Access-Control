import express from 'express';
import corsConfig from './config/corsConfig.js';
import { globalLimiter } from './middleware/rateLimiting.js';
import { apiV1 } from './middleware/apiVersion.js';
import globalErrorHandler from './middleware/errorMiddleware.js';
import cookieParser from 'cookie-parser';

// imported all route
import authRoutes from './routes/authRoutes.js';
import recordRoutes from './routes/recordRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();
app.use(cookieParser());

// configure the Standard Middlewares
app.use(express.json());
app.use(corsConfig);
app.use(globalLimiter);

//  all API Routes
app.use(apiV1('/auth'), authRoutes);
app.use(apiV1('/records'), recordRoutes);
app.use(apiV1('/dashboard'), dashboardRoutes);

// here is the Handling of undefined routes (404)
app.use((req, res, next) => {
    const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    err.statusCode = 404;
    next(err);
  });
// Global Error Handler (it is always in the end)
app.use(globalErrorHandler);

export default app;