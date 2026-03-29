import { Router } from 'express';
import * as qiblaController from '../controllers/qiblaController';

const router = Router();

router.get('/direction', qiblaController.getQiblaDirection);
router.post('/calculate', qiblaController.calculateQibla);
router.get('/info', qiblaController.getQiblaInfo);

export default router;
