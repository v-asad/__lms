import express, { Request, Response } from 'express';
import itemRoutes from './routes/item.routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());

// Routes
app.use('/api/items', itemRoutes);
app.get('/', (_: Request, res: Response) => {
  console.log('WELCOME');
  res.send('WELCOME');
});

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
