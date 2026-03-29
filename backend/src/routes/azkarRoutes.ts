import { Router } from 'express';
import * as azkarController from '../controllers/azkarController';

const router = Router();

router.get('/', azkarController.getAllAzkar);
router.get('/category/:category', azkarController.getAzkarByCategory);
router.get('/morning', azkarController.getMorningAzkar);
router.get('/evening', azkarController.getEveningAzkar);
router.post('/', azkarController.createAzkar);

export default router;
