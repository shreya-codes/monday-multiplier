import {Request, Response, NextFunction } from 'express';
import { processInputChange } from '@services/columnUpdateService';
import { BaseError } from '@/utils/baseError';

const inputChangeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {event} = req.body;
    const outputData = await processInputChange(event);
    res.status(200).json(outputData);
  } catch (error) {
    if (error instanceof BaseError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}
export { inputChangeController };