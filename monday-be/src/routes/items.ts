import { Router } from 'express';
import { updateFactorController, getItemController, getHistoryController } from '../controllers/itemController';

const router = Router();

router.put('/:itemId/factor', updateFactorController);
router.get('/:itemId', getItemController);
router.get('/:itemId/history', getHistoryController);

export default router; 