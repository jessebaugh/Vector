import { Router } from 'express';
import { executePlanController } from '../controllers/executePlanController';

const router = Router();

// POST /api/execute-plan
router.post('/execute-plan', executePlanController);

export default router;
