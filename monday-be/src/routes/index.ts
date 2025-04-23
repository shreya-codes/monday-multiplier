import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    console.log("API is working");
    res.json({ message: 'API is working' });
});

export default router;
