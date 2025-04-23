import { Request, Response, NextFunction } from 'express';
import { updateFactor, getItemHistory, getItem } from '../services/itemService';
import { BaseError } from '@utils/baseError';
const updateFactorController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { factor,boardId} = req.body;
        const itemId = req.params.itemId;
        const outputData = await updateFactor({factor,boardId,itemId});
        res.status(200).json(outputData);
    } catch (error) {
        if (error instanceof BaseError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

const getItemController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const itemId = req.params.itemId;
        const item = await getItem(itemId);
        res.status(200).json(item);
    } catch (error) {
        if (error instanceof BaseError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

const getHistoryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const itemId = req.params.itemId;
        const history = await getItemHistory(itemId);
        res.status(200).json(history);
    } catch (error) {
        if (error instanceof BaseError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

export { updateFactorController, getItemController, getHistoryController };