import {Request, Response, NextFunction } from 'express';
import { processInputChange } from '../services/columnUpdateService';


const inputChangeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {event} = req.body;
    const outputData = await processInputChange(event);
    res.status(200).json(outputData);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
export { inputChangeController };