import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/rbacMiddleware.js';
import { getDashboardSummary } from '../controllers/dashboardController.js';

const router = express.Router();
router.use(protect);

router.get('/summary', authorize('Admin', 'Analyst', 'Viewer'), getDashboardSummary);

export default router;