import { Router } from 'express';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// API info endpoint
router.get('/api', (req, res) => {
  res.json({ 
    message: 'Backend API',
    version: '1.0.0',
    endpoints: {
      trpc: '/trpc',
      health: '/health'
    }
  });
});

// Additional REST routes can be defined here

export default router;