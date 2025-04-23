import { Request, Response, NextFunction } from 'express';
import { updateFactor, getItemHistory, getItem } from '../services/itemService';

const updateFactorController = async (req: Request, res: Response, next: NextFunction) => {
    const { factor,boardId} = req.body;
    const itemId = req.params.itemId;
    const outputData = await updateFactor({factor,boardId,itemId});
    console.log('outputData',outputData);
    res.status(200).json(outputData);
};

const getItemController = async (req: Request, res: Response, next: NextFunction) => {
    const itemId = req.params.itemId;
    const item = await getItem(itemId);
    res.status(200).json(item);
};

const getHistoryController = async (req: Request, res: Response, next: NextFunction) => {
    const itemId = req.params.itemId;
    const history = await getItemHistory(itemId);
    res.status(200).json(history);
};

export { updateFactorController, getItemController, getHistoryController };