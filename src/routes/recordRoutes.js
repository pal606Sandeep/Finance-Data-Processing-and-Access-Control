import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/rbacMiddleware.js';
import { createRecord, getAllRecords, updateRecord, deleteRecord } from '../controllers/recordController.js';

const router = express.Router();
router.use(protect); 

router.route('/')
  .get(authorize('Admin', 'Analyst', 'Viewer'), getAllRecords)
  .post(authorize('Admin'), createRecord);

router.route('/:id')
  .patch(authorize('Admin'), updateRecord)
  .delete(authorize('Admin'), deleteRecord);

export default router;