import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

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

export default router;