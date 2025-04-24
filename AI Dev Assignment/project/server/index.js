import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupDatabase } from './database.js';
import { setupCache } from './cache.js';
import guessRoutes from './routes/guessRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import { errorHandler, rateLimiter } from './middleware/index.js';

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

// Routes
app.use('/api', guessRoutes);
app.use('/api', historyRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handler
app.use(errorHandler);

// Initialize database and cache connections
async function initializeServices() {
  try {
    await setupDatabase();
    await setupCache();
    
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize services:', error);
    process.exit(1);
  }
}

initializeServices();

// Handle process termination
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully');
  // Cleanup connections
  process.exit(0);
});

export default app;