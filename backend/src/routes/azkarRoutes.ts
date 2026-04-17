import { Router } from 'express';
import * as azkarController from '../controllers/azkarController.js';

const router = Router();

router.get('/', azkarController.getAllAzkar);
router.get('/:category', azkarController.getAzkarByCategory);

export default router;
