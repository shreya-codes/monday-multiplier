import { Request, Response, NextFunction } from 'express';
import { updateFactor, getItemHistory, getItem } from '../services/itemService';
import { BaseError } from '@utils/baseError';
import logger from '@/utils/logger';
const updateFactorController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info("Updating factor with params:", { 
            factor: req.body.factor,
            boardId: req.body.boardId,
            itemId: req.params.itemId 
        });
        
        const { factor, boardId } = req.body;
        const itemId = req.params.itemId;
        
        if (!factor || !boardId || !itemId) {
            logger.warn("Missing required parameters:", { factor, boardId, itemId });
            return res.status(400).json({ error: "Missing required parameters" });
        }

        const outputData = await updateFactor({ factor, boardId, itemId });
        res.status(200).json(outputData);
    } catch (error) {
        logger.error("Error in updateFactorController:", error);
        
        if (error instanceof BaseError) {
            logger.error("BaseError details:", {
                message: error.message,
                code: error.code,
                statusCode: error.statusCode
            });
            res.status(error.statusCode).json({ error: error.message });
        } else {
            logger.error("Unexpected error:", error);
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