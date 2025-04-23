import { Router } from "express";
import { inputChangeController } from "../controllers/webhookController";
const router = Router();

router.post('/input-change',async (req, res, next) => {
  await inputChangeController(req, res, next);
});
export default router;
